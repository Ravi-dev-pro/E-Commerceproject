import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Shield, Check, AlertCircle } from 'lucide-react';
import logo from "../assets/lvlogo.png"


function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("phone"); 
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30)
  const [serverotp, setserverotp] = useState("")
  const navigate = useNavigate();
  const handlehome = () => {
    navigate("/register")
  }
  useEffect(() => {

  })

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

  };
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {

      document.getElementById(`otp-${index - 1}`).focus();
    }
  }

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    if (phoneNumber.length === 10) {
      return "+91 " + phoneNumber.replace(/(\d{5})(\d{5})/, "$1 $2");
    }

    return phoneNumber;
  };

  const sendOtp = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/check_user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      const data = await res.json();
      if (data.success) {
        setStep("otp");
        setMessage(data.message || "OTP sent successfully ✅");
        console.log("OTP for testing:", data.otp);
        setserverotp(data.otp)
        localStorage.setItem("sellerid", data.id);
      } else {
        setError(data.message || "Error sending OTP,You are not registered \n please register yourself ");
        <a href="/register">ForRegistration</a>
      }
    } catch (err) {
      console.error(err);
      setError("Server error ");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const enteredOtp = otp.join("").trim();
      const res = await fetch("http://127.0.0.1:8000/api/otpverify/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phoneNumber,
          otp: enteredOtp,
        }),
      })
      const data = await res.json();
      console.log("OTP verify response:", data) 
      if (data.success) {
        localStorage.setItem("sellerid",data.id)
        setStep("done");
        setMessage("Login successful");
        console.log("OTP matched");
        alert("login successfully")
        navigate("/loginseller", {replace:true})
      } else {
        setError("Invalid OTP.... ");
      }
    } catch (err) {
      console.error(err);
      setError("Server error ");
    } finally {
      setIsLoading(false);
    }
  };
  const resendOtp = () => {
    if (resendTimer === 0){
sendOtp
    }

   
    setResendTimer(30);


    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };


  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-500 to-purple-700">
      <Link to="/" className=" cursor-pointer text-white">Home</Link>
     
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-3000"></div>
      </div>

      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-300 rounded-full opacity-80 animate-ping"></div>
        <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-purple-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-cyan-300 rounded-full opacity-70 animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/2 left-1/4 w-1 h-1 bg-indigo-300 rounded-full opacity-60 animate-ping delay-2000"></div>
      </div>

     
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
        
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 shadow-2xl">
           
              <img src={logo} alt="" className="w-20 h-20 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
              {step === 'phone' ? 'Welcome Back' : 'Verify OTP'}
            </h1>
            <p className="text-gray-300 text-lg">
              {step === 'phone'
                ? 'Enter your phone number to continue'
                : `We've sent a 6-digit code to +91 ${formatPhoneNumber(phoneNumber)}`
              }
            </p>
          </div>

         
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500">
            {step === 'phone' ? (
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 font-medium">+91</span>
                    </div>
                    <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
                    </div>
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className={`w-full pl-20 pr-4 py-4 bg-white/5 border ${error ? 'border-red-400' : 'border-white/10'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 hover:bg-white/10 text-lg tracking-wider`}
                      placeholder="Phone Number"
                      maxLength="10"
                    />
                  </div>
                  {phoneNumber && (
                    <p className="mt-3 text-sm text-gray-400 animate-fade-in">
                      +91 {formatPhoneNumber(phoneNumber)}
                    </p>
                  )}
                  {error && (
                    <p className="mt-3 text-sm text-red-400 flex items-center gap-2 animate-fade-in">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </p>
                  )}
                </div>

                <button
                  onClick={sendOtp}
                  disabled={isLoading || phoneNumber.length !== 10}
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:scale-100 shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="h-6 w-6" />
                    </>
                  )}
                </button>
                <div className='flex justify-center text-rose-50'>
                  <a href="/register"><u> For Registration</u></a>
                </div>
              </div>
            ) : (
            
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Enter 6-Digit OTP
                  </label>
                  <div className="flex justify-center gap-3 mb-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        placeholder="-"
                        className={`w-12 h-14 text-center text-xl font-bold bg-white/5 border ${error ? "border-red-400" : "border-white/10"
                          } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 hover:bg-white/10`}
                        maxLength="1"
                      />
                    ))}
                  </div>
                  {error && (
                    <p className="text-sm text-red-400 flex items-center justify-center gap-2 animate-fade-in mb-4">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </p>
                  )}
                </div>

                <button
                  onClick={verifyOtp}
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:scale-100 shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Check className="h-6 w-6" />
                      Verify & Login
                    </>
                  )}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-3">
                    Didn't receive the code?
                  </p>
                  <button
                    onClick={resendOtp}
                    disabled={resendTimer > 0 || isLoading}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>

                {/* Back to Phone */}
                <div className="text-center pt-4">
                  <button
                    onClick={() => {
                      setStep('phone');
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                    }}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm underline underline-offset-2"
                  >
                    Change Phone Number
                  </button>
                </div>
              </div>
            )}

            {/* Security Note */}
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 text-gray-300">
                <Shield className="h-5 w-5 text-blue-400" />
                <p className="text-sm">
                  Your phone number is secure and will only be used for authentication purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login