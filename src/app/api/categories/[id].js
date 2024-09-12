import fs from 'fs';
import path from 'path';

const categoriesFilePath = path.join(process.cwd(), 'data', 'category.json');

function getCategoriesData() {
  const fileData = fs.readFileSync(categoriesFilePath);
  return JSON.parse(fileData);
}

function saveCategoriesData(data) {
  fs.writeFileSync(categoriesFilePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  const { id } = req.query;
  const categories = getCategoriesData();
  const category = categories.find((cat) => cat.id === parseInt(id));

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    // Sửa danh mục
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    category.title = title;
    saveCategoriesData(categories);
    
    res.status(200).json(category);
  } else if (req.method === 'DELETE') {
    // Xóa danh mục
    const newCategories = categories.filter((cat) => cat.id !== parseInt(id));
    saveCategoriesData(newCategories);
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
