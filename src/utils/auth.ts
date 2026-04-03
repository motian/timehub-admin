const TOKEN_KEY = 'token';
const PERMISSION = 'permission';
const CURRENT_CORP_ID = 'current-corp-id';

const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const getLocalCorpID = () => {
  return localStorage.getItem(CURRENT_CORP_ID) || '';
};

const setLocalCorpID = (appId: string) => {
  localStorage.setItem(CURRENT_CORP_ID, appId);
};

const isPermissionChange = (permission: string) => {
  return localStorage.getItem(PERMISSION) !== permission;
};

const setPermission = (permission: string) => {
  localStorage.setItem(PERMISSION, permission);
};

export {
  isLogin,
  getToken,
  setToken,
  clearToken,
  setLocalCorpID,
  getLocalCorpID,
  isPermissionChange,
  setPermission,
};
