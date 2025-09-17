import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { User, Mail, Phone, Building, MapPin, Shield, CheckCircle, Package, XCircle } from 'lucide-react';

function Nav() {


  const [products, setproducts] = useState([]);

  useEffect(() => {
    async function getAllproducts() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/productslist/");
        const data = await response.json();
        console.log(data);
        setproducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    getAllproducts();
  }, []);

  return (
    <>
      <div className="flex items-center w-full h-[60px] pl-3 bg-blue-900 bg-gradient-to-br from-blue-600 via-purple-500 to-pink-400  text-white font-extrabold text-2xl">
        <div className="absolute h-2 w-2  rounded-full bg-green-300 animate-ping left-36 "></div>
        <div className=" absolute h-2 w-2 rounded-full bg-yellow-300 animate-bounce right-96 "></div>
        <h1>LensVox</h1>
        <div className="ml-auto flex space-x-8 pr-3">
          <Link to="/login">SellerLogin</Link>
          {/*    */}
          {/* <Link to="/login">Login</Link> */}
          <Link to="/UserLogin">Login as User</Link>

        </div>
      </div>
      <div className="mt-10 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((item) => (
            <Link to={`/product/${item.id}`}
              state={{ item }}
              key={item.id}
              className="p-4 bg-white shadow-lg rounded-xl border hover:scale-105 transition-transform ease-in-out"
            >
              <img
                src={item.image}
                alt={item.item_name}
                className="h-40 w-full object-cover rounded-md mb-3"
              />
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Package size={18} /> {item.item_name}
              </h2>
              <p className="text-sm text-gray-600">
                Company: {item.company_name}
              </p>
              <p className="text-sm text-gray-600">Model: {item.model_name}</p>
              <p className="text-sm text-gray-600">
                Price: ₹{item.selling_price}
              </p>
             
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600 text-lg">
            No products available
          </p>
        )}
      </div>
     
    </>
  )
}

export default Nav