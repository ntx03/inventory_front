import {ReactTable} from 'component/base/ReactTable';
import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {MaxSizeFlex} from '../base/MaxSize';

@inject('equipmentJournalViewStore')
@observer
export class TableEquipmentJournalComponent extends React.Component {
    render() {
        const {equipmentJournalViewStore} = this.props;
        return (
            <MaxSizeFlex>
                <ReactTable className='table -highlight'
                            columns={equipmentJournalViewStore.columns}
                            data={toJS(equipmentJournalViewStore.equipmentJournalList)}
                            filterable
                            showPagination={true}
                            resizable={false}
                            filtered={equipmentJournalViewStore.filtered}
                    // filtered={equipmentViewStore.filtered}
                    // pageSize={equipmentViewStore.pageSize.value}
                    // onPageSizeChange={equipmentViewStore.handlePageSizeChange}
                    // page={equipmentViewStore.page.value}
                    // onPageChange={equipmentViewStore.handlePageChange}
                />
            </MaxSizeFlex>
        )
    }

}
