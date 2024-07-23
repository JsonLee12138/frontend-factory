## JSON WebSocket
[English Documents](https://github.com/JsonLee12138/frontend-factory/tree/main/packages/socket/README.en.md)

### 介绍
JSON WebSocket是一个 `Socket` 类，用于管理 WebSocket 连接，具有各种重连、心跳消息和事件处理选项的 `WebSocket` 包装器。

### 类: `Socket<T = any>`
该类提供了一个增强功能的 WebSocket 包装器，包括自动重连和心跳消息。

#### 静态属性
- `ReadyState: SocketReadyState`

#### 构造函数
```typescript
constructor(
  url: string,
  options?: SocketOptions<T>
)
```
- **url**: 要连接的 WebSocket URL。
- **options**: WebSocket 的配置选项。
  - **showLog**: 是否显示日志。
  - **reconnectInterval**: 重连尝试之间的间隔时间（毫秒）。
  - **heartbeatInterval**: 心跳消息之间的间隔时间（毫秒）。
  - **heartbeatMessage**: 作为心跳发送的消息以保持连接。
  - **maxReconnectAttempts**: 最大重连尝试次数。0 表示不重连。
  - **onClose**: WebSocket 连接关闭时执行的回调函数。
  - **onError**: 发生错误时执行的回调函数。
  - **onMessage**: 接收到消息时执行的回调函数。
  - **onOpen**: WebSocket 连接打开时执行的回调函数。
  - **protocols**: 用于 WebSocket 连接的协议数组。

#### 方法
- **getInstance()**
  - 返回当前 WebSocket 实例。

- **connect()**
  - 建立 WebSocket 连接。

- **send<T = any>(e: T)**
  - 发送消息，不需要转成字符串。

- **close()**
  - 主动关闭 WebSocket 连接。

- **stopHeartBeat()**
  - 关闭心跳检测。

- **getState()**
  - 获取 WebSocket 连接状态。
