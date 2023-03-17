import {Col, Input, Row} from 'antd'
import {ErrorComponent} from 'component/base/ErrorComponent';
import {LoadingComponent} from 'component/base/LoadingComponent';
import {ConsumablesButtonsTitleComponent} from 'component/consumables/ConsumablesButtonsTitleComponent';
import {TableConsumablesComponent} from 'component/consumables/TableConsumablesComponent';
import {ConsumablesLocationListComponent} from 'component/consumables/ConsumablesLocationListComponent';
import {
    ModalChangeStateConsumablesComponent,
    ModalEditConsignmentConsumablesComponent,
    ModalEditConsumablesComponent
} from 'component/consumables/ModalConsumablesComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import React from 'react';


@inject('consumablesViewStore')
@observer
export class ConsumablesComponent extends React.Component {
    render() {
        const {consumablesViewStore} = this.props;
        if (consumablesViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (consumablesViewStore.stateLoad.errors) {
            return <ErrorComponent errors={consumablesViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Расходники'
                           buttons={<ConsumablesButtonsTitleComponent/>}>
                <Row className='consumables'>
                    {/*<Col span={5} className='consumables_location_list'>*/}
                        {/*<Input.Search className='search'*/}
                                      {/*placeholder="Найти"*/}
                                      {/*onChange={this.handleInputSearchChange}/>*/}
                        {/*<ConsumablesLocationListComponent/>*/}
                    {/*</Col>*/}
                    <Col span={24} className='consumables_list'>
                        <TableConsumablesComponent/>
                        <ModalEditConsumablesComponent/>
                        <ModalChangeStateConsumablesComponent/>
                        <ModalEditConsignmentConsumablesComponent/>
                    </Col>
                </Row>
            </LayoutContent>
        )
    }

    handleInputSearchChange = e => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.setLocationIdListBySearchValue(e.target.value)
    };
}