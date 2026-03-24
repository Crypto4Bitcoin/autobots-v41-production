import type { SkillNode } from './types';

export function validateSkillTree(skills: SkillNode[]) {
  const errors: string[] = [];

  skills.forEach((skill, index) => {
    if (!skill) {
      errors.push(`Skill at index ${index} is undefined`);
      return;
    }

    if (typeof skill.role !== 'string') {
      errors.push(`Skill "${skill.id}" missing valid role`);
    }

    if (!skill.id) {
      errors.push(`Skill at index ${index} missing id`);
    }

    if (!skill.label) {
      errors.push(`Skill "${skill.id}" missing label`);
    }
  });

  if (errors.length > 0) {
    console.warn('⚠️ SkillTree Validation Errors:\n', errors);
  } else {
    console.log('✅ SkillTree validated successfully');
  }
}
