## JSON WebSocket
[中文文档](https://github.com/JsonLee12138/frontend-factory/tree/main/packages/socket/README.md)

### Introduction
JSON WebSocket is a `Socket` class for managing WebSocket connections, with various `WebSocket` wrappers for reconnection, heartbeat messages and event handling options.

### Class: `Socket<T = any>`
This class provides a WebSocket wrapper with enhanced functionality, including automatic reconnections and heartbeat messages.

#### Static Properties
- `ReadyState: SocketReadyState`

#### Constructor
```typescript
constructor(
  url: string,
  options?: SocketOptions<T>
)
```
- **url**: The WebSocket URL to connect to.
- **options**: Configuration options for the WebSocket.
  - **showLog**: Whether to show logs.
  - **reconnectInterval**: Interval in milliseconds between reconnection attempts.
  - **heartbeatInterval**: Interval in milliseconds between heartbeat messages.
  - **heartbeatMessage**: Message sent as a heartbeat to keep the connection alive.
  - **maxReconnectAttempts**: Maximum number of reconnection attempts. 0 means no reconnection.
  - **onClose**: Callback function to execute when the WebSocket connection is closed.
  - **onError**: Callback function to execute when an error occurs.
  - **onMessage**: Callback function to execute when a message is received.
  - **onOpen**: Callback function to execute when the WebSocket connection is opened.
  - **protocols**: An array of protocols to use in the WebSocket connection.

#### Methods
- **getInstance()**
  - Returns the current WebSocket instance.

- **connect()**
  - Establishes a WebSocket connection.

- **send<T = any>(e: T)**
  - Sends a message without converting it to a string.

- **close()**
  - Closes the WebSocket connection manually.

- **stopHeartBeat()**
  - Stops the heartbeat mechanism.

- **getState()**
  - Gets the current WebSocket connection state.
