import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router";
import {Main} from "./main/Main.tsx";
// @ts-expect-error jaa
import "./index.css"
import {basePath} from "./config.ts";
import {Start} from "./create/Start.tsx";
import {Create} from "./create/Create.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename={basePath}>
        <Routes>
            <Route index element={<Start/>}/>
            <Route path=":channel/:url/:key" element={<Main/>}/>
            <Route path="create" element={<Create/>}/>
        </Routes>
    </BrowserRouter>,
)
