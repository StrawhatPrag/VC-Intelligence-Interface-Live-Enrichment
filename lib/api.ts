import { Company } from './types'
import { MOCK_COMPANIES } from './mock-data'

export async function getCompanies(): Promise<Company[]> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800))
  return MOCK_COMPANIES
}

export async function enrichCompany(website: string, name: string, thesis?: string) {
  const response = await fetch('/api/enrich', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      website,
      company_name: name,
      thesis,
    }),
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to enrich company data')
  }
  
  return data
}
