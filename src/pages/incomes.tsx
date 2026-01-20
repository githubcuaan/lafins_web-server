import SuccessDialog from '@/components/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import FSbox from '../components/FSbox';
import AddIncomeModal from './incomes/addModal';
import IncomesTable from './incomes/IncomesTable';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Income',
        href: '/incomes',
    },
];

export default function Incomes() {
    useDocumentTitle('Incomes');
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

    // Clear success message after some time
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(undefined), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <main className="flex flex-1 flex-col gap-4 overflow-auto rounded-xl p-4">
                    <FSbox
                        endpoint="/incomes"
                        addTitle="Add new income"
                        AddModalComponent={AddIncomeModal}
                        sortFields={[
                            { label: 'Date', value: 'date' },
                            { label: 'Amount', value: 'amount' },
                        ]}
                        defaultSortBy="date"
                        defaultSortDir="desc"
                    />
                    <IncomesTable />
                </main>
                <SuccessDialog message={successMessage ?? undefined} />
            </AppLayout>
        </>
    );
}

