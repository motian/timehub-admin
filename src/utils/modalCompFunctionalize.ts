import { createVNode, render, AppContext } from 'vue';
// import type { VNodeProps, AllowedComponentProps } from 'vue';

// type ChildProps<
//   T extends new (...args: any) => any
// > = InstanceType<T>['$props'];

// type PickChildProps<T extends new (...args: any) => any> = {
//   -readonly [K in keyof Omit<
//     ChildProps<T>,
//     keyof VNodeProps | keyof AllowedComponentProps
//   >]: ChildProps<T>[K];
// };

// 保存全局 AppContext
let appContext: AppContext | null = null;

// 在应用初始化时设置 AppContext
export function setAppContext(context: AppContext) {
  appContext = context;
}

/**
 *
 * @param Comp Vue Component
 * @param propsWithoutVisible component props without visible param
 * @returns
 */
const modalCompFunctionalize = <T extends new (...args: any) => any>(
  Comp: T
) => {
  return <U extends Record<string, any>>(propsWithoutVisible?: U) => {
    const container = document.createElement('div');
    const s = performance.now();
    const vnode = createVNode(Comp, {
      'visible': true,
      ...propsWithoutVisible,
      'onUpdate:visible': (visible: boolean) => {
        if (!visible) {
          render(null, container);
          container.remove();
        }
      },
    });
    console.log('compile modal', `${performance.now() - s}ms`);

    // 关键：设置 appContext
    if (appContext) {
      vnode.appContext = appContext;
    }

    const s1 = performance.now();
    render(vnode, container);
    console.log('render modal', `${performance.now() - s1}ms`);
    document.body.appendChild(container);
  };
};

export default modalCompFunctionalize;
