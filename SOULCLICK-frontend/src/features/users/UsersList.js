import { useGetUsersQuery } from "./usersApiSlice";
import PulseLoader from "react-spinners/PulseLoader"

const UserList = () => {
    
    const { 
            data: users,
            isLoading,
            isSuccess,
            isError, 
            error 
    } = useGetUsersQuery('usersList', { // Giving the useGetUsersQuery a name called 'usersList' we will be able to see in redux chrome
        pollingInterval: 60000, // the polling interval is execute every 60s
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
})

    let content

    if (isLoading) content = <PulseLoader color={"#FFF"} />

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }
}
export default UserList