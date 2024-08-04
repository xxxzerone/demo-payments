import React from 'react';
import {Routes, Route} from "react-router-dom";
import CheckoutPage from "./CheckoutPage";
import SuccessPage from "./SuccessPage";
import Fail from "./Fail"

function App() {
    return (
        <Routes>
            <Route path={"/"} element={<CheckoutPage/>}/>
            <Route path={"/sucess"} element={<SuccessPage/>}/>
            <Route path={"/fail"} element={<Fail/>}/>
        </Routes>
    );
}

export default App;
