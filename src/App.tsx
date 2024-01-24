import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatPrincipal from "./components/paginaPrincipal/ChatPrincipal";
import BarraHistorial from "./components/barraHistorial/BarraHistorial";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ChatPrincipal />} />
                    <Route path="/barraHistorial/:id" element={<BarraHistorial />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
