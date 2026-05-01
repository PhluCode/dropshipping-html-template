const productService = require('../services/productService');

const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    // 4. ต้องมั่นใจว่ามีบรรทัดนี้เพื่อส่งข้อมูลกลับเป็น JSON
    res.json(products); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getProducts };