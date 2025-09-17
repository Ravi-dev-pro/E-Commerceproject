import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Loginseller() {
    const sellerid = localStorage.getItem("sellerid")
    const [buyer, setbuyer] = useState(null)
    const [Error, setError] = useState("")
    const [details, setdetails] = useState([])
    const navigate = useNavigate()
    const handlelogout = () => {
        navigate("/")
        localStorage.removeItem("sellerid")
    }

    useEffect(() => {
        const seller = async () => {
            try {
                if (!sellerid) {
                    setError("seller id is not found")
                    return
                }
                console.log("fetching data...")
                const result = await fetch(`http://127.0.0.1:8000/api/buyers/${sellerid}/`)

                if (!result.ok) {
                    throw new Error(`Error ${result.status}: seller not found`)
                }
                const data = await result.json()
                console.log(data)
                setbuyer(data)
            } catch (error) {
                setbuyer(null)
                setError(error.message)
            }
        }
        seller()
    }, [sellerid])

    useEffect(() => {
        const detail = async () => {
            try {
                const product = await fetch(`http://127.0.0.1:8000/api/product/${sellerid}/`)
                if (!product.ok) {
                    throw new Error(`Error ${product.status}:product not find`)
                }
                const datas = await product.json()
                console.log(datas)
                setdetails(datas)
            } catch (error) {
                setdetails(null)
                setError(error.message)
            }
        }
        detail()
    }, [sellerid])

    return (
        <>
        
            <div className="bg-gradient-to-r from-slate-600 via-slate-500 to-gray-400 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    {/* Left Section - Buyer Info */}
                    <div className="space-y-1">
                        {Error && <p className="text-red-400">{Error}</p>}

                        {buyer && (
                            <div>
                                <h3 className="text-lg font-semibold">{buyer.full_name}</h3>
                                <div className="text-sm text-gray-200">
                                    <p>Email: {buyer.Email}</p>
                                    <p>Phone: {buyer.phone_number}</p>
                                    <p>Company: {buyer.Company_name}</p>
                                    <p>District: {buyer.district_name}</p>
                                    <p>State: {buyer.State}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Section - Logout */}
                    <div>
                        <button
                            onClick={handlelogout}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg shadow-md transition duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex  ">
                <div className="grid grid-cols-4 w-fit mx-auto gap-10  mt-10">
                    {Error && <p style={{ color: "red" }}>{Error}</p>}
                    {details && details.length > 0 && (
                        details.map((item) => (
                            <div key={item.id}>
                                <div className="max-w-sm rounded-2xl  overflow-hidden shadow-sm bg-white transform transition duration-300 hover:scale-102 hover:shadow-xl cursor-pointer">
                                    <img
                                        src={item.image}
                                        alt="no image"
                                        className="h-52 w-full object-cover"
                                    />
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold text-gray-700">{item.company_name}</h2>
                                        <h1 className="text-xl font-bold text-gray-900">{item.item_name}</h1>

                                        <p className="text-sm text-gray-500 mt-1">MRP: <span className="line-through">₹{item.mrp}</span></p>
                                        <p className="text-lg font-semibold text-green-600">₹{item.selling_price}</p>

                                        <p className="text-sm text-gray-600 mt-2">Model: {item.model_number}</p>
                                        <p className="text-sm text-gray-600">{item.model_name}</p>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                    </div>
                                </div>


                            </div>
                        )
                        )

                    )}
                    <Addproduct />
                </div>

            </div >



        </>
    )
}
export default Loginseller;



function Addproduct() {
    const [showPopup, setShowPopup] = useState(false)
    const handleopen = () => setShowPopup(true)
    const handleclose = () => setShowPopup(false)
    const [formData, setFormData] = useState({ image: '',image2: '',image3: '',image4: '',image5: '',image6: '',  item_name: '',size:'',type_of:'',pack_of:'',object_form:'',container_type:'',maxmium_shelf_life:'',fssai_number:'',  company_name: '', model_number: '', model_name: '', description: '', selling_price: '', mrp: '', quantity: '' })
    const handlechange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleclear = () => {
        setFormData({ image: '',image2: '',image3: '',image4: '',image5: '',image6: '',  item_name: '',size:'',type_of:'',pack_of:'',object_form:'',container_type:'',maxmium_shelf_life:'',fssai_number:'',  company_name: '', model_number: '', model_name: '', description: '', selling_price: '', mrp: '', quantity: '' })
    object.values(fileInputRefs)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const buyer_id = localStorage.getItem("sellerid")
        const dataToSend = { ...formData, buyer_id: Number(buyer_id) }
        const formDataToSend = new FormData();
        formDataToSend.append("buyer_id", buyer_id);
        formDataToSend.append("item_name", formData.item_name);
        formDataToSend.append("company_name", formData.company_name);
        formDataToSend.append("model_number", formData.model_number);
        formDataToSend.append("model_name", formData.model_name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("selling_price", formData.selling_price);
        formDataToSend.append("mrp", formData.mrp);
        formDataToSend.append("quantity", formData.quantity);
        formDataToSend.append("fssai_number", formData.fssai_number);
        formDataToSend.append("pack_of",formData.pack_of);
        formDataToSend.append("maxmium_shelf_life", formData.maxmium_shelf_life)
        formDataToSend.append("size",formData.size);
        formDataToSend.append("object_form",formData.object_form);
        formDataToSend.append("container_type",formData.container_type);

        if (formData.image) formDataToSend.append("image", formData.image);
        if (formData.image2) formDataToSend.append("image2", formData.image2);
        if (formData.image3) formDataToSend.append("image3", formData.image3);
        if (formData.image4) formDataToSend.append("image4", formData.image4);
        if (formData.image5) formDataToSend.append("image5", formData.image5);
        if (formData.image6) formDataToSend.append("image6", formData.image6);
        try {
            const res = await fetch("http://localhost:8000/api/items/", {
                method: "POST",
                // headers: { "Content-Type": "application/json" },
                // body: JSON.stringify(dataToSend),
                body: formDataToSend
            })
            const DATA = await res.json()
            console.log("saved:", DATA)
            if (DATA.status === "success") {
                alert("Item added succesfully")
            }
            setFormData({
                image: "",
                image2:"",
                image3:"",
                image4:"",
                image5:"",
                image6:"",
                item_name: "",
                company_name: "",
                model_number: "",
                model_name: "",
                description: "",
                selling_price: "",
                mrp: "",
                quantity: "",
                container_type:"",
                type_of:"",
                pack_of:"",
                size:"",
                object_form:"",
                maxmium_shelf_life:"",
                fssai_number:""
            });
        } catch (error) {

            console.error("Error saving item:", error);

        }


    }
   


    return (
        <>
            <div className="h-60 w-60 border-4 ml-5 border-dotted border-black  opacity-50 flex justify-center items-center">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={handleopen} >Add more items</button>
            </div>
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-6xl">
                  <h2 className="text-xl font-bold mb-4">Add New Item</h2>  

                        <form onSubmit={handleSubmit}  className="grid grid-cols-5 gap-4">

                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                className="w-full p-2 mb-3 border rounded"
                                onChange={(e) =>
                                    setFormData({ ...formData, image: e.target.files[0] })

                                }

                            />
                            <input
                                type="file"
                                name="image2"
                                accept="image/*"
                                className="w-full p-2 mb-3 border rounded"
                                onChange={(e) =>
                                    setFormData({ ...formData, image2: e.target.files[0] })

                                }

                            />
                            <input
                                type="file"
                                name="image3"
                                accept="image/*"
                                className="w-full p-2 mb-3 border rounded"
                                onChange={(e) =>
                                    setFormData({ ...formData, image3: e.target.files[0] })

                                }

                            />
                            <input
                                type="file"
                                name="image4"
                                accept="image/*"
                                className="w-full p-2 mb-3 border rounded"
                                onChange={(e) =>
                                    setFormData({ ...formData, image4: e.target.files[0] })

                                }

                            />
                            <input
                                type="file"
                                name="image5"
                                accept="image/*"
                                className="w-full p-2 mb-3 border rounded"
                                onChange={(e) =>
                                    setFormData({ ...formData, image5: e.target.files[0] })

                                }

                            />
                            <input
                                type="file"
                                name="image6"
                                accept="image/*"
                                className="w-full p-2 mb-3 border rounded"
                                onChange={(e) =>
                                    setFormData({ ...formData, image6: e.target.files[0] })

                                }

                            />
                            <input
                                type="text"
                                name="item_name"
                                onChange={handlechange}
                                placeholder="Item Name"
                                value={formData.item_name}
                                className="w-full p-2 mb-3 border rounded"
                            />
                             <input
                                type="text"
                                name="size"
                                onChange={handlechange}
                                placeholder="size"
                                value={formData.size}
                                className="w-full p-2 mb-3 border rounded"
                            />
                             {/* <input
                                type="text"
                                name="type_of"
                                onChange={handlechange}
                                placeholder="type_of"
                                value={formData.type_of}
                                className="w-full p-2 mb-3 border rounded"
                            /> */}
                             <input
                                type="number"
                                name="pack_of"
                                onChange={handlechange}
                                placeholder="pack_of"
                                value={formData.pack_of}
                                className="w-full p-2 mb-3 border rounded"
                            />
                             <input
                                type="text"
                                name="object_form"
                                onChange={handlechange}
                                placeholder="object_form"
                                value={formData.object_form}
                                className="w-full p-2 mb-3 border rounded"
                            />
                             <input
                                type="text"
                                name="container_type"
                                onChange={handlechange}
                                placeholder="container_type"
                                value={formData.container_type}
                                className="w-full p-2 mb-3 border rounded"
                            />
                            <input
                                type="text"
                                name="maxmium_shelf_life"
                                onChange={handlechange}
                                placeholder="maxmium_shelf_life"
                                value={formData.maxmium_shelf_life}     
                                className="w-full p-2 mb-3 border rounded"
                            />
                            <input
                                type="text"
                                name="fssai_number"
                                onChange={handlechange}
                                placeholder="fssai_number"
                                value={formData.fssai_number}
                                className="w-full p-2 mb-3 border rounded"
                            />
                            {/* <input
                                type="text"
                                name="Net Quantity"
                                onChange={handlechange}
                                placeholder="Net Quantity"
                                value={formData.Net_Quantity}
                                className="w-full p-2 mb-3 border rounded"
                            /> */}

                            <input
                                type="text"
                                name="company_name"
                                onChange={handlechange}
                                placeholder="Company Name"
                                value={formData.company_name}
                                className="w-full p-2 mb-3 border rounded"
                            />
                            <input
                                type="text"
                                name="model_number"
                                onChange={handlechange}
                                placeholder="Model Number"
                                value={formData.model_number}
                                className="w-full p-2 mb-3 border rounded"
                            />
                            <input
                                type="text"
                                name="model_name"
                                onChange={handlechange}
                                placeholder="Model Name"
                                value={formData.model_name}
                                className="w-full p-2 mb-3 border rounded"
                            />
                            <input
                                type="number"
                                name="selling_price"
                                onChange={handlechange}
                                placeholder="selling Price"
                                value={formData.selling_price}
                                className="w-full p-2 mb-3 border rounded"
                            />
                            <input
                                type="text"
                                name="mrp"
                                onChange={handlechange}
                                placeholder="MRP"
                                value={formData.mrp}
                                className="w-full p-2 mb-3 border rounded"
                            />
                            <input
                                type="number"
                                name="quantity"
                                onChange={handlechange}
                                placeholder="Quantity"
                                value={formData.quantity}
                                className="w-full p-2 mb-3 border rounded"
                            />
                            <textarea
                                name="description"
                                onChange={handlechange}
                                placeholder="Description"
                                value={formData.description}
                                className="w-full p-2 mb-3 border rounded"
                            ></textarea>
                            <div className="col-span-5 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={handleclose}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                                >
                                    Save
                                </button>
                                <button
                                    type="clear"
                                    onClick={handleclear}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                                >
                                    clear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </>
    )
}