import { service } from "../utils";
import type { superUserLogin } from "../types";
import { url } from "../constant";

export const loginSuper = async (data: superUserLogin) => {
  const res = await service.post(url.SUPERUSER.login, data);
  return res.data;
};
