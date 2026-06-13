import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
  mongodbUri:
    process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/ai-voice-platform",
  dnsServers:
    process.env.DNS_SERVERS?.split(",")
      .map((server) => server.trim())
      .filter(Boolean) ?? [],
  jwtSecret: process.env.JWT_SECRET ?? "development-only-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
};
