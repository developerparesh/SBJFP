import Link from "next/link";

const features = [
  { icon: "🎯", title: "Relevant job discovery", body: "See jobs that actually align with your skills and experience level." },
  { icon: "👤", title: "Structured profile", body: "Build a skills-based profile as your primary identity — resume upload is optional unless a specific role requires it." },
  { icon: "💰", title: "Salary transparency", body: "Salary ranges are provided by employers directly — no vague \"competitive\" placeholders." },
  { icon: "📬", title: "Application tracking", body: "Planned: transparent statuses and employer-view events so you always know where you stand." },
  { icon: "🔖", title: "Save jobs", body: "Bookmark interesting opportunities and come back to them when you're ready." },
  { icon: "📅", title: "Interview scheduling", body: "Planned: coordinate availability and book interviews without endless email threads." },
];

export default function ForJobSeekersSection() {
  return (
    <section
      id="for-job-seekers"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "var(--bg)" }}
      aria-labelledby="seekers-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <span
              className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: "rgba(66,214,164,0.15)", color: "#1a9e74" }}
            >
              For Job Seekers
            </span>
            <h2
              id="seekers-heading"
              className="text-3xl sm:text-4xl font-extrabold mb-5"
              style={{ color: "var(--navy)" }}
            >
              Your Skills Speak for Themselves
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              Stop tailoring your resume for every keyword. SBJFP is designed to surface your skills and match them to relevant opportunities — transparently.
            </p>
            <Link
              href="#final-cta"
              className="inline-flex items-center justify-center px-7 py-3.5 text-base font-bold rounded-xl text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--blue)" }}
            >
              Explore Your Opportunities
            </Link>
          </div>

          {/* Right: feature grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="card bg-white rounded-xl p-5 flex flex-col gap-2"
                aria-label={f.title}
              >
                <span className="text-2xl" aria-hidden="true">{f.icon}</span>
                <h3 className="font-semibold text-sm" style={{ color: "var(--navy)" }}>
                  {f.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
