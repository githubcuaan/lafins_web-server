// Components
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { LoaderCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { authService } from '@/services/auth';

import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    useDocumentTitle('Email verification');
    
    const [processing, setProcessing] = useState(false);
    const [localStatus, setLocalStatus] = useState(status);
    const navigate = useNavigate();

    const handleResendEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);

        try {
            await api.post('/email/verification-notification');
            setLocalStatus('verification-link-sent');
        } catch (error) {
            console.error('Failed to resend verification email', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthLayout
            title="Verify email"
            description="Please verify your email address by clicking on the link we just emailed to you."
        >
            {localStatus === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <form onSubmit={handleResendEmail} className="space-y-6 text-center">
                <Button type="submit" disabled={processing} variant="secondary">
                    {processing && (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    )}
                    Resend verification email
                </Button>

                <a 
                    href="/logout"
                    onClick={handleLogout}
                    className="mx-auto block text-sm text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                >
                    Log out
                </a>
            </form>
        </AuthLayout>
    );
}
