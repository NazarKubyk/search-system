<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Search system

### Create .env file

```bash
  cp .env.example .env
```

### Launch docker containers

```bash
  docker compose up -d --build
```

### Request example

```bash
  curl --location 'http://localhost:3000/api/search?q=reddit%20wikipedia'
```
