import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreState {
  savedCompanies: Set<string>
  toggleSavedCompany: (id: string) => void
  investmentThesis: string
  setInvestmentThesis: (thesis: string) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      savedCompanies: new Set<string>(),
      toggleSavedCompany: (id) =>
        set((state) => {
          const newSaved = new Set(state.savedCompanies)
          if (newSaved.has(id)) {
            newSaved.delete(id)
          } else {
            newSaved.add(id)
          }
          return { savedCompanies: newSaved }
        }),
      investmentThesis: '',
      setInvestmentThesis: (thesis) => set({ investmentThesis: thesis }),
    }),
    {
      name: 'vc-intelligence-storage',
      // Explicitly handle serialization of Sets for zustand persist
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const { state } = JSON.parse(str)
          return {
            state: {
              ...state,
              savedCompanies: new Set(state.savedCompanies),
            },
          }
        },
        setItem: (name, newValue) => {
          const str = JSON.stringify({
            state: {
              ...newValue.state,
              savedCompanies: Array.from(newValue.state.savedCompanies),
            },
          })
          localStorage.setItem(name, str)
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)
