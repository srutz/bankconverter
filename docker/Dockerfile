# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Production stage
FROM node:22-alpine

# Create appserver user
RUN addgroup -g 1001 -S appserver && \
    adduser -S appserver -u 1001 -G appserver

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

# Change ownership of the app directory to appserver
RUN chown -R appserver:appserver /app

# Switch to appserver user
USER appserver

EXPOSE 3000
ENV TEST_PORT=3000
CMD ["node", ".output/server/index.mjs"]
