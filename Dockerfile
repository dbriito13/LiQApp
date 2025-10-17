# ---------- build stage ----------
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy source & build
COPY tsconfig*.json ./
COPY prisma ./prisma/
COPY src ./src
RUN npm run build
RUN npx prisma generate

# ---------- runtime stage ----------
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# prod deps only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# copy built files + prisma client
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

# DEV - Apply migrations and start in watch mode
CMD ["sh", "-c", "npm run start:dev"]
