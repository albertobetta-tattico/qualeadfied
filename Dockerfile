# Qualeadfied frontend – dev container (Nuxt 3 SPA)
# Single-process: Nuxt dev server. Production deploy is a static build via the
# parent backend (see ../qualeadfied-be/deploy.sh).

FROM node:20-alpine AS base

WORKDIR /app

# Install deps separately so they cache when only source files change
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

ENV HOST=0.0.0.0 \
    PORT=3000 \
    NUXT_PUBLIC_API_BASE=http://localhost:8000/api

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
