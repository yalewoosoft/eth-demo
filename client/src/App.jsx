import { EthProvider } from "./contexts/EthContext";
import "./App.css";
import SNApp from "./components/SocialNetwork/SNApp";
import SNNavBar from "./components/SocialNetwork/SNNavBar";
import {createBrowserRouter, createHashRouter, Outlet, RouterProvider} from "react-router-dom";
import SNFollowingPosts from "./components/SocialNetwork/SNFollowingPosts";
import SNFollowing from "./components/SocialNetwork/SNFollowing";
import SNProfile, {loader as addressLoader} from "./components/SocialNetwork/SNProfile";
const HeaderLayout = () => (
    <>
        <header>
            <SNNavBar />
        </header>
        <Outlet />
    </>
);
const router = createHashRouter([
    {
        element: <HeaderLayout />,
        children: [
            {
                path: "/",
                element: <SNApp/>,
            },
            {
                path: "/following_posts",
                element: <SNFollowingPosts />
            },
            {
                path: "/following",
                element: <SNFollowing />
            },
            {
                path: "/profile/:address",
                element: <SNProfile />,
                loader: addressLoader
            },
        ]
    }
])

function App() {
  return (
    <EthProvider>
        <RouterProvider router={router} />
    </EthProvider>
  );
}

export default App;
