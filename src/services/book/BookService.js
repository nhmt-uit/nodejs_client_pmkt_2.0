import { AppConfig} from 'my-constants'
import { BaseService, HttpService} from 'my-utils/core'

class BookService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/book`
    /*
    |--------------------------------------------------------------------------
    | @description: get all book tab
    |--------------------------------------------------------------------------
    */
    getTab() {
        return HttpService.post(`${this.serviceUrl}/get_tab`)
    }
}

export default new BookService()