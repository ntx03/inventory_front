import _ from 'lodash'
import {action, computed, observable, toJS} from 'mobx';
import React from 'react';
import {userInfoStore} from 'store/UserInfoStore';
import {authority} from 'utils/Authority';
import {copyObject} from 'utils/copyObject';
import {locationTypeEnumNamesList} from 'utils/EnumNamesList';
import {locationListToTree} from 'utils/locationListToLocationTreeList'
import {LocationStore} from '../store/api/LocationStore';
import {LocationTagStore} from '../store/api/LocationTagStore';
import {LocationTypeStore} from '../store/api/LocationTypeStore';
import {WatchList} from '../utils/WatchList';

const defaultLocation = {
    name: '',
    address: '',
    description: '',
    type: '',
    parentId: '',
    tagsId: []
};

export class LocationViewStore {

    //Загрузка api-store которые нужны.
    constructor() {
        this.locationStore = new LocationStore();
        this.locationStore.loadLocationList();
        this.locationTypeStore = new LocationTypeStore();
        this.locationTypeStore.loadLocationTypeList();
        this.locationTagStore = new LocationTagStore();
        this.locationTagStore.loadLocationTagList();
    }

    //Отслеживаем полную загрузку всех api-store.
    @computed
    get stateLoad() {
        return new WatchList(
            this.locationStore.locationList,
            this.locationTypeStore.locationTypeList,
            this.locationTagStore.locationTagList
        )
    }

    //Получить список местоположений полученных из api-store.
    @computed
    get locationList() {
        const locationList = this.locationStore.locationList;
        return locationList.value
    }

    @computed
    get locationIdToLocationMap() {
        const map = new Map();
        this.locationList.forEach(l => {
            map.set(l.id, l)
        });
        return map
    }

    //Получить список для отрисовки дерева.
    @computed
    get locationListToTree() {
        return locationListToTree(this.locationList);
    }

    //Получить список типов мостоположений полученных из api-store.
    @computed
    get locationTypeList() {
        const locationTypeList = this.locationTypeStore.locationTypeList;
        return locationTypeList.value
    }

    @computed
    get locationTypeToLocationTypeNameMap() {
        const map = new Map();
        this.locationTypeList.forEach(locationType => {
            const locationTypeName = locationTypeEnumNamesList.find(item => item.enum === locationType).name;
            map.set(locationType, locationTypeName);
        });
        return map
    }

    //Получить список тегов мостоположений полученных из api-store.
    @computed
    get locationTagList() {
        const locationTagList = this.locationTagStore.locationTagList;
        return locationTagList.value
    }

    @computed
    get locationTagIdToLocationTagMap() {
        const map = new Map();
        this.locationTagList.forEach(t => {
            map.set(t.id, t)
        });
        return map
    }

    @observable //Местоположение с которым работаем.
    currentLocation = copyObject(defaultLocation);

    primaryLocation = copyObject(defaultLocation);

    @observable //Переменная для сохранения шаблона location.
    templateLocation = null;

    @computed //Проверить были ли изменения в выбранном местоположение.
    get locationChange() {
        const primaryLocation = toJS(this.primaryLocation);
        const currentLocation = toJS(this.currentLocation);
        return !_.isEqual(primaryLocation, currentLocation)
    }

    @action
    setCurrentLocation(location) {
        if (location) {
            this.currentLocation = copyObject(location);
            this.primaryLocation = copyObject(location);
            return
        }
        this.currentLocation = copyObject(defaultLocation);
        this.primaryLocation = copyObject(defaultLocation);
    }

    @action
    setCurrentLocationName(name) {
        this.currentLocation.name = name;
    }

    @action
    setCurrentLocationAddress(address) {
        this.currentLocation.address = address;
    }

    @action
    setCurrentLocationDescription(description) {
        this.currentLocation.description = description;
    }

    @action
    setCurrentLocationType(type) {
        this.currentLocation.type = type;
    }

    @computed
    get currentLocationTypeName() {
        const locationType = this.locationTagIdToLocationTagMap.get(this.currentLocation.typeId);
        return locationType && locationType.name
    }

    @action
    setCurrentLocationTags(tagList) {
        this.currentLocation.tagsId = tagList;
    }

    //Провеверяем права на местоположение.
    checkAuthorityLocationId(locationId) {
        const location = this.locationIdToLocationMap.get(locationId);
        if (!location) return false;
        return userInfoStore.locationIdList.has(location.id) || this.checkAuthorityLocationId(location.parentId);
    }

    @computed
    get hasAuthorityEditLocation() {
        return authority.SUPER_ADMIN || authority.LOCATION_UPDATE && this.checkAuthorityLocationId(this.selectedLocationId);
    }

    @computed
    get hasAuthorityAddLocation() {
        return authority.SUPER_ADMIN || authority.LOCATION_CREATE && this.checkAuthorityLocationId(this.selectedLocationId)
    };

    @computed
    get hasAuthorityDeleteLocation() {
        return (
            this.selectedLocationId !== 'root' &&
            authority.SUPER_ADMIN ||
            authority.LOCATION_DELETE &&
            this.checkAuthorityLocationId(this.selectedLocationParentId)
        )
    };

    @observable  //Нужно ли показать окно добавления.
    showAdd = false;

    @computed
    get showEditor() {
        const showAdd = this.showAdd;
        const selectedRoot = this.selectedLocationId === 'root';
        return showAdd || !selectedRoot
    }

    @action //Добавление местоположения.
    handleAddLocation() {
        const addLocation = copyObject(defaultLocation);
        addLocation.parentId = this.selectedLocationId !== 'root' ? this.selectedLocationId : null;
        this.currentLocation = copyObject(addLocation);
        this.primaryLocation = copyObject(addLocation);
        this.showAdd = true;
    }

    @action //Создать шаблон местоположения.
    handleCopyLocation() {
        this.templateLocation = copyObject(this.primaryLocation);
        delete this.templateLocation.id;
    }

    @action //Вставить шаблон местоположения.
    handleInsertLocation() {
        const location = copyObject(this.templateLocation);
        location.parentId = this.selectedLocationId !== 'root' ? this.selectedLocationId : null;
        this.locationStore.addLocation(location);
    }

    @action //Удалить местоположеине.
    handleDeleteLocation() {
        const deleteLocationId = this.selectedLocationId;
        const parentId = this.selectedLocation.parentId;
        const parentChildren = this.locationList.filter(item => item.parentId === parentId);
        const countParentChildren = parentChildren.length;
        if (countParentChildren !== 1) {
            const index = parentChildren.findIndex(item => item.id === this.selectedLocationId);
            const children = index ? parentChildren[index - 1] : parentChildren[index + 1];
            this.selectedLocationId = children.id;
            this.currentLocation = copyObject(children);
            this.primaryLocation = copyObject(children);
            this.locationStore.deleteLocation(deleteLocationId);
            return
        }
        if (parentId) {
            const parent = this.locationIdToLocationMap.get(this.currentLocation.parentId);
            this.selectedLocationId = parent.id;
            this.currentLocation = copyObject(parent);
            this.primaryLocation = copyObject(parent);
            this.locationStore.deleteLocation(deleteLocationId);
            return
        }
        this.selectedLocationId = 'root';
        this.currentLocation = copyObject(defaultLocation);
        this.primaryLocation = copyObject(defaultLocation);
        this.locationStore.deleteLocation(deleteLocationId);
    }

    @action //Сохранить изменения местоположения.
    handleSaveLocation() {
        if (this.currentLocation.id) {
            this.locationStore.editLocation(this.currentLocation);
            this.currentLocation = copyObject(this.currentLocation);
            this.primaryLocation = copyObject(this.currentLocation);
            return
        }
        this.showAdd = false;
        //TODO: Баг, возможно изменится выбранный location на сервере.
        const selectedLocation = copyObject(this.selectedLocation);
        this.locationStore.addLocation(this.currentLocation);
        this.currentLocation = copyObject(selectedLocation);
        this.primaryLocation = copyObject(selectedLocation);
    }

    @action //Отменить добавление местоположеня.
    handleCancelSaveLocation() {
        this.showAdd = false;
        this.currentLocation = copyObject(this.selectedLocation);
        this.primaryLocation = copyObject(this.selectedLocation);
    }

    @observable //Храним id выбранного местоположения.
    selectedLocationId = 'root';

    @computed //Получить выбранное местоположение из списка местоположений.
    get selectedLocation() {
        return this.locationIdToLocationMap.get(this.selectedLocationId);
    }

    get selectedLocationParentId() {
        return this.selectedLocation ? this.selectedLocation.parentId : 'root';
    }

    @observable //Массив развернутых(TreeNode) местоположений.
    expandedKeys = ['root'];

    @action
    setExpandedKeys(expandedKeys) {
        this.expandedKeys = expandedKeys;
    }

    @observable //Нужно ли автоматически разворачивать Tree.
    autoExpandParent = false;

    @action
    setAutoExpandParent(autoExpandParent) {
        this.autoExpandParent = autoExpandParent;
    }

    @action
    setAddLocationIdToExpandedKeys(id) {
        this.expandedKeys.push(id);
    }

    //Список id местоположений в которых нашли текст который ищем.
    locationIdListBySearchValue = observable.map([]);

    @action
    setLocationIdListBySearchValue(value) {
        this.autoExpandParent = true;
        if (!value) {
            this.locationIdListBySearchValue.clear();
            this.expandedKeys = ['root'];
            return
        }
        const searchText = value.toLowerCase();
        this.locationList.forEach(location => {
            const str = location.name.toLowerCase();
            if (str.includes(searchText)) {
                this.locationIdListBySearchValue.set(location.id);
                this.expandedKeys.push(location.id);
            } else {
                this.locationIdListBySearchValue.delete(location.id);
            }

        });
    }

    @action //Действие при выборе местоположения.
    handleSelectedLocation(locationId) {
        if (!locationId) {
            return;
        }
        this.showAdd = false;
        this.selectedLocationId = locationId;
        this.currentLocation = copyObject(this.selectedLocation);
        this.primaryLocation = copyObject(this.selectedLocation);
        this.expandedKeys.push(locationId);
    }

}