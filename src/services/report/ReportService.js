import { AppConfig } from 'my-constants';
import { BaseService, HttpService } from 'my-utils/core';

class ReportService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/report_detail`;
    /*
    |--------------------------------------------------------------------------
    | @content: get report cycle page
    |--------------------------------------------------------------------------
    */
    getCyclePage(pagination){
        return HttpService.post(`${this.serviceUrl}/get_cycle_page`, pagination);
    }

    /*
    |--------------------------------------------------------------------------
    | @content: close cycle
    |--------------------------------------------------------------------------
    */
    closeCycle(chuky){
        return HttpService.post(`${this.serviceUrl}/close`, chuky);
    }

    /*
    |--------------------------------------------------------------------------
    | @content: delete cycle
    |--------------------------------------------------------------------------
    */
    delCycle(value){
        return HttpService.post(`${this.serviceUrl}/delete_cycle`, value);
    }

    /*
    |--------------------------------------------------------------------------
    | @content: get report
    | @params: { chuky_id }
    |--------------------------------------------------------------------------
    */
    getReport(post){
        return HttpService.post(`${this.serviceUrl}/get_report`, post);
    }

    /*
    |--------------------------------------------------------------------------
    | @content: get report by member
    | @params: {
    |    chuky_id,
    |    member_name,
    | }
    |--------------------------------------------------------------------------
    */
    getReportByMember(post){
        return HttpService.post(`${this.serviceUrl}/get_report_by_member`, post);
    }

    /*
    |--------------------------------------------------------------------------
    | @content: get report by banker
    | @params: {
    |    chuky_id,
    |    banker_id,
    | }
    |--------------------------------------------------------------------------
    */
    getReportByBanker(post){
        return HttpService.post(`${this.serviceUrl}/get_report_by_banker`, post);
    }

    /*
    |--------------------------------------------------------------------------
    | @content: money exchange
    |--------------------------------------------------------------------------
    */
    moneyExchange(post){
        return HttpService.post(`${this.serviceUrl}/money_exchange`, post);
    }

    /*
    |--------------------------------------------------------------------------
    | @content: delete money exchange
    |--------------------------------------------------------------------------
    */
    deleteMoneyExchange(post){
        return HttpService.post(`${this.serviceUrl}/delete_money_exchange`, post);
    }
}

export default new ReportService()