import {Tree} from 'antd';
import {inject, observer} from 'mobx-react';
import {toJS} from 'mobx';
import React from 'react';


@inject('equipmentViewStore')
@observer
export class FilterLocationComponent extends React.Component {
    render() {
        const {equipmentViewStore} = this.props;
        const locationList = equipmentViewStore.locationListToTree;
        return (
            <Tree showLine={true}
                  expandedKeys={toJS(equipmentViewStore.expandedKeys)}
                  selectedKeys={[toJS(equipmentViewStore.selectedEquipmentLocationId)]}
                  autoExpandParent={equipmentViewStore.autoExpandParent}
                  onExpand={this.handleTreeExpand}
                  onSelect={this.handleSelectedChange}>
                <Tree.TreeNode key={'root'} title={'Все'}>
                    {RenderTreeNode(locationList)}
                </Tree.TreeNode>
            </Tree>
        )
    }

    handleSelectedChange = listId => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.handleSelectedEquipmentLocationId(listId[0])
    };

    handleTreeExpand = (expandedKeys) => {
        const {equipmentViewStore} = this.props;
        equipmentViewStore.setExpandedKeys(expandedKeys, false);
    }
}

const RenderTreeNode = (list) => {
    return list.map(item => {
        if (item.children.length) {
            return <Tree.TreeNode key={item.id} title={item.name}
                                  children={RenderTreeNode(item.children)}/>
        } else {
            return <Tree.TreeNode key={item.id} title={item.name}/>
        }
    })
};