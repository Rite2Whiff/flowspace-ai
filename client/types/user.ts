export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};

export type UserSignupResponse = {
  message: string;
};

export type UserLoginResponse = {
  message: string;
  token: string;
  user: Omit<User, "password">;
};
