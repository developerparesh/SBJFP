const problems = [
  {
    icon: "🔍",
    problem: "Keyword searches miss relevant jobs.",
    solution:
      "SBJFP is designed to match across structured skills, roles, programming languages, tools, and frameworks — not just keyword strings.",
    tag: "Smarter Discovery",
  },
  {
    icon: "📊",
    problem: "Candidates can't easily understand job suitability.",
    solution:
      "Show explainable match percentages, clearly displaying matched skills, missing skills, and specific requirements so candidates can make informed decisions.",
    tag: "Transparent Matching",
  },
  {
    icon: "💰",
    problem: "Salary information is unclear.",
    solution:
      "Support structured salary ranges with currency and pay period, so candidates see real expectations — not vague \"competitive salary\" placeholders.",
    tag: "Salary Clarity",
  },
  {
    icon: "📬",
    problem: "Candidates are uncertain about application progress.",
    solution:
      "Plan transparent application statuses and recorded employer-view events, so candidates know what's happening with their applications.",
    tag: "Application Visibility",
  },
  {
    icon: "⚙️",
    problem: "Application restrictions can be confusing.",
    solution:
      "Employers can configure or disable their own minimum match thresholds per job. No universal fixed percentage is imposed by the platform.",
    tag: "Flexible Rules",
  },
  {
    icon: "📅",
    problem: "Interview scheduling takes too much back-and-forth.",
    solution:
      "Plan interview availability and booking functionality — so candidates and employers coordinate without repeated email chains.",
    tag: "Streamlined Scheduling",
  },
  {
    icon: "📄",
    problem: "A resume document can be a barrier.",
    solution:
      "Support a structured candidate profile as the primary identity. Resume uploads are optional unless a specific application requires a document.",
    tag: "Profile-First",
  },
];

export default function ProblemsSection() {
  return (
    <section
      id="problems"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "var(--bg)" }}
      aria-labelledby="problems-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: "rgba(20,121,201,0.1)", color: "var(--blue)" }}
          >
            Why SBJFP
          </span>
          <h2
            id="problems-heading"
            className="text-3xl sm:text-4xl font-extrabold mb-4"
            style={{ color: "var(--navy)" }}
          >
            Real Problems in Hiring — That We Plan to Solve
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            These are the challenges SBJFP is being built to address. Features described reflect our planned design — not all are operational yet.
          </p>
        </div>

        {/* Problem/solution grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((item) => (
            <article
              key={item.tag}
              className="card bg-white rounded-2xl p-6 flex flex-col gap-4"
              aria-label={`Problem: ${item.problem}`}
            >
              {/* Tag */}
              <div className="flex items-start justify-between gap-2">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "rgba(66,214,164,0.12)", color: "#1a9e74" }}
                >
                  {item.tag}
                </span>
                <span className="text-2xl" role="img" aria-hidden="true">
                  {item.icon}
                </span>
              </div>

              {/* Problem */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  The Problem
                </p>
                <p className="font-semibold text-[var(--navy)] text-sm leading-snug">
                  {item.problem}
                </p>
              </div>

              {/* Solution */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--blue)" }}>
                  Our Approach
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">{item.solution}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
