export interface IUserContext {
  email: string;
  setEmail: (email: string) => void;
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  logout: () => void;
}
