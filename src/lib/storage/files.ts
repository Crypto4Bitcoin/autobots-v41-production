export type StoredFileRecord = {
  path: string;
  contentType: string;
  byteSize: number;
};

export async function saveFileRecord(record: StoredFileRecord) {
  return { ok: true, mode: 'stub' as const, record };
}
