import React, {Component} from 'react'

class AccountantQuickActivitiesContainer extends Component{
    render() {
        return (
            <div>
                <div className="col-sm-4">
                    <label className="mt-checkbox">
                        <input type="checkbox"/> Check All
                        <span></span>
                    </label>
                </div>
                <div className="col-sm-4">
                </div>
                <div className="col-sm-4">
                    <div className="col-sm-6">
                        <label className="mt-checkbox">
                            <input type="checkbox"/> Show All
                            <span></span>
                        </label>
                    </div>
                    <div className="col-sm-2">
                        <button className="btn red">
                            Error Account
                        </button>
                    </div>
                    <div className="col-sm-2">

                    </div>
                    <div className="col-sm-2">
                        <button className="btn red">
                            Close All
                        </button>
                    </div>
                </div>
                <div className="clearfix"></div>
                <div className="clearfix"></div>
            </div>
        );
    }
}

export default AccountantQuickActivitiesContainer;