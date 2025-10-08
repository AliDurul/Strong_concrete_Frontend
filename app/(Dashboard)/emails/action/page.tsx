'use client';

import { fetchAllEmailsAsync, selectDefaultParams, selectFolderId, selectIsShowMailMenu, setIsEdit, setIsShowMailMenu, setSelectedTab, updateEmailState } from "@/lib/features/email/emailSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { coloredToast } from "@/utils/sweetAlerts";
import { forwardMessage, replyMessage, sendMessage } from "@/lib/features/email/emailActions";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function MailActionPage() {
    const isShowMailMenu = useAppSelector(selectIsShowMailMenu);
    const defaultParams = useAppSelector(selectDefaultParams);
    const folderId = useAppSelector(selectFolderId);
    const router = useRouter()
    const dispatch = useAppDispatch()

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const closeMsgPopUp = () => {
        dispatch(setIsEdit(false))
        dispatch(setSelectedTab('Inbox'));
        router.back()
        // searchMails();
    };

    const saveMail = async (type: any, id: any,) => {
        if (!params.to) {
            coloredToast('warning', 'To email address is required.');
            return false;
        }
        if (!params.title) {
            coloredToast('warning', 'To email address is required.');
            return false;
        }

        if (type === 'save' || type === 'save_reply' || type === 'save_forward') {
            //saved to Drafts
            // obj.type = 'Drafts';
            // mailList.splice(0, 0, obj)
            // searchMails();
            coloredToast('success', 'Mail has been saved successfully to Drafts.');

        } else if (type === 'reply') {

            const dataSend = {
                "message": {
                    "toRecipients": [
                        {
                            "emailAddress": {
                                "address": params.to
                            }
                        }
                    ]
                },
                "comment": `
                ${params.comment}
                <p><br></p>
                <p><br></p>
                <p><span style=\"color: black;\"><span class=\"ql-cursor\">﻿</span>Thanks &amp; Regards</span></p>
                <p><span style=\"color: black;\">JACOB SHONGA</span></p>
                <p><strong>PayLink Technologies Zambia Limited,&nbsp;</strong></p>
                <p>2nd Floor Finance House, Heroes Place, Cairo Road, Lusaka, Zambia</p>
                <p>Mobile: +260 973834511 | Website: www.paylinkzm.com</p>
                `
            }

            const res = await replyMessage(params.id, dataSend);
            if (res && res.error) {
                coloredToast('error', res.error);
                return;
            }
            dispatch(fetchAllEmailsAsync(folderId))
            router.back()

            // searchMails();
            coloredToast('success', 'Mail has been sent successfully.');

        } else if (type === 'send') {

            interface EmailRecipient {
                emailAddress: {
                    address: string;
                };
            }

            interface EmailMessage {
                subject: string;
                body: {
                    contentType: string;
                    content: string;
                };
                toRecipients: EmailRecipient[];
                ccRecipients?: EmailRecipient[]; // Optional property
            }

            interface EmailData {
                message: EmailMessage;
                saveToSentItems: string;
            }

            const dataSend: EmailData = {
                "message": {
                    "subject": params.title,
                    "body": {
                        "contentType": "html",
                        "content": params.comment
                    },
                    "toRecipients": [
                        {
                            "emailAddress": {
                                "address": params.to
                            }
                        }
                    ],
                },
                "saveToSentItems": "true"
            }

            if (params.cc) {
                dataSend.message.ccRecipients = [
                    {
                        "emailAddress": {
                            "address": params.cc
                        }
                    }
                ]
            }
            const res = await sendMessage(dataSend)

            if (res && res.error) {
                coloredToast('error', res.error);
                return;
            }
            // searchMails();
            router.back()
            coloredToast('success', 'Mail has been sent successfully.');


        } else if (type === 'forward') {

            const dataSend = {
                // "comment": params.comment,
                "toRecipients": [
                    {
                        "emailAddress": {
                            "address": params.cc
                        }
                    }
                ]
            }

            const res = await forwardMessage(dataSend, params.id);
            if (res && res.error) {
                coloredToast('danger', res.error);
                return;
            }
            dispatch(fetchAllEmailsAsync(folderId))
            router.back()

            // searchMails();
            coloredToast('success', 'Mail has been forwarded successfully.');

        }

        dispatch(updateEmailState(null))
        dispatch(setIsEdit(false))

    };

    return (
        <div className="relative">
            <div className="flex items-center py-4 px-6">
                <button type="button" className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden" onClick={() => dispatch(setIsShowMailMenu(!isShowMailMenu))}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Message</h4>
            </div>
            <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>
            <form className="grid gap-6 p-6">
                <div>
                    <label htmlFor="to" className='text-gray-600'>To:</label>
                    <input
                        id="to"
                        type="text"
                        className="form-input"
                        placeholder="Enter To"
                        defaultValue={params.to}
                        onChange={(e) => {
                            changeValue(e);
                        }}
                    />
                </div>

                <div>
                    <input id="cc" type="text" className="form-input" placeholder="Enter Cc" defaultValue={params.cc} onChange={(e) => changeValue(e)} />
                </div>

                <div >
                    <label htmlFor="title" className='text-gray-600'>Subject:</label>
                    <input id="title" type="text" className="form-input" placeholder="Enter Subject" defaultValue={params.title} onChange={(e) => changeValue(e)} />
                </div>


                <ReactQuill
                    theme="snow"
                    value={params.comment}
                    // defaultValue={params.comment || '' }
                    onChange={(content, delta, source, editor) => {
                        const updatedComment = editor.getHTML();
                        setParams({ ...params, comment: updatedComment });
                    }}

                    style={{ minHeight: '200px' }}
                />

                <div>
                    <input
                        type="file"
                        className="form-input p-0 file:border-0 file:bg-primary/90 file:py-2 file:px-4 file:font-semibold file:text-white file:hover:bg-primary ltr:file:mr-5 rtl:file:ml-5"
                        multiple
                        accept="image/*,.zip,.pdf,.xls,.xlsx,.txt.doc,.docx"
                        required
                    />
                </div>
                <div className="mt-8 flex items-center ltr:ml-auto rtl:mr-auto">
                    <button type="button" className="btn btn-outline-danger ltr:mr-3 rtl:ml-3" onClick={closeMsgPopUp}>
                        Close
                    </button>
                    <button type="button" className="btn btn-success ltr:mr-3 rtl:ml-3" onClick={() => saveMail('save', null)}>
                        Save
                    </button>
                    {
                        params.id && (<button type="button" className="btn btn-success ltr:mr-3 rtl:ml-3" onClick={() => saveMail('forward', null)}>
                            Forward
                        </button>)
                    }
                    <button type="button" className="btn btn-primary" onClick={() => saveMail(params.id ? "reply" : "send", params.id)}>
                        {params.id ? "Reply" : "Send"}
                    </button>
                </div>
            </form>
        </div>
    )
}