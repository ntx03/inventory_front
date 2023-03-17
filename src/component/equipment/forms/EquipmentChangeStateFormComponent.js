import {Form, Input, Select} from 'antd';
import {RenderSelectOption} from 'component/base/RenderSelectOptionOfList';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {filterOption} from 'utils/filterOption';

@inject('equipmentViewStore')
@observer
export class EquipmentChangeStateFormComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        return (
            <Form>
                <Form.Item label="Состояние">
                    <Select value={equipmentViewStore.changeState.stateId}
                            onChange={this.handleStateChange}
                            filterOption={filterOption}
                            showSearch
                            allowClear>
                        {RenderSelectOption.byName(equipmentViewStore.stateList)}
                    </Select>
                </Form.Item>
                <Form.Item label="Комментарий">
                    <Input.TextArea value={equipmentViewStore.changeState.comment}
                                    onChange={this.handleCommentChange}/>
                </Form.Item>
            </Form>
        )
    }

    handleStateChange = value => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setChangeStateId(value)
    };

    handleCommentChange = ({target}) => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setChangeStateComment(target.value)
    };

}