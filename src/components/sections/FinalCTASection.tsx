import Link from "next/link";

export default function FinalCTASection() {
  return (
    <section
      id="final-cta"
      className="py-20 lg:py-28 bg-white"
      aria-labelledby="final-cta-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Decorative dot */}
        <div
          className="w-14 h-14 rounded-full mx-auto mb-8 flex items-center justify-center text-2xl"
          style={{ backgroundColor: "rgba(66,214,164,0.15)" }}
          aria-hidden="true"
        >
          🚀
        </div>

        <h2
          id="final-cta-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight"
          style={{ color: "var(--navy)" }}
        >
          Your Skills Deserve the Right Opportunity.
        </h2>
        <p className="text-slate-500 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
          SBJFP is being built to make job finding and hiring more transparent, relevant, and fair — for candidates and employers alike.
        </p>

        {/* Two CTA cards */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Candidate CTA */}
          <div
            className="rounded-2xl p-8 flex flex-col items-center gap-4 text-white"
            style={{ backgroundColor: "var(--navy)" }}
          >
            <span className="text-3xl" aria-hidden="true">👤</span>
            <p className="font-bold text-lg">I am a Candidate</p>
            <p className="text-slate-300 text-sm leading-relaxed text-center">
              Create your skills profile and discover jobs that genuinely match what you bring.
            </p>
            <Link
              href="/auth/signup?role=candidate"
              className="w-full text-center px-6 py-3 rounded-xl font-bold text-[var(--navy)] transition-all hover:opacity-90 text-sm"
              style={{ backgroundColor: "var(--mint)" }}
              aria-label="Get started as a candidate"
            >
              Find My Match
            </Link>
            <p className="text-xs text-slate-300">Free candidate account</p>
          </div>

          {/* Employer CTA */}
          <div
            className="rounded-2xl p-8 flex flex-col items-center gap-4"
            style={{ backgroundColor: "var(--bg)", border: "2px solid rgba(20,121,201,0.15)" }}
          >
            <span className="text-3xl" aria-hidden="true">🏢</span>
            <p className="font-bold text-lg" style={{ color: "var(--navy)" }}>
              I am an Employer
            </p>
            <p className="text-slate-500 text-sm leading-relaxed text-center">
              Post structured jobs and discover candidates who actually fit your requirements.
            </p>
            <Link
              href="/auth/signup?role=employer"
              className="w-full text-center px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 text-sm"
              style={{ backgroundColor: "var(--blue)" }}
              aria-label="Get started as an employer"
            >
              Hire Talent
            </Link>
            <p className="text-xs text-slate-500">Free employer account</p>
          </div>
        </div>
      </div>
    </section>
  );
}
