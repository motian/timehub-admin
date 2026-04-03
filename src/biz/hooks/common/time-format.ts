import dayjs from 'dayjs';

export default function useTimeFormat() {
  function formatDateRange(duration: string[]) {
    if (duration?.length === 2) {
      return [
        dayjs(duration[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        dayjs(duration[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      ];
    }
    return duration;
  }

  return {
    formatDateRange,
  };
}
