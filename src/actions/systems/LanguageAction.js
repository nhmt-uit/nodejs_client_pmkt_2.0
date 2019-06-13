import { LanguageActionType } from 'my-constants/action-types';
import LanguageService from 'my-services/systems/LanguageService'
import i18n from 'my-utils/i18n'

export const changeLanguage = (lang_code) => {
    return (dispatch) => {
        return LanguageService.getLanguage(lang_code).then(res => {
			i18n.removeResourceBundle(lang_code, "translation");
			i18n.addResourceBundle(lang_code, "translation", res);
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
