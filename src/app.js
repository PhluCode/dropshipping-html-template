const express = require('express');
const path = require('path');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const checkoutRoutes = require('./routes/checkout');

const app = express();

app.use(express.json());

// 1. API Routes (เรียกจาก Frontend ผ่าน /api/products)
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/checkout', checkoutRoutes);

// 2. วิธีแก้ Cannot GET / : 
// ต้องใช้ path.join และ .. เพื่อถอยออกจาก src ไปหา root directory
app.use(express.static(path.join(__dirname, '..')));

// 3. Fallback สำหรับหน้าแรก (ถ้า Static ยังไม่ทำงาน)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});