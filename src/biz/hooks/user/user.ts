import { API } from '@/api';
import MUser from '@/biz/model/user/user';
import useMultiPageData from '../common/multi-page';

export default function useUserApi() {
  return useMultiPageData<MUser>(API.User, MUser);
}
