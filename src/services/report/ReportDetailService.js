import { AppConfig } from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class ReportDetailService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/report_detail`;

    getReportDetail(chuky_id) {
        const payload = {chuky_id: chuky_id}
        return HttpService.post(`${this.serviceUrl}/get_report`, payload)
    }
}

export default new ReportDetailService()