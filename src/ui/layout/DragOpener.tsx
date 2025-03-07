import {Children, cloneElement, FC, isValidElement, PropsWithChildren, useContext, useEffect, useRef} from "react";
import {LayoutContext} from "./LayoutContext.tsx";
import {ComponentItemConfig, ResolvedItemConfig, RowOrColumn, Stack} from "golden-layout";

export const DragOpener: FC<PropsWithChildren<{ config: ComponentItemConfig; containerType?: string }>> =
    ({children, config, containerType}) => {
        const id = config.componentState ? `${config.componentType}-${JSON.stringify(config.componentState)}` : `${config.componentType}`
        if (!config.id) config.id = id

        const layout = useContext(LayoutContext);
        const ref = useRef<HTMLElement>(null)
        const configured = useRef(false);
        useEffect(() => {
            if (configured.current || !layout || !layout.gl || !ref.current) return;
            const {gl} = layout;
            configured.current = true;
            gl.newDragSource(ref.current, () => config);
            ref.current.querySelectorAll("*").forEach((child) => {
                gl.newDragSource(child as HTMLElement, () => config);
            });

            ref.current.addEventListener("click", () => {
                const existing = gl.findFirstComponentItemById(id)
                if (existing) {
                    if (existing.parent?.isStack) {
                        (existing.parent as Stack).setActiveComponentItem(existing, true)
                    }
                    return
                }
                if (containerType) {
                    const container = gl.findFirstComponentItemById(containerType)
                    if (container && container.parent?.parent) {
                        const p = container.parent.parent as RowOrColumn,
                            i = p.contentItems.indexOf(container.parentItem);
                        if (p.isColumn) {
                            if (p.contentItems.length === 1) p.newItem(config)
                            else (p.contentItems[i === 0 ? 1 : 0] as RowOrColumn).newItem(config)
                        } else {
                            const newItem = gl.createAndInitContentItem({
                                type: "column",
                                content: []
                            } as unknown as ResolvedItemConfig, p) as RowOrColumn;
                            p.replaceChild(container.parent, newItem);
                            newItem.addChild(container.parent)
                            newItem.newItem(config)
                        }
                        return
                    }
                }
                gl.addItem(config)
            })
        }, [layout]);

        return Children.map(children, (child) =>
            isValidElement(child)
                ? cloneElement(child, {ref})
                : child
        )
    };