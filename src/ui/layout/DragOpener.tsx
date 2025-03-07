import {Children, cloneElement, FC, isValidElement, PropsWithChildren, useContext, useEffect, useRef} from "react";
import {LayoutContext} from "./LayoutContext.tsx";
import {ComponentItemConfig} from "golden-layout";

export const DragOpener: FC<PropsWithChildren<{config: ComponentItemConfig}>> = ({children, config}) => {
    const layout = useContext(LayoutContext);
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        if(!layout || !layout.gl || !ref.current) return;
        layout.gl.newDragSource(ref.current, () => config);
    }, [config, layout, ref.current]);

    return Children.map(children, (child) =>
        isValidElement(child)
            ? cloneElement(child, {ref})
            : child
    )
};