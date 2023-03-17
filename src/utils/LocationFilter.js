import React from 'react';
import {Tree, TreeSelect} from 'antd';
import {SessionStore} from '../store/SessionStore';

const RenderTreeNode = (list) => {
    return list.map(item => {
        if (item.children.length) {
            return <Tree.TreeNode value={item.id} title={item.name} key={item.id}
                                  children={RenderTreeNode(item.children)}/>
        } else {
            return <Tree.TreeNode value={item.id} title={item.name} key={item.id}/>
        }
    })
};

export class LocationFilter {
    constructor(key, list = [], filterMethod) {
        this.store = new SessionStore(key, []);
        this.list = list;
        this.filterMethodTest = filterMethod;
    }

    filterMethod = (filter, row) => {
        return true
    };

    filterTreeNode = (title,node) =>{
        return node.props.title.toLowerCase().includes(title.toLowerCase())
    };

    filterComponent = () => (
        <TreeSelect
            showSearch
            allowClear
            style={{width: '100%'}}
            onChange={this.filterMethodTest}
            treeNodeFilterProp={'title'}
            filterTreeNode = {this.filterTreeNode}
        >
            <Tree.TreeNode value={'root'} title={'Все'} key={'root'}>
                {RenderTreeNode(this.list)}
            </Tree.TreeNode>
        </TreeSelect>
    );
}
