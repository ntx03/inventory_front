import React from 'react';
import {inject, observer} from 'mobx-react';
import {Icon, Tree} from 'antd';
import {toJS} from 'mobx';

@inject('locationViewStore')
@observer
export class LocationTreeComponent extends React.Component {
    render() {
        const {locationViewStore} = this.props;
        const RenderTitleTreeNode = (location) => {
            const isSearchLocation = locationViewStore.locationIdListBySearchValue.has(location.id);
            if (isSearchLocation) {
                return <span>{location.name} <Icon type="check" style={{color: 'green'}}/></span>
            }
            return <span>{location.name}</span>
        };
        const children = (list) => {
            return list.map(item => {
                if (item.children.length) {
                    return <Tree.TreeNode key={item.id} title={RenderTitleTreeNode(item)}
                                          children={children(item.children)}/>
                } else {
                    return <Tree.TreeNode key={item.id} title={RenderTitleTreeNode(item)}/>
                }
            });
        };
        return (
            <div className='tree'>
                <Tree selectedKeys={[toJS(locationViewStore.selectedLocationId)]}
                      expandedKeys={toJS(locationViewStore.expandedKeys)}
                      autoExpandParent={locationViewStore.autoExpandParent}
                      onExpand={this.handleTreeExpand}
                      onSelect={this.handleTreeChange}
                      showLine={true}>
                    <Tree.TreeNode key={'root'} title={'Местоположения'}>
                        {children(locationViewStore.locationListToTree)}
                    </Tree.TreeNode>
                </Tree>
            </div>
        )
    }

    handleTreeChange = (key) => {
        const {locationViewStore} = this.props;
        locationViewStore.handleSelectedLocation(key[0]);
    };

    handleTreeExpand = (expandedKeys) => {
        const {locationViewStore} = this.props;
        locationViewStore.setExpandedKeys(expandedKeys);
        locationViewStore.setAutoExpandParent(false)
    }
}
