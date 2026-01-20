// Components
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { LoaderCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { authService } from '@/services/auth';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    useDocumentTitle('Forgot password');
    
    const [email, setEmail] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ email?: string }>({});
    const [localStatus, setLocalStatus] = useState(status);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await authService.forgotPassword(email);
            setLocalStatus(response.status || 'We have emailed your password reset link!');
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
            title="Forgot password"
            description="Enter your email to receive a password reset link"
        >
            {localStatus && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {localStatus}
                </div>
            )}

            <div className="space-y-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            autoFocus
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <InputError message={errors.email} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                            data-test="email-password-reset-link-button"
                        >
                            {processing && (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            )}
                            Email password reset link
                        </Button>
                    </div>
                </form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Or, return to</span>
                    <TextLink to="/login">log in</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
