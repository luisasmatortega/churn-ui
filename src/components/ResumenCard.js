import { LucideIcon } from 'lucide-react';


export default function ResumenCard({ title, value, percentage, icon: Icon, colorClass }) {
  return (
    <div className="bg-white p-2 text-sm rounded-md border border-slate-300 hover:shadow-sm
    md:p-3 md:text-sm"
    >
        <div className="flex items-center justify-center gap-1 md:gap-3 md:justify-start">
            <div className={`md:p-1 rounded-lg bg-blue-50 `}>
                <Icon 
                
                className={`${colorClass} fill-current stroke-white size-5 md:size-6`} 
                />
            </div>
            
            <h3 className="font-bold text-slate-800">
              {value} {percentage && <span className="font-normal text-slate-400">({percentage})</span>}
            </h3>
            
        </div>
        <p className=" text-slate-500 font-medium text-center md:text-left">{title}</p>
    </div>
  );
}