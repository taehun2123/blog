import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";
import { Board } from "./pages/Board";
import { Post } from "./pages/Post";
import { EditPost } from "./pages/EditPost";

const Main = React.lazy(() => import("./pages/Main"));

function Router({ isFixed, targetComponentRef }) {
    return (
    <BrowserRouter>
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route
                    path="/"
                    element={
                    <Main isFixed={isFixed} targetComponentRef={targetComponentRef} />
                    }
                />
                <Route
                    path="/board/:type/:name"
                    element={<Board isFixed={isFixed} targetComponentRef={targetComponentRef}/>}
                />
                <Route
                    path="/post/:id"
                    element={<Post isFixed={isFixed} targetComponentRef={targetComponentRef}/>}
                />
                <Route
                    path="/edit"
                    element={<EditPost isFixed={isFixed} targetComponentRef={targetComponentRef}/>}
                />
                <Route
                    path="/edit/:id"
                    element={<EditPost isFixed={isFixed} targetComponentRef={targetComponentRef}/>}
                />
            </Routes>
        </Suspense>
    </BrowserRouter>
    );
}

export default Router;
