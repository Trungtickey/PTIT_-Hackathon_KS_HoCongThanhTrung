import fs from 'fs';
import path from 'path';

// Đọc dữ liệu từ category.json
const categoriesFilePath = path.join(process.cwd(), 'data', 'category.json');

function getCategoriesData() {
  const fileData = fs.readFileSync(categoriesFilePath);
  return JSON.parse(fileData);
}

function saveCategoriesData(data) {
  fs.writeFileSync(categoriesFilePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    const categories = getCategoriesData();
    res.status(200).json(categories);
  } else if (req.method === 'POST') {
    // Thêm mới danh mục
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const categories = getCategoriesData();
    const newCategory = {
      id: categories.length + 1,
      title
    };
    
    categories.push(newCategory);
    saveCategoriesData(categories);
    
    res.status(201).json(newCategory);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
