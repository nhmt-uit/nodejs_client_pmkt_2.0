import $ from 'jquery';

//Show global loading
export function showLoading() {
    $('.wrap-loader').show();
}

//Hide global loading
export function hideLoading(delay = 200) {
    $('.wrap-loader').delay(delay).hide(0);
}

export function sep1000(somenum, usa, fixed) {
    if (isNaN(somenum)) return somenum;
    somenum = eval(somenum);
    if (fixed) {
        if (isFloat(somenum)) {
            somenum = somenum.toFixed(fixed);
        } else {
            somenum = parseFloat(somenum).toFixed(fixed)
        }
        if (somenum == 0) {
            return somenum
        }
    }

    const a = Math.abs(somenum);
    const check = String(a).split(/[.,]/);
    check[0] = check[0].replace(/^[-+]/, '');
    if (check[0].length <= 3) {
        return somenum;
    }
    var dec = String(somenum).split(/[.,]/)
        , sep = usa ? ',' : '.'
        , decsep = usa ? '.' : ',';

    return xsep(dec[0], sep) + (dec[1] ? decsep + dec[1] : '');

    function xsep(num, sep) {
        var n = String(num).split('')
            , i = -3;
        while (n.length + i > 0) {
            n.splice(i, 0, sep);
            i -= 4;
        }
        n = n.join('');
        n = n.replace(/^(-,)/, '-');
        return n;
    }

    function isFloat(n) {
        return n === Number(n) && n % 1 !== 0;
    }
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