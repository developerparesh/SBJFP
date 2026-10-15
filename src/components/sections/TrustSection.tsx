const trustPoints = [
  {
    icon: "📐",
    title: "Match scores follow defined criteria",
    body: "Skill match percentages are calculated using structured criteria that both candidates and employers can understand. We do not use opaque black-box scoring.",
  },
  {
    icon: "💼",
    title: "Salaries are employer-provided",
    body: "Salary ranges are entered by employers and displayed as-is. SBJFP does not independently verify or guarantee the accuracy of salary information.",
  },
  {
    icon: "🗃️",
    title: "Application activity depends on recorded events",
    body: "Application status updates and employer-view events are based on actions recorded in the system. We aim for accuracy but cannot guarantee real-time completeness during early development.",
  },
  {
    icon: "🔒",
    title: "Candidate data access will be controlled",
    body: "Access to candidate data will be governed by Row Level Security policies in our database. Only appropriate parties will be able to view profile or application data.",
  },
];

export default function TrustSection() {
  return (
    <section
      id="trust"
      className="py-20 lg:py-28"
      style={{ backgroundColor: "var(--bg)" }}
      aria-labelledby="trust-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: "rgba(20,121,201,0.1)", color: "var(--blue)" }}
          >
            Our Commitment
          </span>
          <h2
            id="trust-heading"
            className="text-3xl sm:text-4xl font-extrabold mb-4"
            style={{ color: "var(--navy)" }}
          >
            Trust &amp; Transparency
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            We believe honest communication builds better platforms. Here is what you can expect from SBJFP.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="card bg-white rounded-2xl p-6 flex gap-4"
            >
              <span
                className="text-2xl flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(20,121,201,0.08)" }}
                aria-hidden="true"
              >
                {point.icon}
              </span>
              <div>
                <h3
                  className="font-bold text-sm mb-1.5"
                  style={{ color: "var(--navy)" }}
                >
                  {point.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{point.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
