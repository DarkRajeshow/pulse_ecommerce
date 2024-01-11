"use client"

import { TQueryValidator } from "../lib/validators/query-validator";
import { Product } from "../payload-types";
import { trpc } from "../trpc/client";
import Link from "next/link";
import ProductListing from "./ProductListing";

interface ProductReelProps {
    title: string,
    subtitle?: string,
    href?: string,
    query: TQueryValidator
}
export default function ProductReel(props: ProductReelProps) {

    const { title, subtitle, href, query } = props;

    const FALLBACK_LIMIT = 4;

    const { data: queryResults, isLoading } = trpc.getInfiniteProducts.useInfiniteQuery({
        limit: query.limit ?? FALLBACK_LIMIT,
        query
    }, {
        getNextPageParam: (lastPage) => lastPage.nextPage
    })

    const products = queryResults?.pages.flatMap((page) => page.items)

    let map: (Product | null)[] = []

    if (products && products.length) {
        map = products
    }
    else if (isLoading) {
        map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null)
    }

    // console.log('data', data);


    return (
        <section className="py-12">
            <div className="md:flex md:items-center md:justify-between mb-4">
                <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
                    {title && <h1 className="font-bold text-gray-900 sm:text-3xl text-2xl">{title}</h1>}

                    {subtitle && <p className="font-medium text-gray-900 sm:text-sm">{subtitle}</p>}
                </div>
                {href && <Link className="hidden sm:block text-sm font-medium text-blue-600 hover:text-blue-500" href={href} >Shop the collection <span aria-hidden="true">&rarr;</span></Link>}
            </div>
            <div className="relative">
                <div className="mt-6 flex items-center w-full">
                    <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:gap-x-8 lg:gap-x-10">
                        {map.map((product, i) => (
                            <ProductListing key={i} product={product} index={i}/>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

