# Dropshipping E-commerce Template

A full-stack e-commerce dropshipping website template built with HTML, CSS, JavaScript, and Node.js. This project provides a complete solution for building an online store with user authentication, product catalog, shopping cart, and checkout functionality.

## 🏗️ Architecture Overview

This application follows a **client-server architecture** with a clear separation of concerns:

### Frontend (Client-Side)

- **Technology**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Structure**: Static HTML pages served by Express.js
- **Features**:
  - Responsive design with Bootstrap/Material Design
  - Interactive product catalog with filtering
  - Shopping cart functionality
  - User authentication forms
  - Checkout process

### Backend (Server-Side)

- **Technology**: Node.js with Express.js framework
- **Database**: SQLite3 for data persistence
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **API Structure**: RESTful API endpoints

## 📁 Project Structure

```
dropshipping-html-template/
├── assets/                 # Frontend assets
│   ├── css/               # Stylesheets
│   ├── js/                # Client-side JavaScript
│   ├── img/               # Images and media
│   └── fonts/             # Custom fonts
├── src/                   # Backend source code
│   ├── controllers/       # Request handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── checkoutController.js
│   ├── routes/           # API route definitions
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── checkout.js
│   ├── services/         # Business logic layer
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── checkoutService.js
│   ├── data/             # Data files
│   │   ├── products.json
│   │   └── auth_user.json
│   └── app.js            # Main application entry point
├── documentation/        # Project documentation
├── *.html                # Frontend HTML pages
├── package.json          # Node.js dependencies
├── .env                  # Environment variables (not committed)
└── .gitignore           # Git ignore rules
```

## 🔧 Technology Stack

### Frontend

- **HTML5**: Semantic markup and structure
- **CSS3**: Custom styling with responsive design
- **JavaScript**: DOM manipulation and API interactions
- **Bootstrap/Material Design**: UI components and layout

### Backend

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **SQLite3**: Lightweight database for development
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing
- **dotenv**: Environment variable management

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/PhluCode/dropshipping-html-template.git
   cd dropshipping-html-template
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   DATABASE_PATH=./ecommerce.db
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Checkout

- `POST /api/checkout` - Process order
- `GET /api/checkout/:id` - Get order status

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Stateless token-based auth
- **Environment Variables**: Sensitive data stored securely
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries with SQLite3

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    registration_date TEXT NOT NULL
);
```

### Products (JSON-based for simplicity)

- Stored in `src/data/products.json`
- Contains product information, pricing, images, etc.

## 🧪 Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (when implemented)

### Code Organization

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and database operations
- **Routes**: Define API endpoints and middleware
- **Data**: Static data files and database setup

## 🚀 Deployment

### Environment Setup

1. Set `NODE_ENV=production` in `.env`
2. Use a production database (PostgreSQL/MySQL recommended)
3. Configure proper JWT secrets
4. Set up SSL certificates for HTTPS

### Recommended Hosting

- **Frontend**: Netlify, Vercel, or any static hosting
- **Backend**: Heroku, DigitalOcean, AWS, or similar
- **Database**: Managed database service (RDS, PlanetScale, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for the dropshipping community**
