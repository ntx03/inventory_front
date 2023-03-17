import {action, computed, observable} from 'mobx';
import moment from 'moment'
import React from 'react';
import {ProviderStore} from 'store/api/ProviderStore';
import {SessionStore} from 'store/SessionStore';
import {authority} from 'utils/Authority';
import {DateFilter} from 'utils/DateFilter';
import {IdFilter} from 'utils/IdFilter';
import {modals} from 'utils/ModalName';
import {ContractTableButtonsComponent} from '../component/contract/ContractTableButtonsComponent';
import {ContractStore} from '../store/api/ContractStore';
import {copyObject} from '../utils/copyObject';
import {filtersToFiltered, filterToColumn} from '../utils/ReactTableUtils';
import {TextFilter} from '../utils/TextFilter';
import {WatchList} from '../utils/WatchList';

const defaultContract = {
    providerId: '',
    number: '',
    date: moment()
};

export class ContractViewStore {

    columns = [{
        Header: <span title="Поставщик">Поставщик</span>,
        accessor: 'providerId',
        Cell: ({value}) => {
            const provider = this.providerIdToProviderMap.get(value);
            const title = provider && provider.name;
            return <span title={title}>{title}</span>
        },
        ...filterToColumn(this.filters.providerId)
    }, {
        Header: <span title="Номер">Номер</span>,
        accessor: 'number',
        Cell: ({value}) => {
            return <span title={value}>{value}</span>
        },
        ...filterToColumn(this.filters.number)
    }, {
        Header: <span title="Дата">Дата</span>,
        accessor: 'date',
        Cell: props => {
            const date = props.value.format('L');
            return <span title={date}>{date}</span>
        },
        ...filterToColumn(this.filters.date)
    }, {
        id: 'action',
        Header: <span title="Доступные действия">Действия</span>,
        width: 100,
        Cell: props => <ContractTableButtonsComponent {...props}/>,
        filterable: false,
        sortable: false,
        resizable: false
    }];

    @observable
    filters = {
        providerId: new IdFilter('contract.filters.providerId', () => this.providerList),
        number: new TextFilter('contract.filters.number'),
        date: new DateFilter('contract.filters.date')
    };

    @computed
    get filtered() {
        return filtersToFiltered(this.filters);
    }

    pageSize = new SessionStore('contract.pageSize', 50);

    @action
    handlePageSizeChange = size => {
        this.pageSize.setValue(size);
    };

    page = new SessionStore('contract.page', 0);

    @action
    handlePageChange = page => {
        this.page.setValue(page);
    };

    constructor() {
        this.contractStore = new ContractStore();
        this.contractStore.loadContractList();
        this.providerStore = new ProviderStore();
        this.providerStore.loadProviderList();
    }

    @computed
    get stateLoad() {
        return new WatchList(
            this.contractStore.contractList,
            this.providerStore.providerList
        )
    }

    @computed
    get contractList() {
        const contractList = this.contractStore.contractList;
        return contractList.value.map(item => {
            return {
                ...item,
                date: moment(item.date)
            }
        });
    }

    @computed
    get providerList() {
        const providerList = this.providerStore.providerList;
        return providerList.value
    }

    @computed
    get providerIdToProviderMap() {
        const map = new Map();
        this.providerList.forEach(item => {
            map.set(item.id, item);
        });
        return map
    }

    @observable
    contract = copyObject(defaultContract);

    @action
    setContractProviderId(id) {
        this.contract.providerId = id
    }

    @action
    setContractNumber(number) {
        this.contract.number = number;
    }

    @action
    setContractDate(date) {
        if (date) {
            this.contract.date = date;
        } else {
            this.contract.date = null;
        }

    }

    @computed
    get hasAuthorityAddContract() {
        return authority.SUPER_ADMIN || authority.CONTRACT_CREATE
    };

    @computed
    get hasAuthorityEditContract() {
        return authority.SUPER_ADMIN || authority.CONTRACT_UPDATE
    };

    @computed
    get hasAuthorityDeleteContract() {
        return authority.SUPER_ADMIN || authority.CONTRACT_DELETE
    };

    @observable
    modal = null;

    @action
    hideModal() {
        this.modal = null;
    }

    @action
    showModalAddContract() {
        this.contract = copyObject(defaultContract);
        this.modal = modals.ContractEditModal;
    }

    @action
    showModalEditContract(contract) {
        this.contract = copyObject(contract);
        this.modal = modals.ContractEditModal;
    }

    @action
    handleSaveContract() {
        if (this.contract.id) {
            this.contractStore.editContract(this.contract);
        } else {
            this.contractStore.addContract(this.contract);
        }
        this.modal = null;
    }

    @action
    handleDeleteContract(id) {
        this.contractStore.deleteContract(id)
    }

}