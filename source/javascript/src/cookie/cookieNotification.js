// @formatter:off

var _cookieManager          = require('./CookieManager').getInstance();


var COOKIE_ID               = 'some-cookie-id'

var _notification           = document.getElementById('cookie-notification');
var _closeButton            = _notification ? _notification.getElementsByClassName('button--close')[0] : null;
var _delayId;

// @formatter:on

// Check if the cookie exists, otherwise open up the notification with a 500ms delay for smoother animation.
if(!_cookieManager.has(COOKIE_ID)) openNotification(500);


/**
 * Adds 'open' class to the cookie notification
 * @param opt_delay {number=} delay in milliseconds
 */
function openNotification(opt_delay) {

    if(!_notification || !_closeButton) return console.log('Error: failed to find the cookie notification or its close button....');

    if(_delayId) clearTimeout(_delayId);
    _delayId = setTimeout(function () {

        _notification.className = _notification.className + ' show';
        _closeButton.addEventListener('click', handleCloseButtonClick);

    }, opt_delay || 0);

}

/**
 *  Removes the 'open' class from the cookie notification
 *  Als kills the timeout if there is one.
 */
function closeNotification() {

    // disabled for preview
    //_cookieManager.set(COOKIE, true, Infinity)

    if(_delayId) clearTimeout(_delayId);
    _notification.className = _notification.className.replace(/\sshow/, '');
    _closeButton.removeEventListener('click', handleCloseButtonClick);
}


function handleCloseButtonClick(event) {

    closeNotification();

}

