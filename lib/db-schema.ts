/**
 * MongoDB database schema and model definitions
 *
 * This file defines the schema structure for the CryptoEdu MongoDB database.
 * It includes collections for users and their favorite cryptocurrencies.
 *
 * Database: cryptoedu
 * Collections:
 * - users: User accounts with their favorite cryptocurrencies
 *
 * Schema for User:
 * {
 *   id: string (UUID),
 *   email: string,
 *   name: string (optional),
 *   favoriteCryptos: string[] (array of crypto IDs),
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 */

// Collection indexes for better query performance:
//
// db.users.createIndex({ "email": 1 }, { unique: true })
// db.users.createIndex({ "id": 1 }, { unique: true })

export const DB_NAME = 'cryptoedu';
export const COLLECTIONS = {
  USERS: 'users',
};

// MongoDB shell commands to create database and collections
//
// use cryptoedu
//
// db.createCollection('users', {
//   validator: {
//     $jsonSchema: {
//       bsonType: 'object',
//       required: ['id', 'email', 'favoriteCryptos', 'createdAt', 'updatedAt'],
//       properties: {
//         id: {
//           bsonType: 'string',
//           description: 'UUID must be a string and is required'
//         },
//         email: {
//           bsonType: 'string',
//           pattern: '^.+@.+$',
//           description: 'Email must be a valid email address and is required'
//         },
//         name: {
//           bsonType: 'string',
//           description: 'Full name is optional'
//         },
//         favoriteCryptos: {
//           bsonType: 'array',
//           description: 'Array of crypto IDs'
//         },
//         createdAt: {
//           bsonType: 'date',
//           description: 'Creation timestamp is required'
//         },
//         updatedAt: {
//           bsonType: 'date',
//           description: 'Last update timestamp is required'
//         }
//       }
//     }
//   }
// });
