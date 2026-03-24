type BridgePayload = {
  workerId: string;
  taskId: string;
  fileName: string;
  content: string;
};

type BridgeResult = {
  ok: boolean;
  cid: string;
  network: 'private-ipfs' | 'public-ipfs';
  pinned: boolean;
  verified: boolean;
};

function fakeCid(seed: string) {
  return `bafy${Buffer.from(seed).toString('hex').slice(0, 36)}`;
}

export async function storeInPrivateIPFS(payload: BridgePayload): Promise<BridgeResult> {
  return {
    ok: true,
    cid: fakeCid(`private:${payload.workerId}:${payload.taskId}:${payload.fileName}:${payload.content}`),
    network: 'private-ipfs',
    pinned: true,
    verified: true,
  };
}

export async function bridgeToPublicIPFS(payload: BridgePayload): Promise<BridgeResult> {
  return {
    ok: true,
    cid: fakeCid(`public:${payload.workerId}:${payload.taskId}:${payload.fileName}:${payload.content}`),
    network: 'public-ipfs',
    pinned: true,
    verified: true,
  };
}
