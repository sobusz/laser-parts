export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const getLoginUrl = () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/admin/login`;
};
