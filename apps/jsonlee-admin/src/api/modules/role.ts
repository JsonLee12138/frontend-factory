import { BaseApi } from '@/api';
import { singleton } from 'jsonlee-decorator/src';

@singleton
export class RoleApi extends BaseApi {
  constructor() {
    super('/role');
  }
}
