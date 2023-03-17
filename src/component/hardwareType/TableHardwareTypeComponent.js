import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {MaxSizeFlex} from '../base/MaxSize';
import {ReactTable} from '../base/ReactTable';

@inject('hardwareTypeViewStore')
@observer
export class TableHardwareTypeComponent extends React.Component {
    render() {
        const {hardwareTypeViewStore} = this.props;
        return (
            <MaxSizeFlex>
                <ReactTable className='table -highlight'
                            columns={hardwareTypeViewStore.columns}
                            data={toJS(hardwareTypeViewStore.hardwareTypeList)}
                            filterable
                            pageSize={hardwareTypeViewStore.pageSize.value}
                            onPageSizeChange={hardwareTypeViewStore.handlePageSizeChange}
                            page={hardwareTypeViewStore.page.value}
                            onPageChange={hardwareTypeViewStore.handlePageChange}
                            showPagination={true}
                            resizable={false}
                            filtered={hardwareTypeViewStore.filtered}/>
            </MaxSizeFlex>
        )
    }
}
