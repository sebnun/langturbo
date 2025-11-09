# Operations

## Postgres SSH tunnel

```ssh -L 5432:127.0.0.1:5432 ubuntu@163.192.109.201```

## Postgres migrations

1) Make changes to schema
2) ```npx drizzle-kit generate``` or add manual .sql files with ```npx drizzle-kit generate --custom --name=example```
3) ```npx drizzle-kit migrate```

## Postgres backup restore

Tunnel ```ssh -L 4005:127.0.0.1:4005 ubuntu@163.192.109.201``` and restore via UI

## Kamal job deployment

```kamal deploy -d doctor```

## Logs

```kamal app logs -d popularizer -f```

Kamal sets limit `"max-size": "10m"` to `json-file` driver by default
