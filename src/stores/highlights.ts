/* eslint-disable @typescript-eslint/no-explicit-any */
import {create} from "zustand"
import { devtools } from "zustand/middleware"
import { api } from "./user"

export interface Highlight {
  description: string
  images: string[]
}

interface HighlightState {
  loading: boolean
  error: string
  highlight: Highlight
  uploadHighlight: (highlight: any) => Promise<any>
  getHighlight: (id: string) => void
  removeHighlight: (id: string) => Promise<any>
}

const initialState = {
  loading: false,
  error: "",
  highlight: {
    description: "",
    images: []
  }
}
export const useHighlightStore = create<HighlightState>()(
  devtools((set) => ({
    ...initialState,
    uploadHighlight: async (highlight: any) => {
      set({loading: true})
      const formData = new FormData()      
      highlight.images.forEach((image:File)=>formData.append('images',image))
      formData.append('description', highlight.description)
      console.debug(formData.get('images'))
      const { data: response } = await api.post(`/highlights/${highlight.productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      set({ loading: false, highlight: response.data })
      return response
    },
    getHighlight: async (id: string) => {
      set({ loading: true })
      const { data: response } = await api.get(`/highlights/${id}`)
      set({ loading: false, highlight: response.data })
    },
    removeHighlight: async (id: string) => {
      set({ loading: true })
      const { data: response } = await api.delete(`/highlights/${id}`)
      set({ loading: false, highlight: {
        description: "",
        images: []
      } })
      return response
    }
  }))
)
