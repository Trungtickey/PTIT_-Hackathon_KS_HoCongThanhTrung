import { NextApiRequest, NextApiResponse } from 'next';
const products = [
  { id: 1, productName: 'Cam', price: 10000, image: '../img/orange.jpg', quantity: 10 },
  { id: 2, productName: 'Táo', price: 15000, image: '../img/apple.png', quantity: 5 },
  { id: 3, productName: 'Đào', price: 20000, image: '../img/peach.jpg', quantity: 20 },
  { id: 4, productName: 'Nho', price: 20000, image: '../img/grape.jpg', quantity: 25 },
  { id: 5, productName: 'Chuối', price: 20000, image: '../img/banana.png', quantity: 30 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  if (req.method === 'GET') {
    const filteredProducts = products.filter(product =>
      product.productName.toLowerCase().includes((name as string).toLowerCase())
    );

    if (filteredProducts.length > 0) {
      res.status(200).json(filteredProducts);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } else {
    res.status(405).end(); 
  }
}
