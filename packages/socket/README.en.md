## JSON WebSocket
[中文文档](https://github.com/JsonLee12138/frontend-factory/tree/main/packages/socket/README.md)

### Introduction
JSON WebSocket is a `Socket` class for managing WebSocket connections with a `WebSocket` wrapper with various reconnect, heartbeat message and event handling options, with good code hints.

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
  - **connectResend**: Whether to resend unsent content after connection.
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

### Example
```typescript
import { SocketReadyState, Socket } from 'jsonlee-ws';

// Define options for the socket
const options = {
  showLog: true,
  reconnectInterval: 2000,
  heartbeatInterval: 5000,
  heartbeatMessage: "ping",
  maxReconnectAttempts: 5,
  connectResend: true,
  onClose: (e: any) => console.log('WebSocket closed:', e),
  onError: (e: any) => console.error('WebSocket error:', e),
  onMessage: (msg: any) => console.log('WebSocket message:', msg),
  onOpen: (e: any) => console.log('WebSocket opened:', e),
  protocols: ['protocol1', 'protocol2']
};

const socket = new Socket('ws://localhost:8080', options);
```
