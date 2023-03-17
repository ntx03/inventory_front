import {observer} from 'mobx-react';
import React from 'react';
import {MaxSizeFlex} from '../../base/MaxSize';
import {ReactTable} from '../../base/ReactTable';

@observer
export class TableConsignmentComponent extends React.Component {
    render() {
        const {columns, data, filtered} = this.props;
        return (
            <MaxSizeFlex>
                <ReactTable className='table -highlight'
                            columns={columns}
                            data={data}
                            filterable
                            showPagination={true}
                            resizable={false}
                            filtered={filtered}/>
            </MaxSizeFlex>
        )
    }
}
