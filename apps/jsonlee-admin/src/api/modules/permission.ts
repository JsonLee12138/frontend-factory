import { BaseApi } from '@/api';
import { singleton } from 'jsonlee-decorator/src';

@singleton
export class PermissionApi extends BaseApi {
  constructor() {
    super('/permission');
  }
}
