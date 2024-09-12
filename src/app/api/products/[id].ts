import { NextApiRequest, NextApiResponse } from 'next';
let products = [
  { id: 1, productName: 'Cam', price: 10000, image: '../img/orange.jpg', quantity: 10 },
  { id: 2, productName: 'Táo', price: 15000, image: '../img/apple.png', quantity: 5 },
  { id: 3, productName: 'Đào', price: 20000, image: '../img/peach.jpg', quantity: 20 },
  { id: 4, productName: 'Nho', price: 20000, image: '../img/grape.jpg', quantity: 25 },
  { id: 5, productName: 'Chuối', price: 20000, image: '../img/banana.png', quantity: 30 },
];
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const productIndex = products.findIndex(p => p.id === parseInt(id as string));

  if (req.method === 'GET') {
    if (productIndex !== -1) {
      res.status(200).json(products[productIndex]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    const updatedProduct = req.body;
    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...updatedProduct };
      res.status(200).json(products[productIndex]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } else if (req.method === 'DELETE') {
    if (productIndex !== -1) {
      products = products.filter(p => p.id !== parseInt(id as string));
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } else {
    res.status(405).end(); 
  }
  const product = products.find(p => p.id === parseInt(id as string));

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
}
