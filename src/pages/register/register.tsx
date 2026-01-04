import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRegisterMutation } from '@/services';
import { Bug, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const [register, { isLoading }] = useRegisterMutation();

    const validateName = (name: string): string => {
        if (!name.trim()) {
            return 'Full name is required';
        }
        if (name.trim().length < 2) {
            return 'Name must be at least 2 characters';
        }
        return '';
    };

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
        if (password.length < 8) {
            return 'Password must be at least 8 characters';
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return 'Password must contain uppercase, lowercase, and number';
        }
        return '';
    };

    const validateConfirmPassword = (password: string, confirmPassword: string): string => {
        if (!confirmPassword) {
            return 'Please confirm your password';
        }
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }
        return '';
    };

    const handleSubmit = async () => {
        const nameErr = validateName(fullName);
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);
        const confirmPasswordErr = validateConfirmPassword(password, confirmPassword);

        if (nameErr || emailErr || passwordErr || confirmPasswordErr) {
            const errors = [];
            if (nameErr) errors.push(nameErr);
            if (emailErr) errors.push(emailErr);
            if (passwordErr) errors.push(passwordErr);
            if (confirmPasswordErr) errors.push(confirmPasswordErr);

            toast.error('All fields are required', {
                description: errors.join(', ')
            });
            return;
        }

        try {
            await register({
                name: fullName.trim(),
                email: email.trim(),
                password
            }).unwrap();
            localStorage.setItem('userName', fullName.trim());
            localStorage.setItem('userEmail', email.trim());
            toast.success('Account created successfully!', {
                description: 'Please sign in to continue'
            });

            navigate('/login');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error('Registration failed', {
                description: err?.data?.message || 'Please try again with different credentials'
            });
            console.error('Registration failed:', err);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className=" flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-75">
                <div className="flex flex-col items-center mb-8">
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-xl border border-dashed">
                        <div
                            className="absolute bottom-0 inset-0 rounded-xl dark:bg-white opacity-30 blur-lg"
                            style={{
                                background: 'radial-gradient(circle, rgba(255,255,255,0.5) 10%, transparent 90%)',
                            }}
                        />

                        <Bug size={40} className='text-zinc-600 dark:text-muted-foreground' />

                    </div>
                    <div className="text-2xl font-normal mt-4 ">
                        Create account
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="h-12"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

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
                                placeholder="Create a password"
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
                        {password && (
                            <div className="text-xs text-gray-500 pl-1">
                                Must be 8+ characters with uppercase, lowercase, and number
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pr-10 h-12"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={isLoading}
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <Button
                        variant={'outline'}
                        onClick={handleSubmit}
                        className="w-full h-12 text-base font-medium dark:bg-indigo-500/60 bg-indigo-700/80 text-white   rounded-md mt-1"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Creating account...</span>
                            </div>
                        ) : (
                            'Create account'
                        )}
                    </Button>

                    <div className="text-center pt-4">
                        <span className="text-sm text-gray-500">Already have an account? </span>
                        <Link
                            to="/login"
                            className="text-sm   transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}