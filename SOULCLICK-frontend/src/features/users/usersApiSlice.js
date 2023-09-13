import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

/*
    createEntityAdapter allows us to have a selectID (which helps to extract for each collection)
*/
const usersAdapter = createEntityAdapter({})
const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    // getUsers - Read will always be .query
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => ({
                url: '/users',
                // Check to see if the response from the server is sucesss/error
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            // Transform the responseData into a format that the Redux store can use
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                });
                // Set all users with a selectId (new user data)
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        // collection of users (LIST)
                        {type: 'User', id: 'LIST'},
                        // Individual user
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        // invalidateTags dont need to include (result, error, arg). The reason is because, 
        // indicates that the list of users should be updated after a new user is added.
        createNewUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                
                method: 'POST',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        // Needs (result, error, arg) as it needs to know the id of the user that has been updated.
        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: 'LIST'}
            ]
        }),
        // Delete a user we just need to have its id will do
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/users',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: 'LIST'}
            ]
        }),
        // Liked a User we just need to have our own id and the user we liked ID
        likedUser: builder.mutation({
            query: ({ userId, likedUserId }) => ({
                url: '/users/like',
                method: 'POST',
                body: { userId, likedUserId }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ],
            onCompleted: (response) => {
                // Check if 'matched' property exists in the response
                const matched = response.data.matched; // Adjust the extraction based on the actual response structure
                return { matched };
              },
        }),

        // Skipped a User we just need to have our own id and the user we skipped ID
        skippedUser: builder.mutation({
            query: ({ userId, skippedUserId }) => ({
                url: '/users/skip',
                method: 'PATCH',
                body: { userId, skippedUserId }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: 'LIST'}
            ]
        }),
        getAvailableUsers: builder.query({
            query: ({ userId }) => ({
                url: '/users/availableUsers',
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
                        // collection of users (LIST)
                        {type: 'User', id: 'LIST'},
                        // Individual user
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
    }),
    
})

// Automatically generate the hook
export const { useGetUsersQuery,
               useCreateNewUserMutation,
               useUpdateUserMutation,
               useDeleteUserMutation, 
               useSortedUsersQuery,
               useLikedUserMutation,
               useSkippedUserMutation,
               useGetAvailableUsersQuery } = usersApiSlice

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)
