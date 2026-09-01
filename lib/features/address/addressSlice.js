import { addressDummyData } from '@/assets/assets'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

export const fetchAddress = createAsyncThunk('address/fetchAddress',
    async ({ getToken }, thunkAPI) => {
        try {

        }catch (error) {

        }
    }

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [addressDummyData],
    },
    reducers: {
        addAddress: (state, action) => {
            state.list.push(action.payload)
        },
    }
})

export const { addAddress } = addressSlice.actions

export default addressSlice.reducer