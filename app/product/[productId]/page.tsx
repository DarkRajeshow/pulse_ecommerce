import AddToCartButton from "../../../components/AddToCartButton"
import ImageSlider from "../../../components/ImageSlider"
import MaxWidthWrapper from "../../../components/MaxWidthWrapper"
import ProductReel from "../../../components/ProductReel"
import { Button } from "../../../components/ui/button"
import { PRODUCT_CATEGORIES } from "../../../config"
import { getPayloadClient } from "../../../get-payload"
import { formatPrice } from "../../../lib/utils"
import { Check, Shield, Slash } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps {
    params: {
        productId: string
    }
}

const BREADCRUMS = [
    { id: 1, name: "Home", href: "/", },
    { id: 2, name: "Products", href: "/products" }
];


export default async function Page({ params }: PageProps) {

    const { productId } = params;
    const payload = await getPayloadClient();

    const { docs: products } = await payload.find({
        collection: "products",
        limit: 1,
        where: {
            id: {
                equals: productId
            },
            approvedForSale: {
                equals: 'approved'
            },
        }
    })

    const [product] = products;

    if (!product) return notFound();


    const validUrls = product?.images.map(({ image }) => typeof image === 'string' ? image : image.url
    ).filter(Boolean) as string[]



    const label = PRODUCT_CATEGORIES.find(category => category.value === product.category)?.label;


    return <MaxWidthWrapper className="bg-white ">
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                {/* product details */}

                <div className="lg:max-w-lg lg:row-start-1 lg:col-span-2 flex flex-col justify-start w-full">
                    <div className="w-full">
                        <ol className="flex items-center space-x-2">
                            {BREADCRUMS.map((breadcrum, i) => (
                                <li key={breadcrum.href}>
                                    <p className="flex items-center text-sm">
                                        <Link className="font-medium text-sm text-muted-foreground hover:text-gray-900" href={breadcrum.href} >
                                            {breadcrum.name}
                                        </Link>
                                        {i !== BREADCRUMS.length - 1 ? (
                                            <Slash className="text-gray-400 h-4 w-4 mx-1.5" />
                                        ) : null}
                                    </p>
                                </li>
                            ))}
                        </ol>

                        <div>
                            <h1 className="font-bold text-3xl text-gray-900 sm:text-4xl mt-1">{product.name}</h1>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center">
                                <p className="font-medium text-gray-900 "> {formatPrice(product.price)}</p>

                                <div className="ml-4 border-l text-muted-foreground border-gray-300 pl-4">
                                    {label}
                                </div>

                            </div>
                            <div className="mt-4 space-y-6">
                                <div className="text-base text-muted-foreground">
                                    {product.description}
                                </div>
                            </div>
                            <div className="mt-6 flex items-center">
                                <Check
                                    aria-hidden="true"
                                    className="h-5 w-5 flex-shrink-0 text-green-500"
                                >
                                </Check>
                                <p className="ml-2 text-sm text-muted-foreground">
                                    Eligible for instant delivery
                                </p>
                            </div>
                        </div>

                    </div>


                    {/* add to cart option */}

                    <div className="hidden lg:block mt-10 w-full lg:max-w-lg lg:self-start">
                        <div>
                            <AddToCartButton product={product} />
                            <div className="mt-6 text-center">
                                <div className="group inline-flex text-sm text-medium">
                                    <Shield
                                        aria-hidden='true'
                                        className="mr-2 h-5 w-5 flex-shrink-0 text-gray-600"
                                    />

                                    <span className="text-muted-foreground hover:text-gray-700">
                                        30 Day Return Policy
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* product images */}

                <div id="image-slider-container" className="mt-10 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:self-center">
                    <div className="aspect-square rounded-lg">
                        <ImageSlider urls={validUrls} />
                    </div>
                </div>

                {/* add to cart option */}

                <div className="lg:hidden mt-10 w-full lg:max-w-lg lg:self-start">
                    <div>
                        <AddToCartButton product={product} />
                        <div className="mt-6 text-center">
                            <div className="group inline-flex text-sm text-medium">
                                <Shield
                                    aria-hidden='true'
                                    className="mr-2 h-5 w-5 flex-shrink-0 text-gray-600"
                                />

                                <span className="text-muted-foreground hover:text-gray-700">
                                    30 Day Return Policy
                                </span>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>

        <ProductReel
            href="/products"
            query={{
                category: product.category,
                limit: 4
            }}
            title={`Similar ${label}`}
            subtitle={`Browse similar high quality ${label} just like ${product.name}`}
        />
    </MaxWidthWrapper>
}
