import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'eisenhower';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db(dbName);
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const collection = db.collection('tasks');

  if (req.method === 'GET') {
    const { user } = req.query;
    if (!user) return res.status(401).json({ error: 'User required' });
    const tasks = await collection.find({ user }).toArray();
    res.status(200).json(tasks);
  } else if (req.method === 'POST') {
    const { title, description, urgent, important, user } = req.body;
    if (!user) return res.status(401).json({ error: 'User required' });
    const result = await collection.insertOne({ title, description, urgent, important, user });
    res.status(201).json({ _id: result.insertedId, title, description, urgent, important, user });
  } else if (req.method === 'DELETE') {
    const { id, user } = req.query;
    if (!user) return res.status(401).json({ error: 'User required' });
    await collection.deleteOne({ _id: new ObjectId(id), user });
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
}; 