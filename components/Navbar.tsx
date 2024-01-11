import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import Link from 'next/link'
import { CircleDashedIcon } from 'lucide-react'
import NavItems from './NavItems'
import { buttonVariants } from './ui/button'
import Cart from './Cart'
import { getServerSiderUser } from '../lib/payload-utils'
import { cookies } from 'next/headers'
import UserAccountNav from './UserAccountNav'

export default async function Navbar() {
    const nextCookies = cookies();
    const { user } = await getServerSiderUser(nextCookies)

    return (
        <div className='bg-white sticky z-50 top-0 inset-x-0 h-16 '>
            <header className='relative bg-white'>
                <MaxWidthWrapper>
                    <div className='border-b border-gray-200'>
                        <div className='flex h-16 items-center'>

                            {/* {mobile nav} */}
                            <div className='ml-4 flex lg:ml-0'>
                                <Link href={'/'}>
                                    <CircleDashedIcon className='' />
                                </Link>
                            </div>

                            <div className="hidden z-50 lg:block lg:ml-8 lg:self-stretch">
                                <NavItems />
                            </div>
                            <div className='ml-auto flex items-center'>
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                    {user ? null : <Link href={'/sign-in'} className={buttonVariants({
                                        variant: 'ghost'
                                    })}>
                                        Sign In
                                    </Link>}

                                    {user ? null : <span className='h-6 w-px bg-gray-300'
                                        aria-hidden="true"
                                    />}

                                    {user ? (
                                        <UserAccountNav user={user} />
                                    ) : <Link href={'/sign-up'} className={buttonVariants({
                                        variant: 'ghost'
                                    })}>
                                        create Account
                                    </Link>}

                                    {user ? null : <span className='h-6 w-px bg-gray-300'
                                        aria-hidden="true"
                                    />}

                                    <div className='ml-4 flow-root lg:ml-6'>
                                        <Cart />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MaxWidthWrapper>
            </header>
        </div>

    )
}
