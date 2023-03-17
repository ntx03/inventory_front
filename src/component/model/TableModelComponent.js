import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {MaxSizeFlex} from '../base/MaxSize';
import {ReactTable} from '../base/ReactTable';

@inject('modelViewStore')
@observer
export class TableModelComponent extends React.Component {
    render() {
        const {modelViewStore} = this.props;
        return (
            <MaxSizeFlex>
                <ReactTable className='table -highlight'
                            columns={modelViewStore.columns}
                            data={toJS(modelViewStore.modelList)}
                            filterable
                            pageSize={modelViewStore.pageSize.value}
                            onPageSizeChange={modelViewStore.handlePageSizeChange}
                            page={modelViewStore.page.value}
                            onPageChange={modelViewStore.handlePageChange}
                            showPagination={true}
                            resizable={false}
                            filtered={modelViewStore.filtered}/>
            </MaxSizeFlex>
        )
    }
}
