import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Shield, } from "lucide-react";
import logo from "../assets/lvlogo.png";
import { Navigate, useNavigate } from "react-router-dom";

function UserLogin() {
  const [step, setStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate()

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value.replace(/\D/, ""));
  };

  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`)
        if (nextInput) nextInput.focus();
      }
    }
  };



  const sendOtp = async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/usersendotp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Phone_number: phoneNumber }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep("otp");
        setResendTimer(30);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Server error, please try again");
    }
    setIsLoading(false);
  };


  const verifyOtp = async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/userverifylogin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Phone_number: phoneNumber, otp: otp.join("") }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");
        localStorage.setItem("user", JSON.stringify({
          id: data.id,
          phone: data.phone,
          name: data.name
        }));
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user.id, user.phone, user.name);
       
        setStep("done")
        console.log("otp match successfully")
        navigate("/dashboard", {replace:true})

      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Server error, please try again");
    }
    setIsLoading(false);
  };


  const resendOtp = () => {
    if (resendTimer === 0) {
      sendOtp();
    }
  };

  
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);


  const formatPhoneNumber = (num) => {
    return num.replace(/(\d{5})(\d{5})/, "$1-$2");
  };

  return (
    
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-400 via-indigo-500 to-purple-500">
      <Link to="/" className=" cursor-pointer">Home</Link>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-500 to-purple-500 rounded-full mb-6 shadow-2xl">
              <img src={logo} alt="logo" className="w-20 h-20" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
              {step === "phone" ? "Login as User" : "Verify OTP"}
            </h1>
            <p className="text-gray-300 text-lg">
              {step === "phone"
                ? "Enter your phone number to continue"
                : `We've sent a 6-digit code to +91 ${formatPhoneNumber(phoneNumber)}`}
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 shadow-2xl border border-white/10">
            {step === "phone" ? (
              <div className="space-y-6">
                {/* Phone Input */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">+91</span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white"
                      placeholder="Phone Number"
                      maxLength="10"
                    />
                  </div>
                  {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                </div>
              
                <button
                  onClick={sendOtp}
                  // onClick(Enter)
                  disabled={isLoading || phoneNumber.length !== 10}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
                <Link to='/Registration' className="flex justify-center text-white" >Registration</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {/* OTP Input */}
                <div className="flex justify-center gap-3 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      id={`otp-input-${index}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      maxLength="1"
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                          const prevInput = document.getElementById(`otp-input-${index - 1}`)
                          if (prevInput) prevInput.focus()
                        }
                      }}
                      className="w-12 h-14 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl text-white"
                    />
                  ))}
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                  onClick={verifyOtp}
                  disabled={isLoading || otp.join("").length !== 6}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl"
                >
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </button>

                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-3">Didn't receive the code?</p>
                  <button
                    onClick={resendOtp}
                    disabled={resendTimer > 0}
                    className="text-blue-400"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 text-gray-300 text-sm flex gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Your phone number is secure and will only be used for authentication.
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
