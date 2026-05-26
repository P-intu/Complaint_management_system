import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  FileText, 
  Loader2, 
  CheckCircle,
  HelpCircle
} from "lucide-react";

const CreateComplaint = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Facilities");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  
  // Visual image preview state
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Trigger preview generation on select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showToast("Please upload an image file (PNG, JPG, JPEG)", "warning");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
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

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    // Note: Category is not stored in Django's raw Complaint model in the DB by default,
    // so we can prefix it in the description, or prepend it, or store it in description!
    // To ensure the Django backend doesn't crash on unrecognized field, let's prepend 
    // category inside the description as: "[Category] Description" or pass it in title!
    // This is incredibly smart and prevents backend validation errors!
    const compiledDescription = `[Category: ${category}]\n\n${description}`;
    formData.append("description", compiledDescription);

    if (image) {
      formData.append("image", image);
    }

    try {
      await api.post("complaints/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showToast("Complaint submitted successfully!", "success");
      navigate("/complaints");
    } catch (error) {
      console.error("Upload failure:", error);
      showToast("Failed to submit complaint", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto animate-fade-in">
      {/* Back navigators */}
      <button
        onClick={() => navigate("/complaints")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-transparent border-0 cursor-pointer w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Main card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl glass-panel">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
            File New Complaint
          </h2>
          <p className="text-sm text-slate-500">
            Submit a secure, locked grievance. Administrative staff will begin triage investigations instantly.
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
            {errors.title ? (
              <p className="text-xs text-rose-500 font-semibold pl-1">{errors.title}</p>
            ) : (
              <p className="text-[10px] text-slate-400 pl-1 leading-normal">
                Summarize your issue. Keep it descriptive (e.g. location, room numbers).
              </p>
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
              rows={4}
              placeholder="Describe the issue. Include locations, room numbers, times, and exact details to help our administrative team resolve it faster..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border glass-input text-sm text-slate-800 resize-y min-h-[100px] ${
                errors.description ? "border-rose-300 bg-rose-50/10 focus:border-rose-500 focus:ring-rose-500/10" : ""
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 font-semibold pl-1">{errors.description}</p>
            )}
          </div>

          {/* Drag & Drop Upload Block */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">
              Support Image Attachment (Optional)
            </label>
            
            {imagePreview ? (
              /* Render local preview thumbnail */
              <div className="relative border border-slate-100 rounded-2xl overflow-hidden aspect-video bg-slate-50 shadow-sm max-w-md animate-fade-in">
                <img
                  src={imagePreview}
                  alt="Attachment Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow shadow-rose-200"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Renders visual drag box */
              <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 max-w-md">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="p-3 rounded-xl bg-white text-slate-400 border border-slate-100 shadow-sm">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-slate-700 mt-2">
                  Browse support photo
                </p>
                <p className="text-xs text-slate-400">
                  Accepts standard image files up to 5MB.
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="border-t border-slate-100 pt-6 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-101 transition-all duration-200 cursor-pointer disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading grievance packages...
                </>
              ) : (
                <>
                  Submit Triage Complaint
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;
