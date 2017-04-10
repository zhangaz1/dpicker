(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DPicker = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var morph = require('./lib/morph');
module.exports = nanomorph;
function nanomorph(oldTree, newTree) {
    var tree = walk(newTree, oldTree);
    return tree;
}
function walk(newNode, oldNode) {
    if (!oldNode) {
        return newNode;
    } else if (!newNode) {
        return null;
    } else if (newNode.isSameNode && newNode.isSameNode(oldNode)) {
        return oldNode;
    } else if (newNode.tagName !== oldNode.tagName) {
        return newNode;
    } else {
        morph(newNode, oldNode);
        updateChildren(newNode, oldNode);
        return oldNode;
    }
}
function updateChildren(newNode, oldNode) {
    if (!newNode.childNodes || !oldNode.childNodes)
        return;
    var newLength = newNode.childNodes.length;
    var oldLength = oldNode.childNodes.length;
    var length = Math.max(oldLength, newLength);
    var iNew = 0;
    var iOld = 0;
    for (var i = 0; i < length; i++, iNew++, iOld++) {
        var newChildNode = newNode.childNodes[iNew];
        var oldChildNode = oldNode.childNodes[iOld];
        var retChildNode = walk(newChildNode, oldChildNode);
        if (!retChildNode) {
            if (oldChildNode) {
                oldNode.removeChild(oldChildNode);
                iOld--;
            }
        } else if (!oldChildNode) {
            if (retChildNode) {
                oldNode.appendChild(retChildNode);
                iNew--;
            }
        } else if (retChildNode !== oldChildNode) {
            oldNode.replaceChild(retChildNode, oldChildNode);
            iNew--;
        }
    }
}
},{"./lib/morph":3}],2:[function(require,module,exports){
module.exports = [
    'onclick',
    'ondblclick',
    'onmousedown',
    'onmouseup',
    'onmouseover',
    'onmousemove',
    'onmouseout',
    'ondragstart',
    'ondrag',
    'ondragenter',
    'ondragleave',
    'ondragover',
    'ondrop',
    'ondragend',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'onunload',
    'onabort',
    'onerror',
    'onresize',
    'onscroll',
    'onselect',
    'onchange',
    'onsubmit',
    'onreset',
    'onfocus',
    'onblur',
    'oninput',
    'oncontextmenu',
    'onfocusin',
    'onfocusout'
];
},{}],3:[function(require,module,exports){
var events = require('./events');
var eventsLength = events.length;
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
module.exports = morph;
function morph(newNode, oldNode) {
    var nodeType = newNode.nodeType;
    var nodeName = newNode.nodeName;
    if (nodeType === ELEMENT_NODE) {
        copyAttrs(newNode, oldNode);
    }
    if (nodeType === TEXT_NODE || nodeType === COMMENT_NODE) {
        oldNode.nodeValue = newNode.nodeValue;
    }
    if (nodeName === 'INPUT')
        updateInput(newNode, oldNode);
    else if (nodeName === 'OPTION')
        updateOption(newNode, oldNode);
    else if (nodeName === 'TEXTAREA')
        updateTextarea(newNode, oldNode);
    else if (nodeName === 'SELECT')
        updateSelect(newNode, oldNode);
    copyEvents(newNode, oldNode);
}
function copyAttrs(newNode, oldNode) {
    var oldAttrs = oldNode.attributes;
    var newAttrs = newNode.attributes;
    var attrNamespaceURI = null;
    var attrValue = null;
    var fromValue = null;
    var attrName = null;
    var attr = null;
    for (var i = newAttrs.length - 1; i >= 0; --i) {
        attr = newAttrs[i];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;
        attrValue = attr.value;
        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            fromValue = oldNode.getAttributeNS(attrNamespaceURI, attrName);
            if (fromValue !== attrValue) {
                oldNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
            }
        } else {
            fromValue = oldNode.getAttribute(attrName);
            if (fromValue !== attrValue) {
                if (attrValue === 'null' || attrValue === 'undefined') {
                    oldNode.removeAttribute(attrName);
                } else {
                    oldNode.setAttribute(attrName, attrValue);
                }
            }
        }
    }
    for (var j = oldAttrs.length - 1; j >= 0; --j) {
        attr = oldAttrs[j];
        if (attr.specified !== false) {
            attrName = attr.name;
            attrNamespaceURI = attr.namespaceURI;
            if (attrNamespaceURI) {
                attrName = attr.localName || attrName;
                if (!newNode.hasAttributeNS(attrNamespaceURI, attrName)) {
                    oldNode.removeAttributeNS(attrNamespaceURI, attrName);
                }
            } else {
                if (!newNode.hasAttributeNS(null, attrName)) {
                    oldNode.removeAttribute(attrName);
                }
            }
        }
    }
}
function copyEvents(newNode, oldNode) {
    for (var i = 0; i < eventsLength; i++) {
        var ev = events[i];
        if (newNode[ev]) {
            oldNode[ev] = newNode[ev];
        } else if (oldNode[ev]) {
            oldNode[ev] = undefined;
        }
    }
}
function updateOption(newNode, oldNode) {
    updateAttribute(newNode, oldNode, 'selected');
}
function updateInput(newNode, oldNode) {
    var newValue = newNode.value;
    var oldValue = oldNode.value;
    updateAttribute(newNode, oldNode, 'checked');
    updateAttribute(newNode, oldNode, 'disabled');
    if (!newNode.hasAttributeNS(null, 'value') || newValue === 'null') {
        oldNode.value = '';
        oldNode.removeAttribute('value');
    } else if (newValue !== oldValue) {
        oldNode.setAttribute('value', newValue);
        oldNode.value = newValue;
    } else {
        oldNode.value = newValue;
    }
}
function updateTextarea(newNode, oldNode) {
    var newValue = newNode.value;
    if (newValue !== oldNode.value) {
        oldNode.value = newValue;
    }
    if (oldNode.firstChild) {
        if (newValue === '' && oldNode.firstChild.nodeValue === oldNode.placeholder) {
            return;
        }
        oldNode.firstChild.nodeValue = newValue;
    }
}
function updateSelect(newNode, oldNode) {
    if (!oldNode.hasAttributeNS(null, 'multiple')) {
        var i = 0;
        var curChild = newNode.firstChild;
        while (curChild) {
            var nodeName = curChild.nodeName;
            if (nodeName && nodeName.toUpperCase() === 'OPTION') {
                if (curChild.hasAttributeNS(null, 'selected'))
                    break;
                i++;
            }
            curChild = curChild.nextSibling;
        }
        oldNode.selectedIndex = i;
    }
}
function updateAttribute(newNode, oldNode, name) {
    if (newNode[name] !== oldNode[name]) {
        oldNode[name] = newNode[name];
        if (newNode[name]) {
            oldNode.setAttribute(name, '');
        } else {
            oldNode.removeAttribute(name, '');
        }
    }
}
},{"./events":2}],4:[function(require,module,exports){
module.exports = function yoyoifyAppendChild(el, childs) {
    for (var i = 0; i < childs.length; i++) {
        var node = childs[i];
        if (Array.isArray(node)) {
            yoyoifyAppendChild(el, node);
            continue;
        }
        if (typeof node === 'number' || typeof node === 'boolean' || node instanceof Date || node instanceof RegExp) {
            node = node.toString();
        }
        if (typeof node === 'string') {
            if (el.lastChild && el.lastChild.nodeName === '#text') {
                el.lastChild.nodeValue += node;
                continue;
            }
            node = document.createTextNode(node);
        }
        if (node && node.nodeType) {
            el.appendChild(node);
        }
    }
};
},{}],5:[function(require,module,exports){
(function (global){
'use strict';
var moment = typeof window !== 'undefined' ? window['moment'] : typeof global !== 'undefined' ? global['moment'] : null;
var DAY_TOKEN = 'd';
var YEAR_TOKEN = 'y';
var MONTH_TOKEN = 'M';
var HOURS_TOKEN = 'h';
function _getMoment(date, immutable) {
    if (immutable === undefined) {
        immutable = true;
    }
    if (moment.isMoment(date)) {
        return immutable === true ? date.clone() : date;
    }
    if (date instanceof Date) {
        return moment(date);
    }
    return null;
}
function months() {
    return moment.months();
}
function weekdays() {
    return moment.weekdaysShort();
}
function firstDayOfWeek() {
    return moment.localeData().firstDayOfWeek();
}
function isValid(date) {
    date = _getMoment(date, false);
    return date instanceof moment && date.isValid();
}
function isValidWithFormat(dateString, format) {
    var testDate = moment(dateString, format, true);
    if (this.isValid(testDate) === true) {
        return testDate.toDate();
    }
    return false;
}
function getYear(date) {
    return _getMoment(date, false).year();
}
function getMonth(date) {
    return _getMoment(date, false).month();
}
function getDate(date) {
    return _getMoment(date, false).date();
}
function getHours(date) {
    return _getMoment(date, false).hours();
}
function getMinutes(date) {
    return _getMoment(date, false).minutes();
}
function getSeconds(date) {
    return _getMoment(date, false).seconds();
}
function getMilliseconds(date) {
    return _getMoment(date, false).milliseconds();
}
function setDate(date, day) {
    return _getMoment(date).date(day).toDate();
}
function setMinutes(date, minutes) {
    return _getMoment(date).minutes(minutes).toDate();
}
function setHours(date, hours) {
    return _getMoment(date).hours(hours).toDate();
}
function setMonth(date, month) {
    return _getMoment(date).month(month).toDate();
}
function setYear(date, year) {
    return _getMoment(date).year(year).toDate();
}
function addDays(date, num) {
    return _getMoment(date).add(num, DAY_TOKEN).toDate();
}
function addMonths(date, num) {
    return _getMoment(date).add(num, MONTH_TOKEN).toDate();
}
function addYears(date, year) {
    return _getMoment(date).add(year, YEAR_TOKEN).toDate();
}
function addHours(date, hours) {
    return _getMoment(date).add(hours, HOURS_TOKEN).toDate();
}
function subDays(date, num) {
    return _getMoment(date).subtract(num, DAY_TOKEN).toDate();
}
function subMonths(date, num) {
    return _getMoment(date).subtract(num, MONTH_TOKEN).toDate();
}
function format(date, format) {
    return _getMoment(date, false).format(format);
}
function daysInMonth(date) {
    return _getMoment(date, false).daysInMonth();
}
function firstWeekDay(date) {
    return +_getMoment(date).date(1).format('e');
}
function resetSeconds(date) {
    return _getMoment(date).seconds(0).milliseconds(0).toDate();
}
function resetMinutes(date) {
    return _getMoment(this.resetSeconds(date)).minutes(0).toDate();
}
function resetHours(date) {
    return _getMoment(this.resetMinutes(date)).hours(0).toDate();
}
function isBefore(date, comparison) {
    return _getMoment(date, false).isBefore(comparison);
}
function isAfter(date, comparison) {
    return _getMoment(date, false).isAfter(comparison);
}
function isSameOrAfter(date, comparison) {
    return _getMoment(date, false).isSameOrAfter(comparison, DAY_TOKEN);
}
function isSameOrBefore(date, comparison) {
    return _getMoment(date, false).isSameOrBefore(comparison, DAY_TOKEN);
}
function isSameDay(date, comparison) {
    return _getMoment(date, false).isSame(comparison, DAY_TOKEN);
}
function isSameHours(date, comparison) {
    return _getMoment(date, false).isSame(comparison, HOURS_TOKEN);
}
function isSameMonth(date, comparison) {
    return _getMoment(date, false).isSame(comparison, MONTH_TOKEN);
}
function getMeridiem(date) {
    return _getMoment(date, false).format('A');
}
module.exports = {
    _getMoment: _getMoment,
    months: months,
    weekdays: weekdays,
    firstDayOfWeek: firstDayOfWeek,
    isValid: isValid,
    isValidWithFormat: isValidWithFormat,
    getYear: getYear,
    getHours: getHours,
    getMonth: getMonth,
    getDate: getDate,
    getMinutes: getMinutes,
    getSeconds: getSeconds,
    getMilliseconds: getMilliseconds,
    setDate: setDate,
    setMinutes: setMinutes,
    setHours: setHours,
    setMonth: setMonth,
    setYear: setYear,
    addDays: addDays,
    addMonths: addMonths,
    addYears: addYears,
    addHours: addHours,
    subDays: subDays,
    subMonths: subMonths,
    format: format,
    daysInMonth: daysInMonth,
    firstWeekDay: firstWeekDay,
    resetSeconds: resetSeconds,
    resetMinutes: resetMinutes,
    resetHours: resetHours,
    isBefore: isBefore,
    isAfter: isAfter,
    isSameOrAfter: isSameOrAfter,
    isSameOrBefore: isSameOrBefore,
    isSameDay: isSameDay,
    isSameHours: isSameHours,
    isSameMonth: isSameMonth,
    getMeridiem: getMeridiem
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
'use strict';
var _appendChild = require('yo-yoify/lib/appendChild');
var nanomorph = require('nanomorph');
function DPicker(element) {
    var _this = this;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!(this instanceof DPicker)) {
        return new DPicker(element, options);
    }
    var _getContainer = this._getContainer(element), container = _getContainer.container, attributes = _getContainer.attributes;
    this._container = uuid();
    this.data = {};
    var defaults = {
        months: DPicker.dateAdapter.months(),
        days: DPicker.dateAdapter.weekdays(),
        empty: false,
        valid: true,
        order: [
            'months',
            'years',
            'time',
            'days'
        ],
        hideOnDayClick: true,
        hideOnEnter: true,
        hideOnOutsideClick: true,
        siblingMonthDayClick: false,
        firstDayOfWeek: DPicker.dateAdapter.firstDayOfWeek()
    };
    for (var i in defaults) {
        if (options[i] !== undefined) {
            this.data[i] = options[i];
            continue;
        }
        this.data[i] = defaults[i];
    }
    this.data.inputName = attributes.name ? attributes.name : options.inputName ? options.inputName : 'dpicker-input';
    this.data.inputId = attributes.id ? attributes.id : options.inputId ? options.inputId : uuid();
    this._setData('format', [
        attributes.format,
        'DD/MM/YYYY'
    ]);
    this.events = {};
    for (var _i in DPicker.events) {
        this.events[_i] = DPicker.events[_i].bind(this);
    }
    var methods = DPicker.properties;
    methods.min = new Date(1986, 0, 1);
    methods.max = DPicker.dateAdapter.setMonth(DPicker.dateAdapter.addYears(new Date(), 1), 11);
    methods.format = this.data.format;
    for (var _i2 in methods) {
        this._createGetSet(_i2);
        if (typeof methods[_i2] === 'function') {
            this._setData(_i2, [
                options[_i2],
                methods[_i2](attributes)
            ]);
        } else {
            this._setData(_i2, [
                options[_i2],
                attributes[_i2],
                methods[_i2]
            ], methods[_i2] instanceof Date);
        }
    }
    if (options.empty === true) {
        this.data.empty = true;
    }
    this._setData('model', [
        attributes.value,
        options.model,
        new Date()
    ], true);
    this.onChange = options.onChange;
    document.addEventListener('click', this.events.hide);
    document.addEventListener('touchend', function (e) {
        _this.events.inputBlur(e);
    });
    this.initialize();
    this._mount(container);
    this.isValid(this.data.model);
    container.id = this._container;
    container.addEventListener('keydown', this.events.keyDown);
    var input = container.querySelector('input');
    input.addEventListener('blur', this.events.inputBlur);
    return this;
}
DPicker.prototype.setSelected = function (element, test) {
    if (test === true) {
        element.setAttribute('selected', 'selected');
    }
    return element;
};
DPicker.prototype._setData = function (key, values) {
    var isDate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    for (var i = 0; i < values.length; i++) {
        if (values[i] === undefined || values[i] === '') {
            continue;
        }
        if (isDate === false) {
            this.data[key] = values[i];
            break;
        }
        if (DPicker.dateAdapter.isValid(values[i])) {
            this.data[key] = values[i];
            break;
        }
        this.data[key] = new Date();
        var temp = DPicker.dateAdapter.isValidWithFormat(values[i], this.data.format);
        if (temp !== false) {
            this.data[key] = temp;
            break;
        }
    }
};
DPicker.prototype._createGetSet = function (key) {
    if (DPicker.prototype.hasOwnProperty(key)) {
        return;
    }
    Object.defineProperty(DPicker.prototype, key, {
        get: function get() {
            return this.data[key];
        },
        set: function set(newValue) {
            this.data[key] = newValue;
            this.isValid(this.data.model);
            this.redraw();
        }
    });
};
DPicker.prototype._getContainer = function (container) {
    if (typeof container === 'undefined') {
        throw new ReferenceError('Can not initialize DPicker without a container');
    }
    var attributes = {};
    [].slice.call(container.attributes).forEach(function (attribute) {
        attributes[attribute.name] = attribute.value;
    });
    if (container.length !== undefined && container[0]) {
        container = container[0];
    }
    if (container.tagName === 'INPUT') {
        if (!container.parentNode) {
            throw new ReferenceError('Can not initialize DPicker on an input without parent node');
        }
        var parentNode = container.parentNode;
        container.parentNode.removeChild(container);
        container = parentNode;
        container.classList.add('dpicker');
    }
    return {
        container: container,
        attributes: attributes
    };
};
DPicker.prototype._getRenderChild = function () {
    var children = {
        years: this.renderYears(this.events, this.data),
        months: this.renderMonths(this.events, this.data)
    };
    for (var render in DPicker.renders) {
        children[render] = DPicker.renders[render].call(this, this.events, this.data);
    }
    children.days = this.renderDays(this.events, this.data);
    return this.data.order.filter(function (e) {
        return children[e];
    }).map(function (e) {
        return children[e];
    });
};
DPicker.prototype._mount = function (element) {
    this._tree = this.getTree();
    element.appendChild(this._tree);
};
DPicker.prototype.getTree = function () {
    return this.renderContainer(this.events, this.data, [
        this.renderInput(this.events, this.data),
        this.render(this.events, this.data, this._getRenderChild())
    ]);
};
DPicker.prototype.isValid = function checkValidity(date) {
    if (DPicker.dateAdapter.isValid(date) === false) {
        this.data.valid = false;
        return false;
    }
    var isSame = void 0;
    var temp = void 0;
    if (this.data.time === false) {
        temp = DPicker.dateAdapter.resetHours(date);
        isSame = DPicker.dateAdapter.isSameDay(temp, this.data.min) || DPicker.dateAdapter.isSameDay(temp, this.data.max);
    } else {
        temp = DPicker.dateAdapter.resetSeconds(date);
        isSame = DPicker.dateAdapter.isSameHours(temp, this.data.min) || DPicker.dateAdapter.isSameHours(temp, this.data.max);
    }
    if (isSame === false && (DPicker.dateAdapter.isBefore(temp, this.data.min) || DPicker.dateAdapter.isAfter(temp, this.data.max))) {
        this.data.valid = false;
        return true;
    }
    this.data.valid = true;
    return true;
};
DPicker.prototype.renderInput = function (events, data, toRender) {
    var _;
    return _ = document.createElement('input'), _.setAttribute('id', '' + String(data.inputId) + ''), _.setAttribute('value', '' + String(data.empty === true ? '' : DPicker.dateAdapter.format(data.model, data.format)) + ''), _.setAttribute('type', 'text'), _.setAttribute('min', '' + String(data.min) + ''), _.setAttribute('max', '' + String(data.max) + ''), _.setAttribute('format', '' + String(data.format) + ''), _.onchange = events.inputChange, _.onfocus = events.inputFocus, _.setAttribute('name', '' + String(data.inputName) + ''), _.setAttribute('aria-invalid', '' + String(data.valid) + ''), _.setAttribute('aria-haspopup', 'aria-haspopup'), _.setAttribute('class', '' + String(data.valid === false ? 'dpicker-invalid' : '') + ''), _;
};
DPicker.prototype.renderContainer = function (events, data, toRender) {
    var _dpicker;
    return _dpicker = document.createElement('div'), _dpicker.setAttribute('class', 'dpicker'), _appendChild(_dpicker, [toRender]), _dpicker;
};
DPicker.prototype.render = function (events, data, toRender) {
    var _div;
    return _div = document.createElement('div'), _div.setAttribute('aria-hidden', '' + String(data.display === false) + ''), _div.setAttribute('class', 'dpicker-container ' + String(data.display === true ? 'dpicker-visible' : 'dpicker-invisible') + ' ' + String(data.time === true ? 'dpicker-has-time' : '') + ''), _appendChild(_div, [
        ' ',
        toRender,
        ' '
    ]), _div;
};
DPicker.prototype.renderYears = function (events, data, toRender) {
    var _select;
    var modelYear = DPicker.dateAdapter.getYear(data.model);
    var futureYear = DPicker.dateAdapter.getYear(data.max) + 1;
    var pastYear = DPicker.dateAdapter.getYear(data.min);
    var options = [];
    while (--futureYear >= pastYear) {
        var _option;
        options.push(this.setSelected((_option = document.createElement('option'), _option.setAttribute('value', '' + String(futureYear) + ''), _appendChild(_option, [futureYear]), _option), futureYear === modelYear));
    }
    return _select = document.createElement('select'), _select.onchange = events.yearChange, _select.setAttribute('name', 'dpicker-year'), _select.setAttribute('aria-label', 'Year'), _appendChild(_select, [options]), _select;
};
DPicker.prototype.renderMonths = function (events, data, toRender) {
    var _select2, _this2 = this;
    var modelMonth = DPicker.dateAdapter.getMonth(data.model);
    var currentYear = DPicker.dateAdapter.getYear(data.model);
    var months = data.months;
    var showMonths = data.months.map(function (e, i) {
        return i;
    });
    if (DPicker.dateAdapter.getYear(data.max) === currentYear) {
        var maxMonth = DPicker.dateAdapter.getMonth(data.max);
        showMonths = showMonths.filter(function (e) {
            return e <= maxMonth;
        });
    }
    if (DPicker.dateAdapter.getYear(data.min) === currentYear) {
        var minMonth = DPicker.dateAdapter.getMonth(data.min);
        showMonths = showMonths.filter(function (e) {
            return e >= minMonth;
        });
    }
    return _select2 = document.createElement('select'), _select2.onchange = events.monthChange, _select2.setAttribute('name', 'dpicker-month'), _select2.setAttribute('aria-label', 'Month'), _appendChild(_select2, [
        ' ',
        showMonths.map(function (e, i) {
            var _option2;
            return _this2.setSelected((_option2 = document.createElement('option'), _option2.setAttribute('value', '' + String(e) + ''), _appendChild(_option2, [months[e]]), _option2), e === modelMonth);
        }),
        ' '
    ]), _select2;
};
DPicker.prototype.renderDays = function (events, data, toRender) {
    var _tr, _table;
    var daysInMonth = DPicker.dateAdapter.daysInMonth(data.model);
    var daysInPreviousMonth = DPicker.dateAdapter.daysInMonth(DPicker.dateAdapter.subMonths(data.model, 1));
    var firstLocaleDay = data.firstDayOfWeek;
    var firstDay = DPicker.dateAdapter.firstWeekDay(data.model) - 1;
    var currentDay = DPicker.dateAdapter.getDate(data.model);
    var currentMonth = DPicker.dateAdapter.getMonth(data.model);
    var currentYear = DPicker.dateAdapter.getYear(data.model);
    var days = new Array(7);
    data.days.map(function (e, i) {
        days[i < firstLocaleDay ? 6 - i : i - firstLocaleDay] = e;
    });
    var rows = new Array(Math.ceil(0.1 + (firstDay + daysInMonth) / 7)).fill(0);
    var day = void 0;
    var dayActive = void 0;
    var previousMonth = false;
    var nextMonth = false;
    var loopend = true;
    var classActive = '';
    return _table = document.createElement('table'), _appendChild(_table, [
        ' ',
        (_tr = document.createElement('tr'), _appendChild(_tr, [days.map(function (e) {
                var _th;
                return _th = document.createElement('th'), _appendChild(_th, [e]), _th;
            })]), _tr),
        ' ',
        rows.map(function (e, row) {
            var _tr2;
            return _tr2 = document.createElement('tr'), _appendChild(_tr2, [new Array(7).fill(0).map(function (e, col) {
                    var _2, _button, _3;
                    dayActive = loopend;
                    classActive = '';
                    if (col <= firstDay && row === 0) {
                        day = daysInPreviousMonth - (firstDay - col);
                        dayActive = false;
                        previousMonth = true;
                    } else if (col === firstDay + 1 && row === 0) {
                        previousMonth = false;
                        day = 1;
                        dayActive = true;
                    } else {
                        if (day === daysInMonth) {
                            day = 0;
                            dayActive = false;
                            loopend = false;
                            nextMonth = true;
                        }
                        day++;
                    }
                    var dayMonth = previousMonth ? currentMonth : nextMonth ? currentMonth + 2 : currentMonth + 1;
                    var currentDayModel = new Date(currentYear, dayMonth - 1, day);
                    if (dayActive === false && data.siblingMonthDayClick === true) {
                        dayActive = true;
                    }
                    if (data.min && dayActive) {
                        dayActive = DPicker.dateAdapter.isSameOrAfter(currentDayModel, data.min);
                    }
                    if (data.max && dayActive) {
                        dayActive = DPicker.dateAdapter.isSameOrBefore(currentDayModel, data.max);
                    }
                    if (dayActive === true && previousMonth === false && nextMonth === false && currentDay === day) {
                        classActive = 'dpicker-active';
                    }
                    return _2 = document.createElement('td'), _2.setAttribute('class', '' + String(dayActive === true ? 'dpicker-active' : 'dpicker-inactive') + ''), _appendChild(_2, [
                        ' ',
                        dayActive === true ? (_button = document.createElement('button'), _button.setAttribute('value', '' + String(day) + ''), _button.setAttribute('aria-label', 'Day ' + String(day) + ''), _button.setAttribute('aria-disabled', '' + String(dayActive) + ''), _button.onclick = previousMonth === false && nextMonth === false ? events.dayClick : previousMonth === true ? events.previousMonthDayClick : events.nextMonthDayClick, _button.setAttribute('type', 'button'), _button.onkeydown = events.dayKeyDown, _button.setAttribute('class', '' + String(classActive) + ''), _appendChild(_button, [
                            ' ',
                            day,
                            ' '
                        ]), _button) : (_3 = document.createElement('span'), _3.setAttribute('class', '' + String(classActive) + ''), _appendChild(_3, [day]), _3),
                        ' '
                    ]), _2;
                })]), _tr2;
        }),
        ' '
    ]), _table;
};
DPicker.prototype.initialize = function () {
    this.isValid(this.data.model);
};
DPicker.prototype.modelSetter = function (newValue) {
    this.data.empty = !newValue;
    if (this.isValid(newValue) === true) {
        this.data.model = newValue;
    }
    this.redraw();
};
DPicker.prototype.redraw = function () {
    var newTree = this.getTree();
    this._tree = nanomorph(this._tree, newTree);
};
Object.defineProperties(DPicker.prototype, {
    'container': {
        get: function get() {
            return this._container;
        }
    },
    'inputId': {
        get: function get() {
            return this.data.inputId;
        }
    },
    'input': {
        get: function get() {
            if (this.data.empty) {
                return '';
            }
            return DPicker.dateAdapter.format(this.data.model, this.data.format);
        }
    },
    'onChange': {
        set: function set(onChange) {
            var _this3 = this;
            this._onChange = function (dpickerEvent) {
                return !onChange ? false : onChange(_this3.data, dpickerEvent);
            };
        },
        get: function get() {
            return this._onChange;
        }
    },
    'valid': {
        get: function get() {
            return this.data.valid;
        }
    },
    'empty': {
        get: function get() {
            return this.data.empty;
        }
    },
    'model': {
        set: function set(newValue) {
            this.modelSetter(newValue);
        },
        get: function get() {
            return this.data.model;
        }
    }
});
DPicker.decorate = function (origin, decoration) {
    return function decorator() {
        if (decoration.apply(this, arguments) === false) {
            return false;
        }
        return origin.apply(this, arguments);
    };
};
DPicker.events = {
    hide: function hide(evt) {
        if (this.data.hideOnOutsideClick === false || this.display === false) {
            return;
        }
        var node = evt.target;
        if (isElementInContainer(node.parentNode, this._container)) {
            return;
        }
        this.display = false;
        this.onChange({
            modelChanged: false,
            name: 'hide',
            event: evt
        });
    },
    inputChange: function inputChange(evt) {
        if (!evt.target.value) {
            this.data.empty = true;
        } else {
            var newModel = DPicker.dateAdapter.isValidWithFormat(evt.target.value, this.data.format);
            if (newModel !== false) {
                if (this.isValid(newModel) === true) {
                    this.data.model = newModel;
                }
            }
            this.data.empty = false;
        }
        this.redraw();
        this.onChange({
            modelChanged: true,
            name: 'inputChange',
            event: evt
        });
    },
    inputBlur: function inputBlur(evt) {
        if (this.display === false) {
            return;
        }
        var node = evt.relatedTarget || evt.target;
        if (isElementInContainer(node.parentNode, this._container)) {
            return;
        }
        this.display = false;
        this.onChange({
            modelChanged: false,
            name: 'inputBlur',
            event: evt
        });
    },
    inputFocus: function inputFocus(evt) {
        this.display = true;
        if (evt.target && evt.target.select) {
            evt.target.select();
        }
        this.onChange({
            modelChanged: false,
            name: 'inputFocus',
            event: evt
        });
    },
    yearChange: function yearChange(evt) {
        this.data.empty = false;
        this.model = DPicker.dateAdapter.setYear(this.data.model, evt.target.options[evt.target.selectedIndex].value);
        this.redraw();
        this.onChange({
            modelChanged: true,
            name: 'yearChange',
            event: evt
        });
    },
    monthChange: function monthChange(evt) {
        this.data.empty = false;
        this.model = DPicker.dateAdapter.setMonth(this.data.model, evt.target.options[evt.target.selectedIndex].value);
        this.redraw();
        this.onChange({
            modelChanged: true,
            name: 'monthChange',
            event: evt
        });
    },
    dayClick: function dayClick(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.model = DPicker.dateAdapter.setDate(this.data.model, evt.target.value);
        this.data.empty = false;
        if (this.data.hideOnDayClick) {
            this.display = false;
        }
        this.redraw();
        this.onChange({
            modelChanged: true,
            name: 'dayClick',
            event: evt
        });
    },
    previousMonthDayClick: function previousMonthDayClick(evt) {
        if (!this.data.siblingMonthDayClick) {
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        this.model = DPicker.dateAdapter.subMonths(DPicker.dateAdapter.setDate(this.data.model, evt.target.value), 1);
        this.data.empty = false;
        if (this.data.hideOnDayClick) {
            this.display = false;
        }
        this.redraw();
        this.onChange({
            modelChanged: true,
            name: 'previousMonthDayClick',
            event: evt
        });
    },
    nextMonthDayClick: function nextMonthDayClick(evt) {
        if (!this.data.siblingMonthDayClick) {
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        this.model = DPicker.dateAdapter.addMonths(DPicker.dateAdapter.setDate(this.data.model, evt.target.value), 1);
        this.data.empty = false;
        if (this.data.hideOnDayClick) {
            this.display = false;
        }
        this.redraw();
        this.onChange({
            modelChanged: true,
            name: 'nextMonthDayClick',
            event: evt
        });
    },
    dayKeyDown: function dayKeyDown() {
    },
    keyDown: function keyDown(evt) {
        if (!this.data.hideOnEnter) {
            return;
        }
        var key = evt.which || evt.keyCode;
        if (key !== 13 && key !== 27) {
            return;
        }
        document.getElementById(this.inputId).blur();
        this.display = false;
        this.onChange({
            modelChanged: false,
            name: 'keyDown',
            event: evt
        });
    }
};
DPicker.renders = {};
DPicker.properties = { display: false };
DPicker.dateAdapter = undefined;
function uuid() {
    return ([10000000] + -1000 + -4000 + -8000 + -100000000000).replace(/[018]/g, function (a) {
        return (a ^ Math.random() * 16 >> a / 4).toString(16);
    });
}
function isElementInContainer(parent, containerId) {
    while (parent && parent !== document) {
        if (parent.getAttribute('id') === containerId) {
            return true;
        }
        parent = parent.parentNode;
    }
    return false;
}
module.exports = DPicker;
},{"nanomorph":1,"yo-yoify/lib/appendChild":4}],7:[function(require,module,exports){
'use strict';
var MomentDateAdapter = require('./adapters/moment.js');
var DPicker = require('./dpicker');
DPicker.dateAdapter = MomentDateAdapter;
module.exports = DPicker;
},{"./adapters/moment.js":5,"./dpicker":6}]},{},[7])(7)
});