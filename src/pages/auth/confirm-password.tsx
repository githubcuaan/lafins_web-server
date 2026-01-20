import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { LoaderCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

export default function ConfirmPassword() {
    useDocumentTitle('Confirm password');
    
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ password?: string }>({});
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await api.post('/user/confirm-password', { password });
            setPassword('');
            navigate(-1);
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
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing && (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            )}
                            Confirm password
                        </Button>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
