import { SocketReadyState } from "./enums";
import { SocketOptions } from "./types";

export class Socket<T = any> {
  static ReadyState: SocketReadyState;
  private showLog?: boolean;
  private reconectTimes: number = 0;
  private reconnectInterval: number = 1000;
  private heartbeatInterval: number = 10000;
  private heartbeatMessage: string = "ping";
  private heartBeatTimer: number | null | NodeJS.Timeout = null;
  private maxReconnectAttempts: number = 0;
  private url: string = "";
  private protocols: string | string[] = [];
  private sendQueue: T[] = [];
  private connectResend: boolean = false;
  private _onOpen: SocketOptions<T>["onOpen"] = () => {
    if (this.showLog) {
      console.log("websocket had opened");
    }
  };
  private _onClose: SocketOptions<T>["onClose"] = (e: unknown) => {
    if (this.showLog) {
      console.error("websocket had closed:", e);
    }
  };
  private _onError: SocketOptions<T>["onError"] = (e: unknown) => {
    if (this.showLog) {
      console.error("websocket error:", e);
    }
  };
  private _onMessage: SocketOptions<T>["onMessage"] = (e: any) => {
    if (this.showLog) {
      console.log("received a message:", e);
    }
  };
  private instance: WebSocket | null = null;

  /**
   * Constructs a WebSocket instance with specified options.
   * 使用指定的选项构造一个 WebSocket 实例。
   *
   * @param {string} url - The WebSocket URL to connect to.
   * @param {string} url - 要连接的 WebSocket URL。
   *
   * @param {Object} [options] - Configuration options for the WebSocket.
   * @param {Object} [options] - WebSocket 的配置选项。
   *
   * @param {boolean} [options.showLog] - Whether to show logs.
   * @param {boolean} [options.showLog] - 是否显示日志。
   *
   * @param {number} [options.reconnectInterval] - Interval in milliseconds between reconnection attempts.
   * @param {number} [options.reconnectInterval] - 重连尝试之间的间隔时间（毫秒）。
   *
   * @param {number} [options.heartbeatInterval=10000] - Interval in milliseconds between heartbeat messages.
   * @param {number} [options.heartbeatInterval=10000] - 心跳消息之间的间隔时间（毫秒）。
   *
   * @param {string} [options.heartbeatMessage="ping"] - Message sent as a heartbeat to keep the connection alive.
   * @param {string} [options.heartbeatMessage="ping"] - 作为心跳发送的消息以保持连接。
   *
   * @param {number} [options.maxReconnectAttempts=0] - Maximum number of reconnection attempts. 0 means unlimited.
   * @param {number} [options.maxReconnectAttempts=0] - 最大重连尝试次数。0 表示无限次尝试。
   *
   * @param {function} [options.onClose] - Callback function to execute when the WebSocket connection is closed.
   * @param {function} [options.onClose] - WebSocket 连接关闭时执行的回调函数。
   *
   * @param {function} [options.onError] - Callback function to execute when an error occurs.
   * @param {function} [options.onError] - 发生错误时执行的回调函数。
   *
   * @param {function} [options.onMessage] - Callback function to execute when a message is received.
   * @param {function} [options.onMessage] - 接收到消息时执行的回调函数。
   *
   * @param {function} [options.onOpen] - Callback function to execute when the WebSocket connection is opened.
   * @param {function} [options.onOpen] - WebSocket 连接打开时执行的回调函数。
   *
   * @param {Array} [options.protocols=[]] - An array of protocols to use in the WebSocket connection.
   * @param {Array} [options.protocols=[]] - 用于 WebSocket 连接的协议数组。
   *
   * @param {boolean} [connectResend] - Whether to resend unsent content after connection.
   * @param {boolean} [connectResend] - 连接后是否重新发送未发送内容。
   */
  constructor(
    url: string,
    {
      showLog,
      reconnectInterval,
      heartbeatInterval = 10000,
      heartbeatMessage = "ping",
      maxReconnectAttempts = 0,
      onClose,
      onError,
      onMessage,
      onOpen,
      protocols = [],
      connectResend = false
    }: SocketOptions<T> = {}
  ) {
    this.showLog = showLog;
    this.url = url;
    reconnectInterval && (this.reconnectInterval = reconnectInterval);
    this.heartbeatInterval = heartbeatInterval;
    this.heartbeatMessage = heartbeatMessage;
    this.maxReconnectAttempts = maxReconnectAttempts;
    this.protocols = protocols;
    onClose && (this._onClose = onClose);
    onOpen && (this._onOpen = onOpen);
    onError && (this._onError = onError);
    onMessage && (this._onMessage = onMessage);
    this.connectResend = connectResend;
  }

  /**
   * Returns the current WebSocket instance.
   * 返回当前 WebSocket 实例。
   *
   * @returns {WebSocket} The current WebSocket instance.
   * @returns {WebSocket} 当前的 WebSocket 实例。
   */
  public getInstance() {
    return this.instance;
  }

  /**
   * Establishes a WebSocket connection.
   * 建立 WebSocket 连接。
   */
  public connect() {
    if (this.instance) {
      this.instance = null;
      this.reconnectInterval++;
    }
    this.instance = new WebSocket(this.url, this.protocols);
    this.instance.onclose = e => {
      this.onClose(e);
    };
    this.instance.onopen = e => {
      this.onOpen(e);
    };
    this.instance.onerror = e => {
      this._onError?.(e);
    };
    this.instance.onmessage = e => {
      this.onMessage(e);
    };
  }

  private onOpen = (e: WebSocketEventMap['open']) => {
    this.startHeartBeat();
    if(this.connectResend){
      while (this.sendQueue.length) {
        const item = this.sendQueue.shift();
        this.send(item);
      }
    }
    this._onOpen?.(e);
  };

  private onMessage(e: WebSocketEventMap["message"]) {
    try {
      const res = JSON.parse(e.data);
      this._onMessage?.(res);
    } catch (error) {
      this._onMessage?.(e.data);
    }
  }

  /**
   * Sends a message without converting it to a string.
   * 发送消息 不需要转成字符串。
   *
   * @param {T} e - The message to be sent.
   * @param {T} e - 要发送的消息。
   */
  public send = <T = any>(e: T) => {
    if (this.getState() === SocketReadyState.OPEN) {
      let data = e;
      if (typeof e === "object") {
        data = JSON.stringify(e) as any;
      }
      this.instance?.send(data as string);
      return
    }
    if(this.connectResend){
      this.sendQueue.push(e as any);
    }
  };


  /**
   * Closes the WebSocket connection manually.
   * 主动关闭 WebSocket 连接。
   */
  public close() {
    this.instance?.close(1000, "Manually closing websocket connection");
  }

  private startHeartBeat() {
    if (this.heartBeatTimer) return;
    this.heartBeatTimer = setInterval(() => {
      this.send(this.heartbeatMessage);
    }, this.heartbeatInterval);
  }

  /**
   * Stops the heartbeat mechanism.
   * 关闭心跳检测。
   */
  public stopHeartBeat() {
    if (this.heartBeatTimer) {
      clearInterval(this.heartBeatTimer as number);
      this.heartBeatTimer = null;
    }
  }

  private onClose(e: WebSocketEventMap["close"]) {
    this.stopHeartBeat();
    if (e.code !== 1000 && this.maxReconnectAttempts > 0 && this.reconectTimes < this.maxReconnectAttempts) {
      const timeout = setTimeout(() => {
        if (this.showLog) {
          console.log("reconnecting...");
        }
        this.reconectTimes++;
        this.connect();
        clearTimeout(timeout);
      }, this.reconnectInterval);
      return;
    }
    this._onClose?.(e);
  }

  /**
   * Gets the current WebSocket connection state.
   * 获取 WebSocket 连接状态。
   *
   * @returns {number} - The ready state of the WebSocket connection.
   * @returns {number} - WebSocket 连接的状态。
   */
  public getState = () => {
    return this.instance?.readyState;
  };
}

export default Socket;
