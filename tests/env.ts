import 'dotenv/config';
import process from 'node:process';
import path from 'node:path';

export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const authFile = path.resolve('playwright/.auth/user.json');
