import { AppNotification } from "@/types/notification";

const NOTIFICATIONS_STORAGE_KEY = "sbjfp_notifications";

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-001",
    role: "candidate",
    type: "shortlist",
    title: "Application Shortlisted! 🎉",
    message: "TechCorp Labs shortlisted your profile for Senior Android Engineer. Pick your interview slot now.",
    actionUrl: "/dashboard/candidate",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
  },
  {
    id: "notif-002",
    role: "candidate",
    type: "new_match",
    title: "New 92% Skill Match Alert 🎯",
    message: "A new Junior React / Next.js Developer role matching 5 of your skills was just posted by NextGen FinTech.",
    actionUrl: "/jobs/job-003",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
  },
  {
    id: "notif-003",
    role: "employer",
    type: "interview_booked",
    title: "Interview Slot Booked 📅",
    message: "Paresh K. booked the Technical Deep-Dive slot for Oct 17 at 11:00 AM IST.",
    actionUrl: "/dashboard/employer",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
  },
  {
    id: "notif-004",
    role: "candidate",
    type: "system",
    title: "Interview Scheduled 🚀",
    message: "Your interview with TechCorp Labs is confirmed. View your prep checklist and countdown timer in the Interview Hub.",
    actionUrl: "/interviews",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

export function getStoredNotifications(): AppNotification[] {
  if (typeof window === "undefined") return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading notifications:", err);
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifications: AppNotification[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (err) {
    console.error("Error saving notifications:", err);
  }
}

export function markNotificationAsRead(id: string): AppNotification[] {
  const current = getStoredNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveStoredNotifications(updated);
  return updated;
}

export function markAllNotificationsAsRead(role?: "candidate" | "employer"): AppNotification[] {
  const current = getStoredNotifications();
  const updated = current.map((n) => {
    if (!role || n.role === role || n.role === "all") {
      return { ...n, read: true };
    }
    return n;
  });
  saveStoredNotifications(updated);
  return updated;
}

export function addNotification(notification: Omit<AppNotification, "id" | "createdAt" | "read">): AppNotification {
  const current = getStoredNotifications();
  const newNotif: AppNotification = {
    ...notification,
    id: `notif-${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  const updated = [newNotif, ...current];
  saveStoredNotifications(updated);
  return newNotif;
}
