import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useNavigate } from 'react-router-dom'
function ForgotPass() {
    const [userType, setUserType] = useState('hospital')
    const [step, setStep] = useState(1) // 1=email, 2=otp, 3=reset
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2">
            {/* LEFT SIDE */}
            <div className="relative hidden lg:flex flex-col p-10 text-white">
                <div className="absolute inset-0">
                    <img
                        src="https://waggyvet.com/assets/images/cat.jpg"
                        alt="Veterinary Clinic"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="relative z-20 mt-auto">
                    <h2 className="text-2xl font-semibold">
                        Secure Account Recovery
                    </h2>
                    <p className="text-lg mt-2">
                        Reset your password securely using email verification.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col items-center justify-center px-0 sm:px-6 bg-gray-50">

                {/* Card */}
                <div className="w-[95%] sm:w-[85%] md:w-[70%] lg:w-[62%] bg-white rounded-2xl border shadow-sm p-6 sm:p-8">
                    <h1 className="text-2xl font-bold text-[var(--dashboard-text)] mb-2">
                        Forgot Password
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                        {step === 1 && 'Enter your registered email to receive an OTP'}
                        {step === 2 && 'Enter the OTP sent to your email'}
                        {step === 3 && 'Set a new password for your account'}
                    </p>

                    {/* STEP 1: EMAIL */}
                    {step === 1 && (
                        <form className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--dashboard-primary)] outline-none text-sm"
                                />
                            </div>

                            <Button
                                type="button"
                                onClick={() => setStep(2)}
                                className="w-full bg-[var(--dashboard-primary)] hover:opacity-90 text-white py-3 rounded-lg font-semibold"
                            >
                                Send OTP
                            </Button>
                        </form>
                    )}

                    {/* STEP 2: OTP */}
                    {step === 2 && (
                        <form className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">
                                    OTP
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--dashboard-primary)] outline-none text-sm tracking-widest"
                                />
                            </div>

                            <Button
                                type="button"
                                onClick={() => setStep(3)}
                                className="w-full bg-[var(--dashboard-primary)] hover:opacity-90 text-white py-3 rounded-lg font-semibold"
                            >
                                Verify OTP
                            </Button>

                            <p className="text-sm text-center text-gray-500">
                                Didn’t receive OTP?{' '}
                                <button className="text-[var(--dashboard-primary)] font-medium">
                                    Resend
                                </button>
                            </p>
                        </form>
                    )}

                    {/* STEP 3: RESET PASSWORD */}
                    {step === 3 && (
                        <form className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--dashboard-primary)] outline-none text-sm"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </Button>
                                </div>
                            </div>

                            <Button onClick={() => navigate("/login")} className="w-full bg-[var(--dashboard-primary)] hover:opacity-90 text-white py-3 rounded-lg font-semibold">
                                Reset Password
                            </Button>
                        </form>
                    )}
                </div>

                <p className="mt-6 text-sm text-gray-500">
                    Remember your password?{' '}
                    <a href="/login" className="text-[var(--dashboard-primary)] font-semibold">
                        Login
                    </a>
                </p>
            </div>
        </div>
    )
}

export default ForgotPass
