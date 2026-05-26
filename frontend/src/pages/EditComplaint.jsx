import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const EditComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Facilities");
  const [description, setDescription] = useState("");
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchComplaint();
  }, []);

  const fetchComplaint = async () => {
    try {
      setFetching(true);
      const response = await api.get(`complaints/${id}/`);
      setTitle(response.data.title);
      
      // Parse category and clean description from the database blob
      const rawDesc = response.data.description || "";
      const categoryRegex = /^\[Category:\s*([^\]]+)\]\n\n([\s\S]*)$/;
      const match = rawDesc.match(categoryRegex);
      
      if (match) {
        setCategory(match[1]);
        setDescription(match[2]);
      } else {
        setDescription(rawDesc);
      }
    } catch (error) {
      console.error("Error fetching complaint for edit:", error);
      showToast("Failed to fetch complaint details", "error");
      navigate("/complaints");
    } finally {
      setFetching(false);
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!title.trim()) tempErrors.title = "A case title is required";
    else if (title.trim().length < 5) tempErrors.title = "Title must be at least 5 characters";

    if (!description.trim()) tempErrors.description = "A detailed case description is required";
    else if (description.trim().length < 15) tempErrors.description = "Description must be at least 15 characters to assist triage";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    const compiledDescription = `[Category: ${category}]\n\n${description}`;

    try {
      await api.patch(`complaints/${id}/`, {
        title,
        description: compiledDescription,
      });

      showToast("Complaint updated successfully!", "success");
      navigate(`/complaints/${id}`);
    } catch (error) {
      console.error("Update failure:", error);
      showToast("Failed to update complaint", "error");
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-bold text-slate-500">Triage details compiling...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate(`/complaints/${id}`)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-transparent border-0 cursor-pointer w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Case Details
      </button>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl glass-panel">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
            Edit Complaint
          </h2>
          <p className="text-sm text-slate-500">
            Alter descriptions or change categorizations. Triage logs are preserved securely.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">
              Complaint Title
            </label>
            <input
              type="text"
              placeholder="e.g. IT lab air conditioning failure"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border glass-input text-sm text-slate-800 ${
                errors.title ? "border-rose-300 bg-rose-50/10 focus:border-rose-500 focus:ring-rose-500/10" : ""
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 font-semibold pl-1">{errors.title}</p>
            )}
          </div>

          {/* Category SELECT */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">
              Grievance Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border glass-input text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer bg-white"
            >
              <option value="Facilities">Facilities & Campus Maintenance</option>
              <option value="IT Infrastructure">IT & Internet Infrastructure</option>
              <option value="Academic Services">Academic & Library Services</option>
              <option value="Security">Security & Safety Concerns</option>
              <option value="Other">Other Administrative Issues</option>
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">
              Detailed Description
            </label>
            <textarea
              rows={5}
              placeholder="Describe the issue. Include locations, room numbers, and exact details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border glass-input text-sm text-slate-800 resize-y min-h-[120px] ${
                errors.description ? "border-rose-300 bg-rose-50/10 focus:border-rose-500 focus:ring-rose-500/10" : ""
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 font-semibold pl-1">{errors.description}</p>
            )}
          </div>

          {/* Submit */}
          <div className="border-t border-slate-100 pt-6 mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => navigate(`/complaints/${id}`)}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-101 transition-all duration-200 cursor-pointer disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving edits...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditComplaint;
