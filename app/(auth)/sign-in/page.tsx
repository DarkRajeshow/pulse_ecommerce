"use client"


import { Button, buttonVariants } from "../../../components/ui/button"
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleDashed, Pointer } from "lucide-react"
import Link from "next/link"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { trpc } from '../../../trpc/client'
import { cn } from '../../../lib/utils'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Input } from '../../../components/ui/input'


export default function Page() {

    const searchParams = useSearchParams();
    const router = useRouter();
    const isSeller = searchParams.get('as') === 'seller'
    const origin = searchParams.get('origin')

    const continueAsSeller = () => {
        router.push("?as=seller")
    }

    const continueAsBuyer = () => {
        router.replace("/sign-in", undefined)
    }

    const [showPassword, setShowPassword] = useState(false);

    const AuthCredintialsValidator = z.object({
        email: z.string().email(),
        password: z.string().min(8, {
            message: 'Password must be at least 8 characters long.'
        })
    })

    type TAuthCredintialsValidator = z.infer<typeof AuthCredintialsValidator>

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TAuthCredintialsValidator>({
        resolver: zodResolver(AuthCredintialsValidator),
    });

    const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({

        onSuccess: () => {
            toast.success("Signed in successfully")

            router.refresh()

            if (origin) {
                router.push(`/${origin}`)
                return
            }

            if (isSeller) {
                router.push('/sell')
                return
            }

            router.push('/')
        },
        onError: (err) => {
            if (err.data?.code === "UNAUTHORIZED") {
                toast.error("Invalid email or password.")
                return
            }
        },
    })

    // console.log(data);


    const onSubmit = ({ email, password }: TAuthCredintialsValidator) => {
        signIn({ email, password })
    }

    return (
        <div className="flex flex-col items-center justify-center h-[80vh] w-[320px] mx-auto ">
            <CircleDashed className="h-14 w-14" />
            <h1 className="font-semibold mt-5 text-xl text-center">Sign in to your {isSeller && "Seller"} account</h1>
            <Link href={"/sign-up"} className={buttonVariants({
                className: 'font-medium',
                variant: "link"
            })}>Don&apos;t have an account, Register here<Pointer className="ml-1 h-4 w-4" /></Link>

            <div className="grid gap-6 w-full">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-3 py-2 w-full">
                        <div className="grid gap-1 py-2 w-full">
                            <Label className="mb-1">Email</Label>
                            <Input
                                autoComplete={"false"}
                                {...register('email')}
                                type="email"
                                className={cn({
                                    'focus-visible:ring-red-500': errors.email
                                })}
                                placeholder="you@example.com"
                            />
                            {errors?.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="grid gap-1 py-2" >
                            <Label
                                className=" mb-1 flex justify-between "
                            ><p>Choose Password </p> <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-xs font-medium"
                            >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button></Label>

                            <Input
                                {...register('password')}
                                type={showPassword ? 'text' : 'password'}
                                className={cn({
                                    'focus-visible:ring-red-500': errors.password
                                })}
                                placeholder="password"
                            />

                            {errors?.password && (
                                <p className="text-xs text-red-500">{errors.password?.message}</p>
                            )}
                        </div>
                        <Button className="font-bold">Log In</Button>
                    </div>
                </form>

                <div className="relative">
                    <div
                        aria-hidden='true'
                        className="absolute inset-0 flex items-center"
                    >
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            or
                        </span>
                    </div>
                </div>

                {isSeller ? (
                    <Button
                        onClick={continueAsBuyer}
                        variant={'secondary'}
                        disabled={isLoading}
                    >Continue as customer</Button>
                ) : (
                    <Button
                        onClick={continueAsSeller}
                        variant={'secondary'}
                        disabled={isLoading}
                    >Continue as seller</Button>
                )}
            </div>
        </div>
    )
}