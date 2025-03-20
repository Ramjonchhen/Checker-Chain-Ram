import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { api } from "./user"

export interface Category {
    name: string
    subcategories: string[]
}

interface CategoryState {
    loading: boolean
    error: string
    categories: Category[] | never[]
    getCategories: () => Promise<void>
}

const initialState = {
    loading: false,
    error: "",
    categories: [],
}
export const useCategoryStore = create<CategoryState>()(
    devtools((set) => ({
        ...initialState,
        getCategories: async () => {
            try {
                set({ loading: true })
                const { data } = await api.get("/categories")
                // console.debug(data)
                set({ categories: data.data })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                set({ error: error.message })
            } finally {
                set({ loading: false })
            }
        }
    }))
)
