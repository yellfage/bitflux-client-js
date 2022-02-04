# Bitflux client

JavaScript client for [Bitflux](https://github.com/yellfage/bitflux)

> :warning: Currently, the library is not production ready. The API may change at any time.

## Features

### Configuration

- Creating multiple client instances for a specific Hub;

### Interceptors

Intended to perform some operations at specific stages (connecting, connected, disconnected, reconnecting, reconnected, terminating, terminated);

- Flexible modification of URI (params, path, etc);

### Plugins

Intended to extend the library functionality.

- Initialization after using for a client instance;

### Reconnection

- Reconnecting after a connection error;
- Reconnecting after an abnormal disconnection;
- Delay before reconnecting according to a specific reconnection scheme;

### Communication

Communication is happening through a specific transport ([WebSocket](package/bitflux-client-web-socket-transport), Server Sent Events, HTTP polling/long polling, etc) by using a specific protocol ([Json](package/bitflux-client-json-protocol), MessagePack, Xml, etc).

- Multiple transports and protocols;

### Incoming invocation

Invocation made by a server;

- Multiple handlers with the same name;

### Regular invocation

Invocation made by the client **with** waiting for a result.

- Suspending when the client is not connected or disconnected before a result is received and performing after connection;
- Rejection after a specific time regardless of the number of retries and the client state;
- Setting rejection delay for all or specific invocations;
- Rejection an attempt after a specific time. Only if the client is connected;
- Setting attempt rejection delay for all or specific invocations;
- Manual abort;

### Notifiable invocation

Invocation made by the client **without** waiting for a result.

- Suspending when the client is not connected, and performing after connection;

### Logging

- Using custom loggers

### Usage

- Check out the static [sample](package/bitflux-client/sample/echo/src/index.ts)
