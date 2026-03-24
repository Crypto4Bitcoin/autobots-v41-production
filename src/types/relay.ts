export type RelayLinkStatus =
  | 'active'
  | 'degraded'
  | 'offline';

export interface RelayLink {
  id: string;
  fromDistrictId: string;
  toDistrictId: string;
  status: RelayLinkStatus;
  bandwidthScore: number;
  trustScore: number;
  createdAt: string;
  lastSignalAt: string | null;
}

export interface RelaySignal {
  id: string;
  linkId: string;
  signalType: 'alert' | 'countermeasure' | 'market' | 'oversight' | 'kernel';
  payloadSummary: string;
  createdAt: string;
}
const type_stub = (props: any) => null;
export default type_stub;
