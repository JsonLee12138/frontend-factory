export interface SocketOptions<T> {
  reconnectInterval?: number;
  heartbeatInterval?: number;
  heartbeatMessage?: any;
  maxReconnectAttempts?: number;
  shouldReconnect?: boolean;
  protocols?: string | string[];
  showLog?: boolean;
  connectResend?: boolean;
  onOpen?: (e: WebSocketEventMap["open"]) => void;
  onClose?: (e: WebSocketEventMap["close"]) => void;
  onMessage?: (_d: T) => void;
  onError?: (e: WebSocketEventMap["error"]) => void;
}
