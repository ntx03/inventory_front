import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {MaxSizeFlex} from '../base/MaxSize';
import {ReactTable} from '../base/ReactTable';

@inject('contractViewStore')
@observer
export class ContractTableComponent extends React.Component {
    render() {
        const {contractViewStore} = this.props;
        return (
            <MaxSizeFlex>
                <ReactTable className='table -highlight'
                            columns={contractViewStore.columns}
                            data={toJS(contractViewStore.contractList)}
                            filtered={contractViewStore.filtered}
                            pageSize={contractViewStore.pageSize.value}
                            onPageSizeChange={contractViewStore.handlePageSizeChange}
                            page={contractViewStore.page.value}
                            onPageChange={contractViewStore.handlePageChange}
                            filterable
                            showPagination={true}
                            resizable={false}/>
            </MaxSizeFlex>
        )
    }
}
