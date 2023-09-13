import { useState, useEffect } from "react"

/* 
    *localStorage* is a client-side web API provided by modern browsers that allows web developers
    to store key-value pairs locally in the user's browser.
    (Data is persistent and remains available even after the user closes the browser or turns off the computer. )

    The effect updates the persisted state in local storage using the
    localStorage.setItem method, converting the persist
    state variable to a JSON string using JSON.stringify

    localStorage - The first argument is the key of the item you want to
    store, and the second argument is the value you want to store.

    The JSON.stringify() method is used to convert a JavaScript object or array into a JSON
*/
const usePersist = () => {
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);
    
    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}
export default usePersist