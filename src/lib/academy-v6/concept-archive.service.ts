import { ArchivedConceptRecord } from './types';

export class ConceptArchiveService {
  private static archive: ArchivedConceptRecord[] = [];

  static add(record: ArchivedConceptRecord) {
    this.archive.unshift(record);
    return record;
  }

  static list(bucket?: 'good_working' | 'bad_not_working') {
    const items = bucket
      ? this.archive.filter((x) => x.archiveBucket === bucket)
      : this.archive;
    return [...items];
  }
}