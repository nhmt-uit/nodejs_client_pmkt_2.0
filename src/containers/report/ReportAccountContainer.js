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

    handleDeleteMoneyExchange = (memberId, tranIds) => _ => {
        return this.props.onDeleteMoneyExchange(memberId, tranIds);
    }

    handleToggleCheckMoneyExchange = id => _ => {
        return this.props.onToggleCheckMoneyExchange(id);
    }

    renderItem(account) {
        const { currencyMap, order, btnMoneyExchangeClicked, tabActive } = this.props;
        const visible = this.state.visible;
        const rs = [];

        let level = 0;

        const recursiveItem = ((item, level, state) => {
            const marginLeft = `${level * 10}px`;
            const iconChild = visible[item.state] ? <i style={{ marginLeft }} className="fa fa-chevron-down" /> : <i style={{ marginLeft }} className="fa fa-chevron-right" />;
            const memberId = item.level === 0 ? item.id : item.user_id;
            const tranIds = item.level === 0 ? null : item.tranId;
            const elmDOM = (
                <tr key={item.state} >
                    <td>{ level === 0 ? order : null }</td>
                    <td className="cursor-pointer" onClick={this.handleToggleAccount(item.state)}>
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

                            return <td className={`${className} text-right`} key={i}>{Helpers.formatMoney(Number(value), 0)}</td>;
                        })
                    }
                    <td className="text-center">
                        { item.deleteMoneyExchange ? <i onClick={this.handleDeleteMoneyExchange(memberId, tranIds)} className="fa fa-close font-green cursor-pointer" /> : <>&nbsp;</> }
                    </td>
                    <td className="text-center td-exchange-money">
                        { (level === 0 && btnMoneyExchangeClicked  && tabActive === -1)
                            ? <label className="mt-checkbox mt-checkbox-outline">&nbsp;<input onClick={this.handleToggleCheckMoneyExchange(item.id)} type="checkbox"/><span /></label> 
                            : null
                        }
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
