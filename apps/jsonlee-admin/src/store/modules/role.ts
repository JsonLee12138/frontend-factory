import { RoleApi } from '@/api/modules/role';
import { Result } from '@/types/api';
import { RoleItem } from '@/types/api_modules/role';
import { RoleState } from '@/types/store_modules/role';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const state: RoleState = {
  tree: [],
  flag: false,
};

const roleApi = new RoleApi();

export const getRoleData = createAsyncThunk(
  'role/getList',
  roleApi.getListWithoutPagination<RoleItem>,
);

export const getRoleDataWithFlag = createAsyncThunk(
  'role/getListWithFlag',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as { role: RoleState };
    if (state.role.flag) {
      return rejectWithValue(new Error('data already loaded!') as Error);
    }
    return dispatch(getRoleData());
  },
);

export const roleSlice = createSlice({
  name: 'role',
  initialState: state,
  reducers: {
    setRoleData: (state, action) => {
      state.tree = action.payload;
    },
    clear: (state) => {
      state.tree = [];
      state.flag = false;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(getRoleData.fulfilled, (state: RoleState, action) => {
      const { data } = action.payload as unknown as Result<RoleItem[]>;
      state.tree = data;
      state.flag = true;
    }),
});

export const { setRoleData } = roleSlice.actions;

export default roleSlice.reducer;
