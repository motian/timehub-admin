export function getOptions(list: string[]) {
  return list.map((item, index) => {
    return {
      label: item,
      value: index + 1,
    };
  });
}

export function getBitOptions(list: string[]) {
  return list.map((item, index) => {
    return {
      label: item,
      // eslint-disable-next-line no-bitwise
      value: 1 << index,
    };
  });
}

export function getOptionItem(options: any[], value: number) {
  return options.find((item) => item.value === value);
}
