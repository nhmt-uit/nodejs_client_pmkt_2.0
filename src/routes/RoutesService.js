import { find, forEach, cloneDeep } from "lodash";
import path from 'path';

const listAdminRoutes = [
    /*==========================================================================*/
    { name: "AUTH_LOGIN", path: "/auth/:type", language: "en"},
    /*==========================================================================*/
    { name: "AUTH_LOGOUT", path: "/auth/logout", language: "en"},
    /*==========================================================================*/
    { name: "MAINPAGE", path: "/", language: "en"},
    /*==========================================================================*/
    { name: "DASHBOARD", path: "/dashboard", language: "en"},
    
    /*==========================================================================*/
    { name: "ACCOUNTANT_DASHBOARD", path: "/accountant", language: "en"},
    /*==========================================================================*/
    { name: "ACCOUNTANT_LIST", path: "/accountant/list", language: "en"},
    /*==========================================================================*/
    { name: "ACCOUNTANT_MANUAL", path: "/accountant/manual", language: "en"},
    /*==========================================================================*/
    { name: "ACCOUNTANT_MANUAL_PROCESS", path: "/accountant/manual/:bankerName/:type", language: "en"},
    /*==========================================================================*/
    { name: "ACCOUNTANT_REPORT", path: "/accountant/report", language: "en"},
    /*==========================================================================*/
    { name: "ACCOUNTANT_REPORT_DETAIL", path: "/accountant/report/detail_template/:chuky_id/:cycle_name", language: "en"},
    /*==========================================================================*/
    { name: "ACCOUNTANT_REPORT_TRANSACTION", path: "/accountant/report/transaction", language: "en"},
    /*==========================================================================*/


    /*==========================================================================*/
    // {name: "REPORT_DETAIL", path: "/report_detail_template/:chuky_id?", language: "en"},
    /*==========================================================================*/


    /*==========================================================================*/
    { name: "MANAGE_DASHBOARD", path: "/manage", language: "en"},
    /*==========================================================================*/
    { name: "MANAGE_CREATE_NEW", path: "/manage/create_new", language: "en"},
    /*==========================================================================*/
    { name: "MANAGE_CONFIGURATION", path: "/manage/configuration", language: "en"},
    /*==========================================================================*/
    { name: "MANAGE_FORMULA", path: "/manage/formula", language: "en"},
    /*==========================================================================*/
    { name: "MANAGE_FORMULA_GROUP", path: "/manage/formula_group", language: "en"},
    /*==========================================================================*/
    { name: "MANAGE_MEMBER", path: "/manage/member", language: "en"},
    /*==========================================================================*/
    { name: "MANAGE_ACCOUNT", path: "/manage/account", language: "en"},
    /*==========================================================================*/
    { name: "MANAGE_ACCOUNT_SUB", path: "/manage/account-sub", language: "en"},
    /*==========================================================================*/

    /*==========================================================================*/
    { name: "CHANGE_PASSWORD", path: "/change-password", language: "en"},
    /*==========================================================================*/
    { name: "CHANGE_PASSWORD_2", path: "/change-password-2", language: "en"},
    /*==========================================================================*/
    { name: "CHANGE_SECURE_CODE", path: "/change-secure-code", language: "en"},
    /*==========================================================================*/

    /*============================== start ADMIN ROUTES ==================================*/
    { name: "LANGUAGE", path: "/lang", language: "en"},
    { name: "CURRENCY_TYPE", path: "/currency-type", language: "en"},
    { name: "HOST", path: "/host", language: "en"},
    { name: "NOTICE", path: "/notice", language: "en"},
    { name: "LOG_CHANGE_PASSWORD", path: "/log-change-password", language: "en"},
    { name: "SUB_STATUS", path: "/sub-status", language: "en"},
    { name: "SET_FEATURES", path: "/user-features", language: "en"},
    /*============================== end ADMIN ROUTES ==================================*/
];

/*
|--------------------------------------------------------------------------
| Class Manage Routes
| Ex:
|   - RoutesService.setLanguage('en').getPath('ADMIN', 'BLOG_FORM', { method: 'create'}, {name: 'acb', age: 32});
|   - RoutesService.getPath('ADMIN', 'BLOG_FORM', { method: 'create'}, {name: 'acb', age: 32});
|--------------------------------------------------------------------------
*/
class RoutesService {
    language = "en";

    /*
    |--------------------------------------------------------------------------
    | Set Language
    |--------------------------------------------------------------------------
    */
    setLanguage(language) {
        this.language = language;
        return this;
    }

    /*
    |--------------------------------------------------------------------------
    | @params: { method: heroId, id: 'foo' }
    | @queryParams: {name: "teo", age: 34}
    | Ex: ('ADMIN', 'BLOG_FORM', { method: 'create'}, {name: 'acb', age: 32})
    |--------------------------------------------------------------------------
    */
    getPath(area, name, params, queryParams) {
        let routes;
        switch (area) {
            case "ADMIN":
                routes = find(listAdminRoutes, { name, language : this.language });
                break;
            case "ADMIN_MANAGE":
                routes = find(listAdminRoutes, { name, language : this.language });

                if (routes && routes.path) {
                    routes = cloneDeep(routes);

                    routes.path = path.join('/admin', routes.path);
                }

                break;
            default: break;
        }

        if(typeof routes !== "undefined") {
            return this.buildFullPath(routes.path, params, queryParams);
        } else {
            return "/";
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Build url with params & query params
    |--------------------------------------------------------------------------
    */
    buildFullPath(path, params, queryParams) {
        //Add Params Into Path
        if(params) {
            forEach(params, (value, key) => {
                let pattern = new RegExp(`/:${key}[^/]?[^?]?`, "gi");
                path = path.replace(pattern, `/${value}/`);
            });

            //Remove All Params Without Specified
            // path = path.replace(/:.*[^/]?[^?]?/gi, "");

            //Remove Last / In Path
            path = path.replace(/\/$/gi, "");
        }

        //Add Query Params Into Path
        if(queryParams) {
            const queryString = this.serialize(queryParams);
            //Check path exist query params
            if(path.indexOf('?') !== -1) {
                path = `${path}&${queryString}`;
            } else {
                path = `${path}?${queryString}`;
            }
        }

        return path;
    }

    /*
    |--------------------------------------------------------------------------
    | Convert Object To Query String
    |--------------------------------------------------------------------------
    */
    serialize(object) {
        let str = [];
        for (let p in object)
            if (object.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(object[p]));
            }
        return str.join("&");
    }
}

export default new RoutesService();