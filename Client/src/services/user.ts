import type {
  filterParams,
  ListPagination,
  User,
  UserForm,
  UserList,
} from "@/types";
import { service, API_V1 } from "@/utils";

export const getUsersList = async (
  params: filterParams,
): Promise<{ data: UserList[]; pagination: ListPagination<UserList> }> => {
  const res = await service.get(`${API_V1}users/`, { params });
  return res.data;
};

export const getUser = async (id: number): Promise<User> => {
  const res = await service.get(`${API_V1}users/${id}`);
  console.log("get user ", res.data);
  return res.data;
};

export const createUser = async (payload: UserForm) => {
  const res = await service.post(`${API_V1}users/`, payload);
  console.log("create user ", res.data);
  return res.data;
};

export const updateUser = async (
  id: User["id"],
  payload: Partial<UserForm>,
) => {
  const res = await service.put(`${API_V1}users/${id}`, payload);
  console.log("update user ", res.data);
  return res.data;
};

export const deleteUser = async (id: number): Promise<boolean> => {
  const res = await service.delete(`${API_V1}users/${id}`);
  console.log("delete user ", res.data);
  return res.data;
};
