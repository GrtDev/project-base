/**
 * A Singleton class containing a complete cookies reader/writer.
 *
 * Modified version of:
 * Cookies.js - 1.2.1
 * @see: https://github.com/ScottHamper/Cookies
 *
 * @constructor
 * @singleton
 * @private
 */
function CookieManager() {

    // Force the use of a single instance (Singleton)
    // This way we have only one access point to the cookies
    if(CookieManager.prototype._singletonInstance)
    {
        console.log('CookieManager:\tAttempting to instantiate a CookieManager object but this is a Singleton! Use `getInstance` method to retrieve a reference instead!');
        return null;
    }
    CookieManager.prototype._singletonInstance = this;

    var _this = this;
    // Allows for setter injection in unit tests
    var _document = window.document;
    // Used to ensure cookie keys do not collide with built-in `Object` properties
    var _cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
    var _maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');
    var _defaults = {
        path: '/',
        secure: false
    };

    var _cachedDocumentCookie;
    var _cache;
    var _enabled;

    /**
     * Get the cookie value
     * @public
     * @function get
     * @param key {string} cookie id
     * @returns {object}
     */
    _this.get = function (key) {

        if(_cachedDocumentCookie !== _document.cookie) renewCache();

        return _cache[_cacheKeyPrefix + key];
    };

    /**
     * Get the cookie value
     * @public
     * @function get
     * @param key {string} cookie id
     * @returns {boolean}
     */
    _this.has = function (key) {

        if(_cachedDocumentCookie !== _document.cookie) renewCache();

        return typeof _cache[_cacheKeyPrefix + key] !== 'undefined';
    };

    /**
     * Sets the value of a document cookie
     * @public
     * @function set
     * @param key {string} id of the cookie to set
     * @param value {(string|number|boolean)} value for this cookie
     * @param opt_expires {(Date|string|number)=} Date, dateString or number of seconds until expire moment (Infinity is supported).
     * @param opt_path {string=} The path from where the cookie will be readable.
     * @param opt_domain {string=} The domain from where the cookie will be readable. E.g., "example.com", ".example.com" (includes all subdomains) or "subdomain.example.com";
     * @param opt_secure {boolean=} The cookie will be transmitted only over secure protocol as https (boolean or null).
     * @returns {CookieManager}
     */
    _this.set = function (key, value, opt_expires, opt_path, opt_domain, opt_secure) {

        opt_expires = opt_expires || _defaults.expires;
        opt_path = opt_path || _defaults.path;
        opt_domain = opt_domain || _defaults.domain;
        opt_secure = opt_secure !== undefined ? opt_secure : _defaults.secure;
        // @typedef {Date} opt_expires
        opt_expires = getExpiresDate(value === undefined ? -1 : opt_expires);

        _document.cookie = generateCookieString(key, value, opt_expires, opt_path, opt_domain, opt_secure);

        return _this;
    };

    /**
     * Update the cached document cookie object.
     * @private
     */
    function renewCache() {
        _cache = getCacheFromString(_document.cookie);
        _cachedDocumentCookie = _document.cookie;
    };

    /**
     * Parse the given document cookie string
     * @private
     * @param documentCookie
     * @returns {{}}
     */
    function getCacheFromString(documentCookie) {
        var cookieCache = {};
        var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

        for (var i = 0, leni = cookiesArray.length; i < leni; i++)
        {
            var cookieKvp = getKeyValuePairFromCookieString(cookiesArray[i]);

            if(cookieCache[_cacheKeyPrefix + cookieKvp.key] === undefined)
            {
                cookieCache[_cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
            }
        }

        return cookieCache;
    };

    /**
     * Parse the given cookie string.
     * @private
     * @param cookieString {string}
     * @returns {{key: string, value: string}}
     */
    function getKeyValuePairFromCookieString(cookieString) {
        // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
        var separatorIndex = cookieString.indexOf('=');

        // IE omits the "=" when the cookie value is an empty string
        separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

        return {
            key: decodeURIComponent(cookieString.substr(0, separatorIndex)),
            value: decodeURIComponent(cookieString.substr(separatorIndex + 1))
        };
    };

    /**
     * Check if the date is valid
     * @private
     * @param date {Date}
     * @returns {boolean}
     */
    function isValidDate(date) {
        return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
    };

    /**
     * Get the Date object from the expire object.
     * @param expires {Date, string, number}  Date, dateString or number of seconds until expire moment.
     * @param opt_now {Date=}
     * @returns {*}
     */
    function getExpiresDate(expires, opt_now) {
        opt_now = opt_now || new Date();

        if(typeof expires === 'number')
        {
            expires = (expires === Infinity) ? _maxExpireDate : new Date(opt_now.getTime() + expires * 1000);

        } else if(typeof expires === 'string')
        {
            expires = new Date(expires);
        }

        if(expires && !isValidDate(expires))
        {
            throw new Error('`expires` parameter cannot be converted to a valid Date instance');
        }

        return expires;
    };

    /**
     * Create a cookie string from the given values.
     * @private
     * @param key {string} id of the cookie
     * @param value {string} value of the cookie
     * @param opt_expires {Date} expiry date
     * @param opt_path {string}
     * @param opt_domain {string}
     * @param opt_secure {boolean}
     * @returns {String}
     */
    function generateCookieString(key, value, opt_expires, opt_path, opt_domain, opt_secure) {

        key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
        key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
        value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);

        var cookieString = key + '=' + value;
        cookieString += opt_path ? ';path=' + opt_path : '';
        cookieString += opt_domain ? ';domain=' + opt_domain : '';
        cookieString += opt_expires ? ';expires=' + opt_expires.toUTCString() : '';
        cookieString += opt_secure ? ';secure' : '';

        return cookieString;
    };

    /**
     * Check if cookies are enabled by the user.
     * @private
     * @returns {boolean}
     */
    function areEnabled() {
        var testKey = 'CookieManager.js';
        var areEnabled = _this.set(testKey, 1).get(testKey) === '1';
        _this.expire(testKey);
        return areEnabled;
    };

    /**
     * Returns whether cookies are enabled or not.
     * @get enabled
     * @returns {boolean}
     */
    Object.defineProperty(this, 'enabled', {
        enumerable: true,
        get: function () {
            if(_enabled === undefined) _enabled = areEnabled();
            return _enabled;
        }
    });


}

/**
 * Returns an instance of the Cookie manager.
 * @public
 * @static
 * @function getInstance
 * @returns {CookieManager} A Cookie manager instance.
 */
CookieManager.getInstance = function () {
    return CookieManager.prototype._singletonInstance || new CookieManager();
};

module.exports = CookieManager;