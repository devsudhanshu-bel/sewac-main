# redis.js Documentation

## 1. File Overview

The Redis module manages Redis connections used by the telemetry scheduler and related application components.

It maintains:

```text
Producer Connection
Consumer Connection
Dedicated Dispatcher Connections
```

---

# 2. Redis Client Library

The module uses:

```text
redis
```

and creates clients through:

```text
createClient()
```

---

# 3. createRedisConnection()

Creates a Redis connection using:

```text
process.env.REDIS_URL
```

The connection is configured with:

```text
keepAlive: 5000
connectTimeout: 10000
```

---

# 4. Reconnection Strategy

The reconnect delay is calculated as:

```text
Math.min(retries * 500, 5000)
```

Therefore the delay increases with retry attempts but is capped at:

```text
5000 ms
```

---

# 5. Redis Events

The connection listens for:

```text
error
ready
reconnecting
```

Errors are logged with the connection name.

A successful ready event logs:

```text
Redis Ready [name]
```

Reconnection attempts log:

```text
Redis Reconnecting [name]...
```

---

# 6. initRedis()

Initializes the two main Redis connections:

```text
Producer
Consumer
```

The producer is stored in:

```text
producerClient
```

The consumer is stored in:

```text
consumerClient
```

---

# 7. Producer Connection

The producer is intended for:

```text
Pushing
Enqueueing
Status
Recovery
```

It can be retrieved through:

```text
getProducerClient()
```

---

# 8. Consumer Connection

The shared consumer is retained for compatibility with existing code.

It can be retrieved through:

```text
getConsumerClient()
```

The module specifically notes that blocking dispatcher loops should not use this shared consumer connection.

---

# 9. createDispatcherClient()

Creates a dedicated Redis connection for an individual dispatcher.

The dispatcher ID is included in the connection name:

```text
Dispatcher-1
Dispatcher-2
Dispatcher-3
...
```

Each dispatcher therefore receives its own Redis connection.

This is required for blocking operations such as:

```text
BLMove()
```

---

# 10. getProducerClient()

Returns the initialized producer client.

If the producer has not been initialized, it throws:

```text
Redis producer client is not initialized.
```

---

# 11. getConsumerClient()

Returns the initialized consumer client.

If the consumer has not been initialized, it throws:

```text
Redis consumer client is not initialized.
```

---

# 12. Connection Architecture

```text
Redis
 │
 ├── Producer Connection
 │
 ├── Shared Consumer Connection
 │
 ├── Dispatcher 1 Connection
 │
 ├── Dispatcher 2 Connection
 │
 ├── Dispatcher 3 Connection
 │
 └── Dispatcher N Connection
```

The dispatcher connections are intentionally independent.

---

# 13. Exports

The module exports:

```text
initRedis
createRedisConnection
createDispatcherClient
getProducerClient
getConsumerClient
```

---

# 14. Summary

`redis.js` provides the application's Redis connection layer. It creates producer and consumer connections, supports dedicated Redis connections for blocking dispatcher operations, configures reconnection behavior, exposes connection lifecycle events, and provides guarded accessors for the initialized clients.
