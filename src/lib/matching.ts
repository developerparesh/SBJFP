export interface JobRequirement {
  skillName: string;
  isRequired: boolean;
  minYears?: number;
}

export interface CandidateSkillEntry {
  skillName: string;
  yearsExperience?: number;
}

export interface MatchResult {
  score: number; // 0 to 100
  matchedSkills: string[];
  missingRequiredSkills: string[];
  missingPreferredSkills: string[];
  meetsThreshold: boolean;
  explanation: string;
}

/**
 * Calculates an explainable skill match score between candidate skills and job requirements.
 *
 * Weighting:
 * - Required skills account for 75% of the total score.
 * - Preferred skills account for 25% of the total score.
 * - If no preferred skills exist, required skills account for 100%.
 * - If no skills are defined on the job, returns 100%.
 */
export function calculateSkillMatch(
  candidateSkills: CandidateSkillEntry[],
  jobRequirements: JobRequirement[],
  minThreshold: number | null = 70
): MatchResult {
  if (!jobRequirements || jobRequirements.length === 0) {
    return {
      score: 100,
      matchedSkills: [],
      missingRequiredSkills: [],
      missingPreferredSkills: [],
      meetsThreshold: true,
      explanation: "No specific skill restrictions defined for this role.",
    };
  }

  const candidateSkillSet = new Set(
    candidateSkills.map((s) => s.skillName.toLowerCase().trim())
  );

  const requiredReqs = jobRequirements.filter((r) => r.isRequired);
  const preferredReqs = jobRequirements.filter((r) => !r.isRequired);

  const matchedSkills: string[] = [];
  const missingRequiredSkills: string[] = [];
  const missingPreferredSkills: string[] = [];

  // Check required
  requiredReqs.forEach((r) => {
    if (candidateSkillSet.has(r.skillName.toLowerCase().trim())) {
      matchedSkills.push(r.skillName);
    } else {
      missingRequiredSkills.push(r.skillName);
    }
  });

  // Check preferred
  preferredReqs.forEach((r) => {
    if (candidateSkillSet.has(r.skillName.toLowerCase().trim())) {
      matchedSkills.push(r.skillName);
    } else {
      missingPreferredSkills.push(r.skillName);
    }
  });

  let score = 0;

  if (requiredReqs.length > 0 && preferredReqs.length > 0) {
    const requiredScore =
      ((requiredReqs.length - missingRequiredSkills.length) / requiredReqs.length) * 75;
    const preferredScore =
      ((preferredReqs.length - missingPreferredSkills.length) / preferredReqs.length) * 25;
    score = Math.round(requiredScore + preferredScore);
  } else if (requiredReqs.length > 0) {
    score = Math.round(
      ((requiredReqs.length - missingRequiredSkills.length) / requiredReqs.length) * 100
    );
  } else if (preferredReqs.length > 0) {
    score = Math.round(
      ((preferredReqs.length - missingPreferredSkills.length) / preferredReqs.length) * 100
    );
  }

  const meetsThreshold = minThreshold === null ? true : score >= minThreshold;

  let explanation = "";
  if (missingRequiredSkills.length === 0 && missingPreferredSkills.length === 0) {
    explanation = "Perfect match! You have all required and preferred skills.";
  } else if (missingRequiredSkills.length === 0) {
    explanation = `Strong match (${score}%). You possess all ${requiredReqs.length} required skills.`;
  } else {
    explanation = `Match score is ${score}%. Missing ${missingRequiredSkills.length} required skill(s): ${missingRequiredSkills.join(", ")}.`;
  }

  return {
    score,
    matchedSkills,
    missingRequiredSkills,
    missingPreferredSkills,
    meetsThreshold,
    explanation,
  };
}
