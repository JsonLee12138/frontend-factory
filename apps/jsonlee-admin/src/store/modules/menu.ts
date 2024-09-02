import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { MenuState } from '@/types/store_modules/menu.ts';
import { treeBind } from '@/utils/tree.ts';
import { MenuApi } from '@/api/modules/menu.ts';
import { Menu } from '@/types/api_modules/menu.ts';
import { Result } from '@/types/api.ts';

const initState: MenuState = {
  tree: [],
  flattenList: [],
};

const menuApi = new MenuApi();
export const getMenuData = createAsyncThunk(
  'menu/getList',
  menuApi.getListWithoutPagination<Menu.Item>,
);
export const menuSlice = createSlice({
  name: 'menu',
  initialState: initState,
  reducers: {
    setMenuData: (state, action) => {
      state.flattenList = action.payload;
      state.tree = treeBind(action.payload);
    },
  },
  extraReducers: (builder) =>
    builder.addCase(getMenuData.fulfilled, (state: MenuState, action) => {
      const { data } = action.payload as unknown as Result<Menu.Item[]>;
      state.flattenList = data;
      state.tree = treeBind<Menu.Item>(data);
    }),
});

// Action creators are generated for each case reducer function
export const { setMenuData } = menuSlice.actions;

export default menuSlice.reducer;
