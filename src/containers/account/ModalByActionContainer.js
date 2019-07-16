import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { isEmpty as _isEmpty } from 'lodash';
import { connect } from 'react-redux';

import { ModalFormAccountContainer } from 'my-containers/account';

class ModalByActionContainer extends Component {
    static propTypes = {
        onToggleModal: PropTypes.bool,
    };

    render() {
        const { selectedItem } = this.props;

        if (_isEmpty(selectedItem)) {
            return <ModalFormAccountContainer formType="create" />;
        }

        return <ModalFormAccountContainer formType="update" />;
    }
}

const mapStateToProps = state => {
    return {
        selectedItem: state.AccountReducer.selectedItem || {},
    };
};

export default connect(mapStateToProps, null)(ModalByActionContainer);