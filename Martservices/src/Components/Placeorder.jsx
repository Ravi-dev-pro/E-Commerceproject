import { useLocation, useNavigate } from "react-router-dom"
import { ShoppingCart, Plus } from "lucide-react";
import { useEffect, useState } from "react";



function Placeorder() {
    const location = useLocation()
    const { user: initialUser, cart } = location.state || {};
    const [user, setUser] = useState(initialUser || null);
    const [showProfile, setShowProfile] = useState(false)
    const [userAddresses, setUserAddresses] = useState(() => {
        const savedAddresses = localStorage.getItem('userAddresses');
        return savedAddresses ? JSON.parse(savedAddresses) : [];
    })
    useEffect(()=>{
        localStorage.setItem('userAddresses',JSON.stringify(userAddresses))
    },[userAddresses])
    const navigate = useNavigate();
    const [isFormVisible, setisFormVisible] = useState(false)
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
    const initialAddressState = {
        name: '', phone: '', pincode: '', locality: '', address: '',
        city: '', state: '', landmark: '', alternatePhone: '', type: 'Home'
    };
    const [newAddress, setNewAddress] = useState(initialAddressState);
    const handleSaveAddress = (e) => {
        e.preventDefault();

        if (!newAddress.name || !newAddress.phone || !newAddress.pincode || !newAddress.address) {
            alert("Please fill all the required fields.");
            return;
        }

        setUserAddresses(prevAddresses => [...prevAddresses, newAddress]);

        setSelectedAddressIndex(userAddresses.length);
        setisFormVisible(false);
        setNewAddress(initialAddressState);
    };

    const handleCancel = () => {
        setisFormVisible(false);
        setNewAddress(initialAddressState);
    };
    const total = cart.reduce(
        (acc, item) => acc + item.selling_price * item.qty,
        0
    );
    const Discount = (total) => {
        if (total > 10000) {
            return total * 0.02
        } else {
            return 0
        }
    }
    const discountAmount = Discount(total);
    const finalAmount = total - discountAmount;

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/UserLogin");
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prevState => ({
            ...prevState,
            [name]: value
        }));
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
                        <span className="absolute -top-1 -left-0 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {cart?.length || 0}
                        </span>
                    </div>
                    <p className="flex items-center p-2">Welcome : {user?.name}</p>


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
            <div className="container mx-auto p-4 flex gap-6">


                <div className="w-2/3">

                    <div className="bg-gray-600 text-white p-4 font-bold">
                        <h2>DELIVERY ADDRESS</h2>
                    </div>


                    <div className="bg-white p-6 shadow-sm">
                        {userAddresses.map((addr, index) => (
                            <div key={index} className={`p-4 border-b last:border-b-0 ${selectedAddressIndex === index ? 'bg-blue-50' : ''}`}>
                                <label className="flex items-start cursor-pointer">
                                    <input
                                        type="radio"
                                        name="address"
                                        className="mt-1 mr-4 accent-blue-600"
                                        checked={selectedAddressIndex === index}
                                        onChange={() => setSelectedAddressIndex(index)}
                                    />
                                    <div>
                                        <div className="flex items-center gap-4 mb-1">
                                            <p className="font-bold">{addr.name}</p>
                                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-sm">{addr.type}</span>
                                            <p className="font-semibold">{addr.phone}</p>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            {`${addr.address}, ${addr.city}, ${addr.state} - `}
                                            <span className="font-semibold">{addr.pincode}</span>
                                        </p>
                                        {selectedAddressIndex === index && (
                                            <button className="bg-orange-500 text-white font-bold py-2 px-6 rounded-sm shadow-md mt-4 hover:bg-orange-600">
                                                DELIVER HERE
                                            </button>
                                        )}
                                    </div>
                                    {selectedAddressIndex === index && (
                                        <button className="text-blue-600 font-semibold ml-auto text-sm">EDIT</button>
                                    )}
                                </label>
                            </div>
                        ))}

                        <div className="p-4">
                            {!isFormVisible && (
                                <button onClick={() => setisFormVisible(true)} className="flex items-center gap-2 text-blue-600 font-bold">
                                    <Plus size={20} />
                                    Add a new address
                                </button>
                            )}
                        </div>
                        {isFormVisible && (
                            <div className="p-4 border-t mt-4">
                                <h3 className="font-bold mb-4 text-gray-700">ADD A NEW ADDRESS</h3>
                                <form onSubmit={handleSaveAddress}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" name="name" value={newAddress.name} onChange={handleInputChange} placeholder="Name" className="p-2 border rounded" required />
                                        <input type="tel" name="phone" value={newAddress.phone} onChange={handleInputChange} placeholder="10-digit mobile number" className="p-2 border rounded" required maxLength="10" />
                                        <input type="text" name="pincode" value={newAddress.pincode} onChange={handleInputChange} placeholder="Pincode" className="p-2 border rounded" required />
                                        <input type="text" name="locality" value={newAddress.locality} onChange={handleInputChange} placeholder="Locality" className="p-2 border rounded" />
                                        <textarea name="address" value={newAddress.address} onChange={handleInputChange} placeholder="Address (Area and Street)" className="p-2 border rounded md:col-span-2" rows="3" required></textarea>
                                        <input type="text" name="city" value={newAddress.city} onChange={handleInputChange} placeholder="City/District/Town" className="p-2 border rounded" />
                                        <select name="state" value={newAddress.state} onChange={handleInputChange} className="p-2 border  rounded bg-white">
                                            <option value="">-- Select State --</option>
                                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                                            <option value="Uttrakhand">Uttrakhand</option>
                                            <option value="Bihar">Bihar</option>
                                           
                                        </select>
                                        <input type="text" name="landmark" value={newAddress.landmark} onChange={handleInputChange} placeholder="Landmark (Optional)" className="p-2 border rounded" />
                                        <input type="tel" name="alternatePhone" value={newAddress.alternatePhone} onChange={handleInputChange} placeholder="Alternate Phone (Optional)" className="p-2 border rounded" maxLength="10" />
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm font-semibold text-gray-600 mb-2">Address Type</p>
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input type="radio" name="type" value="Home" checked={newAddress.type === 'Home'} onChange={handleInputChange} className="mr-2" /> Home (All day delivery)
                                            </label>
                                            <label className="flex items-center">
                                                <input type="radio" name="type" value="Work" checked={newAddress.type === 'Work'} onChange={handleInputChange} className="mr-2" /> Work (Delivery between 10 AM - 5 PM)
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex gap-4">
                                        <button type="submit" className="bg-gray-500 text-white font-bold py-2 px-6 rounded hover:bg-orange-600">
                                            SAVE AND DELIVER HERE
                                        </button>
                                        <button type="button" onClick={handleCancel} className="text-blue-600 font-bold py-2 px-6 rounded">
                                            CANCEL
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>


                    <div className="bg-white p-4 flex items-center gap-4 shadow-sm mt-1 text-gray-400">
                        <span className="bg-gray-200 font-bold px-2 py-1 text-sm rounded-sm">3</span>
                        <h2 className="font-bold">ORDER SUMMARY</h2>
                    </div>
                </div>

                <div className="w-1/3 border p-4 rounded-lg shadow h-fit bg-white">
                    <h2 className="font-bold mb-4 text-gray-500">PRICE DETAILS</h2>
                    <div className="space-y-3">
                        <p className="flex justify-between">
                            <span>Price ({cart.length} items)</span>
                            <span>₹{total.toFixed(2)}</span>
                        </p>
                        <p className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-₹{discountAmount.toFixed(2)}</span>
                        </p>
                        <hr className="my-2 border-dashed" />
                        <p className="flex justify-between font-bold text-lg">
                            <span>Total Amount</span>
                            <span>₹{finalAmount.toFixed(2)}</span>
                        </p>
                    </div>
                </div>

            </div>
        </>
    )
}
export default Placeorder