'use client';
import { useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, productName: 'Cam', price: 10000, image: '../img/orange.jpg', quantity: 10 },
    { id: 2, productName: 'Táo', price: 15000, image: '../img/apple.png', quantity: 5 },
    { id: 3, productName: 'Đào', price: 20000, image: '../img/peach.jpg', quantity: 20 },
    { id: 4, productName: 'Nho', price: 20000, image: '../img/grape.jpg', quantity: 25 },
    { id: 5, productName: 'Chuối', price: 20000, image: '../img/banana.png', quantity: 30 },
  ]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: products.length + 1,
    productName: '',
    price: 0,
    image: '',
    quantity: 0,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = () => {
    if (editingProductId === null) {
      setProducts([...products, newProduct]);
    } else {
      setProducts(products.map(product => product.id === editingProductId ? newProduct : product));
      setEditingProductId(null); 
    }
    setNewProduct({ id: products.length + 1, productName: '', price: 0, image: '', quantity: 0 });
  };

  const handleDeleteProduct = (id: number) => {
    axios.delete(`/api/products/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch(error => {
        console.error('Lỗi khi xóa sản phẩm', error);
      });
  };

  const handleEditProduct = (product: Product) => {
    setNewProduct(product);
    setEditingProductId(product.id);
  };

  const handleSearchProduct = () => {
    axios.get(`/api/products/search?name=${searchQuery}`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Không tìm thấy sản phẩm', error);
        setProducts([]); 
      });
  };

  return (
    <div className="container">
      <h1>Quản lý sản phẩm</h1>

      <div>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearchProduct}>Tìm kiếm</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th> 
            <th>Tên sản phẩm</th>
            <th>Hình ảnh</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.productName}</td>
                <td><img src={product.image} alt={product.productName} width="50" /></td>
                <td>{product.price} VND</td>
                <td>{product.quantity}</td>
                <td>
                  <button onClick={() => handleEditProduct(product)}>Sửa</button>
                  <button onClick={() => handleDeleteProduct(product.id)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Không tìm thấy sản phẩm nào</td> 
            </tr>
          )}
        </tbody>
      </table>

      <h2>{editingProductId === null ? 'Thêm mới sản phẩm' : 'Cập nhật sản phẩm'}</h2>
      <div>
        <input
          type="text"
          name="productName"
          placeholder="Tên sản phẩm"
          value={newProduct.productName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Hình ảnh"
          value={newProduct.image}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Giá"
          value={newProduct.price}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Số lượng"
          value={newProduct.quantity}
          onChange={handleInputChange}
        />
        <button onClick={handleAddProduct}>
          {editingProductId === null ? 'Thêm' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
}
