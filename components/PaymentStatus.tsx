

"use client"

import { trpc } from "../trpc/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface PaymentStatusProps {
    orderEmail: string,
    orderId: string,
    isPaid: boolean
}
export default function PaymentStatus({ orderEmail, orderId, isPaid }: PaymentStatusProps) {

    const { data } = trpc.payment.pollOrderStatus.useQuery({
        orderId
    }, {
        enabled: isPaid === false,
        refetchInterval: (data) => (data?.isPaid ? false : 100)
    })

    const router = useRouter();


    useEffect(() => {
        if (data?.isPaid) router.refresh()
    }, [data?.isPaid, router])

    
    return (
        <div className="mt-16 grid grid-cols-2 text-sm gap-x-4 text-gray-600">
            <div>
                <p className="font-medium text-gray-700">Shipping To  </p>
                <p>{orderEmail}</p>
            </div>

            <div>
                <p className="font-medium text-gray-900">Order status</p>
                <p>
                    {isPaid
                        ? "Payment Successful"
                        : "Payment Pending"
                    }
                </p>
            </div>
        </div>
    )
}
