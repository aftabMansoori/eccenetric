import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SearchFilters } from '../../components/search-filter';

const initialState: SearchFilters = {
  searchTerm: '',
  fileType: 'all',
  sortBy: 'date-desc',
  tags: [],
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters(_state, action: PayloadAction<SearchFilters>) {
      return action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
