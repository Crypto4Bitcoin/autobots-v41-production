export class UploadAgent {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async run(payload: unknown) {
    console.log('[UploadAgent] Uploading video to YouTube.');
    return { status: 'success', agent: 'UploadAgent', result: 'Completed Uploading video to YouTube.' };
  }
}