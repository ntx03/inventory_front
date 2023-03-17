import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {MaxSizeFlex} from '../base/MaxSize';
import {ReactTable} from '../base/ReactTable';

@inject('vendorViewStore')
@observer
export class TableVendorComponent extends React.Component {
    render() {
        const {vendorViewStore} = this.props;
        return (
            <MaxSizeFlex>
                <ReactTable className='table -highlight'
                            columns={vendorViewStore.columns}
                            data={toJS(vendorViewStore.vendorList)}
                            filterable
                            pageSize={vendorViewStore.pageSize.value}
                            onPageSizeChange={vendorViewStore.handlePageSizeChange}
                            page={vendorViewStore.page.value}
                            onPageChange={vendorViewStore.handlePageChange}
                            showPagination={true}
                            resizable={false}
                            filtered={vendorViewStore.filtered}/>
            </MaxSizeFlex>
        )
    }
}
