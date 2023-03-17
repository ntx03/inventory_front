import React from 'react';
import {inject, observer} from 'mobx-react';
import {MaxSizeFlex} from '../base/MaxSize';
import {ReactTable} from '../base/ReactTable';
import {toJS} from 'mobx';

@inject('stateViewStore')
@observer
export class TableStateComponent extends React.Component {
    render() {
        const {stateViewStore} = this.props;
        return (
            <MaxSizeFlex>
                <ReactTable className='table -highlight'
                            columns={stateViewStore.columns}
                            data={toJS(stateViewStore.stateList)}
                            filterable
                            pageSize={stateViewStore.pageSize.value}
                            onPageSizeChange={stateViewStore.handlePageSizeChange}
                            page={stateViewStore.page.value}
                            onPageChange={stateViewStore.handlePageChange}
                            showPagination={true}
                            resizable={false}
                            filtered={stateViewStore.filtered}/>
            </MaxSizeFlex>
        )
    }
}
