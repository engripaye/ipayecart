
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig} from "@neondatabase/serverless";

import ws from "ws";
neonConfig.webServerConstructor = ws;

neonConfig.poolQueryViaFetch = true;

export const prisma = new PrismaClient({ adapter })