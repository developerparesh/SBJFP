import { PRESET_SKILLS, CandidateSkillState, QUALIFICATION_OPTIONS } from "@/lib/skillsData";
import { ProficiencyLevel } from "@/types/database";

export interface ExtractedSkillResult {
  skills: CandidateSkillState[];
  suggestedYearsExperience: number;
  suggestedQualification?: string;
  matchedKeywords: string[];
}

const ALIASES: Record<string, string> = {
  "react.js": "React",
  "reactjs": "React",
  "nextjs": "Next.js",
  "next.js": "Next.js",
  "node": "Node.js",
  "nodejs": "Node.js",
  "node.js": "Node.js",
  "postgres": "PostgreSQL",
  "psql": "PostgreSQL",
  "k8s": "Kubernetes",
  "compose": "Jetpack Compose",
  "jetpack compose": "Jetpack Compose",
  "android": "Android SDK",
  "tailwind": "Tailwind CSS",
  "tailwindcss": "Tailwind CSS",
  "ts": "TypeScript",
  "js": "JavaScript",
  "py": "Python",
  "golang": "Go",
  "github": "Git & GitHub",
  "git": "Git & GitHub",
  "ci/cd": "CI/CD Pipelines",
  "cicd": "CI/CD Pipelines",
  "rest": "REST APIs",
  "restful": "REST APIs",
  "rest api": "REST APIs",
  "rest apis": "REST APIs",
  "gql": "GraphQL",
  "room": "Room DB",
  "supabase": "Supabase",
  "spring": "Spring Boot",
  "springboot": "Spring Boot",
};

export function extractSkillsFromText(rawText: string): ExtractedSkillResult {
  const normalized = rawText.toLowerCase();
  const foundSkillsMap = new Map<string, CandidateSkillState>();
  const matchedKeywords: string[] = [];

  // 1. Detect aliases first
  Object.entries(ALIASES).forEach(([alias, targetSkill]) => {
    // Regex word boundary
    const regex = new RegExp(`\\b${alias.replace(".", "\\.")}\\b`, "i");
    if (regex.test(normalized)) {
      matchedKeywords.push(alias);
      const def = PRESET_SKILLS.find((s) => s.name.toLowerCase() === targetSkill.toLowerCase());
      if (def && !foundSkillsMap.has(def.name)) {
        foundSkillsMap.set(def.name, {
          skillName: def.name,
          category: def.category,
          proficiency: "intermediate",
          yearsExperience: 2,
        });
      }
    }
  });

  // 2. Scan for exact canonical skill names
  PRESET_SKILLS.forEach((preset) => {
    const escaped = preset.name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(normalized)) {
      matchedKeywords.push(preset.name);
      if (!foundSkillsMap.has(preset.name)) {
        foundSkillsMap.set(preset.name, {
          skillName: preset.name,
          category: preset.category,
          proficiency: "intermediate",
          yearsExperience: 2,
        });
      }
    }
  });

  // 3. Detect overall years of experience from text
  let detectedYears = 1;
  const expPatterns = [
    /(\d+)\+?\s*(?:years?|yrs?)(?:\s*of)?\s*experience/i,
    /experience\s*(?:of|:)?\s*(\d+)\+?\s*(?:years?|yrs?)/i,
    /(\d+)\+?\s*years?\s*in\s*software/i,
  ];

  for (const pattern of expPatterns) {
    const match = normalized.match(pattern);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (!isNaN(parsed) && parsed > 0 && parsed <= 25) {
        detectedYears = parsed;
        break;
      }
    }
  }

  // Check if fresher
  if (
    normalized.includes("fresher") ||
    normalized.includes("recent graduate") ||
    normalized.includes("fresh graduate") ||
    normalized.includes("entry level") ||
    normalized.includes("0 years")
  ) {
    detectedYears = 0;
  }

  // 4. Adjust skill proficiencies based on context words
  const isSenior = /senior|lead|architect|staff|principal|head/i.test(normalized);
  const isFresher = detectedYears === 0;

  foundSkillsMap.forEach((val, key) => {
    let prof: ProficiencyLevel = "intermediate";
    let yrs = detectedYears === 0 ? 1 : Math.max(1, detectedYears - 1);

    if (isSenior || detectedYears >= 5) {
      prof = "expert";
      yrs = Math.max(3, detectedYears);
    } else if (detectedYears >= 3) {
      prof = "advanced";
      yrs = Math.max(2, detectedYears - 1);
    } else if (isFresher) {
      prof = "beginner";
      yrs = 1;
    }

    foundSkillsMap.set(key, {
      ...val,
      proficiency: prof,
      yearsExperience: yrs,
    });
  });

  // 5. Detect Qualification
  let suggestedQualification: string | undefined = undefined;
  if (/b\.?tech|b\.?e\b|bachelor of technology|engineering/i.test(normalized)) {
    suggestedQualification = QUALIFICATION_OPTIONS[0]; // B.Tech / B.E.
  } else if (/bca|mca|computer applications/i.test(normalized)) {
    suggestedQualification = QUALIFICATION_OPTIONS[1]; // BCA / MCA
  } else if (/m\.?tech|ms\b|master of science|mba/i.test(normalized)) {
    suggestedQualification = QUALIFICATION_OPTIONS[6]; // Master's
  } else if (/diploma|polytechnic/i.test(normalized)) {
    suggestedQualification = QUALIFICATION_OPTIONS[3]; // Diploma
  } else if (/phd|doctorate/i.test(normalized)) {
    suggestedQualification = QUALIFICATION_OPTIONS[7]; // Doctorate
  } else if (/bootcamp|self-taught/i.test(normalized)) {
    suggestedQualification = QUALIFICATION_OPTIONS[5]; // Self-Taught
  }

  return {
    skills: Array.from(foundSkillsMap.values()),
    suggestedYearsExperience: detectedYears,
    suggestedQualification,
    matchedKeywords: Array.from(new Set(matchedKeywords)),
  };
}
