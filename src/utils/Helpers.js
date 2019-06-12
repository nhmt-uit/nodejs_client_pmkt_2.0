import $ from 'jquery';

//Show global loading
export function showLoading() {
    $('.wrap-loader').show();
}

//Hide global loading
export function hideLoading() {
    $('.wrap-loader').delay(200).hide(0);
}