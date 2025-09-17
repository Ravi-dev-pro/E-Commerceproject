import { User, Mail, Phone, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom"

const FormField = (props) => {
    const {
      icon: Icon,
      name,
      type,
      placeholder,
      value,
      onChange,
      error,
      disabled = false,     
    } = props;
  
    return (
      <div className="group mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
          </div>
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            // disabled={disabled}  
            className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${
              error ? "border-red-400" : "border-white/10"
            } rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 hover:bg-white/10`}
          />
        </div>
        {error && <p className="text-red-400 text-sm mt-2 ml-2">{error}</p>}
      </div>
    );
  };
function UserRegistration() {

    const [step, setStep] = useState("details");
    const [formData, setFormData] = useState({ fullName: "", phoneNumber: "", });
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    // const [disabled,setdisabled]=useState(false)

    const otpInputs = useRef([]);


    useEffect(() => {
        let timer;
        if (step === 'otp' && resendTimer > 0) {
            timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [step, resendTimer]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setApiError('');
    };


    const validateDetailsForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be 10 digits';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmitDetails = async (e) => {
        e.preventDefault();
        setApiError('');
        if (!validateDetailsForm()) return;

        setIsLoading(true);
        try {
            const payload = {
                full_name: formData.fullName,
                Phone_number: formData.phoneNumber,
            };

            const result = await fetch("http://127.0.0.1:8000/api/sendotp/", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (result.ok) {
                alert("otp sent successfully")
                setStep('otp');
                setResendTimer(60);
            } else{

                const errorData = await result.json();
                setApiError(errorData.detail || 'Failed to send OTP. Number is already registered .');
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            setApiError("A network error occurred. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleOtpChange = (e, index) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value) || value === "") {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            setApiError(''); 

            if (value && index < 5) {
                otpInputs.current[index + 1].focus();
            }
        }
    };

 
    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputs.current[index - 1].focus();
        }
    };

  
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            setApiError("Please enter the complete 6-digit OTP.");
            return;
        }

        setIsLoading(true);
        setApiError('');

        try {
            const payload = {
                Phone_number: formData.phoneNumber,
                otp: enteredOtp,
            };
            const result = await fetch("http://127.0.0.1:8000/api/userverifyotp/", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (result.ok) {
                setStep('verified');
            } else {
                const errorData = await result.json();
                setApiError(errorData.detail || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setApiError("A network error occurred. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue=async()=>{
        try{
            const payload={
                full_name:formData.fullName,
                Phone_number:formData.phoneNumber
            }
            const result=await fetch("http://127.0.0.1:8000/api/register_user/",{
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (result.ok) {
                setStep("success");  
              } else {
                const errorData = await result.json();
                setApiError(errorData.detail || "Failed to register user. Please try again.");
              }
            } catch (error) {
              console.error("Error registering user:", error);
              setApiError("A network error occurred. Please check your connection.");
            }
          };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        setIsLoading(true);
        setApiError('');
        setOtp(['', '', '', '', '', '']);

        try {
            const payload = {
                full_name: formData.fullName,
                // Email: formData.email,
                Phone_number: formData.phoneNumber,
            };

            const result = await fetch("http://127.0.0.1:8000/api/sendotp/", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (result.ok) {
                setResendTimer(60); // Reset timer
            } else {
                const errorData = await result.json();
                setApiError(errorData.detail || 'Failed to resend OTP.');
            }

        } catch (error) {
            console.error("Error resending OTP:", error);
            setApiError("A network error occurred.");
        } finally {
            setIsLoading(false);
        }
    }

    // A simple component to render form fields
   
      

    const renderFormContent = () => {
        switch (step) {
            case 'details':
                return (
                    <form onSubmit={handleSubmitDetails} noValidate>
                      <FormField icon={User}  name="fullName"  type="text"  placeholder="Full Name"  value={formData.fullName}  onChange={handleInputChange} error={errors.fullName}
/>

                        <FormField icon={Phone} name="phoneNumber" type="tel" placeholder="10-Digit Phone Number" value={formData.phoneNumber} onChange={handleInputChange} error={errors.phoneNumber} />
                        {apiError && (
                            <p className="text-sm text-red-400 flex items-center justify-center gap-2 animate-fade-in mb-4">
                                <AlertCircle className="h-4 w-4" /> {apiError}
                            </p>
                        )}
                        <button type='submit' disabled={isLoading} className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:scale-100 shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg">
                            {isLoading ? <><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> Sending OTP...</> : 'Continue'}
                        </button>
                    </form>
                );
            case 'otp':
                return (
                    <form onSubmit={handleVerifyOtp}>
                        <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
                            Enter the 6-digit OTP sent to {formData.phoneNumber}
                        </label>
                        <button onClick={() => setStep('details')} className="flex items-center gap-2 text-gray-400 hover:text-white mx-auto text-sm mb-4">
                            <ArrowLeft size={16} /> Change Number
                        </button>
                        <div className="flex justify-center gap-2 sm:gap-3 mb-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => otpInputs.current[index] = el}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                    className={`w-12 h-14 text-center text-xl font-bold bg-white/5 border ${apiError ? "border-red-400" : "border-white/10"} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 hover:bg-white/10`}
                                    maxLength="1"
                                />
                            ))}
                        </div>
                        {apiError && (
                            <p className="text-sm text-red-400 flex items-center justify-center gap-2 animate-fade-in mb-4">
                                <AlertCircle className="h-4 w-4" /> {apiError}
                            </p>
                        )}
                        <button type="submit" disabled={isLoading || otp.join('').length !== 6} className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:scale-100 shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg">
                            {isLoading ? <><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> Verifying...</> : <><Check className="h-6 w-6" /> Verify OTP</>}
                        </button>
                        <div className="text-center mt-6">
                            <p className="text-gray-400 text-sm mb-2">Didn't receive the code?</p>
                            <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0 || isLoading} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 disabled:text-gray-500 disabled:cursor-not-allowed">
                                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                            </button>
                        </div>
                    </form>
                );
            case 'verified':   
                return (
                    <div className="text-center animate-fade-in h-60">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full mb-6 ring-4 ring-blue-500/30">
                            <Check className="w-10 h-10 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Number Verified!</h2>
                            <p className="text-gray-300 mb-5">Welcome, {formData.fullName}. Please continue to complete registration.</p>
                            <button
                                onClick={handleContinue}
                                className="border-4 p-2 px-6 bg-blue-100 "
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                );

            case 'success':
                return (
                    <div className="text-center animate-fade-in h-60">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6 ring-4 ring-green-500/30">
                            <Check className="w-10 h-10 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Registration Successful!</h2>
                            <p className="text-gray-300 mb-8">Welcome, {formData.fullName}. You can now proceed for login.</p>
                            <Link to="/UserLogin" className='border-4 p-2 px-6 bg-green-100 mt-10'>Login</Link>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 font-sans">
            {/* Animated background shapes */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6 shadow-lg">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-gray-300 text-lg mb-8">
                        {step === 'otp' ? 'Just one more step to go!' : 'Start your amazing journey with us.'}
                    </p>

                    <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500">
                        {renderFormContent()}
                    </div>
                </div>
            </div>
        </main>
    );
}
export default UserRegistration;

