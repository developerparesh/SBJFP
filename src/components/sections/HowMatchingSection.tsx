const steps = [
  {
    number: "01",
    title: "Create your profile",
    body: "Candidates build a structured profile and select their skills — programming languages, tools, frameworks, and experience levels.",
    icon: "👤",
  },
  {
    number: "02",
    title: "Employers define requirements",
    body: "Employers create job listings with required and preferred skills, salary ranges, and configurable preferences.",
    icon: "📋",
  },
  {
    number: "03",
    title: "SBJFP compares skills",
    body: "The platform compares candidate skills against job requirements using structured criteria — not just keyword patterns.",
    icon: "⚡",
  },
  {
    number: "04",
    title: "Understand your match",
    body: "Candidates see a clear explanation: which skills matched, which are missing, and what the employer requires — no guessing.",
    icon: "🎯",
  },
  {
    number: "05",
    title: "Discover suitable candidates",
    body: "Employers can filter and discover candidates using structured skill and preference filters — finding better-matched talent efficiently.",
    icon: "🔎",
  },
];

export default function HowMatchingSection() {
  return (
    <section
      id="how-matching-works"
      className="py-20 lg:py-28 bg-white"
      aria-labelledby="matching-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: "rgba(20,121,201,0.1)", color: "var(--blue)" }}
          >
            How It Works
          </span>
          <h2
            id="matching-heading"
            className="text-3xl sm:text-4xl font-extrabold mb-4"
            style={{ color: "var(--navy)" }}
          >
            How Skill Matching Works
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Five clear steps from profile to match — transparent and explainable at every stage.
          </p>
        </div>

        {/* Steps */}
        <ol className="relative" aria-label="Skill matching steps">
          {/* Vertical connector line (desktop) */}
          <div
            className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px -translate-x-1/2 pointer-events-none"
            style={{ backgroundColor: "rgba(20,121,201,0.15)" }}
            aria-hidden="true"
          />

          <div className="flex flex-col gap-10 lg:gap-12">
            {steps.map((step, i) => (
              <li
                key={step.number}
                className={`relative flex flex-col lg:flex-row items-center gap-6 lg:gap-12 ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content card */}
                <div className="lg:w-5/12">
                  <div className="card bg-white rounded-2xl p-6 border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl" aria-hidden="true">{step.icon}</span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: "var(--blue)" }}
                      >
                        Step {step.number}
                      </span>
                    </div>
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: "var(--navy)" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.body}</p>
                  </div>
                </div>

                {/* Center badge */}
                <div className="lg:w-2/12 flex justify-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10"
                    style={{ backgroundColor: "var(--blue)" }}
                    aria-hidden="true"
                  >
                    {step.number}
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden lg:block lg:w-5/12" aria-hidden="true" />
              </li>
            ))}
          </div>
        </ol>
      </div>
    </section>
  );
}
