import { complaints, analysis, analytics } from '../data/mock'

// Empty VITE_API_URL = run entirely on mock data.
const BASE = import.meta.env.VITE_API_URL
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function call(path, options, fallback) {
  if (!BASE) return fallback()
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    if (!res.ok) throw new Error(res.statusText)
    return await res.json()
  } catch (err) {
    console.warn(`API ${path} failed, using mock data`, err)
    return fallback()
  }
}

export const getComplaints = () => call('/complaints', {}, async () => complaints)

export const getAnalytics = () => call('/admin/analytics', {}, async () => analytics)

// POST /complaints, then POST /complaints/:id/analyse (shape matches the agreed JSON contract)
export async function analyseComplaint(payload) {
  return call(
    '/complaints',
    { method: 'POST', body: JSON.stringify(payload) },
    async () => {
      await wait(300)
      return analysis
    }
  ).then(async (created) => {
    if (!BASE || !created?.complaint_id) return created
    return call(`/complaints/${created.complaint_id}/analyse`, { method: 'POST' }, async () => analysis)
  })
}
