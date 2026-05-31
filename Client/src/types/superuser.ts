export type superUserLogin = {
  email: string;
  password: string;
};
export type superLoginResult = {
  message: string;
  token: string;
  user_info: superUser;
};

type superUser = {
  name: "Super Admin";
  role_id: 0;
  email: "admin";
};