import { apiSlice } from "../../app/api/apiSlice";
/*
    createEntityAdapter allows us to have a selectID (which helps to extract for each collection)
*/

export const chatsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // invalidateTags dont need to include (result, error, arg). The reason is because, 
        // indicates that the list of users should be updated after a new user is added.
        createChat: builder.mutation({
            query: ({ senderId, receiverId }) => ({
                url: '/chats/createChat',
                method: 'POST',
                body: {
                    senderId,
                    receiverId
                }
            }),
            invalidatesTags: [
                { type: 'Chat', id: "LIST" }
            ]
        }),
        getUserChats: builder.query({
            query: ({ userId }) => ({
                url: '/chat/getChats',
                method: 'POST',
                body: {
                    userId
                },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        // collection of chats (LIST)
                        {type: 'Chat', id: 'LIST'},
                        // Individual chat
                        ...result.ids.map(id => ({ type: 'Chat', id }))
                    ]
                } else return [{ type: 'Chat', id: 'LIST' }]
            }
        }),
        findChat: builder.query({
            query: ({ senderId, receiverId }) => ({
                url: '/chat/getChats',
                method: 'POST',
                body: {
                    senderId,
                    receiverId
                },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        // collection of chats (LIST)
                        {type: 'Chat', id: 'LIST'},
                        // Individual chat
                        ...result.ids.map(id => ({ type: 'Chat', id }))
                    ]
                } else return [{ type: 'Chat', id: 'LIST' }]
            }
        }),
    }),
    
})

// Automatically generate the hook
export const {  useCreateChatMutation,
                useFindChatQuery,
                useGetUserChatsQuery
            } = chatsApiSlice

