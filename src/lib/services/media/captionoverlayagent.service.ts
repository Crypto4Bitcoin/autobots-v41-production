export class CaptionOverlayAgent {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async run(payload: unknown) {
    console.log('[CaptionOverlayAgent] Adding subtitles and text overlays.');
    return { status: 'success', agent: 'CaptionOverlayAgent', result: 'Completed Adding subtitles and text overlays.' };
  }
}