export interface MockQuestion {
  id: string;
  role: string;
  category: string;
  question: string;
  hint: string;
  keyConcepts: string[];
  idealSummary: string;
}

export const MOCK_QUESTIONS: MockQuestion[] = [
  {
    id: "q-android",
    role: "Senior Android Developer",
    category: "Concurrency & Architecture",
    question: "How does Kotlin's Dispatchers.IO differ from Dispatchers.Default under the hood, and how do you prevent coroutine leaks when a ViewModel is cleared?",
    hint: "Mention thread pool sharing, 64-thread cap vs CPU core count, and viewModelScope cancellation.",
    keyConcepts: ["Dispatchers.IO", "Dispatchers.Default", "viewModelScope", "cancellation", "thread pool", "SupervisorJob"],
    idealSummary: "Dispatchers.Default is backed by a shared thread pool sized to the CPU core count (minimum 2), optimized for CPU-intensive tasks like sorting or JSON parsing. Dispatchers.IO shares the same thread pool but allows up to 64 threads (or core count) to allocate blocking I/O calls without starving computation. Coroutine leaks are prevented by binding work to `viewModelScope`, which uses a `SupervisorJob` that cancels all child jobs automatically in `onCleared()`.",
  },
  {
    id: "q-nextjs",
    role: "Full-Stack Next.js Engineer",
    category: "Modern Web Architecture",
    question: "Explain the difference between React Server Components (RSC) and Client Components ('use client') in Next.js App Router, and how Server Actions handle progressive enhancement.",
    hint: "Mention server rendering without JS bundle impact, serialization across boundaries, and form action attributes.",
    keyConcepts: ["Server Components", "Client Components", "bundle", "serialization", "Server Actions", "progressive enhancement"],
    idealSummary: "Server Components execute solely on the server and stream pre-rendered HTML/RSC payload without sending component code to the client bundle, reducing JS payload. Client Components with 'use client' are hydrated on the client to handle state, event listeners, and browser APIs. Server Actions run on the server and can be invoked from native HTML `<form action={...}>`, allowing forms to work even before JavaScript has fully downloaded (progressive enhancement).",
  },
  {
    id: "q-fresher",
    role: "Junior Software Engineer (Fresher)",
    category: "JavaScript Fundamentals",
    question: "How does the JavaScript Event Loop work with the Call Stack, and what is the difference in execution order between a microtask (Promise.then) and a macrotask (setTimeout)?",
    hint: "Mention single-threaded execution, call stack draining, microtask queue priority before rendering, and callback queue.",
    keyConcepts: ["event loop", "call stack", "microtask", "macrotask", "Promise", "setTimeout"],
    idealSummary: "JavaScript is single-threaded and executes synchronous frames on the Call Stack. When asynchronous operations finish, microtasks (like Promise callbacks and queueMicrotask) are queued into the microtask queue, while macrotasks (like setTimeout and setInterval) enter the task queue. When the call stack becomes empty, the Event Loop exhausts ALL microtasks before taking the next macrotask, meaning Promise.then always executes ahead of setTimeout(..., 0).",
  },
];

export interface FeedbackResult {
  score: number;
  grade: "Exceptional" | "Solid" | "Needs Depth";
  conceptsFound: string[];
  conceptsMissing: string[];
  strengths: string[];
  improvements: string[];
}

export function evaluateMockAnswer(question: MockQuestion, answer: string): FeedbackResult {
  const normalized = answer.toLowerCase();
  const found: string[] = [];
  const missing: string[] = [];

  question.keyConcepts.forEach((concept) => {
    if (normalized.includes(concept.toLowerCase())) {
      found.push(concept);
    } else {
      missing.push(concept);
    }
  });

  const wordCount = answer.trim().split(/\s+/).length;
  let score = Math.round((found.length / question.keyConcepts.length) * 80);

  if (wordCount >= 40) score += 10;
  if (wordCount >= 70) score += 10;
  if (score > 100) score = 100;
  if (score < 30 && answer.trim().length > 10) score = 45;

  let grade: "Exceptional" | "Solid" | "Needs Depth" = "Needs Depth";
  if (score >= 80) grade = "Exceptional";
  else if (score >= 60) grade = "Solid";

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (found.length > 0) {
    strengths.push(`Clearly articulated ${found.slice(0, 3).join(", ")}.`);
  }
  if (wordCount >= 50) {
    strengths.push("Good descriptive explanation with appropriate depth.");
  }

  if (missing.length > 0) {
    improvements.push(`Consider mentioning: ${missing.slice(0, 3).join(", ")} to demonstrate architectural mastery.`);
  }
  if (wordCount < 40) {
    improvements.push("Elaborate on production trade-offs rather than a single sentence answer.");
  }

  return {
    score,
    grade,
    conceptsFound: found,
    conceptsMissing: missing,
    strengths,
    improvements,
  };
}
