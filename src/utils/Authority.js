import {userInfoStore} from 'store/UserInfoStore';

class Authority {
    SUPER_ADMIN = userInfoStore.authorities.has('SUPER_ADMIN');

    CHANGE_USER_RIGHTS = userInfoStore.authorities.has('CHANGE_USER_RIGHTS');

    GROUP_CREATE = this.SUPER_ADMIN || userInfoStore.authorities.has('GROUP_CREATE');
    GROUP_UPDATE = this.SUPER_ADMIN || userInfoStore.authorities.has('GROUP_UPDATE');
    GROUP_DELETE = this.SUPER_ADMIN || userInfoStore.authorities.has('GROUP_DELETE');
    GROUP_SHOW_MENU = this.SUPER_ADMIN || this.GROUP_CREATE || this.GROUP_UPDATE || this.GROUP_DELETE;

    HARDWARE_MOVE = this.SUPER_ADMIN || userInfoStore.authorities.has('HARDWARE_MOVE');
    ANOTHERS_HARDWARE_MOVE = this.SUPER_ADMIN || userInfoStore.authorities.has('ANOTHERS_HARDWARE_MOVE');
    HARDWARE_MOVE_SHOW_MENU = this.SUPER_ADMIN || this.HARDWARE_MOVE || this.ANOTHERS_HARDWARE_MOVE;

    EQUIPMENT_CREATE = this.SUPER_ADMIN || userInfoStore.authorities.has('EQUIPMENT_CREATE');
    EQUIPMENT_UPDATE = this.SUPER_ADMIN || userInfoStore.authorities.has('EQUIPMENT_UPDATE');
    EQUIPMENT_DELETE = this.SUPER_ADMIN || userInfoStore.authorities.has('EQUIPMENT_DELETE');
    EQUIPMENT_CHANGE_STATE = this.SUPER_ADMIN || userInfoStore.authorities.has('EQUIPMENT_CHANGE_STATE');
    EQUIPMENT_SHOW_MENU = this.SUPER_ADMIN || true;

    CONSUMABLES_CREATE = this.SUPER_ADMIN || userInfoStore.authorities.has('CONSUMABLES_CREATE');
    CONSUMABLES_UPDATE = this.SUPER_ADMIN || userInfoStore.authorities.has('CONSUMABLES_UPDATE');
    CONSUMABLES_DELETE = this.SUPER_ADMIN || userInfoStore.authorities.has('CONSUMABLES_DELETE');
    CONSUMABLES_CHANGE_STATE = this.SUPER_ADMIN || userInfoStore.authorities.has('CONSUMABLES_CHANGE_STATE');
    CONSUMABLES_SHOW_MENU = this.SUPER_ADMIN || true;

    VENDOR_CREATE = this.SUPER_ADMIN || userInfoStore.authorities.has('VENDOR_CREATE');
    VENDOR_UPDATE = this.SUPER_ADMIN || userInfoStore.authorities.has('VENDOR_UPDATE');
    VENDOR_DELETE = this.SUPER_ADMIN || userInfoStore.authorities.has('VENDOR_DELETE');
    VENDOR_SHOW_MENU = this.SUPER_ADMIN || this.VENDOR_CREATE || this.VENDOR_UPDATE || this.VENDOR_DELETE;

    MODEL_CREATE = this.SUPER_ADMIN || userInfoStore.authorities.has('MODEL_CREATE');
    MODEL_UPDATE = this.SUPER_ADMIN || userInfoStore.authorities.has('MODEL_UPDATE');
    MODEL_DELETE = this.SUPER_ADMIN || userInfoStore.authorities.has('MODEL_DELETE');
    MODEL_SHOW_MENU = this.SUPER_ADMIN || this.MODEL_CREATE || this.MODEL_UPDATE || this.MODEL_DELETE;

    HARDWARE_TYPE_CREATE = this.SUPER_ADMIN || userInfoStore.authorities.has('HARDWARE_TYPE_CREATE');
    HARDWARE_TYPE_UPDATE = this.SUPER_ADMIN || userInfoStore.authorities.has('HARDWARE_TYPE_UPDATE');
    HARDWARE_TYPE_DELETE = this.SUPER_ADMIN || userInfoStore.authorities.has('HARDWARE_TYPE_DELETE');
    HARDWARE_TYPE_SHOW_MENU = (
        this.HARDWARE_TYPE_CREATE ||
        this.HARDWARE_TYPE_UPDATE ||
        this.HARDWARE_TYPE_DELETE
    );

    STATE_CREATE = this.SUPER_ADMIN || userInfoStore.authorities.has('STATE_CREATE');
    STATE_UPDATE = this.SUPER_ADMIN || userInfoStore.authorities.has('STATE_UPDATE');
    STATE_DELETE = this.SUPER_ADMIN || userInfoStore.authorities.has('STATE_DELETE');
    STATE_SHOW_MENU = this.SUPER_ADMIN || this.STATE_CREATE || this.STATE_UPDATE || this.STATE_DELETE;

    LOCATION_CREATE = this.SUPER_ADMIN || userInfoStore.authorities.has('LOCATION_CREATE');
    LOCATION_UPDATE = this.SUPER_ADMIN || userInfoStore.authorities.has('LOCATION_UPDATE');
    LOCATION_DELETE = this.SUPER_ADMIN || userInfoStore.authorities.has('LOCATION_DELETE');
    LOCATION_SHOW_MENU = (
        this.LOCATION_CREATE ||
        this.LOCATION_UPDATE ||
        this.LOCATION_DELETE
    );

    LOCATION_TAG_CREATE = this.SUPER_ADMIN || userInfoStore.authorities.has('LOCATION_TAG_CREATE');
    LOCATION_TAG_UPDATE = this.SUPER_ADMIN || userInfoStore.authorities.has('LOCATION_TAG_UPDATE');
    LOCATION_TAG_DELETE = this.SUPER_ADMIN || userInfoStore.authorities.has('LOCATION_TAG_DELETE');
    LOCATION_TAG_SHOW_MENU = (
        this.LOCATION_TAG_CREATE ||
        this.LOCATION_TAG_UPDATE ||
        this.LOCATION_TAG_DELETE
    );

    CONTRACT_CREATE = this.SUPER_ADMIN || userInfoStore.authorities.has('CONTRACT_CREATE');
    CONTRACT_UPDATE = this.SUPER_ADMIN || userInfoStore.authorities.has('CONTRACT_UPDATE');
    CONTRACT_DELETE = this.SUPER_ADMIN || userInfoStore.authorities.has('CONTRACT_DELETE');
    CONTRACT_SHOW_MENU = (
        this.CONTRACT_CREATE ||
        this.CONTRACT_UPDATE ||
        this.CONTRACT_DELETE
    );

    PROVIDER_CREATE = this.SUPER_ADMIN || userInfoStore.authorities.has('PROVIDER_CREATE1');
    PROVIDER_UPDATE = this.SUPER_ADMIN || userInfoStore.authorities.has('PROVIDER_UPDATE1');
    PROVIDER_DELETE = this.SUPER_ADMIN || userInfoStore.authorities.has('PROVIDER_DELETE1');
    PROVIDER_SHOW_MENU = (
        this.PROVIDER_CREATE ||
        this.PROVIDER_UPDATE ||
        this.PROVIDER_DELETE
    );

    CATALOG_SHOW_MENU = (
        this.VENDOR_SHOW_MENU ||
        this.MODEL_SHOW_MENU ||
        this.HARDWARE_TYPE_SHOW_MENU ||
        this.STATE_SHOW_MENU ||
        this.LOCATION_SHOW_MENU ||
        this.LOCATION_TAG_SHOW_MENU ||
        this.CONTRACT_SHOW_MENU ||
        this.PROVIDER_SHOW_MENU
    );

    EQUIPMENT_JOURNAL_VIEW = this.SUPER_ADMIN || userInfoStore.authorities.has('EQUIPMENT_JOURNAL_VIEW');

    SERVICE_CENTER_REPORT_VIEW = this.SUPER_ADMIN || userInfoStore.authorities.has('SERVICE_CENTER_REPORT_VIEW');
    MOVING_REPORT_VIEW = this.SUPER_ADMIN || userInfoStore.authorities.has('MOVING_REPORT_VIEW');
    REPORT_SHOW_MENU = (
        this.SERVICE_CENTER_REPORT_VIEW ||
        this.MOVING_REPORT_VIEW
    );

    ADMINISTRATION_SHOW_MENU = (
        this.CHANGE_USER_RIGHTS ||
        this.GROUP_SHOW_MENU ||
        this.EQUIPMENT_JOURNAL_VIEW
    );

}

export const authority = new Authority();