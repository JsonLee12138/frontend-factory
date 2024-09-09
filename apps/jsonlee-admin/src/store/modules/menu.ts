import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { MenuState } from '@/types/store_modules/menu';
import { treeBind } from '@/utils/tree';
import { MenuApi } from '@/api/modules/menu';
import { Result } from '@/types/api';
import { MenuItem } from '@/types/api_modules/menu';

const initState: MenuState = {
  tree: [],
  flattenList: [],
  flag: false,
};

const menuApi = new MenuApi();
export const getMenuData = createAsyncThunk(
  'menu/getList',
  menuApi.getListWithoutPagination<MenuItem>,
);
export const menuSlice = createSlice({
  name: 'menu',
  initialState: initState,
  reducers: {
    setMenuData: (state, action) => {
      state.flattenList = action.payload;
      state.tree = treeBind(action.payload);
    },
    clear: (state) => {
      state.tree = [];
      state.flattenList = [];
      state.flag = false;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(getMenuData.fulfilled, (state: MenuState, action) => {
      const { data } = action.payload as unknown as Result<MenuItem[]>;
      state.flattenList = data;
      state.tree = treeBind<MenuItem>(data);
      state.flag = true;
    }),
});

// Action creators are generated for each case reducer function
export const { setMenuData } = menuSlice.actions;

export default menuSlice.reducer;
