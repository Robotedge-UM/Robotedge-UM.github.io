FROM node:22-alpine3.21 AS base

# Install Python and build dependencies
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev
RUN apk add --no-cache 

# Stage 1: Dependencies
FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm i

# Stage 2: Builder
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
