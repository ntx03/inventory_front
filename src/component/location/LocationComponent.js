import {Col, Input, Row} from 'antd';
import {LocationCardComponent} from 'component/location/LocationCardComponent';
import {LayoutContent} from 'layout/LayoutContent';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {ErrorComponent} from '../base/ErrorComponent';
import {LoadingComponent} from '../base/LoadingComponent';
import {LocationTreeButtonsComponent} from './LocationTreeButtonsComponent';
import {LocationTreeComponent} from './LocationTreeComponent';

@inject('locationViewStore')
@observer
export class LocationComponent extends React.Component {
    render() {
        const {locationViewStore} = this.props;
        if (locationViewStore.stateLoad.pending) {
            return <LoadingComponent/>
        }
        if (locationViewStore.stateLoad.errors) {
            return <ErrorComponent errors={locationViewStore.stateLoad.errors}/>
        }
        return (
            <LayoutContent title='Местоположения'>
                <Row className='location'>
                    <Col className='location_list'
                         style={{marginRight: 5}}>
                        <Row className='location_search'>
                            <Input.Search className='search'
                                          placeholder="Найти"
                                          onChange={this.handleInputSearchChange}/>
                            <LocationTreeButtonsComponent/>
                        </Row>
                        <Row id='componentScroll'
                             className='location_tree'>
                            <LocationTreeComponent/>
                        </Row>
                    </Col>
                    {locationViewStore.showEditor &&
                    <Col className='location_editor'
                         style={{marginLeft: 5}}>
                        <LocationCardComponent/>
                    </Col>
                    }
                </Row>
            </LayoutContent>
        )
    }


    handleInputSearchChange = e => {
        const {locationViewStore} = this.props;
        locationViewStore.setLocationIdListBySearchValue(e.target.value);
    };
}