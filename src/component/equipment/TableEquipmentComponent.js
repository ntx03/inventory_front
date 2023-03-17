import {toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {MaxSizeFlex} from '../base/MaxSize';
import {CheckBoxTable} from '../base/ReactTable';

@inject('equipmentViewStore')
@observer
export class TableEquipmentComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        return (
            <MaxSizeFlex>
                <CheckBoxTable className='table -highlight'
                               columns={equipmentViewStore.columns}
                               data={toJS(equipmentViewStore.filteredEquipmentList)}
                               filterable
                               showPagination={true}
                               resizable={false}
                               filtered={equipmentViewStore.filtered}
                               pageSize={equipmentViewStore.pageSize.value}
                               onPageSizeChange={equipmentViewStore.handlePageSizeChange}
                               page={equipmentViewStore.page.value}
                               onPageChange={equipmentViewStore.handlePageChange}
                               keyField="id"
                               selectAll={equipmentViewStore.selectedAllEquipment}
                               isSelected={equipmentViewStore.isSelectedEquipment}
                               isDisabled={equipmentViewStore.hasAuthorityCheckedEquipment}
                               toggleSelection={equipmentViewStore.handleSelectedEquipment}
                               toggleAll={equipmentViewStore.handleSelectedAllEquipment}
                               counts={equipmentViewStore.counts}/>
            </MaxSizeFlex>
        )
    }

}
