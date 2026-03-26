export const jobTypes = [
  'refresh-signals',
  'run-verifier',
  'run-simulation',
  'relay-review',
  'periodic-integrity-scan',
] as const;

export type JobType = (typeof jobTypes)[number];
