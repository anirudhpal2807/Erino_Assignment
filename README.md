# Lead Management System

A comprehensive Lead Management System built with React frontend and Express.js backend, featuring JWT authentication, CRUD operations, server-side pagination, and filtering.

## 🚀 Features

### Authentication
- JWT-based authentication with httpOnly cookies
- User registration and login
- Password hashing with bcrypt
- Protected routes and middleware

### Lead Management
- Complete CRUD operations for leads
- Server-side pagination and filtering
- Advanced search capabilities
- Lead scoring and value tracking
- Status and source management

### Frontend
- Modern React.js with hooks
- Responsive design (mobile, tablet, desktop)
- AG Grid for data visualization
- Real-time updates with React Query
- Beautiful UI with Tailwind CSS

### Backend
- Express.js REST API
- MongoDB with Mongoose
- Industry-level architecture
- Comprehensive validation
- Error handling and logging

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router DOM
- AG Grid Community
- React Query
- Tailwind CSS
- Lucide React Icons
- React Hook Form
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Express Validator
- CORS
- Helmet
- Morgan

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd lead-management-system
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lead_management
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### 4. Start the application

#### Development Mode (Both frontend and backend)
```bash
npm run dev
```

#### Start Backend Only
```bash
npm run server
```

#### Start Frontend Only
```bash
npm run client
```

### 5. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
lead-management-system/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── server.js            # Express server
│   └── package.json
├── frontend/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── App.js           # Main app component
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Leads
- `GET /api/leads` - Get all leads (with pagination & filters)
- `GET /api/leads/:id` - Get single lead
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `GET /api/leads/stats` - Get lead statistics

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)

## 🔍 Lead Filtering & Pagination

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `status` - Filter by status (new, contacted, qualified, won, lost)
- `source` - Filter by source (website, facebook_ads, google_ads, referral, events, other)
- `company` - Search by company name
- `email` - Search by email
- `scoreMin` - Minimum score
- `scoreMax` - Maximum score
- `valueMin` - Minimum lead value
- `valueMax` - Maximum lead value
- `isQualified` - Filter by qualification status
- `sortBy` - Sort field
- `sortOrder` - Sort direction (asc/desc)

### Example API Call
```bash
GET /api/leads?page=1&limit=20&status=qualified&source=website&company=acme&sortBy=createdAt&sortOrder=desc
```

## 🗄️ Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/user),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Lead Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  company: String,
  city: String,
  state: String,
  source: Enum,
  status: Enum,
  score: Number (0-100),
  leadValue: Number,
  lastActivityAt: Date,
  isQualified: Boolean,
  createdBy: ObjectId (User),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- JWT tokens stored in httpOnly cookies
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Helmet.js security headers
- SQL injection prevention
- XSS protection

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Laptops (1024px+)
- Desktop (1280px+)

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables
3. Deploy the backend folder
4. Configure MongoDB Atlas

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the build folder
3. Set environment variables

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lead_management
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.com
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📊 Performance Features

- Server-side pagination
- Database indexing
- Query optimization
- Caching with React Query
- Lazy loading
- Code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@example.com or create an issue in the repository.

## 🎯 Future Enhancements

- [ ] Email notifications
- [ ] Lead import/export
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Lead assignment
- [ ] Custom fields
- [ ] API rate limiting per user
- [ ] Audit logs
- [ ] Multi-tenant support

---

**Built with ❤️ for the Erino SDE Internship Assignment**
