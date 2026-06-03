import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import BASE_URL from '@/api/common';
import md5 from 'md5';
import { cloneDeep } from 'lodash-es';

export interface LoginData {
  isAdmin?: number;
  mobile: string;
  password: string;
  captchaId: string;
  captchaValue: string;
}

export interface LoginRes {
  token: string;
}

export interface CaptchaRes {
  b64s: string;
  captchaId: string;
}

export function login(data: LoginData) {
  const params = cloneDeep(data);
  params.password = md5(params.password);
  return axios.post<LoginRes>(`${BASE_URL.ADMIN}/auth/login`, params);
}

export function logout() {
  return axios.post(`${BASE_URL.ADMIN}/auth/logout`);
}

export function getCaptcha() {
  return axios.get<CaptchaRes>(`${BASE_URL.ADMIN}/auth/captcha`);
}

export function getUserInfo() {
  return axios.get<UserState>(`${BASE_URL.ADMIN}/auth/info`);
}

// 未使用，暂时保留
export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>(
    `${BASE_URL.ADMIN}/admin/menu-list`
  );
}

export function getAllTeamList(params: any) {
  return axios.get(`${BASE_URL.ADMIN}/admin-team/list`, { params });
}
