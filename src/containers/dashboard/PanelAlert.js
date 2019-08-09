import React, {Component} from 'react';
import { isEmpty as _isEmpty} from 'lodash'

import { TransComponent } from 'my-components'
import AlertService from 'my-services/systems/AlertService'

class PanelAlert extends Component{
    state = {
        listNotify: []
    }

    componentWillMount() {
        AlertService.getAlert().then(res => {
            if(res.status){
                this.setState({listNotify: res.res.data})
            }
        })
    }

    render() {
        const listNotify =  this.state.listNotify
        if(_isEmpty(listNotify)) return null;
        return (
            <div className="row widget-row">
                <div className="col-xs-12 col-md-6">
                    <div className="portlet light bordered">
                        <div className="portlet-title">
                            <div className="col-xs-6 col-md-9 caption">
                                <i className="icon-social-dribbble font-green hide"></i>
                                <span className="caption-subject font-dark bold uppercase"> <TransComponent i18nKey="Overview" /></span>
                            </div>
                            <div>
                                <ul className="col-xs-6 col-md-3 nav nav-tabs">
                                    <li>
                                        <i className="fa fa-minus font-green-haze"></i>
                                        <span> <TransComponent i18nKey="Turnover" /></span>
                                    </li>
                                    <li>
                                        <i className="fa fa-minus font-yellow-casablanca"></i>
                                        <span> <TransComponent i18nKey="Tickets" /></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="portlet-body">
                            <div className="mt-btm-transform">
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-md-6">
                    <div className="portlet light bordered">
                        <div className="portlet-title">
                            <div className="caption">
                                <i className="icon-social-dribbble font-green hide"></i>
                                <span className="caption-subject font-dark bold uppercase"> <TransComponent i18nKey="Alert" /></span>
                            </div>
                        </div>
                        <div className="portlet-body table-responsive" style={{maxHeight:"400px", overflowY: 'auto', overflowX: 'hidden'}}>
                            <div className="mt-btm-transform ">
                                {/*====================================================================*/}
                                {
                                    listNotify.length ?
                                    listNotify.map(function (items) {
                                    return(
                                        <div className="portlet box blue-hoki" key={items.created}>
                                            <div className="portlet-title">
                                                <div className="caption">
                                                    <i className="fa fa-newspaper-o"></i> {items.created_format}
                                                </div>
                                            </div>
                                            <div className="portlet-body" className={items.type === 1 ? 'bg-success' : items.type === 2 ? 'bg-danger' : 'bg-white'} style={{padding: '10px'}}>
                                                <div id="sample_3_wrapper" className="dataTables_wrapper no-footer">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            {/*Render HTML string as real HTML in a React component*/}
                                                            <div key={items.id} dangerouslySetInnerHTML={{ __html: items.name }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}) : <tr><td className="text-center" colSpan="20"><TransComponent i18nKey="Data Empty" /></td></tr>
                                }
                                {/*====================================================================*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}



export default PanelAlert