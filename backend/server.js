const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample data for the assignment
const services = [
  { 
    id: 1, 
    title: 'Web Development', 
    description: 'Custom web applications built with the latest technologies like React, Next.js, and Node.js.',
    icon: '🌐'
  },
  { 
    id: 2, 
    title: 'Mobile App Development', 
    description: 'High-performance native and cross-platform mobile apps for iOS and Android.',
    icon: '📱'
  },
  { 
    id: 3, 
    title: 'UI/UX Design', 
    description: 'User-centric design focused on creating intuitive and engaging digital experiences.',
    icon: '🎨'
  },
  { 
    id: 4, 
    title: 'Cloud Infrastructure', 
    description: 'Secure and scalable cloud solutions to power your business growth.',
    icon: '☁️'
  },
  { 
    id: 5, 
    title: 'AI & Machine Learning', 
    description: 'Leveraging data to build intelligent systems that solve complex problems.',
    icon: '🤖'
  }
];

app.get('/api/services', (req, res) => {
  res.json(services);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});
