import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";



function Product() {
    const [user, setUser] = useState(null)
    const [showprofile, setShowProfile] = useState(false)
    const loginfirst = () => {
        alert("login first ")
    }
    const location = useLocation();
    const navigate = useNavigate()
    const { item } = location.state || {};
    const handlelogout = () => {
        localStorage.removeItem("user")
        setUser(null)
        navigate("/")
    }
    const handleAddToCart = () => {
        let savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      
        const alreadyAdded = savedCart.find((p) => p.id === item.id);
        if (alreadyAdded) {
          savedCart = savedCart.map((p) =>
            p.id === item.id ? { ...p, qty: p.qty + 1 } : p
          );
        } else {
          savedCart.push({ ...item, qty: 1 });
        }
      
        localStorage.setItem("cart", JSON.stringify(savedCart));
      
      
        navigate("/Addcard", { state: { user } });
      };
    useEffect(() => {
        const storeduser = localStorage.getItem("user")
        if (storeduser) {
            setUser(JSON.parse(storeduser));
        }
    }, [])
    if (!item) {
        return <h2 className="text-center mt-10">No product data available</h2>;
    }

    const images = [item.image, item.image2, item.image3, item.image4, item.image5, item.image6].filter(Boolean)
    const [mainImage, setMainImage] = useState(images[0])



    return (
        <>
            {!user ? (

                <div className="flex items-center w-full h-[60px] pl-3 bg-blue-900 bg-gradient-to-br from-blue-600 via-purple-500 to-pink-400 text-white font-extrabold text-2xl">
                    <div className="absolute h-2 w-2 rounded-full bg-green-300 animate-ping left-36"></div>
                    <div className="absolute h-2 w-2 rounded-full bg-yellow-300 animate-bounce right-96"></div>
                    <h1>LensVox</h1>
                    <div className="ml-auto flex space-x-8 pr-3">
                        <Link to="/login">SellerLogin</Link>
                        <Link to="/UserLogin">Login as User</Link>
                    </div>
                </div>
            ) : (

                <div className="flex items-center w-full h-[60px] pl-3 bg-blue-900 bg-gradient-to-br from-blue-600 via-gray-500 to-white-400 text-white font-extrabold text-2xl mb-8">
                    <div className="absolute h-2 w-2 rounded-full bg-green-300 animate-ping left-36"></div>
                    <div className="absolute h-2 w-2 rounded-full bg-yellow-300 animate-bounce left-80"></div>
                    <h1 className="">LensVox</h1>

                    <div className="ml-auto flex pr-3 relative z-50">
                        <div className="mr-2 flex items-center">
                            <ShoppingCart size={24} className="mr-10" />
                            <p>Welcome : {user.name}</p>
                        </div>

                        <div className="p-1 relative">
                            <button
                                className="flex items-center justify-end font-normal border-2 p-1 rounded-lg"
                                onMouseEnter={() => setShowProfile(true)}
                                onMouseLeave={() => setShowProfile(false)}
                            >
                                Profile
                            </button>

                            {showprofile && (
                                <div className="absolute mt-2 right-0 border p-2 rounded bg-gray-100 shadow-lg" >
                                    <p className="text-black"><strong>Name:</strong> {user.name}</p>
                                    <p className="text-black"><strong>Phone:</strong> {user.phone}</p>
                                </div>
                            )}
                        </div>

                        <button
                            className="flex items-center justify-end font-normal border-2 ml-4 p-1 rounded-lg"
                            onClick={handlelogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-lg ml-20 mr-20 mt-10 rounded-2xl p-6 border hover:shadow-xl transition-all ease-in-out">
                <div>
                    <div className="flex gap-4">

                        <div className="flex flex-col gap-3 w-20">
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`w-20 h-20 object-cover rounded-md border cursor-pointer 
              ${mainImage === img ? "border-blue-500" : "border-gray-600"}`}
                                    onMouseEnter={() => setMainImage(img)}
                                    onClick={() => setMainImage(img)}
                                />
                            ))}
                        </div>


                        <div className="flex-1 flex items-center justify-center">
                            <img
                                src={mainImage}
                                alt="Main product"
                                className="w-[400px] h-[400px] object-cover rounded-xl shadow-lg"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6 w-full">
                        {!user ? (
                            <>
                                <button onClick={loginfirst} className="flex-1 bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
                                    Add to Cart
                                </button>
                                <button onClick={loginfirst} className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
                                    Buy Now
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleAddToCart} className="flex-1 bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
                                    Add to Cart
                                </button>
                                <button onClick={handleAddToCart} className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
                                    Buy Now
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">{item.item_name}</h2>

                    <p className="text-gray-700 text-lg mb-2">
                        <span className="font-semibold">Company:</span> {item.company_name}
                    </p>

                    <p className="text-gray-700 text-lg mb-2">
                        <span className="font-semibold">Model:</span> {item.model_name}
                    </p>

                    <p className="text-gray-900 text-xl font-semibold mb-4">
                        Price: ₹{item.selling_price}
                    </p>
                    <p className="text-gray-900 text-xl font-semibold mb-4">
                        MRP: ₹{item.mrp}
                    </p>
                    <p className="text-gray-900 text-xl font-semibold mb-4">
                        Quantity: ₹{item.quantity}
                    </p>
                    <p className="text-gray-900 text-xl font-semibold mb-4">
                        Size: ₹{item.size}
                    </p>
                    <p className="text-gray-900 text-xl font-semibold mb-4">
                        pack_of: ₹{item.pack_of}
                    </p>
                    <p className="text-gray-900 text-xl font-semibold mb-4">
                        container_type: ₹{item.container}
                    </p>
                    <p className="text-gray-900 text-xl font-semibold mb-4">
                        Expiry: ₹{item.maxmium_shelf_life}
                    </p>
                    <p className="text-gray-900 text-xl font-semibold mb-4">
                        fssai_number: ₹{item.fssai_number}
                    </p>
                    <p className="text-gray-900 text-xl font-semibold mb-4">
                        object_form: ₹{item.object_form}
                    </p>

                    <p className="text-gray-600 text-xl  leading-relaxed"><span className="font-semibold">Description:</span>
                        {item.description}
                    </p>
                </div>
            </div >

        </>
    )
}
export default Product;