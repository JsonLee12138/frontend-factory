import {
  GetBotCheckCodeResult,
  SinginDTO,
  SinginVO,
} from '@/types/api_modules/base';
import { get, post } from '@/utils/request';

export const getBotCheckCode = () =>
  get<GetBotCheckCodeResult, never>('/auth/bot-check');

export const signin = (data: SinginDTO) =>
  post<SinginVO, SinginDTO>('/auth/signin', data);
