import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { authService } from '../../services'

function Auth() {
    const [userType, setUserType] = useState('hospital')
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSignIn = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Call the authentication service
            await authService.login({ email, password })
            
            // Redirect to dashboard on success
            navigate('/')
        } catch (err) {
            // Display error message
            setError(err.message || 'Login failed. Please check your credentials.')
            console.error('Login error:', err)
        } finally {
            setLoading(false)
        }
    }

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
            <div className="flex flex-col items-center justify-center px-0 sm:px-6 bg-gray-50">
                {/* Tabs */}
                <div className="w-[95%] sm:w-[85%] md:w-[70%] lg:w-[62%] bg-[var(--dashboard-text-light)] p-1 rounded-lg flex mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => setUserType('hospital')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${userType === 'hospital'
                            ? 'bg-white text-[var(--dashboard-primary)] shadow-sm'
                            : 'text-white'
                            }`}
                    >
                        Hospital Staff
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setUserType('pet')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${userType === 'pet'
                            ? 'bg-white text-[var(--dashboard-primary)] shadow-sm'
                            : 'text-white'
                            }`}
                    >
                        Pet Owner
                    </Button>
                </div>

                {/* Login Card */}
                <div className="w-[95%] sm:w-[85%] md:w-[70%] lg:w-[62%] bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-[var(--dashboard-text)] mb-2 text-start">
                            {userType === 'hospital'
                                ? 'Hospital Staff Login'
                                : 'Pet Owner Login'}
                        </h1>
                        <p className="text-gray-500 text-sm text-start">
                            {userType === 'hospital'
                                ? 'Access your veterinary practice management dashboard'
                                : 'Manage your pets and book appointments'}
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

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSignIn} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold mb-1.5 text-start">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--dashboard-primary)] outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-[var(--dashboard-primary)] outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </Button>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[var(--dashboard-primary)] hover:opacity-90 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/forgot-password')}
                            className="text-[var(--dashboard-primary)] text-sm font-medium hover:underline bg-transparent border-none cursor-pointer"
                        >
                            Forgot your password?
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-sm text-gray-500">
                    Don&apos;t have an account?{' '}
                    <button
                            onClick={() => navigate('/register')} className="text-[var(--dashboard-primary)] font-semibold">
                        Register
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Auth
