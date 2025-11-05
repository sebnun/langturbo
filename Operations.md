# Operations

## Postgres SSH tunnel

```ssh -L 5432:127.0.0.1:5432 ubuntu@163.192.109.201```

## Postgres migrations

1) Make changes to schema and/or add .sql files with ```npx drizzle-kit generate --custom --name=example``` or ```npx drizzle-kit generate```
3) ```npx drizzle-kit migrate```