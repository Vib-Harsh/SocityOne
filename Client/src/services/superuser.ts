import { service } from "../utils";
import type { superLoginResult, superUserLogin } from "../types";
import { url } from "../constant";

export const loginSuper = async (
  data: superUserLogin,
): Promise<superLoginResult> => {
  const res = await service.post<superLoginResult>(url.SUPERUSER.login, data);
  return res.data;
};
