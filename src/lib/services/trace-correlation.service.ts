// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DBService, supabase } from "./supabase-service";

export interface TraceSpan {
  trace_id: string;
  span_id: string;
  parent_span_id: string | null;
  service_name: string;
  operation_name: string;
  start_time: string;
  end_time: string | null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
}

export class TraceCorrelationService {
  /**
   * Starts a new trace span for a given operation.
   */
  async startSpan(params: {
    traceId?: string;
    parentSpanId?: string;
    serviceName: string;
    operationName: string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>;
  }): Promise<string> {
    const traceId = params.traceId || `tr-${Math.random().toString(36).substring(2, 9)}`;
    const spanId = `sp-${Math.random().toString(36).substring(2, 9)}`;

    console.log(`[TraceCorrelation] [${traceId}] Starting span ${spanId} (${params.serviceName}:${params.operationName})...`);

    await supabase.from("platform_traces").insert([{
      trace_id: traceId,
      span_id: spanId,
      parent_span_id: params.parentSpanId || null,
      service_name: params.serviceName,
      operation_name: params.operationName,
      start_time: new Date().toISOString(),
      metadata: params.metadata || {}
    }]);

    return spanId;
  }

  /**
   * Completes an existing trace span.
   */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  async endSpan(spanId: string, metadataAddition?: Record<string, any>) {
    console.log(`[TraceCorrelation] Ending span ${spanId}...`);
    
    // In a real system, we'd use a local buffer to batch these writes.
    await supabase.from("platform_traces").update({
      end_time: new Date().toISOString(),
      metadata: metadataAddition || {}
    }).eq("span_id", spanId);
  }
}
