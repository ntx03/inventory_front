import {Tree} from 'antd';
import {RenderTreeNode} from 'component/base/RenderSelectOptionOfList';
import {inject, observer} from 'mobx-react';
import {toJS} from 'mobx';
import React from 'react';


@inject('consumablesViewStore')
@observer
export class ConsumablesLocationListComponent extends React.Component {
    render() {
        const {consumablesViewStore} = this.props;
        return (
            <Tree expandedKeys={toJS(consumablesViewStore.expandedKeys)}
                  selectedKeys={[toJS(consumablesViewStore.selectedConsumablesLocationId)]}
                  autoExpandParent={consumablesViewStore.autoExpandParent}
                  onExpand={this.handleTreeExpand}
                  onSelect={this.handleSelectedChange}
                  showLine={true}>
                <Tree.TreeNode key={'root'} title={'Все'}>
                    {RenderTreeNode(consumablesViewStore.locationListToTree)}
                </Tree.TreeNode>
            </Tree>
        )
    }

    handleSelectedChange = listId => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.handleSelectedConsumablesLocationId(listId[0])
    };

    handleTreeExpand = (expandedKeys) => {
        const {consumablesViewStore} = this.props;
        consumablesViewStore.setExpandedKeys(expandedKeys, false);
    }
}