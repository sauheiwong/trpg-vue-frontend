# --- Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# --- Serve Stage ---
FROM nginx:stable-alpine
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80