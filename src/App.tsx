import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatPrincipal from "./components/paginaPrincipal/ChatPrincipal";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ChatPrincipal />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
