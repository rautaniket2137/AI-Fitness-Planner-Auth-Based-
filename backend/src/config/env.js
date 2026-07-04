// import 'dotenv/config';

// const required = ['MONGO_URI', 'JWT_SECRET'];
// required.forEach((key) => {
//   if (!process.env[key]) {
//     console.warn(`Warning: Missing required env variable ${key}`);
//   }
// });

// export const NODE_ENV = process.env.NODE_ENV || 'development';
// export const PORT = process.env.PORT || 5000;
// export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
// export const MONGO_URI = process.env.MONGO_URI;
// export const JWT_SECRET = process.env.JWT_SECRET;
// export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
// export const JWT_COOKIE_EXPIRES_IN = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7;
// export const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';
// export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
// export const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000;
// export const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 100;

import 'dotenv/config';

const required = ['MONGO_URI', 'JWT_SECRET'];

required.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Warning: Missing required env variable ${key}`);
  }
});

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 5000;

export const CLIENT_URL =
  process.env.CLIENT_URL || 'http://localhost:5173';

export const MONGO_URI = process.env.MONGO_URI;

export const JWT_SECRET = process.env.JWT_SECRET;

export const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN || '7d';

export const JWT_COOKIE_EXPIRES_IN =
  Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7;

// AI Configuration
export const AI_PROVIDER =
  process.env.AI_PROVIDER || 'gemini';

export const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;

export const GEMINI_MODEL =
  process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// Rate Limiter
export const RATE_LIMIT_WINDOW_MS =
  Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000;

export const RATE_LIMIT_MAX =
  Number(process.env.RATE_LIMIT_MAX) || 100;