# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /build

# VITE_API_URL="" → all API calls become relative (/api/...) so nginx can proxy
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: serve with nginx ─────────────────────────────────────────────────
FROM nginx:1.25-alpine AS final

LABEL maintainer="safeclass-team" \
      service="safeclass-frontend" \
      version="1.0.0"

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf                       /etc/nginx/conf.d/safeclass-frontend.conf
COPY --from=builder /build/dist       /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
