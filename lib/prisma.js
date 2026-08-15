import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaNeon({
    connectionString,
});

const prisma =
    global.prisma ||
    new PrismaClient({
        adapter,
    });

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}

export default prisma;