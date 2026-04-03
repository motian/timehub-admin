import { useWindowSize } from '@vueuse/core';
import { ref, computed, onMounted, onUnmounted } from 'vue';

export default function useScreenSize() {
  const { width, height } = useWindowSize();
  const sidebarWidth = ref(0);
  const contentWidth = ref(0);
  const topTabsStyle = computed(() => {
    return { width: `${contentWidth.value}px` };
  });
  let resizeObserver: any = null;

  onMounted(() => {
    resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        sidebarWidth.value = entry.target.clientWidth;
        contentWidth.value = width.value - sidebarWidth.value;
      });
    });
    const sider = document.querySelector('.layout-sider') as Element;
    if (sider) {
      resizeObserver.observe(sider);
    }
  });

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  });

  return {
    width,
    height,
    sidebarWidth,
    contentWidth,
    topTabsStyle,
  };
}
