import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "linlin";

let client: MongoClient | null = null;

export function isMongoEnabled() {
  return Boolean(uri);
}

export async function getMongo(): Promise<Db | null> {
  if (!uri) return null;
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(dbName);
}
