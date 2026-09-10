'use client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦'

    // calculate the average rating of the product
    const rating = Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length);

    return (
        <Link href={`/product/${product.id}`} className='group block w-full max-w-60 max-xl:mx-auto'>
            <div className='relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg'>
                <Image fill sizes="(max-width: 640px) 45vw, 240px" className='object-contain p-4 transition duration-300 group-hover:scale-110' src={product.images[0]} alt={product.name} />
            </div>
            <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
                <div>
                    <p>{product.name}</p>
                    <div className='flex'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                        ))}
                    </div>
                </div>
                <p className='font-semibold whitespace-nowrap'>{currency}{Number(product.price).toLocaleString('en-NG')}</p>
            </div>
        </Link>
    )
}

export default ProductCard
