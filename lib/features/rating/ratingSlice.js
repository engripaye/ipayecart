import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from "axios";

export const fetchUserRatings = createAsyncThunk('rating/fetchUserRatings',
    async ({getToken}, thunkAPI) => {
    try {
        const token = await getToken()
        const { data } = await axios.get('/api/rating', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return data ? data.ratings : []
    }catch(error){

    }
    })

const ratingSlice = createSlice({
    name: 'rating',
    initialState: {
        ratings: [],
    },
    reducers: {
        addRating: (state, action) => {
            state.ratings.push(action.payload)
        },
    }
})

export const { addRating } = ratingSlice.actions

export default ratingSlice.reducer