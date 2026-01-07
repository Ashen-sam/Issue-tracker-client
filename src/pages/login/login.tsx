import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setCredentials, useLoginMutation } from '@/services';
import { Bug, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '@/common';

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);

        if (emailErr || passwordErr) {
            const errors = [];
            if (emailErr) errors.push(emailErr);
            if (passwordErr) errors.push(passwordErr);

            showToast.error('All fields are required', errors.join(', '));
            return;
        }

        try {
            const result = await login({ email, password }).unwrap();
            dispatch(setCredentials(result));
            localStorage.setItem('vite-ui-theme', 'system');
            showToast.success('Login successful!', 'Welcome back to your dashboard');

            navigate('/dashboard');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast.error('Login failed', err?.data?.message || 'Please check your credentials and try again');
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
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-75">
                <div className="flex flex-col relative items-center mb-8">
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-xl border border-dashed">
                        <div
                            className="absolute bottom-0 inset-0 rounded-xl dark:bg-white  opacity-30 blur-lg"
                            style={{
                                background: 'radial-gradient(circle, rgba(255,255,255,0.5) 10%, transparent 90%)',
                            }}
                        />

                        <Bug size={40} className='text-zinc-600 dark:text-muted-foreground' />

                    </div>
                    <div className="text-2xl font-normal mt-4 ">
                        Login to Bug Track
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email address..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="h-12"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pr-10 h-12"
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
                    </div>


                    <Button
                        type="submit"
                        variant={'outline'}
                        className="w-full h-11 text-base font-mediumbg-indigo-700/80 text-white
  dark:bg-indigo-500/60 bg-indigo-700/80
  hover:bg-indigo-600/80 dark:hover:bg-indigo-400/60
  hover:text-white dark:hover:text-white  rounded-md"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2  text-white">
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