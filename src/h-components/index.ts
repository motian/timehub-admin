import { App } from 'vue';
import InputNumber from '@/h-components/input-number/index.vue';
import Table from '@/h-components/table/index.vue';
import TopTabs from '@/h-components/top-tabs/index.vue';
import TopBar from '@/h-components/top-bar/index.vue';
import Avatar from '@/h-components/avatar/index.vue';
import Editor from '@/h-components/editor/index.vue';
import Form from '@/h-components/form/index.vue';
import FormModal from '@/h-components/form/form-modal.vue';
import Cover from '@/h-components/cover/index.vue';
import MediaUpload from '@/h-components/media-upload/index.vue';
import Cascader from '@/h-components/cascader/index.vue';
import MediaList from '@/h-components/media-list/index.vue';
import Select from '@/h-components/select/index.vue';
import Ellipsis from '@/h-components/ellipsis/index.vue';
import EllipsisTooltip from '@/h-components/ellipsis/tooltip.vue';
import StatusText from '@/h-components/status-text/index.vue';
import Tooltip from '@/h-components/tooltip/index.vue';
// Manually introduce ECharts modules to reduce packing size

export default {
  install(Vue: App) {
    Vue.component('HInputNumber', InputNumber);
    Vue.component('HMediaUpload', MediaUpload);
    Vue.component('HTable', Table);
    Vue.component('HAvatar', Avatar);
    Vue.component('HEditor', Editor);
    Vue.component('HTopTabs', TopTabs);
    Vue.component('HTopBar', TopBar);
    Vue.component('HForm', Form);
    Vue.component('HFormModal', FormModal);
    Vue.component('HCover', Cover);
    Vue.component('HCascader', Cascader);
    Vue.component('HEllipsisTooltip', EllipsisTooltip);
    Vue.component('HEllipsis', Ellipsis);
    Vue.component('HMediaList', MediaList);
    Vue.component('HSelect', Select);
    Vue.component('HStatusText', StatusText);
    Vue.component('HTooltip', Tooltip);
  },
};
