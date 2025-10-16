# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./
EXPOSE 3000
ENV TEST_PORT=3000
CMD ["node", ".output/server/index.mjs"]
