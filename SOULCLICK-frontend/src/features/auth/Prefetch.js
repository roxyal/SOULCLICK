import { store } from '../../app/store'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Only run this when the components mount
// keep refreshing
const Prefetch = () => {
    // 'getUsers' is an END-POINT, give it a name usersList
    useEffect(() => {
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
    }, [])

    // the component returns the Outlet component which renders the nested routes
    // inside the parent route. This allows the child routes to access the prefetched data.
    return <Outlet />
}
export default Prefetch