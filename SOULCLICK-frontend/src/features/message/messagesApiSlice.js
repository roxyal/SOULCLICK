import { apiSlice } from "../../app/api/apiSlice";
/*
    createEntityAdapter allows us to have a selectID (which helps to extract for each collection)
*/
export const messagesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // invalidateTags dont need to include (result, error, arg). The reason is because, 
        // indicates that the list of users should be updated after a new user is added.
        addMessage: builder.mutation({
            query: ({ chatId, senderId, text }) => ({
                url: '/message/addMessage',
                method: 'POST',
                body: {
                    chatId,
                    senderId,
                    text
                }
            }),
            invalidatesTags: [
                { type: 'Message', id: "LIST" }
            ]
        }),
        getMessages: builder.query({
            query: ({ chatId }) => ({
                url: '/message/getMessages',
                method: 'POST',
                body: {
                    chatId
                },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        // collection of chats (LIST)
                        {type: 'Message', id: 'LIST'},
                        // Individual chat
                        ...result.ids.map(id => ({ type: 'Message', id }))
                    ]
                } else return [{ type: 'Message', id: 'LIST' }]
            }
        }),
    }),
    
})

// Automatically generate the hook
export const {  useAddMessageMutation,
                useGetMessagesQuery
            } = messagesApiSlice

