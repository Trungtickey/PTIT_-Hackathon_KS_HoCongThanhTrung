import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

let products = [
  { id: 1, productName: 'Cam', price: 10000, image: '../img/orange.jpg', quantity: 10 },
  { id: 2, productName: 'Táo', price: 15000, image: '../img/apple.png', quantity: 5 },
  { id: 3, productName: 'Đào', price: 20000, image: '../img/peach.jpg', quantity: 20 },
  { id: 4, productName: 'Nho', price: 20000, image: '../img/grape.jpg', quantity: 25 },
  { id: 5, productName: 'Chuối', price: 20000, image: '../img/banana.png', quantity: 30 },
];

const categoriesFilePath = path.join(process.cwd(), 'data', 'category.json');
function getCategoriesData() {
  const fileData = fs.readFileSync(categoriesFilePath);
  return JSON.parse(fileData);
}

function validateProductData(product) {
  const { name, image, price, quantity, category_id } = product;
  
  if (!name || !image || !price || typeof quantity !== 'number' || quantity < 0) {
    return false;
  }
  
  const categories = getCategoriesData();
  const validCategory = categories.some((category) => category.id === parseInt(category_id));
  if (!validCategory) {
    return false;
  }

  return true;
}
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {

    const categories = getCategoriesData();
    const productsWithCategory = products.map((product) => {
      const category = categories.find((cat) => cat.id === product.category_id);
      return { ...product, category_title: category ? category.title : 'Unknown' };
    });
    res.status(200).json(products);
  } else if (req.method === 'POST') {
    // Thêm mới sản phẩm
    const { name, image, price, quantity, category_id } = req.body;

    // Validate dữ liệu
    if (!validateProductData(req.body)) {
      return res.status(400).json({ message: 'Invalid product data or category_id' });
    }

    const newProduct = {
      id: products.length + 1,
      name,
      image,
      price,
      quantity: parseInt(quantity),
      category_id: parseInt(category_id)
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } else {
    res.status(405).end(); 
  }
}
