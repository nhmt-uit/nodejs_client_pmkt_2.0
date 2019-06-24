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
}

export default new ReportService()