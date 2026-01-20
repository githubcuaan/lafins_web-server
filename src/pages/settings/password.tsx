import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useRef, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/password';
import { authService } from '@/services/auth';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: edit(),
    },
];

export default function Password() {
    useDocumentTitle("Password settings");
    
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setRecentlySuccessful(false);

        try {
            await authService.updatePassword(formData);
            setFormData({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
            setRecentlySuccessful(true);
            setTimeout(() => setRecentlySuccessful(false), 2000);
        } catch (error: any) {
            const validationErrors = error.response?.data?.errors || {};
            setErrors(validationErrors);
            
            if (validationErrors.password) {
                passwordInput.current?.focus();
            } else if (validationErrors.current_password) {
                currentPasswordInput.current?.focus();
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Update password"
                        description="Ensure your account is using a long, random password to stay secure"
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="current_password">
                                Current password
                            </Label>

                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                name="current_password"
                                type="password"
                                value={formData.current_password}
                                onChange={handleChange}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                placeholder="Current password"
                            />

                            <InputError
                                message={errors.current_password}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                New password
                            </Label>

                            <Input
                                id="password"
                                ref={passwordInput}
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder="New password"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirm password
                            </Label>

                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder="Confirm password"
                            />

                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                data-test="update-password-button"
                            >
                                Save password
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">
                                    Saved
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
