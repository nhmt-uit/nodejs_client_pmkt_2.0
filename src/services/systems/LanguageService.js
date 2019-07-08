import { AppConfig } from 'my-constants';
import { BaseService, HttpService } from 'my-utils/core';

class LanguageService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/language`;
    /*
    |--------------------------------------------------------------------------
    | @content: get generate language
    |--------------------------------------------------------------------------
    */
    getLanguage(lang_code){
        const payload = {code: lang_code, updateLang: true};

        return HttpService.post(`${this.serviceUrl}/get`, payload).then(res => {
            if (res.status === true) {
                /*
                |--------------------------------------------------------------------------
                | Map language key:value
                |--------------------------------------------------------------------------
                */
                const langKeys = res.res.data.key, langVals = res.res.data.map
                let listLang = {}
                for (let x in langKeys ) {
                    if(typeof langVals[langKeys[x].id] !== "undefined") {
                        let key = langKeys[x].name
                        let value = langVals[langKeys[x].id].name
                        key = key.replace('{', '{{')
                        key = key.replace('}', '}}')
                        value = value.replace('{', '{{')
                        value = value.replace('}', '}}')
                        listLang[key] = value
                        
                        //extra key lowercase
                        key = key.toLowerCase()
                        listLang[key] = value
                    }
                }
                res.res.listLang = listLang
                return res.res
            }
        })
    }
}

export default new LanguageService()