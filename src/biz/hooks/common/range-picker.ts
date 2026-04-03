import dayjs from 'dayjs';

export default function useRangePicker() {
  const getRangeShortcuts = (format = 'YYYY-MM-DD HH:mm:ss') => {
    return [
      {
        label: '今日',
        value: () => [
          dayjs().startOf('day').format(format),
          dayjs().endOf('day').format(format),
        ],
      },
      {
        label: '昨天',
        value: () => [
          dayjs().startOf('day').add(-1, 'day').format(format),
          dayjs().endOf('day').add(-1, 'day').format(format),
        ],
      },
      {
        label: '3日内',
        value: () => [
          dayjs().startOf('day').add(-2, 'day').format(format),
          dayjs().endOf('day').format(format),
        ],
      },
      {
        label: '7日内',
        value: () => [
          dayjs().startOf('day').add(-6, 'day').format(format),
          dayjs().endOf('day').format(format),
        ],
      },
      {
        label: '30日内',
        value: () => [
          dayjs().startOf('day').add(-29, 'day').format(format),
          dayjs().endOf('day').format(format),
        ],
      },
    ];
  };

  return {
    getRangeShortcuts,
  };
}
