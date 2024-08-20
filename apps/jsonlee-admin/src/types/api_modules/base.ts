namespace Base {
  export interface GetBotCheckCodeResult {
    id: number;
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
}

export default Base;
