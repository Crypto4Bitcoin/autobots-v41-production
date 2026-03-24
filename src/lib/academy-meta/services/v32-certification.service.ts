import { studentRepository } from '../repositories/v31-v35-repositoriees';

export class CertificationService {
  async chooseTrack(studentId: string, track: string) {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    return studentRepository.update(studentId, { skillTrack: track as any });
  }

 async addEvidence(studentId: string, count: number) {
    const student = await studentRepository.getById(studentId);
    if (!student) throw new Error('Student not found');
    return studentRepository.update(studentId, { 
      catalogEvidenceCount: student.catalogEvidenceCount + count 
    });
  }
}

export const certificationService = new CertificationService();

export class DeanService {
  async verifyStudent(studentId: string) {
    const student = await studentRepository.getById(studentId);
    if (!student) throw new Error('Student not found');
    if (student.catalogEvidenceCount >= 10) {
      return studentRepository.update(studentId, { deanVerified: true, eligibleForMarketplace: true });
    }
    throw new Error('Insufficient evidence for Dean verification');
  }
}

export const deanService = new DeanService();
