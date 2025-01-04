


FROM node:20-alpine AS builder
WORKDIR /frontend/
COPY package*.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=development
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /frontend/
COPY package*.json ./
RUN npm ci --only=development
COPY --from=builder /frontend/.next ./.next
COPY --from=builder /frontend/public ./public
COPY --from=builder /frontend/next.config.ts ./
EXPOSE 5000
ENV NODE_ENV=development
CMD ["npx", "next", "start", "-p", "5000"]
