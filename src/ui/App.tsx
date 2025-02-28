import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router";
import {Start} from "./start/Start.tsx";
import {Main} from "./main/Main.tsx";
// @ts-expect-error jaa
import "./index.css"
import {basePath} from "./config.ts";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename={basePath}>
        <Routes>
            <Route index element={<Start/>}/>
            <Route path=":url/:key" element={<Main/>}/>
        </Routes>
    </BrowserRouter>,
)
