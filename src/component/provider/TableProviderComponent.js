import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {MaxSizeFlex} from '../base/MaxSize';
import {ReactTable} from '../base/ReactTable';

@inject('providerViewStore')
@observer
export class TableProviderComponent extends React.Component {
    render() {
        const {providerViewStore} = this.props;
        return (
            <MaxSizeFlex>
                <ReactTable className='table -highlight'
                            columns={providerViewStore.columns}
                            data={toJS(providerViewStore.providerList)}
                            filterable
                            pageSize={providerViewStore.pageSize.value}
                            onPageSizeChange={providerViewStore.handlePageSizeChange}
                            page={providerViewStore.page.value}
                            onPageChange={providerViewStore.handlePageChange}
                            showPagination={true}
                            resizable={false}
                            filtered={providerViewStore.filtered}/>
            </MaxSizeFlex>
        )
    }
}
