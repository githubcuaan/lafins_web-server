import TimeRangeModal from '@/components/TimeRangeModal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Fillter({
    name,
    selected,
    onClick,
}: {
    name: string;
    selected?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${selected ? 'border-transparent bg-primary text-primary-foreground shadow-xs' : 'border-gray-700 bg-transparent hover:bg-muted'}`}
        >
            {name}
        </button>
    );
}

interface FillterBoxProps {
    className?: string;
    // endpoint: đường dẫn mà FillterBox sẽ gửi request tới (ví dụ '/dashboard' hoặc '/incomes')
    endpoint?: string;
}

export default function FillterBox({
    className,
    endpoint = '/dashboard',
}: FillterBoxProps) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const filters = Object.fromEntries(searchParams.entries());

    function detectSelectedFromFilters(
        filters:
            | { start?: string; end?: string; range?: string }
            | Record<string, string | undefined>,
    ) {
        // If server gives a canonical range, trust it directly
        if (filters.range) {
            if (filters.range === 'day') return 'Day';
            if (filters.range === 'month') return 'Month';
            if (filters.range === 'year') return 'Year';
            return 'Options';
        }

        // fallback: infer from start/end
        if (!filters.start || !filters.end) return 'Day';
        const start = filters.start;
        const end = filters.end;
        const today = new Date().toISOString().slice(0, 10);
        if (start === today && end === today) return 'Day';
        // month
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
            .toISOString()
            .slice(0, 10);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            .toISOString()
            .slice(0, 10);
        if (start === monthStart && end === monthEnd) return 'Month';
        // year
        const yearStart = new Date(now.getFullYear(), 0, 1)
            .toISOString()
            .slice(0, 10);
        const yearEnd = new Date(now.getFullYear(), 11, 31)
            .toISOString()
            .slice(0, 10);
        if (start === yearStart && end === yearEnd) return 'Year';

        return 'Options';
    }

    const [selected, setSelected] = useState<string>(() =>
        detectSelectedFromFilters(filters),
    );
    // Keep previous selected filter so we can restore if user cancels/outside-clicks the options modal
    const [prevSelected, setPrevSelected] = useState<string | null>(null);

    // update when URL params change
    useEffect(() => {
        setSelected(detectSelectedFromFilters(filters));
    }, [searchParams]);

    function applyRange(start: string, end: string, name: string) {
        // Preserve other filters (search, per_page, etc.) and reset to page 1
        const currentFilters = { ...filters };
        // Remove any existing 'range' when applying custom start/end
        delete (currentFilters as Record<string, unknown>).range;
        const data = { ...currentFilters, start, end, page: '1' };
        const params = new URLSearchParams(data as Record<string, string>);
        navigate(`${endpoint}?${params.toString()}`, { replace: false });
        setSelected(name);
    }

    function applyDay() {
        // Preserve other filters (search, per_page, etc.) and reset to page 1
        const currentFilters = { ...filters };
        // Remove custom start/end when using preset range
        delete (currentFilters as Record<string, unknown>).start;
        delete (currentFilters as Record<string, unknown>).end;
        const data = { ...currentFilters, range: 'day', page: '1' };
        const params = new URLSearchParams(data as Record<string, string>);
        navigate(`${endpoint}?${params.toString()}`, { replace: false });
        setSelected('Day');
    }

    function applyMonth() {
        // Preserve other filters (search, per_page, etc.) and reset to page 1
        const currentFilters = { ...filters };
        delete (currentFilters as Record<string, unknown>).start;
        delete (currentFilters as Record<string, unknown>).end;
        const data = { ...currentFilters, range: 'month', page: '1' };
        const params = new URLSearchParams(data as Record<string, string>);
        navigate(`${endpoint}?${params.toString()}`, { replace: false });
        setSelected('Month');
    }

    function applyYear() {
        // Preserve other filters (search, per_page, etc.) and reset to page 1
        const currentFilters = { ...filters };
        delete (currentFilters as Record<string, unknown>).start;
        delete (currentFilters as Record<string, unknown>).end;
        const data = { ...currentFilters, range: 'year', page: '1' };
        const params = new URLSearchParams(data as Record<string, string>);
        navigate(`${endpoint}?${params.toString()}`, { replace: false });
        setSelected('Year');
    }

    return (
        <div className={`${className ?? ''} flex w-full gap-2`}>
            <Fillter
                name="Day"
                selected={selected === 'Day'}
                onClick={applyDay}
            />
            <Fillter
                name="Month"
                selected={selected === 'Month'}
                onClick={applyMonth}
            />
            <Fillter
                name="Year"
                selected={selected === 'Year'}
                onClick={applyYear}
            />
            <TimeRangeModal
                onApply={(s, e) => {
                    applyRange(s, e, 'Options');
                    // clear previous selection once applied
                    setPrevSelected(null);
                }}
                onCancel={() => {
                    // restore previous selection (or fallback to URL-determined)
                    const restore =
                        prevSelected ??
                        detectSelectedFromFilters(filters);
                    setSelected(restore);
                    setPrevSelected(null);
                }}
            >
                <Fillter
                    name="Options"
                    selected={selected === 'Options'}
                    onClick={() => {
                        // open options modal and remember what was selected before
                        setPrevSelected(selected);
                        setSelected('Options');
                    }}
                />
            </TimeRangeModal>
        </div>
    );
}
