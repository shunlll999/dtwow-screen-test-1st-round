# syntax=docker/dockerfile:1

# ---------- base: ติดตั้ง dependencies (ใช้ร่วมกันทั้ง dev / build) ----------
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---------- dev: next dev + hot reload (source ถูก bind mount จาก compose) ----------
FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------- builder: next build ----------
FROM base AS builder
ENV NODE_ENV=production
COPY . .
RUN npm run build

# ---------- prod: next start จาก build ที่ compile แล้ว ----------
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
EXPOSE 3000
CMD ["npm", "run", "start"]
