import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/AuthStore';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
}

const ProductComponent: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = useSelector((state:RootState) => state.auth.userId);
  const navigate = useNavigate();



  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Product[]>('http://localhost:4001/products',{
        withCredentials:true
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    if (name === '' || price === '') return;
    try {
      const response = await axios.post<Product>('http://localhost:4001/add-products', {
        name, price: Number(price),
      },{
        withCredentials:true
      });
      setProducts([...products, response.data]);
      setName('');
      setPrice('');
    } catch (error) {
      console.error('Error adding product', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCart = async(id:string) => {

    console.log('dd');
    
    const response = await axios.post(`http://localhost:4002/add-to-cart`,{
      userId:userId,
      productId:id
    },{
      withCredentials:true
    });

    console.log(response,'ssssssssssssss');
    

    if(response.data.error){
      alert('product already added')
    }else{
      navigate("/");
    }

  }

  return (
    <div className="container  p-4">
      <div className="">
        <div className="w-1/5 h-1/6 bg-white p-4 border">
          <h2 className="text-2xl text-black font-semibold mb-4">Add Product</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                className=" block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Price</label>
              <input
                type="number"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={addProduct}
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
        <div className="p-4  border mt-4">
          <h2 className="text-2xl font-semibold mb-4">Product List</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product._id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-gray-500">${product.price.toFixed(2)}</p>
                  <button onClick={()=>handleCart(product._id)} className='bg-green-900 p-2'>ADD TO CART</button>
                </div>
              ))}
            </div>
          )}
          {products.length === 0 ? (<h1>no products available</h1>):("")}
        </div>
      </div>
    </div>
  );
};

export default ProductComponent;
