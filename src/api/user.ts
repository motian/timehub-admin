import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import md5 from 'md5';
import { cloneDeep } from 'lodash-es';
import BASE_URL from '@/api/common';

export interface LoginData {
  isAdmin?: number;
  systemId: number;
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
  params.systemId = 3; // 1. 私域通 2. 营销通 3. 聚数通
  return axios.post<LoginRes>(`${BASE_URL.IAM}/auth/login`, params);
}

export function logout() {
  return axios.post<LoginRes>(`${BASE_URL.IAM}/auth/logout`);
}

export function getCaptcha() {
  return axios.get<CaptchaRes>(`${BASE_URL.IAM}/auth/captcha`);
}

export function getUserInfo() {
  return axios.get<UserState>(`${BASE_URL.IAM}/admin/info`);
}

// 未使用，暂时保留
export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>(`${BASE_URL.IAM}/admin/menu`);
}

export function getAllTeamList(params: any) {
  return axios.get(`${BASE_URL.IAM}/admin-team/list`, { params });
}
