import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {MaxSizeFlex} from '../base/MaxSize';
import {ReactTable} from '../base/ReactTable';

@inject('userViewStore')
@observer
export class TableUserComponent extends React.Component {
    render() {
        const {userViewStore} = this.props;
        return (
            <MaxSizeFlex>
                <ReactTable className='table -highlight'
                            columns={userViewStore.columns}
                            data={toJS(userViewStore.userList)}
                            filterable
                            pageSize={userViewStore.pageSize.value}
                            onPageSizeChange={userViewStore.handlePageSizeChange}
                            page={userViewStore.page.value}
                            onPageChange={userViewStore.handlePageChange}
                            showPagination={true}
                            resizable={false}
                            filtered={userViewStore.filtered}/>
            </MaxSizeFlex>
        )
    }
}
