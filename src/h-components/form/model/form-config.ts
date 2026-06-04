type HFormType =
  | 'radio-group'
  | 'input-group'
  | 'input'
  | 'date-picker'
  | 'time-picker'
  | 'time-range-picker'
  | 'range-picker';

export interface HFormConfigItemChild {
  name?: string;
  label?: string;
  value?: string | number;
  placeholder?: string;
  type?: HFormType;
  data?: HFormConfigItemChild[];
  rules?: any[];
  slotName?: string;
  required?: boolean;
}

export interface HFormConfigItem {
  title: string;

  children: HFormConfigItemChild[];
}
