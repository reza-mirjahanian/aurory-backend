
## Description
Design and implement an application that can **calculate and store** ratings of players that play a multiplayer game that involves **1v1 PvP** matches.

![alt text](help/submit.png)
![alt text](help/player-info.png)
![alt text](help/top-10.png)

## Running the app with Docker

```bash
# development
# http://localhost:3008/docs
$ docker compose -f docker-compose.dev.yml up

# or run with 
pnpm run docker:dev

```



## Running the app locally(Node.js)

#### Setup

```bash
$ pnpm install
```
###### Database

```bash
# MySQL URL example in .env file
$ DATABASE_URL=mysql://root:12345678@localhost:3306/auroray-dev

# Prisma init
$ pnpx prisma generate

# Migrate the database
$ pnpx prisma migrate dev --name init
```

#### Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

#### Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Info:
- 📌 nestjs.com
- 📌 openskill.js

#### Swagger UI (for Docker, port is 3008)
http://localhost:3001/docs

#### Done:
- ✅ Allow clients to submit results of games or matches, which will be to calculate rating.
- ✅ Allow clients to fetch rating data for a given player
- ✅ Allow clients to fetch the top 10 players by rating
- ✅ Docker
- ✅ Test cases are created
- ✅ Database(MySQL) for persistent data storage.
- ✅ Add Swagger UI.
- ✅ Husky for git commits.


#### Todo:
- 💡 End-to-end
- 💡 Follow the SOLID rules. For example, write an interface for the rating system.
- 💡 Caching with redis
- 💡 More API endpoint
- 💡 Include API versioning, 
- 💡 rate-limiting, 
