"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "./ui/button"
import { User } from "../payload-types"
import Link from "next/link"
import { LayoutDashboard, LogOut, Pointer } from "lucide-react"
import { useAuth } from "../hooks/use-auth"

export default function UserAccountNav({ user }: { user: User }) {

    const { signOut } = useAuth()
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild className="overflow-visible">
                <Button
                    variant={'secondary'}
                    size={'sm'}
                    className="relative"
                >
                    My Account
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-gray-50 rounded-md mt-1 w-60 p-2 mr-6 text-sm font-medium text-gray-600" align="end">
                <div className="flex flex-col items-start justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5 leading-none">
                        <p className="font-semibold text-sm text-black pb-2">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild
                        className="hover:!outline-none hover:text-gray-900">
                        <Link href={'/sell'} className="flex items-center justify-center gap-2">
                            <LayoutDashboard className="w-4 h-4 " /> Seller Dashboard
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:!outline-none hover:text-gray-900 ">
                        <p onClick={signOut} className="flex items-center justify-center gap-2 cursor-pointer"><LogOut className="w-4 h-4 " />  Log Out</p>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}
