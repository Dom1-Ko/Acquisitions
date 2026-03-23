import 'dotenv/config';

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

//setup for neon-local when in develoment mode - so that prod db is not impacted by changes
if (process.env.NODE_ENV === 'development'){
    // console.log('------------------------------------');
    // console.log('DEBUG: NODE_ENV is:', process.env.NODE_ENV);
    // console.log('------------------------------------');

    // Redirects HTTP queries to your local container's proxy port
    neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
    // Disables SSL since the local proxy typically doesn't use it
    neonConfig.useSecureWebSocket = false;
    // Required to enable HTTP-based querying for the serverless driver
    neonConfig.poolQueryViaFetch = true;
}

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

export { db, sql };