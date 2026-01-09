import { defineStore } from 'pinia'

interface UiState {
  loading: boolean;
  darkMode: boolean;
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    loading: false,
    darkMode: false
  }),

  getters: {
    isLoading: (state): boolean => state.loading,
    isDarkMode: (state): boolean => state.darkMode
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },
    
    toggleDarkMode() {
      this.darkMode = !this.darkMode
    }
  }
})