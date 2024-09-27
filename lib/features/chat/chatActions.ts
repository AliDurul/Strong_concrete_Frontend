'use server'

import { auth } from "@/auth";

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL;

const authConfig = async () => {
    const session = await auth();
    const accessToken = session?.accessToken;

    return {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };
};


export const getAllChats = async () => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}/chats/`, {
            cache: "no-cache",
            headers,
        });
        const data = await response.json();

        if (response.ok) {
            return data.userChats;
        } else {
            throw new Error(data.message || "Something went wrong, Please try again!");
        }

    } catch (error: any) {
        return { error: error.message };
    }
};

export const getMessagesForChat = async (chatId: number) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}/chats/message/${chatId}`, {
            cache: "no-cache",
            headers,
        });
        const data = await response.json();

        if (response.ok) {
            return data.messages;
        } else {
            throw new Error(data.message || "Something went wrong, Please try again!");
        }

    } catch (error: any) {
        return { error: error.message };
    }
};

export const postMessage = async (chatId: number, messageData: { receiverId: number, content: string }) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}/chats/message/${chatId}`, {
            cache: "no-cache",
            headers,
            method: "POST",
            body: JSON.stringify(messageData),

        });
        const data = await response.json();

        if (response.ok) {
            return data.message;
        } else {
            throw new Error(data.message || "Something went wrong, Please try again!");
        }

    } catch (error: any) {
        return { error: error.message };
    }
};

export const deleteChat = async (id: any) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}ticket-room/${id}/`, {
            method: "DELETE",
            headers,
        });

        const data = await response.json();

        if (response.status === 200) {
            return { message: data.message, remainingData: data.data };
        } else {
            throw new Error(data.detail ?? "Something went wrong, Please try again!");
        }

    } catch (error: any) {
        return { error: error.message };
    }
};

// export const deleteMultiTicket = async (ids: any) => {
//     const headers = await authConfig();

//     try {
//         const response = await fetch(`${BASE_URL}/sales/multiple-delete`, {
//             method: "POST",
//             headers,
//             body: JSON.stringify({ ids }),
//         });

//         const data = await response.json();

//         if (!data.error && response.status === 202) {
//             return { message: data.message, remainingData: data.data };
//         } else {
//             throw new Error(data.message ?? "Something went wrong, Please try again!");
//         }

//     } catch (error: any) {
//         return { error: error.message };
//     }
// };

export const readChat = async (id: string) => {
    const headers = await authConfig();

    try {
        const response = await fetch(`${BASE_URL}ticket-room/${id}/`, {
            headers,
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.detail || "Something went wrong, Please try again!");
        }

    } catch (error: any) {
        return { error: error.message };
    }

}

export const updateChat = async (roomData: any) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}ticket-room/${roomData.id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(roomData),
        });

        const data = await response.json();
        if (response.ok && data.isUpdated) {
            return { message: "Successfully Updated!" };
        } else {
            throw new Error(
                data.message || "Something went wrong, Please try again!"
            );
        }
    } catch (error: any) {
        return { error: error.message };
    }
};

export const createChat = async (roomData: any) => {
    const headers = await authConfig();
    try {
        const response = await fetch(`${BASE_URL}ticket-categories/`, {
            method: "POST",
            headers,
            body: JSON.stringify(roomData),
        });

        const data = await response.json();
        if (response.ok) {
            return { message: "Successfully Created!", data };
        } else {
            throw new Error(
                data.message || "Something went wrong, Please try again!"
            );
        }
    } catch (error: any) {
        return { error: error.message };
    }
};