export class ThumbnailAgent {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async run(payload: unknown) {
    console.log('[ThumbnailAgent] Creating thumbnail frames.');
    return { status: 'success', agent: 'ThumbnailAgent', result: 'Completed Creating thumbnail frames.' };
  }
}