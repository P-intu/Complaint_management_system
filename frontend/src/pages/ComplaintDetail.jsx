import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { 
  ArrowLeft, 
  Trash2, 
  Edit2, 
  Calendar, 
  User, 
  Tag, 
  Loader2, 
  Image, 
  ShieldAlert,
  CheckCircle,
  HelpCircle
} from "lucide-react";

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Parsed details
  const [category, setCategory] = useState("Other");
  const [cleanDescription, setCleanDescription] = useState("");

  useEffect(() => {
    fetchComplaint();
  }, []);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const response = await api.get(`complaints/${id}/`);
      setComplaint(response.data);

      // Parse Category & Clean Description
      const rawDesc = response.data.description || "";
      const categoryRegex = /^\[Category:\s*([^\]]+)\]\n\n([\s\S]*)$/;
      const match = rawDesc.match(categoryRegex);
      
      if (match) {
        setCategory(match[1]);
        setCleanDescription(match[2]);
      } else {
        setCleanDescription(rawDesc);
      }
    } catch (error) {
      console.error("Error fetching complaint details:", error);
      showToast("Grievance details could not be compiled", "error");
      navigate("/complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`complaints/${id}/`);
      showToast("Complaint deleted successfully", "success");
      navigate("/complaints");
    } catch (error) {
      console.error("Failed to delete complaint:", error);
      showToast("Failed to delete complaint", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-bold text-slate-500">Compiling triage metadata...</p>
      </div>
    );
  }

  if (!complaint) return null;

  // Determine Timeline Step Checklists
  const status = complaint.status;
  const step1 = true; // Submitted is always completed
  const step2 = status === "In Progress" || status === "Resolved";
  const step3 = status === "Resolved";

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in">
      {/* Back triggers */}
      <button
        onClick={() => navigate("/complaints")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-transparent border-0 cursor-pointer w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Rejection Alert Banner */}
      {status === "Rejected" && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-rose-100 bg-rose-50/50 text-rose-800 animate-slide-up">
          <ShieldAlert className="w-5.5 h-5.5 mt-0.5 text-rose-500 shrink-0" />
          <div>
            <h4 className="text-sm font-bold">Case Triage Terminated</h4>
            <p className="text-xs text-rose-600/90 leading-relaxed mt-1">
              Following review by administrative staff, this grievance did not meet criteria for a campus triage workflow. Standard reasons include duplication, insufficient descriptions, or incorrect listings.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Details Left, Photo Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left pane: Details Card */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl glass-panel flex flex-col gap-6">
          
          {/* Header Metadata */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700">
                <Tag className="w-3.5 h-3.5" />
                {category}
              </span>
              
              <StatusBadge status={status} />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {complaint.title}
            </h1>
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Filed</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">
                  {new Date(complaint.created_at).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filed By</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">
                  Reporter #{complaint.created_by || "Me"}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {cleanDescription}
            </p>
          </div>

          {/* Dynamic Horizontal Tracker Steps Timeline */}
          {status !== "Rejected" && (
            <div className="flex flex-col gap-3 mt-4 border-t border-slate-50 pt-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resolution Milestones</h3>
              
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 relative">
                {/* Connector line */}
                <div className="absolute top-[16px] left-[15px] right-[15px] h-0.5 bg-slate-100 hidden sm:block z-0" />

                {/* Step 1: Submitted */}
                <div className="flex items-center sm:flex-col gap-3 sm:gap-2 relative z-10 text-left sm:text-center shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm shadow">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">Submitted</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Triage accepted</p>
                  </div>
                </div>

                {/* Step 2: Investigating */}
                <div className="flex items-center sm:flex-col gap-3 sm:gap-2 relative z-10 text-left sm:text-center shrink-0">
                  {step2 ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm shadow">
                      ✓
                    </div>
                  ) : status === "Pending" ? (
                    <span className="relative flex h-8 w-8">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-8 w-8 bg-indigo-600 text-white items-center justify-center text-sm shadow font-bold">⏳</span>
                    </span>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 border border-slate-200 font-bold text-sm">
                      2
                    </div>
                  )}
                  <div>
                    <p className={`text-xs font-bold leading-tight ${status === "Pending" ? "text-indigo-600" : "text-slate-900"}`}>
                      Investigation
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Staff examining</p>
                  </div>
                </div>

                {/* Step 3: Resolved */}
                <div className="flex items-center sm:flex-col gap-3 sm:gap-2 relative z-10 text-left sm:text-center shrink-0">
                  {step3 ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm shadow">
                      ✓
                    </div>
                  ) : status === "In Progress" ? (
                    <span className="relative flex h-8 w-8">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-8 w-8 bg-indigo-600 text-white items-center justify-center text-sm shadow font-bold">⏳</span>
                    </span>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 border border-slate-200 font-bold text-sm">
                      3
                    </div>
                  )}
                  <div>
                    <p className={`text-xs font-bold leading-tight ${status === "In Progress" ? "text-indigo-600" : "text-slate-900"}`}>
                      Resolved
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Case completed</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action trigger panels */}
          <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-50 pt-6 mt-4">
            <Link
              to={`/edit/${complaint.id}`}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit2 className="w-4.5 h-4.5" />
              Edit description
            </Link>
            
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white hover:bg-rose-700 flex items-center justify-center gap-1.5 shadow-lg shadow-rose-100 hover:scale-101 transition-all cursor-pointer"
            >
              <Trash2 className="w-4.5 h-4.5" />
              Delete Grievance
            </button>
          </div>
        </div>

        {/* Right pane: Photo Lightbox panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {complaint.image ? (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl glass-panel flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                Visual Evidence
              </h3>
              
              <div className="border border-slate-100 rounded-2xl overflow-hidden aspect-square bg-slate-50 shadow-sm relative group">
                <img
                  src={complaint.image}
                  alt="Evidence"
                  className="w-full h-full object-cover"
                />
                
                <a
                  href={complaint.image}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-xl bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-900 transition-all opacity-0 group-hover:opacity-100 shadow"
                >
                  Inspect Evidence
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl glass-panel text-center flex flex-col items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 border border-slate-100 shadow-sm">
                <Image className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No Image Attached</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                This grievance was submitted without visual evidence packages. You can still add detailed remarks in description logs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SAFE Delete Modal Portal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Delete Grievance Audit"
        message="Are you absolutely sure you want to delete this complaint? This will remove all description entries and attached support images permanently from the database. This action is irreversible."
        confirmText="Yes, Delete Case"
        cancelText="Cancel Action"
        type="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default ComplaintDetail;
