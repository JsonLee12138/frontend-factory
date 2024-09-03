import { AnyObject } from './global';

export interface RequestOptions extends RequestInit {
  params?: AnyObject;
  data?: AnyObject;
}
