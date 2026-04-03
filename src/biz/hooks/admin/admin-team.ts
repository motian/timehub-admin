import { API } from '@/api';
import MAdminTeam from '@/biz/model/admin/admin-team';
import { useUserStore } from '@/store';
import { computed, ref } from 'vue';
import useMultiPageData from '../common/multi-page';

export default function useAdminTeamApi() {
  const adminTeamApi = useMultiPageData<MAdminTeam>(API.AdminTeam, MAdminTeam);
  const teamTree = ref();
  const { userInfo } = useUserStore();

  function buildTreeData(node: MAdminTeam, teamList: MAdminTeam[]) {
    node.children = teamList.filter((team) => team.parentId === node.id);
    node.children.forEach((subNode) => {
      buildTreeData(subNode, teamList);
    });

    if (!node.children.length) {
      delete node.children;
    }
  }

  async function loadTreeData(withRootNode = true, onlyMyTeam = false) {
    await adminTeamApi.loadAllData({ onlyMyTeam });
    const data = adminTeamApi.allData.value;
    let rootTeam = data.find((team) => !team.parentId);
    if (!rootTeam) {
      rootTeam = data.find((team) => team.id === userInfo.teamId);
    }
    if (!rootTeam) return;
    buildTreeData(rootTeam, data);
    teamTree.value = withRootNode ? [rootTeam] : rootTeam?.children;
  }

  const getChildrenIds = (teamId: number, includeParent = true) => {
    const teamList = adminTeamApi.allData.value;
    const childrenIds: number[] = [];
    const dfs = (id: number) => {
      const children = teamList.filter((d) => d.parentId === id);
      for (const child of children) {
        childrenIds.push(child.id);
        dfs(child.id);
      }
    };
    dfs(teamId);
    return includeParent ? [teamId, ...childrenIds] : childrenIds;
  };

  const customerTeamList = computed(() => {
    return adminTeamApi.allData.value.filter((t) => t.parentId > 0);
  });

  return {
    ...adminTeamApi,
    customerTeamList,
    teamTree,
    loadTreeData,
    getChildrenIds,
  };
}
