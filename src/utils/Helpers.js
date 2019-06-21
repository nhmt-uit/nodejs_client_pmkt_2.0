import $ from 'jquery';

//Show global loading
export function showLoading() {
    $('.wrap-loader').show();
}

//Hide global loading
export function hideLoading(delay = 200) {
    $('.wrap-loader').delay(delay).hide(0);
}