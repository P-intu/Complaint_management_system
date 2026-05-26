import React from "react";
import { Clock, RefreshCw, CheckCircle2, AlertOctagon } from "lucide-react";

const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || "Pending").trim();

  const configs = {
    "Pending": {
      bg: "bg-amber-50/70 border-amber-200/60 text-amber-800",
      dot: "bg-amber-500",
      Icon: Clock,
      label: "Pending",
    },
    "In Progress": {
      bg: "bg-indigo-50/70 border-indigo-200/60 text-indigo-800",
      dot: "bg-indigo-500",
      Icon: RefreshCw,
      label: "In Progress",
    },
    "Resolved": {
      bg: "bg-emerald-50/70 border-emerald-200/60 text-emerald-800",
      dot: "bg-emerald-500",
      Icon: CheckCircle2,
      label: "Resolved",
    },
    "Rejected": {
      bg: "bg-rose-50/70 border-rose-200/60 text-rose-800",
      dot: "bg-rose-500",
      Icon: AlertOctagon,
      label: "Rejected",
    },
  };

  const current = configs[normalizedStatus] || configs["Pending"];
  const { Icon } = current;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm shadow-sm transition-all duration-300 ${current.bg}`}
    >
      <span className="relative flex h-2 w-2">
        {normalizedStatus !== "Rejected" && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`}></span>
      </span>
      
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {current.label}
    </span>
  );
};

export default StatusBadge;
