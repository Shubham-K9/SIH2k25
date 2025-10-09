# Backend Integration for Diagnosis Code Autocomplete

This document outlines the integration between the frontend React application and the backend Node.js API for NAMASTE-ICD11 diagnosis code mapping with autocomplete functionality.

## 🏗️ Architecture Overview

```
Frontend (React + Vite)     Backend (Node.js + Express)
├── Port: 5173             ├── Port: 5000
├── API Client             ├── Supabase Database
├── Autocomplete Component ├── NAMASTE-ICD11 Mappings
└── Diagnosis Page         └── REST API Endpoints
```

## 🔧 Backend Setup

### Prerequisites
- Node.js 18+ 
- Supabase account and project
- PostgreSQL database

### Installation
```bash
cd BackEnd
npm install
```

### Environment Variables
Create a `.env` file in the BackEnd directory:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### Database Setup
```bash
# Run database migrations
npm run setup-db

# Create demo users (optional)
npm run create-demo-users
```

### Start Backend Server
```bash
# Development
npm run dev

# Production
npm start
```

## 🚀 Frontend Integration

### API Client Configuration
The frontend automatically detects the backend URL:
- **Development**: `http://localhost:5000/api`
- **Production**: Uses environment variable `VITE_API_URL`

### Key Components

#### 1. CodeSearchService (`src/services/codeSearchService.js`)
- Handles all API communication with the backend
- Implements caching for better performance
- Provides debounced search functionality
- Manages authentication tokens

#### 2. DiagnosisAutocomplete (`src/components/DiagnosisAutocomplete.jsx`)
- Real-time autocomplete input component
- Keyboard navigation support
- Filtering by category and AYUSH system
- Confidence score display

#### 3. Enhanced Diagnosis Page (`src/pages/Diagnosis.jsx`)
- Integrated with backend API
- Advanced search and selection interface
- Real-time status monitoring
- Comprehensive diagnosis management

## 📡 API Endpoints

### Code Search
```http
GET /api/codes/search?q={query}&category={category}&ayush_system={system}&limit={limit}
```

**Response:**
```json
{
  "message": "Search completed successfully",
  "results": [
    {
      "id": "uuid",
      "namaste_code": "NAMASTE001",
      "namaste_label": "Back Pain",
      "namaste_description": "Pain in the back region",
      "icd11_code": "ME84.0",
      "icd11_label": "Back pain",
      "icd11_description": "Pain in the back",
      "category": "Musculoskeletal",
      "ayush_system": "Ayurveda",
      "confidence_score": 0.95,
      "is_active": true
    }
  ],
  "count": 1,
  "query": {
    "search": "back pain",
    "category": "",
    "ayush_system": "",
    "limit": 10
  }
}
```

### Get Categories
```http
GET /api/codes/categories
```

### Get AYUSH Systems
```http
GET /api/codes/ayush-systems
```

### Health Check
```http
GET /api/health
```

## 🔍 Features

### 1. Real-time Autocomplete
- **Debounced Search**: 300ms delay to prevent excessive API calls
- **Multi-field Search**: Searches across NAMASTE codes, labels, and ICD-11 codes
- **Smart Filtering**: Category and AYUSH system filters
- **Confidence Scoring**: Visual indicators for mapping quality

### 2. Advanced Search Interface
- **Quick Search Buttons**: Common diagnosis terms
- **Keyboard Navigation**: Arrow keys, Enter, Escape support
- **Loading States**: Visual feedback during searches
- **Error Handling**: Graceful fallback for API failures

### 3. Diagnosis Management
- **Selection Tracking**: Add/remove diagnoses with validation
- **Duplicate Prevention**: Prevents adding the same code twice
- **Rich Display**: Shows all relevant information for each diagnosis
- **Summary Statistics**: Overview of selected diagnoses

### 4. Backend Status Monitoring
- **Real-time Status**: Shows connection status in bottom-right corner
- **Health Checks**: Automatic backend connectivity monitoring
- **Error Reporting**: Displays connection errors and retry options

## 🛠️ Development Workflow

### Starting Both Servers
```bash
# Terminal 1: Backend
cd BackEnd
npm run dev

# Terminal 2: Frontend
npm run dev
```

### Testing the Integration
1. Start both servers
2. Navigate to `/diagnosis` page
3. Type in the search box (e.g., "back pain")
4. Verify autocomplete suggestions appear
5. Select a diagnosis and see it added to the list

### Debugging
- Check browser console for API errors
- Monitor backend logs for request details
- Use BackendStatus component to verify connection
- Check Network tab for API call details

## 🔒 Authentication

The backend requires authentication for all code search endpoints. The frontend automatically includes the JWT token from localStorage in all requests.

### Token Management
- **Storage**: JWT tokens stored in localStorage
- **Auto-inclusion**: Added to all API requests via axios interceptor
- **Error Handling**: Automatic logout on 401 responses
- **Refresh**: Manual token refresh when needed

## 📊 Performance Optimizations

### 1. Caching
- **Client-side Cache**: 5-minute cache for search results
- **Debounced Requests**: Prevents excessive API calls
- **Smart Invalidation**: Cache cleared on filter changes

### 2. API Optimization
- **Pagination**: Limits results to prevent large responses
- **Filtering**: Server-side filtering reduces data transfer
- **Compression**: Gzip compression for API responses

### 3. UI Optimizations
- **Virtual Scrolling**: For large suggestion lists
- **Lazy Loading**: Load suggestions only when needed
- **Progressive Enhancement**: Works without JavaScript

## 🚨 Error Handling

### Frontend Error Handling
- **Network Errors**: Graceful fallback to demo data
- **API Errors**: User-friendly error messages
- **Validation Errors**: Real-time form validation
- **Timeout Handling**: Automatic retry for failed requests

### Backend Error Handling
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Validates all request parameters
- **Database Errors**: Proper error responses
- **CORS Handling**: Secure cross-origin requests

## 🔧 Configuration

### Frontend Configuration
```javascript
// src/services/apiClient.js
const getBackendURL = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api'
  } else {
    return import.meta.env.VITE_API_URL || '/api'
  }
}
```

### Backend Configuration
```javascript
// BackEnd/server.js
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
```

## 📈 Monitoring and Analytics

### Backend Monitoring
- **Request Logging**: All API requests logged
- **Performance Metrics**: Response time tracking
- **Error Tracking**: Comprehensive error logging
- **Audit Trail**: All code searches logged for compliance

### Frontend Monitoring
- **User Interactions**: Search patterns and selections
- **Performance Metrics**: Load times and responsiveness
- **Error Tracking**: Client-side error monitoring
- **Usage Analytics**: Feature usage statistics

## 🚀 Deployment

### Backend Deployment
1. Set up production environment variables
2. Configure Supabase production database
3. Deploy to your preferred platform (Heroku, AWS, etc.)
4. Set up monitoring and logging

### Frontend Deployment
1. Set `VITE_API_URL` environment variable
2. Build the application: `npm run build`
3. Deploy to your hosting platform
4. Configure CORS on backend for production domain

## 🔄 Future Enhancements

### Planned Features
- **Offline Support**: Cache for offline diagnosis search
- **Advanced Filters**: Date ranges, confidence scores
- **Bulk Operations**: Import/export diagnosis lists
- **Analytics Dashboard**: Usage statistics and insights
- **Mobile App**: React Native version
- **API Versioning**: Support for multiple API versions

### Integration Opportunities
- **FHIR Integration**: Direct FHIR resource creation
- **EHR Systems**: Integration with hospital systems
- **AI/ML**: Machine learning for better code suggestions
- **Voice Input**: Speech-to-text for diagnosis entry

## 📞 Support

For issues with the backend integration:
1. Check the BackendStatus component
2. Verify environment variables
3. Check backend logs
4. Test API endpoints directly
5. Contact the development team

---

**Note**: This integration provides a robust foundation for diagnosis code management with real-time autocomplete functionality. The system is designed to be scalable, maintainable, and user-friendly while maintaining compliance with healthcare standards.
