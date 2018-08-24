module.exports = new function Common() {
    var that = this;

    function isString(param) {
        return Object.prototype.toString.call(param) == '[object String]';
    }

    function isArray(param) {
        return Object.prototype.toString.call(param) == '[object Array]';
    }

    function isPlainObject(param) {
        return Object.prototype.toString.call(param) == '[object Object]';
    }

    function isFunction(param) {
        return Object.prototype.toString.call(param) == '[object Function]';
    }

    function isUndefined(param) {
        return Object.prototype.toString.call(param) == '[object Undefined]';
    }

    function getStringLen(str) {
        var regEx = /^[\u4e00-\u9fa5\uf900-\ufa2d]+$/;
        var oMatches = str.match(/[\x00-\xff]/g);
        var len = str.length * 2;
        if (oMatches) {
            len -= oMatches.length;
        }
        return len;
    }

    function stringLimit(str, max, suffix) {
        var len = getStringLen(str);
        if (len < max) {
            return str.toString();
        }
        var string = "";
        for (var i = 0; i < str.length; i++) {
            string += str.charAt(i);
            if (getStringLen(string) >= max) {
                break;
            }
        }
        return (string + (suffix)).toString();
    }

    function randomString(len) {
        var rdmString = "";
        for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
        return rdmString.substr(0, len || 32);
    }

    function extend() {
        // 定义默认参数和变量
        // 对象分为扩展对象和被扩展的对象
        //options 代表扩展的对象中的方法
        //name 代表扩展对象的方法名
        //i    为扩展对象参数起始值
        //deep 默认为浅复制
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        //当第一个参数为布尔类型是，次参数定义是否为深拷贝
        //对接下来的参数进行处理
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // 当定义是否深拷贝时，参数往后移动一位
            i = 2;
        }
        // 如果要扩展的不是对象或者函数，则定义要扩展的对象为空
        if (typeof target !== "object" && !isFunction(target)) {
            target = {};
        }
        // 当只含有一个参数时，被扩展的对象是jQuery或jQuery.fn
        if (length === i) {
            target = this;
            --i;
        }
        //对从i开始的多个参数进行遍历
        for (; i < length; i++) {
            // 只处理有定义的值
            if ((options = arguments[i]) != null) {
                // 展开扩展对象
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    // 防止循环引用
                    if (target === copy) {
                        continue;
                    }
                    // 递归处理深拷贝
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
                        target[name] = extend(deep, clone, copy);
                        // 不处理未定义值
                    } else if (copy !== undefined) {
                        //给target增加属性或方法
                        target[name] = copy;
                    }
                }
            }
        }
        //返回
        return target;
    }

    this.isFunction = isFunction;
    this.isPlainObject = isPlainObject;
    this.isArray = isArray;
    this.isString = isString;
    this.isUndefined = isUndefined;
    this.getStringLen = getStringLen;
    this.stringLimit = stringLimit;
    this.randomString = randomString;
    this.extend = extend;
};
