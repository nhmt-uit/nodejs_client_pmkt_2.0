import { LanguageActionType } from 'my-constants/action-types';
import LanguageService from 'my-services/systems/LanguageService'
import i18n from 'my-utils/i18n';
import { CookieService } from 'my-utils/core';
import { lang } from 'moment';

export const changeLanguage = (lang_code) => {
    return (dispatch) => {
        lang_code = CookieService.get('lang') || lang_code;
        return LanguageService.getLanguage(lang_code).then(res => {
			i18n.removeResourceBundle(lang_code, "translation");
			i18n.addResourceBundle(lang_code, "translation", res.listLang);
			i18n.reloadResources(lang_code, "translation");
            i18n.changeLanguage(lang_code);

            dispatch({
                type: LanguageActionType.ON_CHANGE_LANGUAGE,
                payload: res.listLang,
                lang_code: lang_code
            })
        })
    }
};
