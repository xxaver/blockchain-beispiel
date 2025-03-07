import {createContext} from "react";
import {GoldenLayout} from "golden-layout";

export interface LayoutProps<T> {
    props: T;
    close: () => void
}

export const LayoutContext = createContext<null | {
    gl: GoldenLayout
}>(null)