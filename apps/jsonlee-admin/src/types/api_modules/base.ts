export interface GetBotCheckCodeResult {
  id: string;
  enable: boolean;
  picPath: string;
}
export interface SinginDTO {
  account: string;
  password: string;
  captchaId: string;
  captcha: string;
}
export interface SinginVO {
  accessToken: string;
  defaultRouter: string;
}
