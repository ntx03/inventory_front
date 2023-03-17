
const getChildrenById = (id, list) => {
    return list.filter(item => item.parentId && item.parentId === id)
        .map(item => {
            return {
                ...item,
                children: getChildrenById(item.id, list)
            }
        });
};

export const locationListToTree = (locationList) => {
    return locationList.filter(item => !item.parentId).map(item => {
        return {
            ...item,
            children: getChildrenById(item.id, locationList)
        }
    });
};