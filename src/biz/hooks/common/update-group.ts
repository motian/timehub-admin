import { ref } from 'vue';

export default function useUpdateGroup() {
  const updateGroupModal = ref({
    show: false,
    id: 0 as number | string,
    groupId: 0,
  });

  const onShowUpdateGroupModal = (id: number | string, groupId: number) => {
    updateGroupModal.value.id = id;
    updateGroupModal.value.groupId = groupId;
    updateGroupModal.value.show = true;
  };

  return {
    updateGroupModal,
    onShowUpdateGroupModal,
  };
}
