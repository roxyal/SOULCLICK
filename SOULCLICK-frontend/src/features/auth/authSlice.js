import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth', // Give the authSlice a name 'auth'
    initialState: { token: null }, // initial state will hve a property of token
    reducers: {
        // When you login, state.token = (the accessToken)
        setCredentials: (state, action) => {
            const { accessToken } = action.payload
            state.token = accessToken
        },
        // When you logout, tokens will be set back to null
        logOut: (state, action) => {
            state.token = null
        },
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

// state.auth (auth is the name of the authSlice)
// state.auth.token (equals to the current state of the auth and its token)
export const selectCurrentToken = (state) => state.auth.token