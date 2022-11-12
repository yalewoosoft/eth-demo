import {useLoaderData} from "react-router-dom";

export async function loader({params}) {
    return params.address;
}

function SNProfile() {
    const address = useLoaderData();
    return (
        <h1>SNProfile: {address}</h1>
    )
}

export default SNProfile;
