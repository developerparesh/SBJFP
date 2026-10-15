export interface JobOffer {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  isRemote: boolean;
  baseSalaryINR: number;
  variableBonusINR: number;
  esopsValueINR: number;
  retiralsINR: number; // EPF + Gratuity
  totalAnnualCTC: number;
  estMonthlyTakeHome: number;
  joiningDate: string;
  validUntil: string;
  benefits: string[];
  status: "pending" | "accepted" | "negotiating";
}

export const INITIAL_OFFERS: Record<string, JobOffer> = {
  "app-001": {
    id: "off-001",
    applicationId: "app-001",
    jobId: "job-android-001",
    jobTitle: "Senior Android Developer",
    companyName: "TechMatrix Labs",
    location: "Bangalore (Hybrid)",
    isRemote: true,
    baseSalaryINR: 1900000,
    variableBonusINR: 200000,
    esopsValueINR: 400000,
    retiralsINR: 120000,
    totalAnnualCTC: 2620000,
    estMonthlyTakeHome: 138000,
    joiningDate: "November 3, 2026",
    validUntil: "October 24, 2026",
    benefits: [
      "Comprehensive Health Insurance for family (₹10,00,000 cover)",
      "₹50,000 / year continuous education & tech conference budget",
      "₹35,000 one-time Home Office & Ergonomic setup stipend",
      "Flexible work hours & wellness reimbursement",
    ],
    status: "pending",
  },
  "app-fresher": {
    id: "off-fresher",
    applicationId: "app-fresher",
    jobId: "job-fresher-000",
    jobTitle: "Junior Software Engineer (Freshers Welcome)",
    companyName: "CodeCraft Studios",
    location: "Remote / Hyderabad",
    isRemote: true,
    baseSalaryINR: 750000,
    variableBonusINR: 80000,
    esopsValueINR: 120000,
    retiralsINR: 50000,
    totalAnnualCTC: 1000000,
    estMonthlyTakeHome: 58000,
    joiningDate: "November 10, 2026",
    validUntil: "October 28, 2026",
    benefits: [
      "1-on-1 Engineering mentorship program & paired programming",
      "Full Health Insurance (₹5,00,000 cover)",
      "MacBook Pro M-series workstation provided",
      "Annual team retreat & hackathons",
    ],
    status: "pending",
  },
};

const OFFERS_STORAGE_KEY = "sbjfp_job_offers";

export function getStoredOffers(): Record<string, JobOffer> {
  if (typeof window === "undefined") return INITIAL_OFFERS;
  try {
    const raw = localStorage.getItem(OFFERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(INITIAL_OFFERS));
      return INITIAL_OFFERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_OFFERS;
  }
}

export function acceptJobOffer(applicationId: string): JobOffer | null {
  const offers = getStoredOffers();
  const target = Object.values(offers).find(
    (o) => o.applicationId === applicationId || o.jobId === applicationId
  );

  if (target) {
    target.status = "accepted";
    if (typeof window !== "undefined") {
      localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(offers));
    }
    return target;
  }
  return null;
}
