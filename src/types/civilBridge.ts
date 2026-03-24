export interface CivilBridgeRecord {
  id: string;
  sourceDomain: 'civil' | 'market' | 'kernel';
  targetDomain: 'civil' | 'market' | 'kernel';
  objectId: string;
  objectType: string;
  syncedAt: string;
}
const type_stub = (props: any) => null;
export default type_stub;
