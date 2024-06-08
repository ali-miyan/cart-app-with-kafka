import React, { useState, useEffect } from "react";
import axios from "axios";
import { RootState } from "../store/AuthStore";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../store/Auth";
import { Link } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  price: number;
}

export interface CartItem {
  userId: string;
  products: Product[];
}

interface ListPostProps {
  refreshList: boolean;
  setRefreshList: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListData: React.FC<ListPostProps> = ({ refreshList, setRefreshList }) => {
  const [users, setUsers] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem | null>(null);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const dispatch = useDispatch();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/users/${userId}`, {
        withCredentials: true,
      });
      console.log(response.data, "data");

      if (response.status === 200) {
        setUsers(response.data);
        setLoading(false);
      }

      setRefreshList(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get<CartItem>(`http://localhost:4002/cart/${userId}`, {
        withCredentials: true,
      });

      console.log(response);
      
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshList]);

  useEffect(() => {
    fetchCart();
  }, [refreshList]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/logout`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setLoading(false);
        dispatch(clearToken());
      }
      setRefreshList(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
  <div className="max-w-full ml-10 mt-1 flex-wrap justify-center flex">
    <div className="mt-8">
      <Link to={"/add-products"}>
        <button className="p-3 ml-10 bg-green-900 mb-2 w-32">
          add-to cart
        </button>
      </Link>
        <button onClick={handleLogout} className="p-3 ml-10 bg-green-900 mb-2 w-32">
          Logout
        </button>
      </div>

        {loading ? (
          <p>Loading...</p>
          ) : users ? (
          <h2 className="text-2xl text-center font-bold mb-4 w-full">HELLO ALI</h2>
        ) : (
          <p>No users found</p>
        )}
      </div>
      <div className="justify-center flex">
        <div className="p-4 border w-4/6 bg-green-950 mt-4">
          <h2 className="text-2xl font-semibold mb-4">MY CART</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : cart && cart.products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {cart.products.map((product) => (
                <div key={product._id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-gray-500">${product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ListData;
