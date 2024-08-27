import { BaseApi } from '@/api';
import { singleton } from 'jsonlee-decorator/src';

@singleton
export class MenuApi extends BaseApi {
  constructor() {
    super('/menu');
  }
}
