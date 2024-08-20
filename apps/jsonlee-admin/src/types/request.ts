export interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  data?: Record<string, any>;
}
