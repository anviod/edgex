/**
 * Poll async scan/browse jobs returned by POST /api/.../scan (202 + job_id).
 */
export async function pollAsyncJob(request, jobId, { intervalMs = 500, timeoutMs = 190000 } = {}) {
  if (!jobId) {
    throw new Error('missing job_id')
  }
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    const job = await request.get(`/api/jobs/${encodeURIComponent(jobId)}`, { timeout: 15000 })
    const status = job?.status
    if (status === 'succeeded') {
      return job.result
    }
    if (status === 'failed' || status === 'cancelled') {
      throw new Error(job?.error || `scan job ${status}`)
    }
    await new Promise((r) => setTimeout(r, intervalMs))
  }
  throw new Error('scan job polling timeout')
}

/**
 * Submit a scan endpoint and either return sync result or poll an async job.
 * Compatible with both legacy sync responses and new 202 job responses.
 */
export async function postScanAndWait(request, url, payload = {}, { timeoutMs = 190000, axiosTimeout = 15000 } = {}) {
  const res = await request.post(url, payload, { timeout: axiosTimeout })
  if (res && typeof res === 'object' && res.job_id) {
    return pollAsyncJob(request, res.job_id, { timeoutMs })
  }
  // axios may wrap Fiber 202 body; also accept bare result arrays/objects
  return res
}
