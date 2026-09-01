import { addressDummyData } from '@/assets/assets'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from "axios";

export const fetchAddress = createAsyncThunk('address/fetchAddress',
    async ({ getToken }, thunkAPI) => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/address', {headers: {
                Authorization: `Bearer ${token}`
                }})
            return data ? data.addresses: []

        }catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    })

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