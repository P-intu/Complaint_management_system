import React from "react";

// Individual Pulse blocks
const Pulse = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

// Overview Metrics Cards Loader
const OverviewSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <Pulse className="h-4 w-24" />
            <Pulse className="h-8 w-8 rounded-lg" />
          </div>
          <Pulse className="h-8 w-16" />
          <Pulse className="h-3.5 w-32" />
        </div>
      ))}
    </div>
  );
};

// Complaint Card Loader
const ComplaintCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col h-[320px]">
          {/* Card Header image placeholder */}
          <Pulse className="h-40 w-full rounded-t-2xl" />
          
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center gap-4">
                <Pulse className="h-5 flex-1" />
                <Pulse className="h-6 w-16 rounded-full" />
              </div>
              <Pulse className="h-3 w-full mt-2" />
              <Pulse className="h-3 w-5/6" />
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <Pulse className="h-3 w-20" />
              <Pulse className="h-3 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Admin Table Rows Loader
const TableSkeleton = () => {
  return (
    <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden animate-fade-in">
      {/* Header Placeholder */}
      <div className="bg-slate-50/50 p-4 border-b border-slate-100 grid grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Pulse key={i} className="h-4 w-20" />
        ))}
      </div>
      
      {/* Row Placeholders */}
      <div className="divide-y divide-slate-50">
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="p-4 grid grid-cols-5 gap-4 items-center">
            <Pulse className="h-4 w-32" />
            <Pulse className="h-4 w-44" />
            <Pulse className="h-6 w-16 rounded-full" />
            <Pulse className="h-4 w-24" />
            <div className="flex gap-2">
              <Pulse className="h-8 w-14 rounded-lg" />
              <Pulse className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Skeleton = {
  OverviewSkeleton,
  ComplaintCardSkeleton,
  TableSkeleton,
};

export default Skeleton;
