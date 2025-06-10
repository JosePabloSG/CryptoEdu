import { MongoClient } from 'mongodb';
import { DB_NAME, COLLECTIONS } from '@/lib/db-schema';

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://marcortesstiven:9Y1OEBnibgMHBNzz@cluster0.21bg2lq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

/**
 * Initialize MongoDB collections and indexes
 */
async function initializeDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    console.log(`Using database: ${DB_NAME}`);

    // Check if collections exist, create them if not
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    // Users collection
    if (!collectionNames.includes(COLLECTIONS.USERS)) {
      console.log(`Creating collection: ${COLLECTIONS.USERS}`);
      await db.createCollection(COLLECTIONS.USERS, {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: [
              'id',
              'email',
              'favoriteCryptos',
              'createdAt',
              'updatedAt',
            ],
            properties: {
              id: {
                bsonType: 'string',
                description: 'UUID must be a string and is required',
              },
              email: {
                bsonType: 'string',
                pattern: '^.+@.+$',
                description:
                  'Email must be a valid email address and is required',
              },
              name: {
                bsonType: 'string',
                description: 'Full name is optional',
              },
              favoriteCryptos: {
                bsonType: 'array',
                description: 'Array of crypto IDs',
              },
              createdAt: {
                bsonType: 'date',
                description: 'Creation timestamp is required',
              },
              updatedAt: {
                bsonType: 'date',
                description: 'Last update timestamp is required',
              },
            },
          },
        },
      });
    }

    // Create indexes
    console.log('Creating indexes for users collection');
    await db.collection(COLLECTIONS.USERS).createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { id: 1 }, unique: true },
    ]);

    console.log('Database initialization complete');
  } finally {
    await client.close();
  }
}

// Only run this script directly when needed
if (require.main === module) {
  initializeDatabase()
    .then(() => console.log('Done'))
    .catch((err) => console.error('Error initializing database:', err));
}

export default initializeDatabase;
