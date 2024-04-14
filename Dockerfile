FROM node:20-alpine AS base
RUN npm i -g pnpm

FROM base AS development


ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build
RUN pnpx prisma generate

#FROM base AS production
#ARG NODE_ENV=production
#ENV NODE_ENV=${NODE_ENV}
#WORKDIR /usr/src/app
#COPY package.json pnpm-lock.yaml ./
#RUN pnpm install --prod
#COPY --from=development /usr/src/app/dist ./dist


RUN chmod +x ./start.sh

CMD ["/bin/sh","start.sh"]