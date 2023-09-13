import { RotatingLines } from "react-loader-spinner"

const LoaderSpinner = ({ color }) => {
    return (
        <div id="loader-spinner">
            <RotatingLines strokeColor={color} />
        </div>
    )
}
export default LoaderSpinner