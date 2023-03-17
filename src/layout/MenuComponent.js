import {Icon, Menu as AntMenu} from 'antd';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {authority} from 'utils/Authority';

@inject('controllerStore')
@observer
export class MenuComponent extends React.Component {
    render() {
        const controllerName = this.props.controllerStore.controllerName;
        return (
            <AntMenu mode="horizontal"
                     theme="dark"
                     selectedKeys={[controllerName]}
                     onSelect={({key}) => {
                         this._handelSelect(key)
                     }}
                     subMenuOpenDelay={0.3}
                     subMenuCloseDelay={0.1}>
                {authority.EQUIPMENT_SHOW_MENU &&
                <AntMenu.Item key="equipment">
                    <span>
                        <Icon type="hdd"/>
                        Оборудование
                    </span>
                </AntMenu.Item>
                }
                {authority.CONSUMABLES_SHOW_MENU &&
                <AntMenu.Item key="consumables">
                    <span>
                        <Icon type="retweet"/>
                        Расходники
                    </span>
                </AntMenu.Item>
                }
                {authority.HARDWARE_MOVE_SHOW_MENU &&
                <AntMenu.SubMenu key="moves"
                                 title={
                                     <span>
                                         <Icon type="compass"/>
                                         Перемещения
                                     </span>}>
                    <AntMenu.Item key="consignment">
                    <span>
                        <Icon type="info"/>
                        Открытые
                    </span>
                    </AntMenu.Item>
                    <AntMenu.Item key="consignment.sent">
                    <span>
                        <Icon type="check"/>
                        Отправленные
                    </span>
                    </AntMenu.Item>
                    <AntMenu.Item key="consignment.accepted">
                    <span>
                        <Icon type="clock-circle-o"/>
                        Архив
                    </span>
                    </AntMenu.Item>
                </AntMenu.SubMenu>
                }
                {authority.CATALOG_SHOW_MENU &&
                <AntMenu.SubMenu key="catalog"
                                 title={
                                     <span>
                                         <Icon type="book"/>
                                         Справочники
                                     </span>}>
                    {authority.VENDOR_SHOW_MENU &&
                    <AntMenu.Item key="vendor">
                    <span>
                        Производители
                    </span>
                    </AntMenu.Item>
                    }
                    {authority.MODEL_SHOW_MENU &&
                    <AntMenu.Item key="model">
                    <span>
                        Модели
                    </span>
                    </AntMenu.Item>
                    }
                    {authority.HARDWARE_TYPE_SHOW_MENU &&
                    <AntMenu.Item key="hardwareType">
                    <span>
                        Типы оборудования
                    </span>
                    </AntMenu.Item>
                    }
                    {authority.STATE_SHOW_MENU &&
                    <AntMenu.Item key="state">
                    <span>
                        Состояния
                    </span>
                    </AntMenu.Item>
                    }
                    {authority.LOCATION_SHOW_MENU &&
                    <AntMenu.Item key="location">
                    <span>
                        Местоположения
                    </span>
                    </AntMenu.Item>
                    }
                    {authority.LOCATION_TAG_SHOW_MENU &&
                    <AntMenu.Item key="location.tag">
                    <span>
                        Теги местоположения
                    </span>
                    </AntMenu.Item>
                    }
                    {authority.CONTRACT_SHOW_MENU &&
                    <AntMenu.Item key="contract">
                    <span>
                        Договоры
                    </span>
                    </AntMenu.Item>
                    }
                    {authority.PROVIDER_SHOW_MENU &&
                    <AntMenu.Item key="provider">
                    <span>
                        Поставщики
                    </span>
                    </AntMenu.Item>
                    }
                </AntMenu.SubMenu>
                }
                {authority.REPORT_SHOW_MENU &&
                <AntMenu.Item key="reports">
                    <span>
                        <Icon type="dashboard"/>
                        Отчеты
                    </span>
                </AntMenu.Item>
                }
                {authority.ADMINISTRATION_SHOW_MENU &&
                <AntMenu.SubMenu key="administration"
                                 title={<span><Icon type="coffee"/>Администрирование</span>}>
                    {authority.CHANGE_USER_RIGHTS &&
                    <AntMenu.Item key="user">
                    <span>
                        <Icon type="user"/>
                        Пользователи
                    </span>
                    </AntMenu.Item>
                    }
                    {authority.GROUP_SHOW_MENU &&
                    <AntMenu.Item key="group">
                    <span>
                        <Icon type="team"/>
                        Группы
                    </span>
                    </AntMenu.Item>
                    }
                    {authority.EQUIPMENT_JOURNAL_VIEW &&
                    <AntMenu.Item key="equipment.journal">
                    <span>
                        <Icon type="team"/>
                        Журнал действий с оборудованием
                    </span>
                    </AntMenu.Item>
                    }
                </AntMenu.SubMenu>
                }
            </AntMenu>
        )
    }

    _handelSelect = (key) => {
        this.props.controllerStore.navigate(key)
    };
}