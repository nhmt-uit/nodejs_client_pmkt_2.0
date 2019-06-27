import $ from 'jquery';

//Show global loading
export function showLoading() {
    $('.wrap-loader').show();
}

//Hide global loading
export function hideLoading(delay = 200) {
    $('.wrap-loader').delay(delay).hide(0);
}

export function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
}

export function formatFormulaName(formulaName) {
    try {
        return formulaName.replace(/^([^-]*-)/gi, "")
    } catch (e) {
        console.log(e)
    }
}