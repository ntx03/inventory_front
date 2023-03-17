import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {MaxSizeFlex} from '../base/MaxSize';
import {ReactTable} from '../base/ReactTable';

@inject('groupViewStore')
@observer
export class TableGroupComponent extends React.Component {
    render() {
        const {groupViewStore} = this.props;
        return (
            <MaxSizeFlex>
                <ReactTable className='table -highlight'
                            columns={groupViewStore.columns}
                            data={toJS(groupViewStore.groupList)}
                            filterable
                            pageSize={groupViewStore.pageSize.value}
                            onPageSizeChange={groupViewStore.handlePageSizeChange}
                            page={groupViewStore.page.value}
                            onPageChange={groupViewStore.handlePageChange}
                            showPagination={true}
                            resizable={false}
                            filtered={groupViewStore.filtered}/>
            </MaxSizeFlex>
        )
    }
}
