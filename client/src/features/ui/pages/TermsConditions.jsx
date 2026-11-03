import React from "react";
import { Link } from "react-router-dom";
import { Scale, ChevronRight, FileCheck, AlertCircle, ArrowLeft, Clock, BookOpen } from "lucide-react";
import Footer from "../components/Footer";

export default function TermsConditions() {
  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Nulla facilisi. Praesent vulputate sem sit amet erat tristique, vitae pulvinar magna pulvinar. Curabitur vel libero vel turpis eleifend facilisis.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      ],
      points: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.",
        "Tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
        "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      ],
    },
    {
      id: "accounts",
      title: "2. Account Registration & Security",
      content: [
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.",
        "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
      ],
      points: [
        "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.",
        "Saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
      ],
    },
    {
      id: "pricing",
      title: "3. Product Listings & Pricing",
      content: [
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
        "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
      ],
    },
    {
      id: "orders",
      title: "4. Orders, Payments & Billing",
      content: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      ],
      points: [
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
      ],
    },
    {
      id: "delivery",
      title: "5. Shipping, Delivery & Inspection",
      content: [
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      ],
    },
    {
      id: "support",
      title: "6. Customer Support & Resolution",
      content: [
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
        "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
      ],
      points: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.",
        "Tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
      ],
    },
    {
      id: "ip",
      title: "7. Intellectual Property & Trademarks",
      content: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Nulla facilisi. Praesent vulputate sem sit amet erat tristique, vitae pulvinar magna pulvinar.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      ],
    },
    {
      id: "prohibited",
      title: "8. Prohibited User Conduct",
      content: [
        "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
      ],
      points: [
        "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.",
        "Quam nihil molestiae consequatur vel illum qui dolorem eum fugiat quo voluptas.",
        "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.",
      ],
    },
    {
      id: "liability",
      title: "9. Limitation of Liability & Warranties",
      content: [
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      ],
    },
    {
      id: "disputes",
      title: "10. Governing Law & Dispute Resolution",
      content: [
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
        "Lorem ipsum dolor sit amet: legal@shopmart.example.com | Jurisdiction: High Court of Delhi, New Delhi, India.",
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FAF7FE] flex flex-col font-['Poppins',sans-serif] relative overflow-x-hidden text-slate-800">
 
      {/* Main Container */}
      <div className="flex-1 max-w-[1700px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6 select-none">
          <Link to="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#059669] font-bold">Terms & Conditions</span>
        </div>

        {/* Hero Banner Header with Frosted Glass Look */}
        <div className="w-full bg-white/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden mb-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-bold shadow-2xs">
                <Scale className="w-4 h-4 text-[#059669] stroke-[2.4]" />
                <span>Terms of Service Agreement</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Terms & Conditions
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl font-normal leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
              </p>
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200/60">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white/90 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Last updated: November 2026</span>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#059669] hover:text-emerald-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Body Grid: Sidebar TOC + Main Legal Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Quick Table of Contents */}
          <aside className="lg:col-span-4 bg-white/80 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm relative overflow-hidden lg:sticky lg:top-24">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            
            <div className="flex items-center gap-2 pb-3.5 mb-3 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-[#059669]" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Table of Contents
              </h3>
            </div>

            <nav className="space-y-1.5">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-all"
                >
                  {sec.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Right Column: Legal Text Content Cards */}
          <div className="lg:col-span-8 space-y-6">
            {sections.map((sec) => (
              <section
                key={sec.id}
                id={sec.id}
                className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden scroll-mt-24 transition-all"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>{sec.title}</span>
                </h2>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {sec.content.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}

                  {sec.points && (
                    <ul className="space-y-2 mt-4 pt-2 border-t border-slate-100">
                      {sec.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-2 shrink-0" />
                          <span className="text-slate-700 font-medium">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>

        </div>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

