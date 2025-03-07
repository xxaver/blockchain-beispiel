import {Children, cloneElement, FC, isValidElement, PropsWithChildren, useContext, useEffect, useRef} from "react";
import {LayoutContext} from "./LayoutContext.tsx";
import {ComponentItemConfig} from "golden-layout";

export const DragOpener: FC<PropsWithChildren<{ config: ComponentItemConfig }>> = ({children, config}) => {
    const id = config.componentState ? `${config.componentType}-${JSON.stringify(config.componentState)}` : config.componentType
    if (!config.id) config.id = id


    const layout = useContext(LayoutContext);
    const ref = useRef<HTMLElement>(null)
    const configured = useRef(false);
    useEffect(() => {
        if (configured.current || !layout || !layout.gl || !ref.current) return;
        configured.current = true;
        layout.gl.newDragSource(ref.current, () => config);
        ref.current.querySelectorAll("*").forEach((child) => {
            layout.gl.newDragSource(child, () => config);
        });
    }, [layout]);

    return Children.map(children, (child) =>
        isValidElement(child)
            ? cloneElement(child, {ref})
            : child
    )
};