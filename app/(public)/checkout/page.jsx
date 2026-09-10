"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

export default function CheckoutPage() {
    const { user } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [cart, setCart] = useState([]);
    const [couponCode, setCouponCode] = useState("");
    const [coupon, setCoupon] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("PAYSTACK");

    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    const currency =
        process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦";

    /*
     * Load checkout information
     */
    useEffect(() => {
        if (!user) return;

        const loadCheckout = async () => {
            try {
                const token = await getToken();

                const [addressResponse, cartResponse] =
                    await Promise.all([
                        axios.get("/api/address", {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }),

                        axios.get("/api/cart", {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                    ]);

                setAddresses(addressResponse.data.addresses || []);
                setCart(cartResponse.data.cart || []);

                if (addressResponse.data.addresses?.length > 0) {
                    setSelectedAddress(
                        addressResponse.data.addresses[0].id
                    );
                }

            } catch (error) {
                toast.error(
                    error?.response?.data?.error ||
                    error.message
                );
            } finally {
                setLoading(false);
            }
        };

        loadCheckout();
    }, [user, getToken]);

    const subtotal = useMemo(() => {
        return cart.reduce(
            (sum, item) =>
                sum + Number(item.price) * Number(item.quantity),
            0
        );
    }, [cart]);

    const shipping = subtotal > 0 && subtotal < 50000 ? 5000 : 0;

    const discount = coupon
        ? (subtotal * coupon.discount) / 100
        : 0;

    const total = Math.max(
        0,
        subtotal - discount + shipping
    );

    const applyCoupon = async () => {
        if (!couponCode.trim()) {
            return toast.error("Enter a coupon code");
        }

        try {
            const token = await getToken();

            const { data } = await axios.post(
                "/api/coupon",
                {
                    code: couponCode.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCoupon(data.coupon);

            toast.success("Coupon applied successfully");

        } catch (error) {
            setCoupon(null);

            toast.error(
                error?.response?.data?.error ||
                "Invalid coupon"
            );
        }
    };

    const placeOrder = async () => {
        if (!selectedAddress) {
            return toast.error(
                "Please select a delivery address"
            );
        }

        if (!cart.length) {
            return toast.error("Your cart is empty");
        }

        try {
            setPlacingOrder(true);

            const token = await getToken();

            /*
             * Create the order first.
             * For PAYSTACK the cart is NOT cleared yet.
             */
            const { data } = await axios.post(
                "/api/orders",
                {
                    addressId: selectedAddress,

                    items: cart.map(item => ({
                        id: item.id,
                        quantity: item.quantity
                    })),

                    couponCode: couponCode || null,

                    paymentMethod
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            /*
             * COD
             */
            if (paymentMethod === "COD") {
                toast.success("Order placed successfully");

                router.push("/orders");

                return;
            }

            /*
             * PAYSTACK
             */
            const paymentResponse = await axios.post(
                "/api/paystack/initialize",
                {
                    orderIds: data.orderIds
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const authorizationUrl =
                paymentResponse.data.authorization_url;

            if (!authorizationUrl) {
                throw new Error(
                    "Paystack payment URL was not returned"
                );
            }

            /*
             * Redirect customer to Paystack
             */
            window.location.href = authorizationUrl;

        } catch (error) {
            toast.error(
                error?.response?.data?.error ||
                error.message
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-slate-800">
                        Please login to continue
                    </h1>

                    <p className="text-slate-500 mt-2">
                        You need to be logged in before checking out.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-slate-300 border-t-slate-800 rounded-full" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 py-10">
            <div className="max-w-6xl mx-auto px-5">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm text-slate-500">
                        IpayeCart
                    </p>

                    <h1 className="text-3xl font-semibold text-slate-800">
                        Checkout
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Complete your order securely.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Delivery address */}
                        <section className="bg-white rounded-2xl border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800">
                                        Delivery Address
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Where should we deliver your order?
                                    </p>
                                </div>

                                <span className="text-sm text-slate-400">
                                    01
                                </span>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
                                    <p className="text-slate-500">
                                        You don't have a saved address.
                                    </p>

                                    <button
                                        onClick={() =>
                                            router.push("/address")
                                        }
                                        className="mt-3 text-slate-800 font-medium underline"
                                    >
                                        Add an address
                                    </button>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {addresses.map(address => (
                                        <label
                                            key={address.id}
                                            className={`border rounded-xl p-4 cursor-pointer transition ${
                                                selectedAddress === address.id
                                                    ? "border-slate-800 bg-slate-50"
                                                    : "border-slate-200 hover:border-slate-400"
                                            }`}
                                        >
                                            <div className="flex gap-3">
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    checked={
                                                        selectedAddress === address.id
                                                    }
                                                    onChange={() =>
                                                        setSelectedAddress(
                                                            address.id
                                                        )
                                                    }
                                                    className="mt-1"
                                                />

                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {address.name}
                                                    </p>

                                                    <p className="text-sm text-slate-500 mt-1">
                                                        {address.street},{" "}
                                                        {address.city},{" "}
                                                        {address.state}
                                                    </p>

                                                    <p className="text-sm text-slate-500">
                                                        {address.country}
                                                    </p>

                                                    <p className="text-sm text-slate-500">
                                                        {address.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Payment */}
                        <section className="bg-white rounded-2xl border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800">
                                        Payment Method
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Choose how you'd like to pay.
                                    </p>
                                </div>

                                <span className="text-sm text-slate-400">
                                    02
                                </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">

                                {/* Paystack */}
                                <label
                                    className={`cursor-pointer rounded-xl border p-5 ${
                                        paymentMethod === "PAYSTACK"
                                            ? "border-green-600 bg-green-50"
                                            : "border-slate-200"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="PAYSTACK"
                                        checked={
                                            paymentMethod === "PAYSTACK"
                                        }
                                        onChange={e =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                        className="sr-only"
                                    />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                Pay Online
                                            </p>

                                            <p className="text-sm text-slate-500 mt-1">
                                                Secure payment with Paystack
                                            </p>
                                        </div>

                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                            💳
                                        </div>
                                    </div>
                                </label>

                                {/* COD */}
                                <label
                                    className={`cursor-pointer rounded-xl border p-5 ${
                                        paymentMethod === "COD"
                                            ? "border-slate-800 bg-slate-50"
                                            : "border-slate-200"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={
                                            paymentMethod === "COD"
                                        }
                                        onChange={e =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                        className="sr-only"
                                    />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                Cash on Delivery
                                            </p>

                                            <p className="text-sm text-slate-500 mt-1">
                                                Pay when your order arrives
                                            </p>
                                        </div>

                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            💵
                                        </div>
                                    </div>
                                </label>

                            </div>
                        </section>

                        {/* Coupon */}
                        <section className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-800">
                                Have a coupon?
                            </h2>

                            <div className="flex gap-3 mt-4">
                                <input
                                    value={couponCode}
                                    onChange={e =>
                                        setCouponCode(
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    placeholder="Enter coupon code"
                                    className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
                                />

                                <button
                                    type="button"
                                    onClick={applyCoupon}
                                    className="px-5 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-900"
                                >
                                    Apply
                                </button>
                            </div>

                            {coupon && (
                                <p className="text-sm text-green-600 mt-3">
                                    Coupon applied — {coupon.discount}% off
                                </p>
                            )}
                        </section>

                    </div>

                    {/* RIGHT — SUMMARY */}
                    <aside className="lg:sticky lg:top-6 h-fit">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">

                            <h2 className="text-xl font-semibold text-slate-800">
                                Order Summary
                            </h2>

                            <div className="mt-5 space-y-4">

                                {cart.map(item => (
                                    <div
                                        key={item.id}
                                        className="flex gap-3"
                                    >
                                        <div className="relative h-16 w-16 rounded-lg bg-slate-100 overflow-hidden">
                                            <Image
                                                src={item.images?.[0]}
                                                alt={item.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-800 line-clamp-2">
                                                {item.name}
                                            </p>

                                            <p className="text-xs text-slate-500 mt-1">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>

                                        <p className="text-sm font-medium text-slate-800">
                                            {currency}
                                            {(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                ))}

                            </div>

                            <div className="border-t border-slate-200 mt-6 pt-5 space-y-3">

                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Subtotal
                                    </span>

                                    <span className="text-slate-800">
                                        {currency}
                                        {subtotal.toLocaleString()}
                                    </span>
                                </div>

                                {coupon && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600">
                                            Discount
                                        </span>

                                        <span className="text-green-600">
                                            -{currency}
                                            {discount.toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Shipping
                                    </span>

                                    <span className="text-slate-800">
                                        {currency}
                                        {shipping.toLocaleString()}
                                    </span>
                                </div>

                                <div className="border-t border-slate-200 pt-4 flex justify-between">
                                    <span className="text-lg font-semibold text-slate-800">
                                        Total
                                    </span>

                                    <span className="text-xl font-bold text-slate-900">
                                        {currency}
                                        {total.toLocaleString()}
                                    </span>
                                </div>

                            </div>

                            <button
                                onClick={placeOrder}
                                disabled={
                                    placingOrder ||
                                    !cart.length ||
                                    !selectedAddress
                                }
                                className="w-full mt-6 bg-slate-900 text-white py-3.5 rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {placingOrder
                                    ? "Processing..."
                                    : paymentMethod === "PAYSTACK"
                                        ? "Pay with Paystack"
                                        : "Place Order"}
                            </button>

                            <p className="text-xs text-center text-slate-400 mt-4">
                                🔒 Your payment is securely processed.
                            </p>

                        </div>
                    </aside>

                </div>
            </div>
        </main>
    );
}
