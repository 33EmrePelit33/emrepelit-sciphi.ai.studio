import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const isDatabaseConfigured = (): boolean =>
  Boolean(
    process.env.SQL_HOST &&
      process.env.SQL_USER &&
      process.env.SQL_PASSWORD &&
      process.env.SQL_DB_NAME
  );

const TRANSIENT_POOL_ERROR_CODES = new Set([
  '57P01', // admin_shutdown (Cloud SQL scale-to-zero)
  '57P02', // crash_shutdown
  '57P03', // cannot_connect_now
  '08006', // connection_failure
  '08003', // connection_does_not_exist
  'ECONNRESET',
  'ETIMEDOUT',
  'EPIPE',
]);

function isTransientScaleToZeroError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { code?: string; message?: string };
  if (e.code && TRANSIENT_POOL_ERROR_CODES.has(String(e.code))) return true;
  const msg = String(e.message || '');
  return (
    msg.includes('Connection terminated unexpectedly') ||
    msg.includes('Connection terminated') ||
    msg.includes('terminating connection due to administrator command') ||
    msg.includes('ECONNRESET') ||
    msg.includes('Client has encountered a connection error')
  );
}

export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      // Close idle connections before Cloud SQL scale-to-zero drops them remotely
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
      allowExitOnIdle: true,
    });

    global._postgresPool.on('error', (err) => {
      // Cloud SQL Developer edition scales to zero when idle and terminates idle sockets;
      // pg.Pool automatically evicts the dead client and opens a fresh connection on next query.
      if (isTransientScaleToZeroError(err)) {
        return;
      }
      console.warn('SQL pool client recovered from non-idle error:', err?.message || err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();
export const db = drizzle(pool, { schema });
