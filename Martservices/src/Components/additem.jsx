import React, { useState } from 'react';
import { Plus, Image, DollarSign, Package, Loader2, X } from 'lucide-react';

const AddItemCard = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    image: '',
    price: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddItem = () => {
    if (newItem.name.trim() && newItem.price.trim()) {
      const itemToAdd = {
        id: Date.now(),
        name: newItem.name.trim(),
        image: newItem.image.trim() || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
        price: parseFloat(newItem.price)
      };
      setItems([...items, itemToAdd]);
      setNewItem({ name: '', image: '', price: '' });
    }
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmitToBackend = async () => {
    setIsSubmitting(true);
    
    const dataToSend = {
      items: items,
      timestamp: new Date().toISOString(),
      totalItems: items.length,
      totalValue: items.reduce((sum, item) => sum + item.price, 0)
    };
    
    try {
        
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Items sent to backend:', dataToSend);
      
      alert(`Successfully sent ${items.length} items to backend!`);
      setItems([]);
    } catch (error) {
      console.error('Error sending items:', error);
      alert('Error sending items to backend');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
          <Package className="text-white" size={24} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Add Items</h2>
      </div>

      {/* Add Item Form */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Item</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package size={16} className="inline mr-1" />
              Item Name
            </label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter item name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image size={16} className="inline mr-1" />
              Image URL (Optional)
            </label>
            <input
              type="url"
              value={newItem.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign size={16} className="inline mr-1" />
              Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={newItem.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleAddItem}
          disabled={!newItem.name.trim() || !newItem.price.trim()}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Items List */}
      {items.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Added Items ({items.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                <h4 className="font-semibold text-gray-800 mb-1 truncate">{item.name}</h4>
                <p className="text-lg font-bold text-green-600">₹{item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center text-lg font-semibold text-gray-800">
              <span>Total Items: {items.length}</span>
              <span>Total Value: ₹{items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmitToBackend}
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Sending to Backend...</span>
              </>
            ) : (
              <span>Send All Items to Backend</span>
            )}
          </button>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Package size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No items added yet. Start by adding your first item above!</p>
        </div>
      )}
    </div>
  );
};

export default AddItemCard;