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

## Whisper inference in GCP

1) Provision VM with ubuntu "accelerated" OS (has GPU driver installed), copy config from current VM
2) Prepare for kamal with infra scripts, Install NVIDIA container toolkit for docker
3) ```curl -s "http://34.26.13.75/v1/audio/transcriptions" -F "file=@/Users/pablo/Desktop/1min.mp3" -F "model=Systran/faster-whisper-large-v3" -F "timestamp_granularities[]=word" -F "response_format=verbose_json"```

# Expo web hosting

1) ```npx expo export --platform web```
2) ```eas deploy --prod```


# Livekit agent test

```uv run src/agent.py console```

# Expo build 

For app stores ```eas build --platform all```
Development build ```eas build --platform all --profile development```

# Expo submit

```eas submit --platform ios```

# Expo update

```eas update --channel production --message "persist language"``