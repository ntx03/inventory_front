import React from 'react';
import {Select, Tree} from 'antd'

export class RenderSelectOption {

    static byName(list) {
        return list.map(item => {
            return <Select.Option key={item.id} title={item.name}>{item.name}</Select.Option>
        })
    }

    static byNumber(list) {
        return list.map(item => {
            return <Select.Option key={item.id} title={item.number}>{item.number}</Select.Option>
        })
    }
}

export const RenderTreeNode = (list) => {
    return list.map(item => {
        if (item.children.length) {
            return <Tree.TreeNode key={item.id} value={item.id} title={item.name}
                                  children={RenderTreeNode(item.children)}/>
        } else {
            return <Tree.TreeNode key={item.id} value={item.id} title={item.name}/>
        }
    })
};