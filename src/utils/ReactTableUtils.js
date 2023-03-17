export function filterToColumn(filter) {
    return {
        filterMethod: filter.filterMethod,
        Filter: filter.filterComponent
    }
}

export function filtersToFiltered(filters) {
    return Object.keys(filters).map(id => {
        const filter = filters[id];
        return {
            id,
            value: filter.store.value
        };
    });
}
