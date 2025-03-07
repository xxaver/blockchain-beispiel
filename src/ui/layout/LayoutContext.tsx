import {createContext} from "react";
import {GoldenLayout} from "golden-layout";

export const LayoutContext = createContext<null | {
    gl: GoldenLayout
}>(null)