// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const compression = require('compression');
// require('dotenv').config();

// const app = express();

// // Trust proxy (needed if behind proxies or for accurate IP detection)
// app.set('trust proxy', 1);

// // CORS configuration
// const allowedOrigins = [
//   'http://localhost:3000', // Local frontend
//   process.env.FRONTEND_URL, // Deployed frontend
// ].filter(Boolean); // Removes any undefined/null values

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

// // Security middleware
// app.use(helmet({
//   crossOriginEmbedderPolicy: false
// }));
// app.use(compression());

// // Rate limiting removed

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cookieParser());

// // Logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// // Database connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://palanirudh82992_db_user:NcMxUb57yv3jKpI3@erinodb.byfb0t1.mongodb.net/?retryWrites=true&w=majority&appName=ERINODB')
// .then(() => console.log('✅ MongoDB connected successfully'))
// .catch(err => {
//   console.error('❌ MongoDB connection error:', err);
//   process.exit(1);
// });

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/leads', require('./routes/leads'));
// app.use('/api/users', require('./routes/users'));

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Lead Management API is running',
//     timestamp: new Date().toISOString()
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err.stack);
  
//   if (err.name === 'ValidationError') {
//     return res.status(400).json({
//       status: 'error',
//       message: 'Validation Error',
//       errors: Object.values(err.errors).map(e => e.message)
//     });
//   }
  
//   if (err.name === 'CastError') {
//     return res.status(400).json({
//       status: 'error',
//       message: 'Invalid ID format'
//     });
//   }
  
//   if (err.name === 'JsonWebTokenError') {
//     return res.status(401).json({
//       status: 'error',
//       message: 'Invalid token'
//     });
//   }
  
//   if (err.name === 'TokenExpiredError') {
//     return res.status(401).json({
//       status: 'error',
//       message: 'Token expired'
//     });
//   }
  
//   res.status(err.status || 500).json({
//     status: 'error',
//     message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
//   });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     status: 'error',
//     message: 'Route not found'
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
//   console.log(`🔗 MongoDB connected to: ${process.env.MONGODB_URI}`);
// });

// module.exports = app;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

require('dotenv').config();

const app = express();

// ==========================
// TRUST PROXY
// ==========================

app.set('trust proxy', 1);

// ==========================
// CORS CONFIGURATION
// ==========================

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://erino-assignment-4flz.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// ==========================
// SECURITY MIDDLEWARE
// ==========================

app.use(helmet({
  crossOriginEmbedderPolicy: false
}));

app.use(compression());

// ==========================
// BODY PARSER
// ==========================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ==========================
// LOGGING
// ==========================

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==========================
// DATABASE CONNECTION
// ==========================

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ==========================
// ROOT ROUTE
// ==========================

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend API Running Successfully'
  });
});

// ==========================
// ROUTES
// ==========================

app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/users', require('./routes/users'));

// ==========================
// HEALTH CHECK
// ==========================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Lead Management API is running',
    timestamp: new Date().toISOString()
  });
});

// ==========================
// ERROR HANDLER
// ==========================

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid ID format'
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expired'
    });
  }

  res.status(err.status || 500).json({
    status: 'error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong!'
        : err.message
  });
});

// ==========================
// 404 ROUTE
// ==========================

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// ==========================
// SERVER
// ==========================

const PORT = process.env.PORT || 5000;

// Local development only
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
//comment for testing