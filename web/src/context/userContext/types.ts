export interface IUserContext {
  email: string;
  isLogin: boolean;
  userId: string;
  logout: () => void;
}
