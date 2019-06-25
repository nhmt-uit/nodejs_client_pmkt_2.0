import $ from 'jquery';
import _ from 'lodash';

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

export function flatMap(arr, cb) {
    const flatMap = [];

    arr = _.toArray(arr);

    const stack = arr.map(function (item, index) {
        return { level: 0, item, index, parent: [] };
    }).reverse();

    while (stack.length > 0) {
        const elem = stack.pop();

        if (typeof cb !== 'function') continue;

        const nextElem = cb(elem.level, elem.item, elem.parent, elem.info, elem.index);

        if (_.has(nextElem, 'value')) {
            flatMap.push(nextElem.value);
        }

        if (nextElem.child) {
            ((elem, nextElem, stack)=> {
                let count = 0;

                _.toArray(nextElem.child).map(function (item, index) {
                    const itemtam = {};

                    count ++;

                    const parent = elem.parent.slice();

                    parent.push(elem.item);

                    if(elem.level === 3) {
                        itemtam['name'] = item.name;
                        itemtam['name1'] = count + " - " + item.name;
                        itemtam['child'] = item.child;
                        itemtam['id'] = item.id;
                        itemtam['is_exported'] = item.is_exported;
                        itemtam['level'] = item.level;

                        return {
                            level: elem.level + 1,
                            item: itemtam,
                            parent,
                            info: nextElem.info,
                            index
                        }
                    }

                    return {
                        level: elem.level + 1,
                        item,
                        parent,
                        info: nextElem.info,
                        index
                    }
                }).reverse().forEach(function (item) {
                    stack.push(item);
                });
            }).call(null, elem, nextElem, stack);
        }
    }
    return flatMap;
}