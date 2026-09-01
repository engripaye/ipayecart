'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {fetchProducts} from "@/lib/features/product/productSlice";
import {useAuth, useUser} from "@clerk/nextjs";
import {fetchCart} from "@/lib/features/cart/cartSlice";

export default function PublicLayout({ children }) {

    const dispatch = useDispatch()
    const { user } = useUser()
    const {getToken} = useAuth()
    const {cartItems} = useSelector((state) => state.cart)

    useEffect(() => {
        dispatch(fetchProducts({}))
    }, [])

    useEffect(() => {
        if(user){
            dispatch(fetchCart({getToken}))
        }
    }, [])

    useEffect(() => {

    }, [])

    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
