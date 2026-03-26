export type PublicSignalRecord = {
  title: string;
  source: string;
  url?: string;
  capturedAt: string;
};

export async function fetchPublicSignals(divisionSlug: string): Promise<PublicSignalRecord[]> {
  return [
    {
      title: `${divisionSlug} placeholder public signal`,
      source: 'manual-stub',
      capturedAt: new Date().toISOString(),
    },
  ];
}
