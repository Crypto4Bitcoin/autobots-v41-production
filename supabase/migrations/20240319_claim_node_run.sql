-- RPC for atomic node run claiming
-- Similar to claim_next_job but specialized for node_runs table

CREATE OR REPLACE FUNCTION public.claim_next_node_run(p_worker_id VARCHAR)
RETURNS public.node_runs AS $$
DECLARE
  v_run public.node_runs;
BEGIN
  WITH candidate AS (
    SELECT id
    FROM public.node_runs
    WHERE status IN ('pending', 'runnable')
    ORDER BY created_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT 1
  )
  UPDATE public.node_runs
  SET status = 'processing',
      worker_id = p_worker_id,
      started_at = NOW()
  WHERE id = (SELECT id FROM candidate)
  RETURNING * INTO v_run;

  RETURN v_run;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.claim_next_node_run IS 'Atomically claims the next runnable node run for a worker.';
