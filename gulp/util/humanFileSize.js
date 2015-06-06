/**
 *  Converts bytes into a human readable string.
 *  @param bytes {number} number of bytes
 *  @param decimal {boolean} use decimal or binary format for conversion.
 *
 *  @see: http://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable
 */
function humanFileSize(bytes, decimal) {
    var threshold = decimal ? 1000 : 1024;
    if(Math.abs(bytes) < threshold)
    {
        return bytes + ' B';
    }
    var units = decimal
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= threshold;
        ++u;
    } while (Math.abs(bytes) >= threshold && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}

module.exports = humanFileSize;