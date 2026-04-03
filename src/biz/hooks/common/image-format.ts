export default function useImageFormat() {
  // 检测是否支持webp
  const isSupportWebp = (function () {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      // was able or not to get WebP representation
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    // very old browser like IE 8, canvas not supported
    return false;
  })();

  const autoFormat = (url: string, width = 1280) => {
    if (url.includes('wework.qpic.cn')) {
      return url;
    }
    const thumbnail = `imageMogr2/auto-orient/thumbnail/${width}x>`;
    if (isSupportWebp) {
      return `${url}?${thumbnail}/format/webp`;
    }
    return `${url}?${thumbnail}`;
  };

  return {
    autoFormat,
  };
}
