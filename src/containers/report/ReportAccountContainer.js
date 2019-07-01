import React, { Component } from 'react';
import { cloneDeep } from 'lodash';

import { Helpers } from 'my-utils';

export default class ReportAccountContainer extends Component {
    constructor(props) {
        super(props);

        this.state = { visible: {} };
    }
    handleToggleAccount = id => _ => {
        const visible = this.state.visible;

        visible[id] = visible[id] !== undefined ? !visible[id] : true;

        this.setState({ visible });
    }

    groupAccount(account) {
        let rs = {};

        account.forEach(item => {
            if (item.parent === 0) {
                rs = item;
            } else {
                rs[item.parent] = rs[item.parent] || [];
                rs[item.parent].push(item);
            }
        });

        return rs;
    }

    renderItem(account) {
        const { currencyMap, order } = this.props;
        const visible = this.state.visible;
        const rs = [];

        let level = 0;

        const recursiveItem = ((item, level, state) => {
            const marginLeft = `${level * 10}px`;
            const iconChild = visible[item.state] ? <icon style={{ marginLeft }} className="fa fa-chevron-down" /> : <icon style={{ marginLeft }} className="fa fa-chevron-right" />
            const elmDOM = (
                <tr key={item.state} className="cursor-pointer" onClick={this.handleToggleAccount(item.state)}>
                    <td>{ level === 0 ? order : null }</td>
                    <td>
                        {
                            account[item.id] 
                                ? <>{ iconChild }<span>&nbsp;&nbsp;{item.name}</span></>
                                : <span style={{ marginLeft }}>&nbsp;&nbsp;{item.name}</span> 
                        }
                    </td>
                    {
                        currencyMap.map((currency, i) => {
                            const value = item.total[currency.dv_tien_te_id] ?  item.total[currency.dv_tien_te_id].result : 0;
                            const className = Number(value) < 0 ? 'font-red' : 'font-blue-steel';

                            return <td className={className} key={i}>{Helpers.formatMoney(Number(value), 0)}</td>;
                        })
                    }
                    <td className="text-center">
                        { item.deleteMoneyExchange ? <icon className="fa fa-close" /> : <>&nbsp;</> }
                    </td>
                    <td className="text-center td-exchange-money">
                        { level === 0 ? <label className="mt-checkbox mt-checkbox-outline">&nbsp;<input type="checkbox"/><span /></label> : null }
                    </td>
                </tr>
            );
            
            if (level === 0 || visible[state]) {
                rs.push(elmDOM);

                if (account[item.id]) {
                    account[item.id].forEach(elm => {
                        recursiveItem(elm, level + 1, item.state);
                    });
                }
            }
        })

        recursiveItem(account, level);

        return rs;
    }

    render() {
        const { item } = this.props;
        const data = this.groupAccount(cloneDeep(item));
        const result = this.renderItem(data);

        return result;
    }
}
