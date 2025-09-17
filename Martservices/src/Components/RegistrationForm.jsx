import React, { useState } from 'react';
import { User, Mail, Home, Phone, MapPinHouse, LocateFixed, Locate, Check, AlertCircle } from 'lucide-react';

function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    Email: '',
    phone_number: '',
    Company_name:'',
    pin_code:'',
    district_name:'',
    State:'',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' })); 
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.Email.trim()) newErrors.Email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.Email)) newErrors.Email = 'Email is invalid';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!formData.Company_name.trim())
      newErrors.Company_name = "Company name is required";
    if (!formData.pin_code.trim()) newErrors.pin_code = "Pincode is required";
    if (!formData.district_name.trim()) newErrors.district_name = "District is required";
    if (!formData.State.trim()) newErrors.State = "State is required";
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
   
    try {
      const response = await fetch("http://127.0.0.1:8000/api/buyer/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          full_name: "",
          Email: "",
          phone_number: "",
          Company_name: "", 
          pin_code: "",
          district_name: "",
          State: "",
          agreeToTerms: false,
        });
        alert('Registration successful ');
        
      } else {
        alert("number already registered  ");
      }
    } catch (error) {
      console.error("Error:", error);
    }
   
    setIsSubmitting(false);

   
  };

  

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-700 to-pink-500">
  
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-3000"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-300 rounded-full opacity-80 animate-ping"></div>
        <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-blue-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-pink-300 rounded-full opacity-70 animate-bounce delay-1000"></div>
      </div>

      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-2">
        <div className="w-full max-w-lg">
       
          <div className="text-center mb-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
              Join Us Today
            </h1>
            <p className="text-gray-300 text-lg">Create your account and start your amazing journey</p>
          </div>

          
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="group">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.full_name ? 'border-red-400' : 'border-white/10'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 hover:bg-white/10`}
                    placeholder="Full Name"
                  />
                </div>
                {errors.full_name && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2 animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    {errors.full_name}
                  </p>
                )}
              </div>

        
              <div className="group">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.Email ? 'border-red-400' : 'border-white/10'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 hover:bg-white/10`}
                    placeholder="Email Address"
                  />
                </div>
                {errors.Email && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2 animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    {errors.Email}
                  </p>
                )}
              </div>

              <div className="group">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.phone_number ? 'border-red-400' : 'border-white/10'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 hover:bg-white/10`}
                    placeholder="Phone Number"
                  />
                </div>
                {errors.phone_number && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2 animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phone_number}
                  </p>
                )}
              </div>
              <div className="group">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Home className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    name="Company_name"
                    value={formData.Company_name}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.Company_name ? 'border-red-400' : 'border-white/10'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 hover:bg-white/10`}
                    placeholder="Company / Business Name"
                  />
                </div>
                {errors.Company_name && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2 animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    {errors.Company_name}
                  </p>
                )}
              </div>

              <div className='group'>
                <div className='relative'>
                  <div className='absolute insert-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <MapPinHouse className='h-5 w-5 mt-5 text-gray-400 group-focus-within:text-purple-300 transition-colors duration-300' />

                  </div>
                  <input
                    type="number"
                    name='pin_code'
                    value={formData.pin_code}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.pin_code ? 'border-red-400' : 'border-white/10'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 hover:bg-white/10`}
                    placeholder="Pincode"
                  />

                </div>

              </div>
              <div className="group">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Locate className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    name="district_name"
                    value={formData.district_name}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.district_name ? 'border-red-400' : 'border-white/10'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 hover:bg-white/10`}
                    placeholder="District"
                  />
                </div>
                {errors.district_name && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2 animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    {errors.district_name}
                  </p>
                )}
              </div>
              <div className="group">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LocateFixed className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    name="State"
                    value={formData.State}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.State ? 'border-red-400' : 'border-white/10'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 hover:bg-white/10`}
                    placeholder="State"
                  />
                </div>
                {errors.State && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2 animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    {errors.State}
                  </p>
                )}
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex items-center h-6 mt-1">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-colors duration-200"
                  />
                </div>
                <div className="text-sm">
                  <label className="text-gray-300 leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors duration-200 font-medium">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors duration-200 font-medium">
                      Privacy Policy
                    </a>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-2 animate-fade-in">
                      <AlertCircle className="h-4 w-4" />
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:scale-100 shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Check className="h-6 w-6" />
                    Create Account
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center ">
                <p className="text-gray-300 text-lg">
                  Already have an account?{' '}
                  <a href="/login" className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors duration-200 font-semibold">
                    Sign In
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;