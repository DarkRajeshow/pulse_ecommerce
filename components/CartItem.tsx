import { PRODUCT_CATEGORIES } from '../config'
import { useCart } from '../hooks/use-cart'
import { Product } from '../payload-types'
import { Cross, ImageIcon, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function CartItem({ product }: { product: Product }) {

    const { image } = product.images[0]

    const { removeItem } = useCart();

    const label = PRODUCT_CATEGORIES.find(({ value }) => {
        return value == product.category
    })?.label

    return (
        <div className='space-y-3 py-2'>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className="relative aspect-square h-20 w-20 min-h-fit overflow-hidden rounded">
                        <span title='Remove' >
                            <Trash2 onClick={() => {
                                removeItem(product.id)
                            }} className='bg-black/50 cursor-pointer text-white z-30 absolute top-1 right-1 rounded-sm p-0.5' />
                        </span>
                        {(typeof image !== "string" && image.url) ? <Link href={`/product/${product.id}`}><Image alt={product.name} src={image.url} fill className='absolute object-cover' /></Link> : (
                            <div className='flex h-full items-center bg-secondary justify-center'>
                                <ImageIcon
                                    aria-hidden='true'
                                    className='h-4 w-4 text-muted-foreground'
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col self-start">
                        <span className="line-clamp-1 text-sm font-medium mb=1">{product.name}</span>
                        <span className="line-clamp-1 text-xs capitalize text-muted-foreground">{label}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
