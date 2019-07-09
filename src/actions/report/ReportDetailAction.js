import { ReportDetailActionType } from 'my-constants/action-types'
import ReportDetailService from 'my-services/report/ReportDetailService'

export const getReportDetail = (chuky_id) => {
    return (dispatch) => {
        chuky_id = chuky_id || "5c6b823b79282518c5a00a55";
        return ReportDetailService.getReportDetail(chuky_id).then(res => {

            dispatch({
                type: ReportDetailActionType.GET_REPORT_DETAIL,
                chuky_id: chuky_id,
                payload: res,
            })
        })
    }
}