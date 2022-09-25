import { dbName, searchHistoryCollection, SearchHistoryEntry } from './common'
import * as mongodb from 'mongodb'

export async function getSearchHistory(): Promise<Array<SearchHistoryEntry>> {
  const client = await mongodb.MongoClient.connect(process.env.MONGODB_HOST!)
  const db = client.db(dbName)
  const entries = await db
    .collection(searchHistoryCollection)
    .find()
    .sort({ timestamp: -1 })
    .toArray()
  return entries.map((entry) => ({
    id: entry.id,
    timestamp: entry.timestamp,
    entry: entry.entry,
  }))
}

export async function clearSearchHistory(): Promise<string> {
  const client = await mongodb.MongoClient.connect(process.env.MONGODB_HOST!)
  const db = client.db(dbName)
  await db.dropCollection(searchHistoryCollection)
  return `Search history cleared`
}
