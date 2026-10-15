import Link from "next/link";

const features = [
  { icon: "📝", title: "Structured job creation", body: "Define roles with required and preferred skills, salary ranges, and specific requirements — not just a text description." },
  { icon: "🎚️", title: "Configurable match thresholds", body: "Set your own minimum match percentage — or disable it entirely. No platform-wide restriction is imposed on your listings." },
  { icon: "🔍", title: "Candidate discovery filters", body: "Planned: filter and discover candidates by structured skills, experience, and preference criteria." },
  { icon: "📊", title: "Required vs. preferred skills", body: "Distinguish between must-have and nice-to-have skills to improve match quality and attract the right applicants." },
  { icon: "🗂️", title: "Application history", body: "Planned: view and manage incoming applications with clear candidate skill summaries." },
  { icon: "📅", title: "Interview scheduling", body: "Planned: publish your availability and let matched candidates book interview slots directly." },
];

export default function ForEmployersSection() {
  return (
    <section
      id="for-employers"
      className="py-20 lg:py-28 bg-white"
      aria-labelledby="employers-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: feature grid */}
          <div className="grid sm:grid-cols-2 gap-4 order-2 lg:order-1">
            {features.map((f) => (
              <div
                key={f.title}
                className="card bg-[var(--bg)] rounded-xl p-5 flex flex-col gap-2"
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

          {/* Right: copy */}
          <div className="order-1 lg:order-2">
            <span
              className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: "rgba(20,121,201,0.1)", color: "var(--blue)" }}
            >
              For Employers
            </span>
            <h2
              id="employers-heading"
              className="text-3xl sm:text-4xl font-extrabold mb-5"
              style={{ color: "var(--navy)" }}
            >
              Hire on Skills, Not Keywords
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              Define exactly what your roles require. Let structured matching surface candidates who genuinely fit — so you spend less time sifting and more time hiring.
            </p>
            <Link
              href="/auth/signup?role=employer"
              className="inline-flex items-center justify-center px-7 py-3.5 text-base font-bold rounded-xl text-white transition-all hover:opacity-90 shadow-sm"
              style={{ backgroundColor: "var(--navy)" }}
            >
              Discover Better-Matched Talent
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
