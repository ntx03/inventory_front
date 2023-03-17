import React from 'react';
import {inject, observer} from 'mobx-react';
import {MaxSizeFlex} from '../base/MaxSize';
import {ReactTable} from '../base/ReactTable';
import {toJS} from 'mobx';

@inject('locationTagViewStore')
@observer
export class TableLocationTagComponent extends React.Component {
    render() {
        const {locationTagViewStore} = this.props;
        return (
            <MaxSizeFlex>
                <ReactTable className='table -highlight'
                            columns={locationTagViewStore.columns}
                            data={toJS(locationTagViewStore.locationTagList)}
                            filterable
                            pageSize={locationTagViewStore.pageSize.value}
                            onPageSizeChange={locationTagViewStore.handlePageSizeChange}
                            page={locationTagViewStore.page.value}
                            onPageChange={locationTagViewStore.handlePageChange}
                            showPagination={true}
                            resizable={false}
                            filtered={locationTagViewStore.filtered}/>
            </MaxSizeFlex>
        )
    }
}
