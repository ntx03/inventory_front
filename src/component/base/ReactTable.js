import React from 'react';
import ReactTableOriginal from 'react-table';
import {Checkbox, Divider} from 'antd';
import {observer, inject} from 'mobx-react';
import Pagination from 'react-table/lib/pagination'

const PaginationAndCountComponent = (props) => {
    const counts = props.counts;
    if (counts) {
        const AllRecordsCountComponent = () => {
            if (counts.allRecords || counts.allRecords === 0) {
                return (
                    <div>
                        Общее кол-во записей: {counts.allRecords}
                    </div>
                )
            }
            return null
        };
        const CurrentRecordsCountComponent = () => {
            if (counts.currentRecords || counts.currentRecords === 0) {
                return (
                    <div>
                        <Divider type="vertical"/>
                        Кол-во записей: {counts.currentRecords}
                    </div>
                )
            }
            return null
        };
        const SelectedRecordsCountComponent = () => {
            if (counts.selectedRecords || counts.selectedRecords === 0) {
                return (
                    <div>
                        <Divider type="vertical"/>
                        Кол-во выделенных записей: {counts.selectedRecords}
                    </div>
                )
            }
            return null
        };
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div className='-pagination'
                     style={{
                         display: 'flex',
                         justifyContent: 'center'
                     }}>
                    <AllRecordsCountComponent/>
                    <CurrentRecordsCountComponent/>
                    <SelectedRecordsCountComponent/>
                </div>
                <Pagination {...props}/>
            </div>
        )
    }
    return <Pagination {...props}/>
};

const selectAll = (data) => {
    const a = [];
    data.forEach(e => {
        a.push(e.id)
    });
    console.log(a);
};

const CheckboxTableHoc = (Component) => {

    @observer
    class RTCheckboxTable extends React.Component {
        rowSelector = observer((row) => {
            if (!row || !row.hasOwnProperty(this.props.keyField)) return null;
            const {isSelected, isDisabled} = this.props;
            const checked = isSelected(row[this.props.keyField]);
            const disabled = isDisabled(row);
            return (
                <Checkbox
                    type='checkbox'
                    disabled={!disabled}
                    checked={checked}
                    onClick={(e) => {
                        const {shiftKey} = e;
                        e.stopPropagation();
                        this.props.toggleSelection(row[this.props.keyField], shiftKey, row);
                    }}
                    onChange={() => {
                    }}
                    value=''
                />
            );
        });

        headSelector = (row) => {
            const checked = this.props.selectAll;
            return (
                <Checkbox
                    type='checkbox'
                    checked={checked}
                    onChange={() => {
                        this.props.toggleAll();
                    }}
                    value=''
                />
            );
        };

        render() {
            const {columns: originalCols, isSelected, toggleSelection, toggleAll, keyField, selectAll, ...rest} = this.props;
            const select = {
                id: '_selector',
                accessor: () => 'x',
                Header: this.headSelector,
                Cell: (ci) => {
                    return <this.rowSelector {...ci.original}/>;
                },
                width: 30,
                filterable: false,
                sortable: false,
                resizable: false,
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            };
            const columns = [
                select,
                ...originalCols,
            ];

            const extra = {
                    columns,
                    PaginationComponent: PaginationAndCountComponent
                }
            ;
            return (
                <Component {...rest} {...extra} />
            );
        }
    }

    RTCheckboxTable.displayName = 'RTCheckboxTable';
    RTCheckboxTable.defaultProps = {
        keyField: '_id',
        isSelected: (key) => {
            console.log('No isSelected handler provided:', {key})
        },
        selectAll: false,
        toggleSelection: (key, shift, row) => {
            console.log('No toggleSelection handler provided:', {key, shift, row})
        },
        toggleAll: () => {
            console.log('No toggleAll handler provided.')
        },
    };

    return RTCheckboxTable;
};

const TreeTableHoc = (Component) => {
    const wrapper = (componentProps) => {
        const TrComponent = (props) => {
            const {ri, ...rest} = props;
            if (ri && ri.groupedByPivot) {
                const cell = props.children[ri.level];
                cell.props.style.flex = 'unset';
                cell.props.style.width = '100%';
                cell.props.style.maxWidth = 'unset';
                cell.props.style.paddingLeft = `${componentProps.treeTableIndent * ri.level}px`;
                cell.props.style.borderBottom = '1px solid rgba(128,128,128,0.2)';
                return <div {...rest}>{cell}</div>;
            }
            return <Component.defaultProps.TrComponent {...rest} />;
        };

        const getTrProps = (state, ri, ci, instance) => {
            state.pageSize = 0;
            state.minRows = 0;
            return {state, ri};
        };

        const {columns, ...rest} = componentProps;
        const extra = {
            columns: columns.map((col) => {
                let column = col;
                if (rest.pivotBy && rest.pivotBy.includes(col.accessor)) {
                    column = {
                        ...col,
                        accessor: col.accessor,
                        width: `${componentProps.treeTableIndent}px`,
                        show: false,
                        Header: '',
                    }
                }
                return column;
            }),
            TrComponent,
            getTrProps,
            PaginationComponent: PaginationAndCountComponent
        };
        return (
            <Component {...rest} {...extra} />
        )
    };
    wrapper.displayName = 'RTTreeTable';
    wrapper.defaultProps =
        {
            treeTableRowBackground: '#EEE',
            treeTableIndent: 10,
        };
    return wrapper;
};

const ReactTable = (props) => {
    return <ReactTableOriginal {...props} PaginationComponent={PaginationAndCountComponent}/>
};

export {ReactTable};
export const CheckBoxTable = CheckboxTableHoc(ReactTableOriginal);
export const TreeTable = TreeTableHoc(ReactTableOriginal);
