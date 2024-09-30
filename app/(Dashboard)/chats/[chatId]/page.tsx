import React from 'react'
import { ChatBoxCallIcons, ChatBoxDeletecons, ChatBoxShareIcons, ChatBoxSmileIcon, ChatBoxVideoCallIcons, SettingIcon } from '../_components/ChatIcons';
import ChatBoxBody from '../_components/ChatBoxBody';
import { getChat } from '@/lib/features/chat/chatActions';
import Image from 'next/image';
import ChatBurgerBtn from '../_components/ChatBurgerBtn';
import { auth } from '@/auth';
import Dropdown from '@/app/components/Layout/Dropdown';

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL;

export default async function ChatBoxPage({ params }: { params: { chatId: string } }) {

    const chatboxData = await getChat(params?.chatId)
    const { selectedChat } = chatboxData
    const session = await auth()
    const userInfo = session?.user
    const receiver = selectedChat?.chatUsers?.find((member: any) => member.id !== userInfo?.id)

    return (
        <div className="relative h-full">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                    <ChatBurgerBtn />
                    <div className="relative flex-none">
                        <Image
                            width={40}
                            height={40}
                            src={`${selectedChat?.isGroupChat ? `${BASE_URL}/image/${selectedChat?.chatPicture || '/assets/images/profile.png'}` : `${BASE_URL}/image/${receiver?.profilePic || '/assets/images/profile.png'}`}`}
                            className="rounded-full object-cover sm:h-12 sm:w-12" alt="" />
                        <div className="absolute bottom-0 ltr:right-0 rtl:left-0">
                            <div className="h-4 w-4 rounded-full bg-success"></div>
                        </div>
                    </div>
                    <div className="mx-3">
                        <p className="font-semibold">{selectedChat.isGroupChat ? `${selectedChat?.chatName}` : `${receiver?.firstName} ${receiver?.lastName}`}</p>
                        <p className="text-xs text-white-dark">{true ? 'Active now' : 'Last seen at ' + 10}</p>
                    </div>
                </div>
                <div className="flex gap-3 sm:gap-5">
                    <button type="button">
                        <ChatBoxCallIcons />
                    </button>

                    <button type="button">
                        <ChatBoxVideoCallIcons />
                    </button>
                    <div className="dropdown">
                        <Dropdown
                            placement={'bottom-end'}
                            btnClassName="bg-[#f4f4f4] dark:bg-[#1b2e4b] hover:bg-primary-light w-8 h-8 rounded-full !flex justify-center items-center"
                            button={
                                <svg className="rotate-90 opacity-70 hover:text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            }
                        >
                            <ul className="text-black dark:text-white-dark">
                                <li>
                                    <button type="button">
                                        <svg className="ltr:mr-2 rtl:ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"></circle>
                                            <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                        </svg>
                                        Search
                                    </button>
                                </li>
                                <li>
                                    <button type="button">
                                        <ChatBoxDeletecons />
                                        Delete
                                    </button>
                                </li>
                                <li>
                                    <button type="button">
                                        <ChatBoxShareIcons />
                                        Share
                                    </button>
                                </li>
                                <li>
                                    <button type="button">
                                        <SettingIcon />
                                        Settings
                                    </button>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>

            <ChatBoxBody chatboxData={chatboxData} receiver={receiver} />


        </div>
    )
}
