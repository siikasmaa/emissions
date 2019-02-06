import React from "react";
import {render} from 'react-dom';
import Home from "./pages/home";

const target = document.getElementById('root');

render(
    <div>
        <Home/>
    </div>,
    target
);