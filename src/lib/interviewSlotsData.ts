import { InterviewSlot } from "@/types/database";

export const INITIAL_INTERVIEW_SLOTS: InterviewSlot[] = [
  {
    id: "slot-001",
    job_id: "job-android-001",
    job_title: "Senior Android Developer",
    date: "Tomorrow (Oct 16, 2026)",
    time: "10:30 AM - 11:15 AM IST",
    duration_minutes: 45,
    meeting_link: "https://meet.google.com/sbj-andr-slot1",
    notes: "Round 1: Mobile Architecture & Jetpack Compose Live Walkthrough",
    status: "available",
    candidate_id: null,
    candidate_name: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "slot-002",
    job_id: "job-android-001",
    job_title: "Senior Android Developer",
    date: "Tomorrow (Oct 16, 2026)",
    time: "02:30 PM - 03:15 PM IST",
    duration_minutes: 45,
    meeting_link: "https://meet.google.com/sbj-andr-slot2",
    notes: "Round 1: Mobile Architecture & Jetpack Compose Live Walkthrough",
    status: "available",
    candidate_id: null,
    candidate_name: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "slot-003",
    job_id: "job-android-001",
    job_title: "Senior Android Developer",
    date: "Friday (Oct 17, 2026)",
    time: "11:00 AM - 11:45 AM IST",
    duration_minutes: 45,
    meeting_link: "https://meet.google.com/sbj-andr-slot3",
    notes: "Round 1: Mobile Architecture & Jetpack Compose Live Walkthrough",
    status: "available",
    candidate_id: null,
    candidate_name: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "slot-004",
    job_id: "job-fullstack-002",
    job_title: "Full-Stack Next.js & Supabase Engineer",
    date: "Thursday (Oct 16, 2026)",
    time: "04:00 PM - 04:45 PM IST",
    duration_minutes: 45,
    meeting_link: "https://meet.google.com/sbj-fullstack-slot",
    notes: "Round 1: Next.js App Router & Supabase Integration Discussion",
    status: "booked",
    candidate_id: "cand-priya-001",
    candidate_name: "Priya Nair",
    created_at: new Date().toISOString(),
  },
];

export function getStoredInterviewSlots(): InterviewSlot[] {
  if (typeof window === "undefined") return INITIAL_INTERVIEW_SLOTS;
  try {
    const raw = localStorage.getItem("sbjfp_interview_slots");
    if (!raw) {
      localStorage.setItem("sbjfp_interview_slots", JSON.stringify(INITIAL_INTERVIEW_SLOTS));
      return INITIAL_INTERVIEW_SLOTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_INTERVIEW_SLOTS;
  } catch {
    return INITIAL_INTERVIEW_SLOTS;
  }
}

export function saveStoredInterviewSlots(slots: InterviewSlot[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("sbjfp_interview_slots", JSON.stringify(slots));
    } catch {
      // ignore
    }
  }
}
