import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

function Addtocard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: navUser, item, buyNow } = location.state || {};

  const [user, setUser] = useState(navUser || null);
  const [showProfile, setShowProfile] = useState(false);
  const [cart,setcart] = useState([])

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setcart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        
        navigate("/UserLogin");
      }
    }
  }, [user, navigate]);
  const updatequantity=(id,change)=>{
    setcart((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, qty: Math.max(1, item.qty + change) }
            : item
        )
    )
  }
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);
  const total = cart.reduce(
    (acc, item) => acc + item.selling_price * item.qty,
    0
  );
  const Discount=(total)=>{
    if (total>10000){
       return total*0.02
    }else{
        return 0
    }
  }
  const discountAmount = Discount(total);
  const finalAmount = total - discountAmount;
  const removeItem = (id) => {
    setcart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/UserLogin");
  };

  return (
    <>
   
      <div className="flex items-center w-full h-[60px] pl-3 bg-blue-900 bg-gradient-to-br from-blue-600 via-gray-500 to-white-400 text-white font-extrabold text-2xl mb-8">
        <div className="absolute h-2 w-2 rounded-full bg-green-300 animate-ping left-36"></div>
        <div className="absolute h-2 w-2 rounded-full bg-yellow-300 animate-bounce left-80"></div>
        <h1 className="">LensVox</h1>

        <div className="ml-auto flex pr-3 relative z-50">
          <div className="mr-2 flex items-center">
            <ShoppingCart size={24} className="mr-10" />
            <p>Welcome : {user?.name}</p>
          </div>

        
          <div className="p-1 relative">
            <button
              className="flex items-center justify-end font-normal border-2 p-1 rounded-lg"
              onMouseEnter={() => setShowProfile(true)}
              onMouseLeave={() => setShowProfile(false)}
            >
              Profile
            </button>

            {showProfile && (
              <div className="absolute mt-2 right-0 border p-2 rounded bg-gray-100 shadow-lg">
                <p className="text-black">
                  <strong>Name:</strong> {user?.name}
                </p>
                <p className="text-black">
                  <strong>Phone:</strong> {user?.phone}
                </p>
              </div>
            )}
          </div>

          <button
            className="flex items-center justify-end font-normal border-2 ml-4 p-1 rounded-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700"
        >
          Continue Shopping
        </button>
      </div>

     
      <div className="flex p-6 gap-6">
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center border p-4 rounded-lg shadow"
            >
              <img
                src={item.image}
                alt={item.item_name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-semibold">{item.item_name}</h3>
                <p className="text-gray-600">₹{item.selling_price}</p>
                <p className="text-gray-600">₹{item.model_number}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updatequantity(item.id, -1)}
                    className="px-2 border rounded"
                  >
                    −
                  </button>
                  <span className="px-3">{item.qty}</span>
                  <button
                    onClick={() => updatequantity(item.id, 1)}
                    className="px-2 border rounded"
                  >
                    +
                  </button>
                </div>
                <div className="mt-2 flex gap-4">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                  <button className="text-blue-600">Save for Later</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        
        <div className="w-1/3 border p-4 rounded-lg shadow h-fit">
          <h2 className="font-bold mb-4">PRICE DETAILS</h2>
          <p className="flex justify-between">
            <span>Price ({cart.length} items)</span>
            <span>₹{total.toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-green-600">
            <span>Discount</span>
            <span >-{discountAmount.toFixed(2)}</span>
          </p>
          <hr className="my-2" />
          <p className="flex justify-between font-bold text-lg">
            <span>Total Amount</span>
            <span>₹{finalAmount.toFixed(2)}</span>
          </p>
          <button className="w-full mt-4 bg-orange-500 text-white py-2 rounded-lg">
            PLACE ORDER
          </button>
        </div>
      </div>
    </>
  );
}

export default Addtocard;
