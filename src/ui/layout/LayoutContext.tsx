import {createContext} from "react";
import {ComponentItemConfig, ContentItem, GoldenLayout, ResolvedItemConfig, RowOrColumn, Stack} from "golden-layout";

export const LayoutContext = createContext<null | {
    gl: GoldenLayout
}>(null)

export const openItem = (gl: GoldenLayout, containerType: string, type: string, state: string, title: string) => {
    const existing = gl.findFirstComponentItemById(`${type}-${state}`)
    if (existing) {
        if (existing.parent?.isStack) {
            (existing.parent as Stack).setActiveComponentItem(existing, true)
        }
        return
    }
    const config: ComponentItemConfig = {
        type: "component",
        componentType: type,
        componentState: state,
        id: `${type}-${state}`,
        content: [],
        title
    };
    const container = gl.findFirstComponentItemById(containerType)
    if (container && container.parent?.parent) {
        const p = container.parent.parent as RowOrColumn, i = p.contentItems.indexOf(container.parentItem);
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

    }
    //else gl.addItem(config)
}