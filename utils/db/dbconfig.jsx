//  postgresql://wastedb_owner:hApjmC4xz2Fk@ep-wandering-sky-a5ffuhqt.us-east-2.aws.neon.tech/wastedb?sslmode=require

import {neon} from '@neondatabase/serverless'

import {drizzle} from 'drizzle-orm/neon-serverless'

import * as schema  from './schema'
const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql, {schema})