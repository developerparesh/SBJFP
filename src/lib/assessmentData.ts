export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SkillQuiz {
  skillName: string;
  durationSeconds: number;
  passingScore: number; // e.g. 2 out of 3
  questions: AssessmentQuestion[];
}

export const SKILL_QUIZZES: Record<string, SkillQuiz> = {
  React: {
    skillName: "React",
    durationSeconds: 120,
    passingScore: 2,
    questions: [
      {
        id: "r1",
        question: "Which hook should be used to run a side effect only when a specific state variable changes?",
        options: [
          "useEffect with that variable in the dependency array",
          "useMemo with an empty array",
          "useCallback without dependencies",
          "useRef initialized to null",
        ],
        correctIndex: 0,
        explanation: "useEffect watches dependencies specified in its dependency array and re-runs when any of them mutate.",
      },
      {
        id: "r2",
        question: "Why does React require keys when rendering lists of elements?",
        options: [
          "To enforce CSS ordering",
          "To help React identify which items have changed, been added, or been removed during reconciliation",
          "To prevent memory leaks in event listeners",
          "To automatically bind click handlers",
        ],
        correctIndex: 1,
        explanation: "Keys provide a stable identity to list elements across renders so React can re-order or patch the DOM efficiently.",
      },
      {
        id: "r3",
        question: "What is the primary benefit of React Server Components (RSC)?",
        options: [
          "They replace client-side JavaScript entirely",
          "They render on the server without shipping component code to the client bundle, reducing JS payload",
          "They allow direct access to browser localStorage",
          "They execute synchronous HTTP polling automatically",
        ],
        correctIndex: 1,
        explanation: "React Server Components execute only on the server, streaming HTML/JSON to the client with zero bundle impact.",
      },
    ],
  },
  TypeScript: {
    skillName: "TypeScript",
    durationSeconds: 120,
    passingScore: 2,
    questions: [
      {
        id: "ts1",
        question: "What is the difference between 'unknown' and 'any' in TypeScript?",
        options: [
          "'unknown' is type-safe because you cannot perform operations on it without type narrowing, whereas 'any' bypasses all type checking",
          "'any' can only accept string or number, whereas 'unknown' accepts all primitives",
          "'unknown' compiles to runtime assertions in the emitted JS",
          "There is no difference; they are aliases",
        ],
        correctIndex: 0,
        explanation: "'unknown' requires type narrowing (via typeof, instanceof, or custom guards) before properties or methods can be accessed.",
      },
      {
        id: "ts2",
        question: "Which utility type constructs a type with all properties of T set to optional?",
        options: ["Required<T>", "Partial<T>", "Omit<T, K>", "Pick<T, K>"],
        correctIndex: 1,
        explanation: "Partial<T> marks every key in type T with the '?' optional flag.",
      },
      {
        id: "ts3",
        question: "What is a discriminated union in TypeScript?",
        options: [
          "A union of types that share a common literal property used by the compiler to narrow the variant",
          "A set of enum values with string indices",
          "A type that cannot be assigned null or undefined",
          "An interface that extends multiple base classes",
        ],
        correctIndex: 0,
        explanation: "A discriminated union uses a single tag property (like `kind: 'success' | 'error'`) to safely narrow the union.",
      },
    ],
  },
  Kotlin: {
    skillName: "Kotlin",
    durationSeconds: 120,
    passingScore: 2,
    questions: [
      {
        id: "k1",
        question: "What is the purpose of 'suspend' modifier on a function in Kotlin?",
        options: [
          "It marks a function that can be paused and resumed non-blockingly within a coroutine",
          "It forces the function to run in a background daemon thread",
          "It catches all unhandled NullPointerExceptions",
          "It makes the function synchronous and thread-safe",
        ],
        correctIndex: 0,
        explanation: "Suspend functions can yield execution without blocking the underlying thread, enabling structured concurrency.",
      },
      {
        id: "k2",
        question: "What does the safe-call operator '?.' do in Kotlin?",
        options: [
          "Throws a NullPointerException immediately if the reference is null",
          "Executes the call only if the reference is not null, otherwise returns null safely",
          "Converts any nullable type into an Optional wrapper",
          "Forces smart-casting to non-null without compiler verification",
        ],
        correctIndex: 1,
        explanation: "The safe call operator evaluates the expression only when the target is non-null, avoiding NullPointerExceptions.",
      },
      {
        id: "k3",
        question: "What distinguishes a 'data class' in Kotlin?",
        options: [
          "It automatically generates equals(), hashCode(), toString(), and copy() implementations based on constructor properties",
          "It is automatically serialized to XML",
          "It can only contain primitive integers and booleans",
          "It cannot be instantiated using constructor parameters",
        ],
        correctIndex: 0,
        explanation: "Data classes automatically provide structural equality, string representations, and copy utility methods.",
      },
    ],
  },
  SQL: {
    skillName: "SQL",
    durationSeconds: 120,
    passingScore: 2,
    questions: [
      {
        id: "s1",
        question: "What is the main difference between WHERE and HAVING clauses in SQL?",
        options: [
          "WHERE filters rows before grouping/aggregation; HAVING filters aggregated groups",
          "WHERE only works on primary keys; HAVING works on foreign keys",
          "HAVING cannot be used with GROUP BY",
          "WHERE is only supported in MySQL; HAVING is only in PostgreSQL",
        ],
        correctIndex: 0,
        explanation: "WHERE filters rows before GROUP BY aggregation occurs; HAVING filters the groups produced by aggregate functions like COUNT or SUM.",
      },
      {
        id: "s2",
        question: "Which type of index is most effective for speeding up range queries (e.g. BETWEEN or >) in relational databases?",
        options: ["Hash Index", "B-Tree Index", "Bitmap Index", "Full-Text Index"],
        correctIndex: 1,
        explanation: "B-Tree indices maintain ordered data structures that allow logarithmic lookups and range scans.",
      },
      {
        id: "s3",
        question: "What does the ACID property 'Isolation' guarantee in a database transaction?",
        options: [
          "Data is replicated to at least two physically isolated servers",
          "Concurrent transactions execute without interfering with one another, as if run serially",
          "Transactions are permanently committed to non-volatile disk",
          "Foreign key constraints are checked before each row insert",
        ],
        correctIndex: 1,
        explanation: "Isolation ensures that concurrent transactions remain separated and do not see uncommitted intermediate states.",
      },
    ],
  },
};

const VERIFIED_STORAGE_KEY = "sbjfp_verified_skills";

export function getVerifiedSkills(): string[] {
  if (typeof window === "undefined") return ["Kotlin", "React"];
  try {
    const raw = localStorage.getItem(VERIFIED_STORAGE_KEY);
    if (!raw) {
      const defaults = ["Kotlin", "React"];
      localStorage.setItem(VERIFIED_STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    return ["Kotlin", "React"];
  }
}

export function saveVerifiedSkill(skillName: string): string[] {
  const current = getVerifiedSkills();
  if (!current.includes(skillName)) {
    const updated = [...current, skillName];
    if (typeof window !== "undefined") {
      localStorage.setItem(VERIFIED_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  }
  return current;
}
