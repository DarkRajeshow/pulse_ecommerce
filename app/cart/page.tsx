"use client"
import { Button } from "../../components/ui/button";
import { PRODUCT_CATEGORIES } from "../../config";
import { useCart } from "../../hooks/use-cart";
import { cn, formatPrice } from "../../lib/utils";
import { trpc } from "../../trpc/client";
import { Check, Loader2, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {

    const { items, removeItem } = useCart();

    const router = useRouter();

    const [isMounted, setIsMounted] = useState(false)

    const productIds = items.map(({ product }) => product.id)

    const { mutate: createCheckoutSession, isLoading } = trpc.payment.createSession.useMutation({
        onSuccess: ({ url }) => {
            if (url) router.push(url)
        }
    })

    const carTotal = items.reduce((total, { product }) => total + product.price, 0)


    const fee = 1;

    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl py-4 pd-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Shopping Cart</h1>
                <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                    <div className={cn("lg:col-span-7", {
                        "rounded-lg border-2 border-dashed border-zinc-200 p-12": isMounted && items.length === 0
                    })}>
                        <h2 className="sr-only">Items in your shopping cart</h2>

                        {(isMounted && items.length === 0) ? (
                            <div className="flex flex-col justify-center items-center space-y-1">
                                <div className="relative mb-4 h-40 w-40 text-muted-foreground">
                                    <Image fill src={'/hippo-empty-cart.png'} alt="Empty cart" />
                                </div>
                                <h3>Your cart is empty</h3>
                                <p>Whoops! nothing to show here yet.</p>
                            </div>
                        ) : null}

                        <ul className={cn({
                            "divide-y divide-gray-200 border-b border-t border-gray-200": isMounted && items.length > 0
                        })}>
                            {isMounted && items.map(({ product }) => {
                                const label = PRODUCT_CATEGORIES.find(({ value }) => {
                                    return value === product.category
                                })?.label


                                const { image } = product.images[0]
                                return (
                                    <li key={product.id} className="flex py-6 sm:py-10 relative">
                                        <div className="flex shrink-0 ">
                                            <div className="relative h-48 w-48">
                                                {(typeof image !== "string" && image.url) && (
                                                    <Image
                                                        alt={product.name}
                                                        src={image.url} fill
                                                        className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                                                    />
                                                )}
                                            </div>
                                            <div className="font-medium ml-2.5 lg:ml-4 flex-col flex gap-1 justify-between">
                                                <div className="">
                                                    <h3 className="text-2xl sm:text-3xl font-semibold t">{product.name}</h3>
                                                    <p className="border-l my-1 border-gray-300 px-2 text-gray-500">{label}</p>
                                                    <p className="text-xl font-bold">{formatPrice(product.price)}</p>
                                                    <span className="mt-2 flex items-center gap-2 text-sm "><Check className="text-green-600 h-4 w-4" /> Eligible for instance delivery.</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Button
                                                        onClick={() => { removeItem(product.id) }}
                                                        variant={"secondary"}
                                                        className="flex items-center gap-1 font-semibold"
                                                    >
                                                        Remove <Trash2 className=" h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <span
                                                    className="absolute top-10 right-5 cursor-pointer"
                                                    onClick={() => { removeItem(product.id) }}
                                                >
                                                    <X className="h-6 w-6 hover:h-7 hover:w-7 transition-all    " />
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>

                    </div>


                    <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Subtotal</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {isMounted ? formatPrice(carTotal) : <Loader2 className="animate-spin text-muted-foreground h-4 w-4" />}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Transation Fee</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {isMounted ? formatPrice(fee) : <Loader2 className="animate-spin text-muted-foreground h-4 w-4" />}
                                </p>
                            </div>
                            <div className="flex items-center justify-between text-xl text-gray-900 font-semibold border-y my-2 py-3 border-gray-300">
                                <p>Total</p>
                                <p>
                                    {isMounted ? carTotal === 0 ? formatPrice(0) : formatPrice(carTotal + fee) : <Loader2 className="animate-spin text-muted-foreground h-4 w-4" />}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button
                                disabled={items.length === 0 || isLoading}
                                onClick={(() => createCheckoutSession({ productIds }))} className="h-full w-full py-3 text-xl font-semibold " size={"lg"} >
                                {isLoading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin " /> : null}
                                Checkout
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
