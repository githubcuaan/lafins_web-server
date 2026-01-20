import { TrendingUp } from 'lucide-react';

export default function TotalOutcome({ className = 'w-full z-30', total = 0 }) {

    return (
        <div className={className}>
            <div className="p-4 relative z-40">
                <div className="flex items-center space-x-4">
                    <div className="circle-icon">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Outcome</div>
                        <div className="text-2xl font-semibold text-red-600">{new Intl.NumberFormat('vi-VN').format(total)} VND</div>
                    </div> 
                </div>    
            </div>
        </div>
    );
}