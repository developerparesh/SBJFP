export type NotificationType = "shortlist" | "interview_booked" | "new_match" | "system";

export interface AppNotification {
  id: string;
  userId?: string;
  role: "candidate" | "employer" | "all";
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: string;
}
