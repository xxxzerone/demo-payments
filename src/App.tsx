import React from 'react';
import {Routes, Route} from "react-router-dom";
import CheckoutPage from "./CheckoutPage";

function App() {
  return (
      <Routes>
        <Route path={"/sandbox"} element={<CheckoutPage />}/>
      </Routes>
  );
}

export default App;
