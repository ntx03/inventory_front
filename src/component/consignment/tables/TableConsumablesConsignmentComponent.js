import {toJS} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';
import {ReactTable} from '../../base/ReactTable';

@observer
export class TableConsumablesConsignmentComponent extends React.Component {
    render() {
        const {consumablesList, columns} = this.props;
        return (
            <ReactTable className='table -highlight'
                        columns={columns}
                        data={toJS(consumablesList)}
                        pageSize={consumablesList.length}
                        showPagination={false}
                        resizable={false}/>
        )
    }
}
