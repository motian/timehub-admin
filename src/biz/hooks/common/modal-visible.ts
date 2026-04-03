import { watch } from 'vue';

interface OnAfterAction {
  (): void;
}

export default function onModalVisible(
  props: any,
  callback: OnAfterAction | null = null
) {
  watch(
    () => props.visible,
    () => {
      if (!props.visible) return;
      if (callback) {
        callback();
      }
    }
  );
  return {};
}
