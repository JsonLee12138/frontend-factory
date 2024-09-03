import { get, post } from '@/utils/request';
import Base from '@/types/api_modules/base';

export const getBotCheckCode = () =>
  get<Base.GetBotCheckCodeResult, never>('/auth/bot-check');

export const signin = (data: Base.SinginDTO) =>
  post<Base.SinginVO, Base.SinginDTO>('/auth/signin', data);
