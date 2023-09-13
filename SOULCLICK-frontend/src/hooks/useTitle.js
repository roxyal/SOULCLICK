import { useEffect } from "react"

// This hook helps to update the page title
// Assigning new title 
const useTitle = (title) => {

    useEffect(() => {
        const prevTitle = document.title
        document.title = title

        return () => document.title = prevTitle
    }, [title])

}
export default useTitle