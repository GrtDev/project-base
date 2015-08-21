/**
 * @author  Geert Fokke
 * @mail    geert@tamtam.nl
 * @www     www.tamtam.nl
 */

// @formatter:off

var CookieManager           = require('./CookieManager');


var COOKIE_ID               = 'accept-cookies';
var COOKIE_SHOW_CLASS       = 'show';

var _cookieManager          = CookieManager.getInstance();
var _notification;
var _closeButton;
var _delayId;

// @formatter:on


/**
 * Adds 'open' class to the cookie notification
 * @param opt_delay {number=} delay in milliseconds
 */
function openNotification ( opt_delay ) {

    if( !_notification || !_closeButton ) return console.log( 'Error: failed to find the cookie notification or its close button....' );

    if( _delayId ) clearTimeout( _delayId );
    _delayId = setTimeout( function () {

        _notification.className = _notification.className + ' ' + COOKIE_SHOW_CLASS;
        _closeButton.addEventListener( 'click', handleCloseButtonClick );

    }, opt_delay || 0 );

}

/**
 *  Removes the 'open' class from the cookie notification
 *  Als kills the timeout if there is one.
 */
function closeNotification () {

    _cookieManager.set( COOKIE_ID, true, Infinity )

    if( _delayId ) clearTimeout( _delayId );
    _notification.className = _notification.className.replace( new RegExp( '\\b\\s?' + COOKIE_SHOW_CLASS + '\\b', 'i' ), '' );
    _closeButton.removeEventListener( 'click', handleCloseButtonClick );

}


function handleCloseButtonClick ( event ) {

    closeNotification();

}


var cookieNotification = {

    check: function () {

        // retrieve elements
        _notification = document.getElementById( 'cookie-notification' );
        _closeButton = _notification ? _notification.getElementsByClassName( 'js-close' )[ 0 ] : null;

        if( !_notification ) return;
        if( !_closeButton ) return console.log( 'error: cookie notification found, but not it\'s close button?' );


        // Check if the cookie exists, otherwise open up the notification with a 500ms delay for smoother animation.
        if( !_cookieManager.has( COOKIE_ID ) ) openNotification( 500 );

    }

}

module.exports = cookieNotification;

