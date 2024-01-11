"use client"

import { Button, buttonVariants } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { cn } from "../../../lib/utils"
import { trpc } from "../../../trpc/client"
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleDashed, Pointer } from "lucide-react"
import Link from "next/link"
import { useForm } from 'react-hook-form'
import { ZodError, z } from 'zod'

import { toast } from 'sonner'
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {


    const router = useRouter();
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

    const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
        onError: (err) => {
            if (err.data?.code === "CONFLICT") {
                toast.error("This email is already in use. Sign in Instead")
                return
            }

            if (err instanceof ZodError) {
                toast.error(err.issues[0].message);
                return;
            }

            toast.error('something went wrong. Please try again')
        },
        onSuccess: ({ sentEmail }) => {
            toast.success(`Verfification email sent to ${sentEmail}.`)
            router.push('/verify-email?to=' + sentEmail)
        }
    })

    // console.log(data);


    const onSubmit = ({ email, password }: TAuthCredintialsValidator) => {
        mutate({ email, password })
    }

    return (
        <div className="flex flex-col items-center justify-center h-[80vh] w-[320px] mx-auto">
            <CircleDashed className="h-14 w-14" />
            <h1 className="font-semibold mt-5 text-xl">Create an account</h1>
            <Link href={"/sign-in"} className={buttonVariants({
                className: 'font-medium',
                variant: "link"
            })}>Already have an account, Sign in here<Pointer className="ml-1 h-4 w-4" /></Link>

            <div className="grid gap-6 w-full">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-3 py-2 w-full">
                        <div className="grid gap-1 py-2 w-full">
                            <Label htmlFor="email" className="mb-1">Email</Label>
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
                            <Label htmlFor="email"
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
                        <Button className="font-bold">Create account</Button>
                    </div>
                </form>

               
            </div>
        </div>
    )
}