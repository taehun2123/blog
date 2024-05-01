import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";

const Main = React.lazy(() => import("./pages/Main"));
const Board = React.lazy(() => import("./pages/Board"));

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
                    path="/board/:id"
                    element={<Board isFixed={isFixed} targetComponentRef={targetComponentRef}/>}
                />
            </Routes>
        </Suspense>
    </BrowserRouter>
    );
}

export default Router;
