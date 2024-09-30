'use client'
import React, { useState } from 'react'
import Image from 'next/image';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ChatBoxSmileIcon } from './ChatIcons';
import ChatBoxBottom from './ChatBoxBottom';
import { Message } from '@/types/types';


const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL;


export default function ChatBoxBody({ chatboxData, receiver }: { chatboxData: any, receiver: any }) {

    const { messages, selectedChat } = chatboxData
    const [chatMessages, setChatMessages] = useState<Message[]>(messages)
    const { userInfo } = useCurrentUser()

    const showProfilePic = (currentMessage: Message, nextMessage: Message | undefined) => {
        return !nextMessage || currentMessage.senderId !== nextMessage.senderId;
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const isNewDay = (currentMessage: Message, previousMessage: Message | undefined) => {
        if (!previousMessage) return true;
        const currentDate = new Date(currentMessage.createdAt).toDateString();
        const previousDate = new Date(previousMessage.createdAt).toDateString();
        return currentDate !== previousDate;
    };

    return (
        <>
            <PerfectScrollbar className="chat-conversation-box relative h-full sm:h-[calc(100vh_-_300px)]">
                <div className="min-h-[400px] space-y-3 p-4 pb-[68px] sm:min-h-[300px] sm:pb-0">

                    {chatMessages && chatMessages?.length > 0 ? (
                        <>
                            {chatMessages?.map((message: Message, i: number) => {
                                const nextMessage = chatMessages[i + 1];
                                const previousMessage = chatMessages[i - 1];
                                const showDateHeader = isNewDay(message, previousMessage);

                                return (
                                    <div key={message.id}>
                                        {showDateHeader && (
                                            <div className="m-6 mt-0 block ">
                                                <h4 className="relative border-b  border-[#f4f4f4] text-center text-xs dark:border-gray-800 ">
                                                    <span className="relative top-2 bg-white px-3 dark:bg-black">{formatDate(message.createdAt.toString())}</span>
                                                </h4>
                                            </div>
                                        )}

                                        <div className={`flex items-start gap-3 ${userInfo?.id === message.senderId ? 'justify-end' : ''}`}>
                                            <div className={`flex-none ${userInfo?.id === message.senderId ? 'order-2' : ''}`}>
                                                {showProfilePic(message, nextMessage) && userInfo?.id !== message.senderId ? (
                                                    <Image width={40} height={40} src={`${BASE_URL}/image/${receiver?.profilePic}`} className="rounded-full object-cover" alt="" />
                                                ) : ('')}
                                                {/* {userInfo?.id === message.senderId ? (<Image height={40} width={40} src={`${BASE_URL}/image/${userInfo?.profilePic}`} className="rounded-full object-cover" alt="" />) : ('')} */}
                                                {/* {userInfo?.id !== message.senderId ? (<Image width={40} height={40} src={`${BASE_URL}/image/${receiver?.profilePic}`} className="rounded-full object-cover" alt="" />) : ('')} */}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={` relative rounded-md bg-black/10 p-2 py-3 pr-11 dark:bg-gray-800 ${message.senderId === userInfo?.id ? '!bg-primary text-white rounded-br-none' : 'rounded-bl-none '}`}>
                                                    {message.content}
                                                    <div className={`absolute bottom-1 right-1  text-xs text-white-dark ${userInfo?.id === message.senderId ? 'ltr:text-right ltr:text-white-light rtl:text-left' : ''}`}>
                                                        {formatTime(message.createdAt.toString())}
                                                    </div>
                                                </div>

                                                <div className={`${userInfo?.id === message.senderId ? 'hidden' : ''}`}>
                                                    <ChatBoxSmileIcon />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    ) : null}
                </div>
            </PerfectScrollbar>
            <div className="absolute bottom-0 left-0 w-full p-4">
                <ChatBoxBottom receiver={receiver} selectedChat={selectedChat} setChatMessages={(msg: Message) => setChatMessages([...chatMessages, msg])} />
            </div>
        </>

    )
}
