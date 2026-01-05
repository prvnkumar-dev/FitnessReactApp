import { Link } from "react-router-dom";
const pageError=()=>{
    return(
        <>
        <h1 className="text-danger text-center display-1 mt-4 text-bold" >PAGE NOT FOUND</h1>
        <p className="text-center mt-4"><Link to={"/"} className="text-danger">Go To Homepage</Link></p>
        </>
    );

};
export default pageError;