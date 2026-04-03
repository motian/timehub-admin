export interface ArgID {
  id: number;
}

export interface ArgPage {
  page: number;
  pageSize: number;
}

const BASE_URL = {
  IAM: '/api/iam',
  WEBHOOK: '/api/webhook/admin',
  COMMON: '/api/common/admin',
  MARKETING: '/api/marketing/admin',
};

export default BASE_URL;
