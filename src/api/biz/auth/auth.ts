import BASE_URL from '@/api/common';
import axios from 'axios';

export default {
  ResetPassword(data: {
    mode: number;
    oldPassword: string;
    newPassword: string;
  }) {
    return axios.post(`${BASE_URL.ADMIN}/auth/reset-password`, data);
  },
};
