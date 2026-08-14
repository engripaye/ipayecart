
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig} from "@neondatabase/serverless";

import ws from "ws";
neonConfig.webServerConstructor = ws;

neonConfig.poolQueryViaFetch = true;

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });

if(process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;