export class QueueRouterService {
  /**
   * Routes a node job to the appropriate queue class based on capability.
   */
  static route(capability: string): string {
    const browserCaps = ["search.web", "scrape.site", "navigation.visit"];
    const mediaCaps = ["media.render", "video.clip", "image.generate"];
    const toolCaps = ["api.request", "social.post", "email.send"];
    
    if (browserCaps.includes(capability)) return "queue_browser";
    if (mediaCaps.includes(capability)) return "queue_media";
    if (toolCaps.includes(capability)) return "queue_tools";
    
    return "queue_general";
  }

  /**
   * Dispatches a job to the selected queue.
   */
  async dispatch(job: { nodeRunId: string; capability: string }) {
    const queue = QueueRouterService.route(job.capability);
    console.log(`[QueueRouter] Routing job ${job.nodeRunId} (${job.capability}) -> ${queue}`);
    
    // In production, this would be an enqueue operation (Redis, SQS, etc.)
    return { nodeRunId: job.nodeRunId, targetQueue: queue, status: "enqueued" };
  }
}
