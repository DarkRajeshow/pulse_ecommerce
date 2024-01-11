"use client"
import { ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { formatPrice } from "../lib/utils";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../hooks/use-cart";
import { ScrollArea } from "./ui/scroll-area";
import CartItem from "./CartItem";
import { useEffect, useState } from "react";

export default function Cart() {

    const { items } = useCart();
    const itemCount = items.length;
    const fee = 1;
    const cartTotal = items.reduce((total, { product }) => { return total + product.price }, fee)

    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (isMounted) {

    }


    return (
        <Sheet>
            <SheetTrigger className="group -m-2 flex items-center p-2">
                <ShoppingCart
                    aria-hidden='true'
                    className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{isMounted ? itemCount : 0}</span>

            </SheetTrigger>

            <SheetContent className="">
                <SheetHeader className="text-center">
                    <SheetTitle className="text-center">Cart({isMounted ? itemCount : 0})</SheetTitle>
                </SheetHeader>

                {itemCount > 0 ? (
                    <>
                        <div className="flex w-full flex-col pr-6 mt-7">
                            <p className="font-semibold">Card Items</p>
                            <ScrollArea className="flex items-center justify-center">
                                {items.map(({ product }) => (
                                    <CartItem product={product} key={product.id} />
                                ))}
                            </ScrollArea>

                        </div>

                        <div className="space-y-4">
                            <Separator className="my-2" />
                            <div className="text-sm">
                                <div className="flex">
                                    <span className="flex-1">Shipping</span>
                                    <span>free</span>
                                </div>
                                <div className="flex">
                                    <span className="flex-1">Transation fee</span>
                                    <span>{formatPrice(fee, { currency: "INR" })}</span>
                                </div>
                                <div className="flex">
                                    <span className="flex-1">Total</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetTrigger asChild>
                                    <Link href={'/cart'}
                                        className={buttonVariants({
                                            className: 'w-full',
                                        })}
                                    >Continue to Checkout</Link>
                                </SheetTrigger>
                            </SheetFooter>
                        </div>
                    </>
                ) :
                    (
                        <>
                            <div className="flex items-center justify-center h-full flex-col ">
                                <div className="relative mb-4 h-60 w-60 "
                                    aria-hidden='true'
                                >
                                    <Image alt="Empty Cart" fill src={'/hippo-empty-cart.png'} />
                                </div>
                                <div className="text-lg font-medium">Your cart is empty</div>

                                <SheetTrigger asChild>
                                    <Link href={'/products'}
                                        className={buttonVariants({
                                            variant: 'link',
                                            className: "text-xs text-muted-foreground"
                                        })}
                                    >Add items to your cart to checkout</Link>
                                </SheetTrigger>

                            </div>

                        </>
                    )}

            </SheetContent>

        </Sheet>
    )
}
