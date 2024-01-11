import PaymentStatus from "../../components/PaymentStatus";
import { PRODUCT_CATEGORIES } from "../../config";
import { getPayloadClient } from "../../get-payload";
import { getServerSiderUser } from "../../lib/payload-utils";
import { formatPrice } from "../../lib/utils";
import { Product, ProductFile, User } from "../../payload-types";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

export default async function Page({ searchParams }: PageProps) {

    const orderId = searchParams.orderId;

    const nextCookies = cookies();

    const { user } = await getServerSiderUser(nextCookies)

    const payload = await getPayloadClient();

    const { docs: orders } = await payload.find({
        collection: "orders",
        depth: 2,
        where: {
            id: {
                equals: orderId
            }
        }
    })

    const [order] = orders;

    if (!order) {
        return notFound();
    }

    const orderUserId = typeof order.user === 'string'
        ? order.user
        : order.user.id

    if (orderUserId !== user?.id) {
        return redirect(`/sign-in?origin=thank-you?orderId=${order.id}`)
    }

    const products = order.products as Product[];
    const orderTotal = products.reduce((total, product) => total + product.price, 0)

    return (
        <main className="relative lg:min-h-full">
            <div className="hidden lg:block mx-auto h-80 overflow-hidden lg:h-full lg:w-1/2 ">
                <Image
                    height={400}
                    width={400}
                    src={'/checkout-thank-you.jpg'}
                    alt="Thank you image"
                    className="mx-auto"
                />

                <div className="mx-auto max-w-2xl px-4 py-16 ">
                    <div className="lg:col-start-2 ">
                        <p className="text-sm font-medium text-blue-300">
                            Order Successful
                        </p>
                        <h1 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
                            Thanks for ordering
                        </h1>

                        {order._isPaid ? <p className="mt-2 text-base text-muted-foreground">Your order was processed and your assets are available to download below. we&apos;ve sent your receipt and order details to {" "} {typeof order.user !== "string" ? (
                            <span className="font-medium text-gray-900">
                                {order.user.email}
                            </span>
                        ) : null} </p> : <p className="mt-2 font-medium text-muted-foreground">
                            we appreciate your order, and we&apos;re currently processing it. So hang on tight and we&apos;ll send you confirmation very soon!
                        </p>}

                        <div className="mt-16 text-sm font-medium">
                            <div className="text-muted-foreground">
                                order no.
                            </div>
                            <div className="mt-2 text-gray-900">
                                {order.id}
                            </div>
                            <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                                {(order.products as Product[]).map((product, i) => {
                                    const label = PRODUCT_CATEGORIES.find(({ value }: { value: string }) => value === product.category)?.label;

                                    const downloadUrl = (product.product_files as ProductFile).url as string

                                    const { image } = product.images[0];

                                    return (
                                        <li key={i} className="flex space-x-6 py-6">
                                            <div className="relative h-24 w-24">
                                                {typeof image !== "string" && image.url ? (
                                                    <Image fill alt={product.name}
                                                        src={image.url}
                                                    />
                                                ) : null}
                                            </div>

                                            <div className="flex-auto flex flex-col justify-between">
                                                <div className="space-y-1">
                                                    <h3 className="text-gray-300">
                                                        {product.name}
                                                    </h3>

                                                    <p className="my-1">
                                                        Category : {label}
                                                    </p>

                                                </div>

                                                {order._isPaid ? (
                                                    <a
                                                        download={product.name}
                                                        href={downloadUrl}
                                                        className="text-blue-600 hover:underline underline-offset-2"
                                                    >Download Asset</a>
                                                ) : null}
                                            </div>

                                            <p className="flex-none font-medium text-gray-900">
                                                {formatPrice(product.price)}
                                            </p>
                                        </li>
                                    )
                                })}
                            </ul>

                            <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
                                <div className="flex justify-between text-gray-900">
                                    <p className="">Subtotal</p>
                                    <p className="">{formatPrice(orderTotal)}</p>
                                </div>
                                <div className="flex justify-between text-gray-900">
                                    <p>Transation fee</p>
                                    <p>{formatPrice(1)}</p>
                                </div>
                                <div className="flex items-center border-y border-gray-200 pt-6 justify-between text-base text-gray-900">
                                    <p>Total</p>
                                    <p>{formatPrice(orderTotal + 1)}</p>
                                </div>
                            </div>

                            <PaymentStatus orderEmail={(order.user as User).email} orderId={order.id} isPaid={order._isPaid} />

                            <div className="mt-16 border-t border-gray-200 py-4 text-right">
                                <Link
                                    href={'/products'}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                    Continue shopping &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main >

    )
}
