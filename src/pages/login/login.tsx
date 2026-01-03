import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials, useLoginMutation } from '@/services';
import { toast } from 'sonner';
import logo from '../../../public/logo-white.png'

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const validateEmail = (email: string): string => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Email is required';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email';
        }
        return '';
    };

    const validatePassword = (password: string): string => {
        if (!password) {
            return 'Password is required';
        }
        if (password.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setEmailError('');
        setPasswordError('');

        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);

        if (emailErr || passwordErr) {
            setEmailError(emailErr);
            setPasswordError(passwordErr);
            return;
        }

        try {
            const result = await login({ email, password }).unwrap();
            dispatch(setCredentials(result.token));

            toast.success('Login successful!', {
                description: 'Welcome back to your dashboard'
            });

            navigate('/dashboard');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error('Login failed', {
                description: err?.data?.message || 'Please check your credentials and try again'
            });
            console.error('Login failed:', err);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleSubmit(e as any);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center mb-8">

                    <img src={logo} width={180} height={160} alt="log" />
                    <div className="text-2xl font-normal  ">
                        Login to Bug Track
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email address..."
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (emailError) setEmailError('');
                                }}
                                onKeyPress={handleKeyPress}
                                className={`pl-10 h-12  ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                disabled={isLoading}
                            />
                        </div>
                        {emailError && (
                            <p className="text-sm text-red-600 flex items-center gap-1 pl-1">
                                <AlertCircle className="h-3.5 w-3.5" />
                                {emailError}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (passwordError) setPasswordError('');
                                }}
                                onKeyPress={handleKeyPress}
                                className={`pl-10 pr-10 h-12  ${passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={isLoading}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {passwordError && (
                            <p className="text-sm text-red-600 flex items-center gap-1 pl-1">
                                <AlertCircle className="h-3.5 w-3.5" />
                                {passwordError}
                            </p>
                        )}
                    </div>


                    <Button
                        type="submit"
                        className="w-full h-12 text-base font-medium   rounded-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            'Sign in'
                        )}
                    </Button>

                    <div className="text-center pt-4">
                        <span className="text-sm text-gray-500">Don't have an account? </span>
                        <Link
                            to="/register"
                            className="text-sm transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}