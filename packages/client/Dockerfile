# syntax=docker/dockerfile:1.6

############################
# 1) Build stage (Node + esbuild)
############################
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies (better caching)
COPY package.json yarn.lock ./
RUN corepack enable
RUN yarn set version 3.8.7

# RUN --mount=type=cache,target=/root/.yarn-cache \
RUN yarn install --immutable

# --cache-folder /root/.yarn-cache

ARG PB_HOST
ARG LWL_ID

ENV PB_HOST=$PB_HOST
ENV LWL_ID=$LWL_ID

# Copy source and build
COPY src ./src
COPY public ./public
ENV NODE_ENV=production
RUN yarn build_prod

############################
# 2) Runtime stage (nginx)
############################
FROM nginx:1.27-alpine AS runtime

# Copy build output to nginx web root
COPY --from=build /app/public /usr/share/nginx/html

# Replace default server config (adds SPA fallback + caching + gzip)
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
