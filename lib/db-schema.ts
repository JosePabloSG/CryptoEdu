/**
 * MongoDB database schema and model definitions
 *
 * This file defines the schema structure for the CryptoEdu MongoDB database.
 * It includes collections for users and their favorite cryptocurrencies,
 * as well as the homepage content.
 *
 * Database: cryptoedu
 * Collections:
 * - users: User accounts with their favorite cryptocurrencies
 * - crypto_edu_homepage: Dynamic content for the homepage
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
 * 
 * Schema for Homepage:
 * {
 *   name: string,
 *   description: string,
 *   url: string,
 *   logo: string,
 *   social: {
 *     twitter: string,
 *     facebook: string
 *   },
 *   offer: {
 *     title: string,
 *     description: string
 *   },
 *   stats: Array<{number: number, label: string}>,
 *   features: Array<{title: string, description: string}>,
 *   concepts: Array<{title: string, description: string}>,
 *   testimonials: Array<{author: string, comment: string}>,
 *   sections: string[],
 *   total_users: number,
 *   last_updated: Date
 * }
 */

// Collection indexes for better query performance:
//
// db.users.createIndex({ "email": 1 }, { unique: true })
// db.users.createIndex({ "id": 1 }, { unique: true })

export const DB_NAME = 'cryptoedu';
export const COLLECTIONS = {
  USERS: 'users',
  HOMEPAGE: 'crypto_edu_homepage'
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
//
// db.createCollection('crypto_edu_homepage', {
//   validator: {
//     $jsonSchema: {
//       bsonType: 'object',
//       required: ['name', 'description', 'url', 'logo', 'social', 'offer', 'stats', 'features', 'concepts', 'testimonials', 'sections', 'total_users', 'last_updated'],
//       properties: {
//         name: {
//           bsonType: 'string',
//           description: 'Platform name is required'
//         },
//         description: {
//           bsonType: 'string',
//           description: 'Platform description is required'
//         },
//         url: {
//           bsonType: 'string',
//           description: 'Platform URL is required'
//         },
//         logo: {
//           bsonType: 'string',
//           description: 'Logo URL is required'
//         },
//         social: {
//           bsonType: 'object',
//           required: ['twitter', 'facebook'],
//           properties: {
//             twitter: {
//               bsonType: 'string',
//               description: 'Twitter URL is required'
//             },
//             facebook: {
//               bsonType: 'string',
//               description: 'Facebook URL is required'
//             }
//           }
//         },
//         offer: {
//           bsonType: 'object',
//           required: ['title', 'description'],
//           properties: {
//             title: {
//               bsonType: 'string',
//               description: 'Offer title is required'
//             },
//             description: {
//               bsonType: 'string',
//               description: 'Offer description is required'
//             }
//           }
//         },
//         stats: {
//           bsonType: 'array',
//           description: 'Platform statistics',
//           items: {
//             bsonType: 'object',
//             required: ['number', 'label'],
//             properties: {
//               number: {
//                 bsonType: 'number',
//                 description: 'Statistic number'
//               },
//               label: {
//                 bsonType: 'string',
//                 description: 'Statistic label'
//               }
//             }
//           }
//         },
//         features: {
//           bsonType: 'array',
//           description: 'Platform features',
//           items: {
//             bsonType: 'object',
//             required: ['title', 'description'],
//             properties: {
//               title: {
//                 bsonType: 'string',
//                 description: 'Feature title'
//               },
//               description: {
//                 bsonType: 'string',
//                 description: 'Feature description'
//               }
//             }
//           }
//         },
//         concepts: {
//           bsonType: 'array',
//           description: 'Educational concepts',
//           items: {
//             bsonType: 'object',
//             required: ['title', 'description'],
//             properties: {
//               title: {
//                 bsonType: 'string',
//                 description: 'Concept title'
//               },
//               description: {
//                 bsonType: 'string',
//                 description: 'Concept description'
//               }
//             }
//           }
//         },
//         testimonials: {
//           bsonType: 'array',
//           description: 'User testimonials',
//           items: {
//             bsonType: 'object',
//             required: ['author', 'comment'],
//             properties: {
//               author: {
//                 bsonType: 'string',
//                 description: 'Testimonial author'
//               },
//               comment: {
//                 bsonType: 'string',
//                 description: 'Testimonial comment'
//               }
//             }
//           }
//         },
//         sections: {
//           bsonType: 'array',
//           description: 'Website sections',
//           items: {
//             bsonType: 'string'
//           }
//         },
//         total_users: {
//           bsonType: 'number',
//           description: 'Total number of platform users'
//         },
//         last_updated: {
//           bsonType: 'date',
//           description: 'Last update timestamp'
//         }
//       }
//     }
//   }
// });
