import {AppConfig} from 'my-constants';
import {BaseService, HttpService} from "my-utils/core";

class TransactionService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/manual_transport_new`;

    getAllTransaction(){
        return HttpService.post(`${this.serviceUrl}/getall`)
    }

    getCycle(){
        return HttpService.post(`${this.serviceUrl}/chuky`)
    }

    getTypeOfMoney(){
        return HttpService.post(`${this.serviceUrl}/loaitien`)
    }

    saveTransaction(post){
        return HttpService.post(`${this.serviceUrl}/save`, post)
    }

    delTransaction(id){
       return HttpService.post(`${this.serviceUrl}/delete`, id)
    }

    getDetailReportById(id){
        return HttpService.post(`${this.serviceUrl}/get_detail_report_by_id`, id)
    }
}

export default new TransactionService()