import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance(),
    },
];

export default function Appearance() {
    useDocumentTitle("Appearance settings");
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Appearance settings"
                        description="Update your account's appearance settings"
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
