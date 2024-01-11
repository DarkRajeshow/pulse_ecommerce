"use client"
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";
import { useCart } from "../hooks/use-cart";
import { Product } from "../payload-types";

export default function AddToCartButton({ product }: { product: Product }) {

    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    const { addItem } = useCart();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsSuccess(false)
        }, 2000)

        return () => clearTimeout(timeout)

    }, [isSuccess])


    return (
        <Button

            onClick={() => {
                addItem(product);
                setIsSuccess(true)
            }}
            size={'lg'}
            className="w-full"
        >
            {isSuccess ? <span className="flex gap-2 items-center justify-center">Added! <CheckCircle className="text-green-200 h-4 w-4" /> </span> : "Add to cart"}
        </Button>
    )
}
