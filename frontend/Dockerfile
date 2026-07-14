FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG BACKEND_URL=
ENV BACKEND_URL=$BACKEND_URL
ARG NEXT_PUBLIC_API_URL=
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_PROXY_MODE=on
ENV NEXT_PUBLIC_API_PROXY_MODE=$NEXT_PUBLIC_API_PROXY_MODE
RUN if [ "$NEXT_PUBLIC_API_PROXY_MODE" = "on" ] && [ -z "$BACKEND_URL" ]; then echo "BACKEND_URL is required when API proxy mode is on"; exit 1; fi
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
