'use client'
import { selectActiveUsers } from '@/lib/features/user/userSlice'
import { useAppSelector } from '@/lib/hooks'
import React from 'react'
import ChatBurgerBtn from './ChatBurgerBtn'
import Image from 'next/image'


const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL;

export default function ChatBoxUserDetail({ selectedChat, receiver }: { selectedChat: any, receiver: any }) {
    const activeUsers = useAppSelector(selectActiveUsers)

    return (

        <div className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
            <ChatBurgerBtn />
            <div className="relative flex-none">
                <Image
                    width={40}
                    height={40}
                    src={`${selectedChat?.isGroupChat ? `${BASE_URL}/image/${selectedChat?.chatPicture || '/assets/images/profile.png'}` : `${BASE_URL}/image/${receiver?.profilePic || '/assets/images/profile.png'}`}`}
                    className="rounded-full object-cover sm:h-12 sm:w-12" alt="" />

                {
                    !selectedChat.isGroupChat && activeUsers.some(user => user.userId === receiver?.id) && (
                        <div className="absolute bottom-0 ltr:right-0 rtl:left-0">
                            <div className="size-3 rounded-full bg-success"></div>
                        </div>
                    )
                }
            </div>
            <div className="mx-3">
                <p className="font-semibold">{selectedChat.isGroupChat ? `${selectedChat?.chatName}` : `${receiver?.firstName} ${receiver?.lastName}`}</p>
                <p className="text-xs text-white-dark">{ activeUsers.some(user => user.userId === receiver?.id) ? 'Active now' : 'Last seen at ' + '...'}</p>
            </div>
        </div>

    )
}
