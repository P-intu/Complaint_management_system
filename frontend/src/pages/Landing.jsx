import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Send, 
  Search, 
  Lock, 
  TrendingUp, 
  FileText, 
  Users, 
  ChevronDown, 
  CheckCircle, 
  ArrowRight,
  Sparkles
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      title: "Real-time Tracking",
      description: "Submit administrative issues and monitor investigation workflows second-by-second on a transparent timeline.",
      icon: Search,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Encrypted Security",
      description: "Your voice is guarded. Grade-A encryption protects credentials and image files from unauthorized disclosure.",
      icon: Lock,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Automated Workflows",
      description: "Intelligent ticket routing forwards reports instantly to department staff and updates status badges live.",
      icon: Send,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Auditing & Analytics",
      description: "Track institutional compliance rates, staff resolution speeds, and common trends using rich admin widgets.",
      icon: TrendingUp,
      color: "from-rose-500 to-rose-600",
    },
  ];

  const faqs = [
    {
      question: "Who can submit complaints through ResolveFlow?",
      answer: "Any registered reporter can securely file complaints. ResolveFlow accounts are open to staff, students, and citizens depending on institutional setups.",
    },
    {
      question: "Can admins change complaint details?",
      answer: "No. To preserve auditing integrity, submitted titles, descriptions, and uploaded pictures are locked and cannot be altered by administrative staff. Only status reviews are updated.",
    },
    {
      question: "What files can I attach to support my case?",
      answer: "You can upload support images (like PNG, JPG, or JPEG) directly from your camera roll or desktop files using our interactive uploader.",
    },
    {
      question: "Is this system fully mobile-friendly?",
      answer: "Absolutely. The layout collapses elegantly from large desktop screens down to mobile touchscreens, giving you full features on the go.",
    },
  ];

  return (
    <div className="flex flex-col overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-28 overflow-hidden bg-mesh">
        {/* Glow meshes */}
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left text */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/60 bg-indigo-50/70 px-3.5 py-1 text-xs font-bold text-indigo-700 backdrop-blur-xs animate-float">
                <Sparkles className="w-4 h-4" />
                Empowering Modern Accountability
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Institutional Integrity, <br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Streamlined.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                The modern full-stack platform for submitting grievances, auditing compliance workflows, and resolving institutional complaints in record time.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-2">
                <button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl hover:bg-slate-800 transition-all hover:scale-102 hover:shadow-slate-300/40 cursor-pointer"
                >
                  File your first report
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
                
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Explore features
                </a>
              </div>
            </div>

            {/* Right mock UI illustration */}
            <div className="lg:col-span-5 relative w-full flex justify-center animate-slide-up">
              <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-3xl border border-slate-100 bg-white/70 p-6 shadow-2xl backdrop-blur-md glass-panel">
                {/* Decorative dots */}
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                
                <div className="mt-8 flex flex-col gap-5">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800">Case Audit #8271</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
                      In Progress
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Grievance Title</p>
                    <p className="text-sm font-bold text-slate-800">IT Infrastructure Malfunction - Hall B</p>
                  </div>

                  {/* Flow tracker steps */}
                  <div className="flex flex-col gap-3.5 mt-2 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-[10px]">✓</div>
                      <span className="text-xs font-semibold text-slate-700">Complaint Submitted</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-[10px]">✓</div>
                      <span className="text-xs font-semibold text-slate-700">Assigned to Triage Staff</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-5.5 w-5.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5.5 w-5.5 bg-indigo-600 text-white items-center justify-center font-bold text-[10px]">⏳</span>
                      </span>
                      <span className="text-xs font-bold text-indigo-600">Resolving IT Infrastructure</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20 bg-white relative">
        <div className="mx-auto max-w-7xl">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
              Intuitive Tools. Heavy Impact.
            </h2>
            <p className="text-base text-slate-500 max-w-lg leading-relaxed">
              Our framework is built to simplify the intake process while providing robust administrative oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/50 glass-panel-hover"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${feat.color} text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950">{feat.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Complaint Workflow Timeline */}
      <section id="workflow" className="px-4 sm:px-6 lg:px-8 py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
              Audit Workflow Timeline
            </h2>
            <p className="text-base text-slate-500 max-w-lg leading-relaxed">
              Transparency at every interval. Learn how reports proceed securely from creation to closure.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="absolute top-[28px] left-[50px] right-[50px] h-0.5 bg-slate-200 hidden md:block z-0" />
            
            {[
              { step: "01", title: "Reporter Files Case", desc: "User inputs title, category, uploads photos, and saves." },
              { step: "02", title: "Triage & Review", desc: "Admins receive the dashboard listing and evaluate issues." },
              { step: "03", title: "Resolution Cycle", desc: "Assigned staff fix problems and change state to In Progress." },
              { step: "04", title: "Verified Closure", desc: "Report resolves or rejects, notifying the user immediately." },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col gap-4 relative z-10 bg-slate-50 p-4 rounded-xl border border-slate-100 md:border-transparent">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white font-extrabold shadow-lg shadow-indigo-100">
                  {step.step}
                </div>
                <h4 className="text-base font-bold text-slate-950">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Testimonials */}
      <section id="testimonials" className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Trusted by Leading Compliance Teams
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "ResolveFlow changed how we handle staff disputes and facilities issues. The live status update dropdown is amazing.",
                author: "Sarah Jenkins",
                role: "Director of HR, TechCorp",
                initial: "S",
              },
              {
                quote: "No complex architecture, just pure visual clarity. The image attachment previews make case review incredibly fast.",
                author: "Marcus Chen",
                role: "Ombudsman, Horizon Academy",
                initial: "M",
              },
              {
                quote: "Having a fully responsive mobile workspace allowed our field auditors to log and delete junk reports on the go.",
                author: "Amanda Ross",
                role: "Facilities Admin, City Transit",
                initial: "A",
              },
            ].map((test, idx) => (
              <div key={idx} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between gap-6 glass-panel-hover">
                <p className="text-sm text-slate-600 italic leading-relaxed">"{test.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold text-sm">
                    {test.initial}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{test.author}</h5>
                    <p className="text-xs text-slate-500">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQs Accordion */}
      <section id="faq" className="px-4 sm:px-6 lg:px-8 py-20 bg-slate-50">
        <div className="mx-auto max-w-3xl">
          <div className="text-center flex flex-col items-center gap-4 mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => {
              const active = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-100 bg-white overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between p-5 text-left font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-250 ${active ? "rotate-180" : ""}`} />
                  </button>
                  
                  {active && (
                    <div className="px-5 pb-5 animate-fade-in">
                      <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
