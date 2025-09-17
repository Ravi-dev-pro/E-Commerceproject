import React, { useState } from 'react';
import { X, Mail, Phone, MapPin } from 'lucide-react';

const ProfileCard = ({ userData, isOpen, onClose }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Profile Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Information */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userData.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">N</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-800">{userData.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Mail size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-800">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Phone size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold text-gray-800">{userData.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <MapPin size={16} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold text-gray-800">{userData.district}, {userData.state}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;