import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Mock codes endpoint for testing
app.get('/api/codes/search', (req, res) => {
  const { q } = req.query;
  
  // Mock data for testing
  const mockResults = [
    {
      id: '1',
      namaste_code: 'NAMASTE001',
      namaste_label: 'Back Pain',
      namaste_description: 'Pain in the back region',
      icd11_code: 'ME84.0',
      icd11_label: 'Back pain',
      icd11_description: 'Pain in the back',
      category: 'Musculoskeletal',
      ayush_system: 'Ayurveda',
      confidence_score: 0.95,
      is_active: true
    },
    {
      id: '2',
      namaste_code: 'NAMASTE002',
      namaste_label: 'Headache',
      namaste_description: 'Pain in the head',
      icd11_code: 'ME84.1',
      icd11_label: 'Headache',
      icd11_description: 'Pain in the head',
      category: 'Neurological',
      ayush_system: 'Ayurveda',
      confidence_score: 0.90,
      is_active: true
    },
    {
      id: '3',
      namaste_code: 'NAMASTE003',
      namaste_label: 'Diabetes',
      namaste_description: 'High blood sugar levels',
      icd11_code: '5A10',
      icd11_label: 'Type 1 diabetes mellitus',
      icd11_description: 'Type 1 diabetes mellitus',
      category: 'Endocrine',
      ayush_system: 'Ayurveda',
      confidence_score: 0.88,
      is_active: true
    },
    {
      id: '4',
      namaste_code: 'NAMASTE004',
      namaste_label: 'Hypertension',
      namaste_description: 'High blood pressure',
      icd11_code: 'BA00',
      icd11_label: 'Essential hypertension',
      icd11_description: 'Essential hypertension',
      category: 'Cardiovascular',
      ayush_system: 'Ayurveda',
      confidence_score: 0.92,
      is_active: true
    },
    {
      id: '5',
      namaste_code: 'NAMASTE005',
      namaste_label: 'Knee Pain',
      namaste_description: 'Pain in the knee joint',
      icd11_code: 'ME84.2',
      icd11_label: 'Knee pain',
      icd11_description: 'Pain in the knee',
      category: 'Musculoskeletal',
      ayush_system: 'Ayurveda',
      confidence_score: 0.87,
      is_active: true
    },
    {
      id: '6',
      namaste_code: 'NAMASTE006',
      namaste_label: 'Fever',
      namaste_description: 'Elevated body temperature',
      icd11_code: 'MD11',
      icd11_label: 'Fever',
      icd11_description: 'Elevated body temperature',
      category: 'General',
      ayush_system: 'Ayurveda',
      confidence_score: 0.85,
      is_active: true
    }
  ].filter(item => 
    !q || 
    item.namaste_label.toLowerCase().includes(q.toLowerCase()) ||
    item.namaste_code.toLowerCase().includes(q.toLowerCase()) ||
    item.icd11_label.toLowerCase().includes(q.toLowerCase())
  );

  res.json({
    message: 'Search completed successfully',
    results: mockResults,
    count: mockResults.length,
    query: { search: q, limit: 10 }
  });
});

// Mock categories endpoint
app.get('/api/codes/categories', (req, res) => {
  res.json({
    message: 'Categories retrieved successfully',
    data: ['Musculoskeletal', 'Neurological', 'Endocrine', 'Cardiovascular', 'General']
  });
});

// Mock AYUSH systems endpoint
app.get('/api/codes/ayush-systems', (req, res) => {
  res.json({
    message: 'AYUSH systems retrieved successfully',
    data: ['Ayurveda', 'Yoga', 'Naturopathy', 'Homeopathy', 'Siddha', 'Unani']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simplified Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Test search: http://localhost:${PORT}/api/codes/search?q=back`);
});

export default app;
