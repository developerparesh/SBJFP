import { supabase } from "@/lib/supabase";
import { PRESET_SKILLS, CandidateSkillState } from "@/lib/skillsData";
import { SAMPLE_JOBS } from "@/lib/sampleJobs";
import { ProficiencyLevel } from "@/types/database";

/**
 * Service to interface with Supabase tables with reliable offline/unmigrated fallback.
 */

export async function getSkillsFromDb() {
  try {
    const { data, error } = await supabase.from("skills").select("*").order("name");
    if (error || !data || data.length === 0) {
      return PRESET_SKILLS;
    }
    return data.map((d) => ({
      name: d.name,
      category: d.category,
    }));
  } catch {
    return PRESET_SKILLS;
  }
}

export async function getJobsFromDb() {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*, employer:profiles(*), job_skills(*, skill:skills(*))")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return SAMPLE_JOBS;
    }

    return data.map((j) => ({
      ...j,
      company_name: j.employer?.company_name || "Hiring Partner",
      requirements: (j.job_skills || []).map((js: any) => ({
        skillName: js.skill?.name || "Skill",
        isRequired: js.is_required,
        minYears: js.min_years,
      })),
    }));
  } catch {
    return SAMPLE_JOBS;
  }
}

export async function syncCandidateSkillsToDb(
  userId: string,
  skills: CandidateSkillState[]
): Promise<boolean> {
  // Always update localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("sbjfp_candidate_skills", JSON.stringify(skills));
  }

  try {
    // 1. Delete previous skills for candidate
    await supabase.from("candidate_skills").delete().eq("candidate_id", userId);

    // 2. Fetch skill IDs mapping
    const { data: dbSkills } = await supabase.from("skills").select("id, name");
    if (dbSkills && dbSkills.length > 0) {
      const skillMap = new Map<string, string>(
        dbSkills.map((s) => [s.name.toLowerCase(), s.id])
      );

      const rowsToInsert: {
        candidate_id: string;
        skill_id: string;
        proficiency_level: ProficiencyLevel;
        years_experience: number;
      }[] = [];

      skills.forEach((s) => {
        const skillId = skillMap.get(s.skillName.toLowerCase());
        if (skillId) {
          rowsToInsert.push({
            candidate_id: userId,
            skill_id: skillId,
            proficiency_level: s.proficiency,
            years_experience: s.yearsExperience,
          });
        }
      });

      if (rowsToInsert.length > 0) {
        await supabase.from("candidate_skills").insert(rowsToInsert);
      }
    }
    return true;
  } catch (err) {
    console.warn("Could not sync candidate skills to Supabase (using localStorage fallback):", err);
    return false;
  }
}

export async function submitJobApplicationToDb(
  candidateId: string,
  jobId: string,
  matchScore: number
): Promise<boolean> {
  try {
    const { error } = await supabase.from("job_applications").insert({
      candidate_id: candidateId,
      job_id: jobId,
      match_score: matchScore,
      status: "submitted",
    });

    return !error;
  } catch (err) {
    console.warn("Could not save application to Supabase:", err);
    return false;
  }
}
