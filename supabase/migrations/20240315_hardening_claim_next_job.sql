-- AutoBots: Hardening Migration (Atomic Queue Claiming)

-- 1. Add priority column to job_queue for deterministic ordering
ALTER TABLE job_queue ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;

-- 2. Create the atomic claim RPC
CREATE OR REPLACE FUNCTION claim_next_job(worker_id_param TEXT)
RETURNS TABLE (
    id UUID,
    pipeline_item_id UUID,
    workspace_id UUID,
    target_state pipeline_state,
    payload JSONB,
    attempts INTEGER,
    max_attempts INTEGER
) AS $$
DECLARE
    claimed_row_id UUID;
BEGIN
    -- Selection and claim in one statement using a CTE
    WITH candidate AS (
        SELECT jq.id
        FROM job_queue jq
        WHERE jq.status = 'pending'
        ORDER BY jq.priority DESC, jq.created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
    )
    UPDATE job_queue
    SET 
        status = 'processing',
        locked_at = NOW(),
        locked_by = worker_id_param,
        updated_at = NOW()
    WHERE job_queue.id = (SELECT candidate.id FROM candidate)
    RETURNING job_queue.id INTO claimed_row_id;

    IF claimed_row_id IS NULL THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT 
        jq.id, jq.pipeline_item_id, jq.workspace_id, jq.target_state, jq.payload, jq.attempts, jq.max_attempts
    FROM job_queue jq
    WHERE jq.id = claimed_row_id;
END;
$$ LANGUAGE plpgsql;
