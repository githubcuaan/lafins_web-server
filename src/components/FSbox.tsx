
import FillterBox from "./FilterBox";
import SearchBox from "./SearchBox";
import FillterOrder from "./filter-order";
import AddBtn from "./add-btn";
import { useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";

type FSboxProps = {
    endpoint: string;
    addTitle: string;
    AddModalComponent: React.ComponentType<{ isOpen: boolean; onClose: () => void; onSuccess?: () => void }>;
    sortFields: Array<{ label: string; value: string }>;
    defaultSortBy: string;
    defaultSortDir?: 'asc' | 'desc';
};


export default function FSbox({
    endpoint,
    addTitle,
    AddModalComponent,
    sortFields,
    defaultSortBy,
    defaultSortDir = 'desc',
}: FSboxProps) {
    const [open, setOpen] = useState(false);

    // state for sort
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const filters = Object.fromEntries(searchParams.entries());

    const handleSortChange = (v: { by: string; dir: string }) => {
        const currentBy = filters?.sort_by ?? defaultSortBy;
        const currentDir = filters?.sort_dir ?? defaultSortDir;
        if (String(currentBy) === String(v.by) && String(currentDir) === String(v.dir)) return;

        const data = {
            ...filters,
            sort_by: v.by,
            sort_dir: v.dir,
            page: '1',
        };
        const params = new URLSearchParams(data as Record<string, string>);
        navigate(`${endpoint}?${params.toString()}`, { replace: true });
    };

    return (
        <div className="fsbox">
            <div className="fsbox-top">
                <FillterBox endpoint={endpoint} />
            </div>

            <div className="fsbox-row">
                <div className="fsbox-left">
                    <div className="fsbox-search"><SearchBox /></div>
                    <div className="fsbox-add"><AddBtn title={addTitle} onClick={() => setOpen(true)} /></div>
                    <AddModalComponent
                        isOpen={open}
                        onClose={() => setOpen(false)}
                        onSuccess={() => {
                            setOpen(false);
                        }}
                    />
                </div>

                <div className="fsbox-right">
                    <FillterOrder
                        value={{
                            by: String(filters?.sort_by ?? defaultSortBy),
                            dir: (String(filters?.sort_dir ?? defaultSortDir) === 'asc' ? 'asc' : 'desc'),
                        }}
                        onChange={handleSortChange}
                        fields={sortFields}
                    />
                </div>
            </div>
        </div>
    );
}