import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from "axios";

let debouncerTimer = null

export const uploadCart  = createAsyncThunk('cart/upload',
    async ({ getToken }, thunkAPI) => {
    try {
        clearTimeout(debouncerTimer)
        debouncerTimer = setTimeout(async () => {
            const { cartItems } = thunkAPI.getState().cart;
            const token = await getToken();
            await axios.post('/api/cart', { cart: cartItems }, {
                headers: {
                    Authorization: `Bearer ${token}`}})
        }, 1000)
    }catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
    })


export const fetchCart = createAsyncThunk('cart/fetch',
    async ({ getToken }, thunkApi) => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/cart', {headers: {
                Authorization: `Bearer ${token}`
                }})
                return data

        }catch (error) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    })

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {},
    },
    reducers: {
        addToCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]++
            } else {
                state.cartItems[productId] = 1
            }
            state.total += 1
        },
        removeFromCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]--
                if (state.cartItems[productId] === 0) {
                    delete state.cartItems[productId]
                }
            }
            state.total -= 1
        },
        deleteItemFromCart: (state, action) => {
            const { productId } = action.payload
            state.total -= state.cartItems[productId] ? state.cartItems[productId] : 0
            delete state.cartItems[productId]
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCart.fulfilled, (state, action) => {
            state.cartItems = action.payload.cart
            state.total = Object.values(action.payload.cart).reduce((acc, item) => acc + item, 0)

        })
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions

export default cartSlice.reducer
