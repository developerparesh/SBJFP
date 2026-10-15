import Link from "next/link";

/** Illustrative job-card UI preview — clearly marked as example data */
function JobMatchPreview() {
  const skills = [
    { name: "Kotlin", matched: true },
    { name: "Jetpack Compose", matched: true },
    { name: "REST APIs", matched: true },
    { name: "Room DB", matched: true },
    { name: "CI/CD", matched: false },
    { name: "Hilt/DI", matched: false },
  ];

  return (
    <div
      className="card rounded-2xl bg-white p-6 w-full max-w-sm mx-auto"
      aria-label="Illustrative job match card — example data only"
      role="img"
    >
      {/* Card header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: "var(--blue)" }}
              aria-hidden="true"
            >
              AD
            </div>
            <p className="text-xs text-slate-400">TechCorp Ltd — Illustrative example</p>
          </div>
          <h3 className="font-bold text-[var(--navy)] text-base">Android Developer</h3>
          <p className="text-xs text-slate-500 mt-0.5">Bangalore · ₹12L–18L / year</p>
        </div>
        <span
          className="text-xs font-semibold px-2 py-1 rounded-full"
          style={{ backgroundColor: "#e6faf4", color: "#1a9e74" }}
        >
          Remote
        </span>
      </div>

      {/* Match score */}
      <div className="mb-4">
        <div className="flex justify-between text-xs font-medium mb-1.5">
          <span className="text-slate-500">Skills match</span>
          <span style={{ color: "var(--mint)" }} className="font-bold">
            85% — illustrative
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="match-bar h-full rounded-full"
            style={
              {
                "--bar-width": "85%",
                backgroundColor: "var(--mint)",
              } as React.CSSProperties
            }
            role="img"
            aria-label="85% skill match — illustrative example"
          />
        </div>
      </div>

      {/* Skill chips */}
      <div className="flex flex-wrap gap-1.5 mb-4" aria-label="Skills">
        {skills.map((s) => (
          <span
            key={s.name}
            className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
              s.matched
                ? "border-[#42d6a4]/40 text-[#1a9e74] bg-[#e6faf4]"
                : "border-slate-200 text-slate-400 bg-slate-50"
            }`}
          >
            {s.matched ? "✓ " : "○ "}
            {s.name}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          className="flex-1 text-xs font-semibold py-2 px-3 rounded-lg text-white transition-colors cursor-default"
          style={{ backgroundColor: "var(--blue)" }}
          tabIndex={-1}
          aria-hidden="true"
        >
          Apply Now
        </button>
        <button
          className="text-xs font-medium py-2 px-3 rounded-lg border border-slate-200 text-slate-500 transition-colors cursor-default"
          tabIndex={-1}
          aria-hidden="true"
        >
          Save
        </button>
      </div>

      <p className="text-[10px] text-slate-300 text-center mt-3">
        ⓘ Illustrative UI preview. Not a real job listing.
      </p>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden py-20 lg:py-28"
      style={{ backgroundColor: "var(--navy)" }}
      aria-labelledby="hero-heading"
    >
      {/* Subtle background shape */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(20,121,201,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <span
              className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6"
              style={{ backgroundColor: "rgba(66,214,164,0.15)", color: "var(--mint)" }}
            >
              Skills Meet Opportunity
            </span>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-tight mb-6"
            >
              Find Jobs That Match{" "}
              <span style={{ color: "var(--mint)" }}>Your Skills.</span>{" "}
              Hire People Who Fit.
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-xl">
              Discover relevant opportunities through skills-based matching, understand job requirements, explore transparent salary ranges, and bring hiring into one clear experience.
            </p>

            <div
              id="hero-cta"
              className="flex flex-col sm:flex-row gap-4"
              aria-label="Primary calls to action"
            >
              <Link
                href="/auth/signup?role=candidate"
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-bold rounded-xl text-[var(--navy)] transition-all hover:scale-[1.02]"
                style={{ backgroundColor: "var(--mint)" }}
              >
                Find My Match
              </Link>
              <Link
                href="/auth/signup?role=employer"
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold rounded-xl border-2 text-white transition-all hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.3)" }}
              >
                Hire Talent
              </Link>
            </div>
          </div>

          {/* Right: UI preview */}
          <div className="flex justify-center lg:justify-end">
            <JobMatchPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
