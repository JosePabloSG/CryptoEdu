import clientPromise from './mongodb';
import { DB_NAME, COLLECTIONS } from './db-schema';
import { User, CreateUserDTO, UpdateFavoritesDTO } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * User database service for interacting with MongoDB
 */
export class UserService {
  /**
   * Create a new user
   */
  static async createUser(userData: CreateUserDTO): Promise<User> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.USERS);

    const now = new Date();
    const user: User = {
      id: uuidv4(),
      email: userData.email,
      name: userData.name || '',
      favoriteCryptos: userData.favoriteCryptos || [],
      createdAt: now,
      updatedAt: now,
    };

    await collection.insertOne(user);
    return user;
  }

  /**
   * Find a user by email
   */
  static async findUserByEmail(email: string): Promise<User | null> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.USERS);

    const user = await collection.findOne({ email });
    return user as User | null;
  }

  /**
   * Find a user by ID
   */
  static async findUserById(id: string): Promise<User | null> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.USERS);

    const user = await collection.findOne({ id });
    return user as User | null;
  }

  /**
   * Update a user's favorite cryptocurrencies
   */
  static async updateFavorites(
    userId: string,
    favoriteCryptos: string[],
  ): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.USERS);

    const result = await collection.updateOne(
      { id: userId },
      {
        $set: {
          favoriteCryptos,
          updatedAt: new Date(),
        },
      },
    );

    return result.modifiedCount > 0;
  }
}
