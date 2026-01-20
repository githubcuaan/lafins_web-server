import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { LoaderCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    useDocumentTitle('Reset password');
    
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; password_confirmation?: string }>({});
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await authService.resetPassword({
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            
            setPassword('');
            setPasswordConfirmation('');
            navigate('/login');
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthLayout
            title="Reset password"
            description="Please enter your new password below"
        >
            <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            className="mt-1 block w-full"
                            readOnly
                        />
                        <InputError
                            message={errors.email}
                            className="mt-2"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            className="mt-1 block w-full"
                            autoFocus
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirm password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            autoComplete="new-password"
                            className="mt-1 block w-full"
                            placeholder="Confirm password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        disabled={processing}
                        data-test="reset-password-button"
                    >
                        {processing && (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        )}
                        Reset password
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
