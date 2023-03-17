import React from 'react';
import {inject, observer} from 'mobx-react';
import {MaxSizeFlex} from '../base/MaxSize';
import {ReactTable} from '../base/ReactTable';
import {toJS} from 'mobx';

@inject('consumablesViewStore')
@observer
export class TableConsumablesComponent extends React.Component {
    render() {
        const {consumablesViewStore} = this.props;
        return (
            <MaxSizeFlex>
                <ReactTable className='table -highlight'
                            columns={consumablesViewStore.columns}
                            data={toJS(consumablesViewStore.filteredConsumablesList)}
                            filtered={consumablesViewStore.filtered}
                            pageSize={consumablesViewStore.pageSize.value}
                            onPageSizeChange={consumablesViewStore.handlePageSizeChange}
                            page={consumablesViewStore.page.value}
                            onPageChange={consumablesViewStore.handlePageChange}
                            filterable
                            showPagination={true}
                            resizable={false}
                            counts={consumablesViewStore.counts}/>
            </MaxSizeFlex>
        )
    }
}
