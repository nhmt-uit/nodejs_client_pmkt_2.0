import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { isEmpty as _isEmpty } from 'lodash'


class AccountantBankerAccountResultRowContainer extends Component {
    render() {
        const { item, level } = this.props
        console.log(this.props.level)
        return (
            <tr>
                <td>
                    <span className={`spacing-${level}`}></span>
                    {!_isEmpty(item.child) ? <><i className="fa fa-chevron-right"></i><span className="spacing-0"></span></> : <span className="placeholder-parent"></span>}
                    { item.username }
                </td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
            </tr>
        )
    }
}



const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(AccountantBankerAccountResultRowContainer);