/**
 Tools function to filter the data from opencv
 see more info "__insert_link__"
**/
function getHierarchyForContours(hierarchy, index) {
    const next = hierarchy.data32S[index * hierarchy.channels()];
    const previous = hierarchy.data32S[index * hierarchy.channels() + 1];
    const child = hierarchy.data32S[index * hierarchy.channels() + 2];
    const parent = hierarchy.data32S[index * hierarchy.channels() + 3];
    return [
        next,
        previous,
        child,
        parent
    ];
}
export function getParent(hierarchy, index) {
    return getHierarchyForContours(hierarchy, index)[3];
}
function getChild(hierarchy, index) {
    return getHierarchyForContours(hierarchy, index)[2];
}
export function getChildren(hierarchy, parentIndex) {
    let currentChild = getChild(hierarchy, parentIndex);
    let children = [];
    while (currentChild !== -1) {
        children.push(currentChild);
        currentChild = getChild(hierarchy, currentChild);
    }
    return children;
}
