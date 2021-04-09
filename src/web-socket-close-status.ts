export enum WebSocketCloseStatus {
  // (1000) The connection has closed after the request was fulfilled.
  NormalClosure = 1000,
  // (1001) Indicates an endpoint is being removed. Either the server or client will become unavailable.
  EndpointUnavailable = 1001,
  // (1002) The client or server is terminating the connection because of a protocol error.
  ProtocolError = 1002,
  // (1003) The client or server is terminating the connection because it cannot accept the data type it received.
  InvalidMessageType = 1003,
  // No error specified.
  Empty = 1005,
  // (1007) The client or server is terminating the connection because it has received data inconsistent with the message type.
  InvalidPayloadData = 1007,
  // (1008) The connection will be closed because an endpoint has received a message that violates its policy.
  PolicyViolation = 1008,
  // (1009) The client or server is terminating the connection because it has received a message that is too big for it to process.
  MessageTooBig = 1009,
  // (1010) The client is terminating the connection because it expected the server to negotiate an extension.
  MandatoryExtension = 1010,
  // (1011) The connection will be closed by the server because of an error on the server.
  InternalServerError = 1011
}
