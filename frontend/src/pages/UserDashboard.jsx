import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import StatusBadge from "../components/StatusBadge";
import Skeleton from "../components/Skeleton";
import { 
  Plus, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  TrendingUp,
  Inbox,
  ArrowRight
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get("complaints/");
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      showToast("Failed to fetch complaints list", "error");
    } finally {
      setLoading(false);
    }
  };

  // 1. Math calculations for Overview counters
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === "Pending").length;
  const inProgressCount = complaints.filter(c => c.status === "In Progress").length;
  const resolvedCount = complaints.filter(c => c.status === "Resolved").length;

  // 2. Filter / Search logic
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Case Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor administrative complaints and track resolution progress.
          </p>
        </div>

        <button
          onClick={() => navigate("/create")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-102 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          File New Complaint
        </button>
      </div>

      {/* 1. Overview Widgets */}
      {loading ? (
        <Skeleton.OverviewSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Reports</span>
              <span className="text-3xl font-black text-slate-900">{totalCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 text-slate-600">
              <Inbox className="w-6 h-6" />
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Review</span>
              <span className="text-3xl font-black text-slate-900">{pendingCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-500">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Investigation</span>
              <span className="text-3xl font-black text-slate-900">{inProgressCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-500">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          {/* Card 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved Cases</span>
              <span className="text-3xl font-black text-slate-900">{resolvedCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-2">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search complaints by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 rounded-xl border glass-input text-sm text-slate-800"
          />
        </div>

        {/* Filter status buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {["All", "Pending", "In Progress", "Resolved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                statusFilter === status
                  ? "bg-slate-950 text-white border-slate-950 shadow-md shadow-slate-100"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints Grid */}
      {loading ? (
        <Skeleton.ComplaintCardSkeleton />
      ) : filteredComplaints.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center gap-4 max-w-xl mx-auto shadow-sm glass-panel my-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-500 mb-2">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            No complaints found
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
            {searchTerm || statusFilter !== "All"
              ? "We couldn't find any reports that match your current search terms or filters."
              : "You haven't submitted any complaints yet. File a report to track facilities or institutional issues."}
          </p>
          {searchTerm || statusFilter !== "All" ? (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
              }}
              className="mt-2 text-sm font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          ) : (
            <button
              onClick={() => navigate("/create")}
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-all cursor-pointer"
            >
              Create first complaint
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Grid Display */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredComplaints.map((complaint) => (
            <Link
              to={`/complaints/${complaint.id}`}
              key={complaint.id}
              className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
            >
              {/* Image Preview or Gradient mesh placeholder */}
              <div className="h-44 w-full overflow-hidden relative bg-slate-100">
                {complaint.image ? (
                  <img
                    src={complaint.image}
                    alt={complaint.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-slate-100 via-indigo-50/20 to-purple-50/20 flex items-center justify-center relative">
                    <Inbox className="w-8 h-8 text-slate-300" />
                  </div>
                )}
                
                {/* Float status badge */}
                <div className="absolute top-3 right-3 z-10">
                  <StatusBadge status={complaint.status} />
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col justify-between min-h-[150px]">
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-1">
                    {complaint.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1">
                    {complaint.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {new Date(complaint.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  
                  <span className="text-xs font-bold text-indigo-600 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Case
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
