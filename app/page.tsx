import MaxWidthWrapper from "../components/MaxWidthWrapper";
import ProductReel from "../components/ProductReel";
import { Button, buttonVariants } from "../components/ui/button";
import { cn } from "../lib/utils";
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  const prons = [
    {
      name: "Instant Delivery",
      Icon: ArrowDownToLine,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa dolores repellat dignissimos eum placeat excepturi."
    },
    {
      name: "Quality products",
      Icon: CheckCircle,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa dolores repellat dignissimos eum placeat excepturi."
    },
    {
      name: "Nice texture",
      Icon: Leaf,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa dolores repellat dignissimos eum placeat excepturi."
    }
  ]
  return (
    <>
      <MaxWidthWrapper className="">

        <div className=" py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">Your marketplace for high-quality{' '}
            <span className="text-blue-600">digital assets</span> </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">Welcome to Pulse eCommerce. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas maiores porro corporis est dolore excepturi soluta labore veniam ab fuga.</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link className={cn(buttonVariants(), 'font-medium text-base ')} href={'/products'}>Browse Trending</Link>
            <Button variant={"ghost"} className='font-medium text-base'>Our quality promise <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
            </svg>
            </Button>
          </div>
        </div>

        <ProductReel query={{ sort: "desc", limit: 4 }} href="/products" title="Brand new " />
        {/* {Todo : list products} */}
      </MaxWidthWrapper>

      <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="grid gap-y-12 sm:grid-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:grid-x-8">
            {prons.map((pron, index) => {
              return <div key={index} className="m-auto text-center px-10">
                <div className="inline-block rounded-full bg-blue-200 p-5">
                  {<pron.Icon className="text-xl " />}
                </div>
                <div className="text py-4 ">
                  <h3 className="font-medium">{pron.name}</h3>
                  <p className="text-sm text-gray-600 py-2">{pron.description}</p>
                </div>
              </div>
            })}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  )
}
