import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/button'

function Register() {
    const [userType, setUserType] = useState('hospital')
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2">
            {/* LEFT SIDE */}
            <div className="relative hidden lg:flex flex-col p-10 text-white">
                <div className="absolute inset-0">
                    <img
                        src="https://waggyvet.com/assets/images/vets.jpg"
                        alt="Veterinary Clinic"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="relative z-20 mt-auto">
                    <h2 className="text-2xl font-semibold">
                        Welcome Veterinary Professionals
                    </h2>
                    <p className="text-lg mt-2">
                        Manage your practice, access patient records, and provide excellent care.
                    </p>

                    <ul className="mt-4 space-y-2 text-base">
                        <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            Manage appointments and schedules
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            Access complete patient records
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            Streamline clinic operations
                        </li>
                    </ul>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col items-center justify-center px-0 sm:px-4 bg-gray-50 py-6">

                {/* Login Card */}
                <div className="w-[95%] sm:w-[85%] md:w-[70%] lg:w-[62%] bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-[var(--dashboard-text)] mb-2 text-start">
                            Create an Account
                        </h1>
                        <p className="text-gray-500 text-sm text-start">
                            Create a hospital account for free, no credit card required.
                        </p>
                    </div>

                    {/* Google */}
                    <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition mb-6">
                        <img
                            src="https://www.svgrepo.com/show/355037/google.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="relative flex items-center mb-6">
                        <div className="flex-grow border-t border-gray-200" />
                        <span className="mx-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Or continue with
                        </span>
                        <div className="flex-grow border-t border-gray-200" />
                    </div>

                    {/* Form */}
                    <form className="space-y-5">
                        <div>
                            <label className="block text-start text-sm font-semibold mb-1.5">
                                Hospital Name
                            </label>
                            <input
                                type="text"
                                placeholder="Hospital Name"
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--dashboard-primary)] outline-none text-sm"
                            />
                        </div>
                        <div className='flex lg:flex-row flex-col gap-2'>
                            <div>
                                <label className="block text-start text-sm font-semibold mb-1.5">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="john"
                                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--dashboard-primary)] outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-start text-sm font-semibold mb-1.5">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="does"
                                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--dashboard-primary)] outline-none text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-start">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--dashboard-primary)] outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-start">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--dashboard-primary)] outline-none text-sm"
                                />
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </Button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-start">
                                Phone (Optional)
                            </label>
                            <input
                                type="tel"
                                placeholder="Phone (Optional)"
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--dashboard-primary)] outline-none text-sm"
                            />
                        </div>

                        <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <input
                                type="checkbox"
                                id="terms"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />

                            <div className="space-y-1 leading-none">
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Accept Terms and Privacy Policy
                                </label>

                                <p className="text-sm text-muted-foreground">
                                    By creating an account, you agree to our{" "}
                                    <a href="/terms" className="text-[var(--dashboard-primary)] hover:underline">
                                        Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a href="/privacy" className="text-[var(--dashboard-primary)] hover:underline">
                                        Privacy Policy
                                    </a>
                                </p>
                            </div>
                        </div>

                        <Button className="w-full bg-[var(--dashboard-primary)] hover:opacity-90 text-white py-3 rounded-lg font-semibold">
                            Create Account
                        </Button>
                    </form>
                </div>

                <p className="mt-6 text-sm text-gray-500">
                    Already have an account?{' '}
                    <a href="/login" className="text-[var(--dashboard-primary)] font-semibold">
                        sign in
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Register
