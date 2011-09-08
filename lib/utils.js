exports.objCopy = function(obj, keys) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = {};
    if(arguments.length <= 1) {
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
    } else {
        for(var i = 1; i < arguments.length; i++) {
            copy[arguments[i]] = obj[arguments[i]];
        }
    }
    return copy;
};

exports.toArray = function(enu) {
    var arr = [];
    for ( var i = 0, l = enu.length; i < l; i++)
        arr.push(enu[i]);
    return arr;
};

exports.Logger = function(level) {
    var DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3;

    var doLog = function() {
        console.log(exports.toArray(arguments));
    };
    var doNothing = function() {
    };

    this.debug = level <= DEBUG ? doLog : doNothing;
    this.info = level <= INFO ? doLog : doNothing;
    this.warn = level <= WARN ? doLog : doNothing;
    this.error = level <= ERROR ? doLog : doNothing;
};