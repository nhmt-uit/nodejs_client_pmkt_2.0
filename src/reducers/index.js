import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { reducer as flashReducer } from 'redux-flash'

// System Reducers
import AppReducer from './systems/AppReducer';
import LanguageReducer from './systems/LanguageReducer';
import AuthReducer from './systems/AuthReducer';
import AccountantReducer from './AccountantReducer';
import AccountantManualReducer from './AccountantManualReducer';
import AccountantAssignFormulaReducer from './AccountantAssignFormulaReducer';
import NotificationReducer from './systems/NotificationReducer';
import ChangePasswordReducer from './systems/ChangePasswordReducer';
import BankerReducer from './banker/BankerReducer'
import ChangeSecureCodeReducer from './systems/ChangeSecureCodeReducer'
import AlertReducer from './systems/AlertReducer';
import ReportReducer from './ReportReducer';
import AccountReducer from './AccountReducer';
import ReportDetailReducer from "./report/ReportDetailReducer";
import TransactionReducer from "./report/TransactionReducer";
import MemberReducer from "./member/MemberReducer";
import AccountSubReducer from "./account_sub/AccountSubReducer"
import FormulaReducer from "./formula/FormulaReducer"
import FormulaGroupReducer from "./formula-group/FormulaGroupReducer"
import ConfigurationReducer from './manage/ConfigurationReducer';
import CurrencyTypeReducer from './currency-type/CurrencyTypeReducer';
import SubStatusReducer from './sub-status/SubStatusReducer';

const appReducers = combineReducers({
    // Redux form reducer
    form: formReducer,
    flash: flashReducer,

    banker: BankerReducer,
    alert: AlertReducer,
    report_detail: ReportDetailReducer,
    member: MemberReducer,
    // type_of_money: TransactionReducer,

    // System reducers
    AppReducer,
    LanguageReducer,
    MemberReducer,
    AuthReducer,
    AccountSubReducer,
    TransactionReducer,
    AccountantAssignFormulaReducer,
    // Accountant Reducer
    AccountantReducer, AccountantManualReducer,
    NotificationReducer,
    ChangePasswordReducer,
    ChangeSecureCodeReducer,
    ReportReducer,
    AccountReducer,
    FormulaReducer,
    FormulaGroupReducer,
    ConfigurationReducer,
    CurrencyTypeReducer,
    SubStatusReducer
});

export default appReducers;