import {toJS} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';
import {ReactTable} from '../../base/ReactTable';

@observer
export class TableEquipmentsConsignmentComponent extends React.Component {
    render() {
        const {equipmentList, columns} = this.props;
        return (
            <ReactTable className='table -highlight'
                        columns={columns}
                        data={toJS(equipmentList)}
                        pageSize={equipmentList.length}
                        showPagination={false}
                        resizable={false}/>
        )
    }
}
