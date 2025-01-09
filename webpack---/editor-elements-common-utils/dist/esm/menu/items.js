export const containsSubmenu = (menuData) => !!menuData?.items?.some(subItem => !!subItem.items?.length);
export const containsNestedSubmenus = (menuData) => getTreeDepth(menuData) === 3;
const getTreeDepth = (tree) => {
    let depth = 1;
    const setDepth = (list, newDepth = 1) => {
        if (depth < newDepth) {
            depth = newDepth;
        }
        list.forEach((listItem) => {
            if (listItem?.items?.length > 0) {
                return setDepth(listItem.items, newDepth + 1);
            }
        });
    };
    setDepth(tree.items);
    return depth;
};
//# sourceMappingURL=items.js.map