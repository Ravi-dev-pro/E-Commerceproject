import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import ban1 from '../assets/banner1.jpeg'
import ban2 from '../assets/images.jpeg'
import ban3 from '../assets/images3.jpeg'
import { motion } from "framer-motion";
import { Link } from "react-router-dom"
import { Package,ShoppingCart} from "lucide-react"


function Dashboard() {
    const [user, setUser] = useState(null)
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate()
    const [products, setproducts] = useState([]);
    useEffect(() => {
        async function allproducts() {
            try {
                const result = await fetch("http://127.0.0.1:8000/api/productslist/");
                const data = await result.json()
                console.log(data)
                setproducts(data)

            } catch (error) {
                console.error("error fetching products ", error)
            }
        }
        allproducts();
    }, [])
    const handlelogout = () => {
        localStorage.removeItem("user")
        setUser(null)
        navigate("/")
    }
    useEffect(() => {
        const storeduser = localStorage.getItem("user")
        if (storeduser) {
            setUser(JSON.parse(storeduser));
        } else {
            navigate("/")
        }
    }, [navigate])

    const image = [ban1, ban2, ban3,]
    const [index, setindex] = useState(0);
    useEffect(() => {
        const bann = setInterval(() => {
            setindex(previous => (previous + 1) % image.length)
        }, 4000);
        return () => clearInterval(bann)
    }, []);

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
                onMouseEnter={()=>setShowProfile(true)} 
                onMouseOut={()=>setShowProfile(false)}
              >
                Profile
              </button>

              {showProfile && (
              <div className="absolute mt-2 right-0 border p-2 rounded bg-gray-100 shadow-lg">
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

            <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                whileHover={{ scale: 0.7 }}
                className="flex flex-col-reverse md:flex-row justify-between overflow-hidden bg-gray-100" >
                <img src={image[index]} alt="banner" className='w-full h-60 ' />

            </motion.div>
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

export default Dashboard