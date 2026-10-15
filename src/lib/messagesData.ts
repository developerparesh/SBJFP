export interface ChatMessage {
  id: string;
  sender: "candidate" | "hr";
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  hrName: string;
  hrRole: string;
  hrAvatar: string;
  candidateName: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-001",
    jobId: "job-android-001",
    jobTitle: "Senior Android Developer",
    companyName: "TechMatrix Labs",
    hrName: "Priya Sharma",
    hrRole: "Lead Technical Recruiter",
    hrAvatar: "👩‍💼",
    candidateName: "Paresh K.",
    lastMessage: "Looking forward to our technical discussion tomorrow! Do you have any questions about the Google Meet link?",
    lastTimestamp: "10:45 AM",
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        sender: "hr",
        senderName: "Priya Sharma",
        text: "Hi Paresh! We reviewed your skill profile for Senior Android Developer. Your 83% match score and Kotlin/Compose skills stood out to the engineering team.",
        timestamp: "Yesterday, 04:15 PM",
      },
      {
        id: "m2",
        sender: "candidate",
        senderName: "Paresh K.",
        text: "Thank you Priya! I am excited about TechMatrix Labs' offline-first mobile architecture.",
        timestamp: "Yesterday, 04:30 PM",
      },
      {
        id: "m3",
        sender: "hr",
        senderName: "Priya Sharma",
        text: "Looking forward to our technical discussion tomorrow! Do you have any questions about the Google Meet link?",
        timestamp: "Today, 10:45 AM",
      },
    ],
  },
  {
    id: "conv-002",
    jobId: "job-fresher-000",
    jobTitle: "Junior Software Engineer",
    companyName: "CodeCraft Studios",
    hrName: "Rahul Verma",
    hrRole: "Engineering Talent Partner",
    hrAvatar: "👨‍💻",
    candidateName: "Paresh K.",
    lastMessage: "We have confirmed your fresher cohort slot. The team is excited to meet you!",
    lastTimestamp: "Oct 14",
    unreadCount: 0,
    messages: [
      {
        id: "m201",
        sender: "hr",
        senderName: "Rahul Verma",
        text: "Hello Paresh! Congratulations on completing your skill profile. At CodeCraft, our freshers receive dedicated 1-on-1 mentorship.",
        timestamp: "Oct 14, 11:00 AM",
      },
      {
        id: "m202",
        sender: "candidate",
        senderName: "Paresh K.",
        text: "That sounds amazing! What is the primary stack we will begin with during onboarding?",
        timestamp: "Oct 14, 11:20 AM",
      },
      {
        id: "m203",
        sender: "hr",
        senderName: "Rahul Verma",
        text: "We have confirmed your fresher cohort slot. The team is excited to meet you!",
        timestamp: "Oct 14, 02:15 PM",
      },
    ],
  },
];

const MESSAGES_STORAGE_KEY = "sbjfp_chat_conversations";

export function getStoredConversations(): Conversation[] {
  if (typeof window === "undefined") return INITIAL_CONVERSATIONS;
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
      return INITIAL_CONVERSATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CONVERSATIONS;
  }
}

export function saveStoredConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(conversations));
  } catch (err) {
    console.error("Failed to save conversations:", err);
  }
}

export function sendCandidateMessage(conversationId: string, text: string): Conversation[] {
  const current = getStoredConversations();
  const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const updated = current.map((c) => {
    if (c.id === conversationId) {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "candidate",
        senderName: c.candidateName,
        text,
        timestamp: timeNow,
      };
      return {
        ...c,
        lastMessage: text,
        lastTimestamp: timeNow,
        messages: [...c.messages, newMsg],
      };
    }
    return c;
  });

  saveStoredConversations(updated);
  return updated;
}
