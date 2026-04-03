import { ref, reactive, watchEffect } from 'vue';
import { get as getObjVal, set as setObjVal } from 'lodash-es';

export default function useFormData<T extends object>(props: any, emit: any) {
  const form = ref<T>(props.modelValue);
  const formData = reactive<T>(
    new Proxy(form, {
      get: (target: any, prop) => {
        return getObjVal(target.value, prop);
      },
      set: (target: any, prop, value) => {
        setObjVal(target.value, prop, value);
        emit('update:modelValue', target.value);
        return true;
      },
    })
  );

  watchEffect(() => {
    form.value = props.modelValue;
  });

  return {
    formData,
  };
}
