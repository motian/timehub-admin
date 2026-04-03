import { defineStore } from 'pinia';

import { getAllTeamList } from '@/api/user';
import HJson from '@/biz/model-base/h-json';
import MAdminTeam from '@/biz/model/admin/admin-team';
import useUserStore from '../user';

interface TeamState {
  teamList: MAdminTeam[];
}

const useTeamStore = defineStore('team', {
  state: (): TeamState => ({
    teamList: [],
  }),

  getters: {},

  actions: {
    buildTreeData(node: MAdminTeam, teamList: MAdminTeam[]) {
      node.children = teamList.filter((team) => team.parentId === node.id);
      node.children.forEach((subNode) => {
        this.buildTreeData(subNode, teamList);
      });
      if (!node.children.length) {
        delete node.children;
      }
    },

    async initTeamData() {
      const res = await getAllTeamList({ onlyMyTeam: false });
      const data = res?.data?.list?.reverse() || [];
      this.teamList = HJson.fromJsonArray(data, MAdminTeam);
    },

    getTeamTree(withRootNode = false) {
      const rootTeam = this.teamList.find(
        (team) => !team.parentId
      ) as MAdminTeam;
      this.buildTreeData(rootTeam, this.teamList);
      return withRootNode ? [rootTeam] : rootTeam?.children;
    },

    getMyTeamTree(withRootNode = true) {
      const { userInfo } = useUserStore();
      const rootTeam = this.teamList.find(
        (team) => team.id === userInfo.teamId
      ) as MAdminTeam;
      this.buildTreeData(rootTeam, this.teamList);
      return withRootNode ? [rootTeam] : rootTeam?.children;
    },

    getChildrenIds(teamId: number, includeParent = true) {
      const childrenIds: number[] = [];
      const dfs = (id: number) => {
        const children = this.teamList.filter((d) => d.parentId === id);
        for (const child of children) {
          childrenIds.push(child.id);
          dfs(child.id);
        }
      };
      dfs(teamId);
      return includeParent ? [teamId, ...childrenIds] : childrenIds;
    },
  },
});

export default useTeamStore;
