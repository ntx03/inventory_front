import {action, observable, toJS} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {Request} from 'utils/Request';

export class VendorStore {
    @observable
    vendorList = fromPromise.resolve([]);

    @observable
    vendor = fromPromise.resolve({});

    @action
    loadVendorList() {
        this.vendorList = fromPromise(Request.post('/api/vendor/list'))
    }

    @action
    loadVendor(id) {
        this.vendor = fromPromise(Request.post('/api/vendor/get', id))
    }

    @action
    addVendor(vendor) {
        const vendorList = this.vendorList.value;
        const addVendor = async () => {
            const newVendor = await Request.post('/api/vendor/add', toJS(vendor));
            vendorList.push(newVendor);
            return vendorList
        };
        this.vendorList = fromPromise(addVendor())
    }

    @action
    editVendor(vendor) {
        const vendorList = this.vendorList.value;
        const editVendor = async () => {
            await Request.post('/api/vendor/edit', toJS(vendor));
            return vendorList.map(item => {
                if (item.id === vendor.id) {
                    return vendor
                }
                return item
            });
        };
        this.vendorList = fromPromise(editVendor());
    };

    @action
    deleteVendor(vendorId) {
        const vendorList = this.vendorList.value;
        const deleteVendor = async () => {
            await Request.post('/api/vendor/delete', {
                id: vendorId
            });
            return vendorList.filter(item => item.id !== vendorId);
        };
        this.vendorList = fromPromise(deleteVendor())
    }

}