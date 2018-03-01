class Floating {

    constructor() {

        /** @type {Object} */
        this.floatingBuffer = {};

        /**
         * @type {{
                     wrapper: string|HTMLElement,
                     offsetBottom: number,
                     offsetTop: number,
                     fixedSelector: string,
                     absoluteSelector: string,
                     disableInlineStyles: boolean,
                     disableClasses: boolean
                 }}
         */
        this.defaultProperties = {
            'offsetBottom': 0,
            'offsetTop': 0,
            'fixedSelector': 'floating-fixed',
            'absoluteSelector': 'floating-absolute',
            'disableInlineStyles': false,
            'disableClasses': false
        };

    }

    /**
     * @param {*} mixedVar
     * @returns {Boolean}
     */
    empty(mixedVar) {
        /** @type {Array} */
        const emptyValues = [void 0, null, false, 0, '', '0'];
        for (let value of emptyValues) {
            if (value === mixedVar) {
                return true;
            }
        }
        if (typeof mixedVar === 'object') {
            /** @type {String} */
            const objectType = Object.prototype.toString.call(mixedVar).toLowerCase();
            if (objectType.indexOf('element') !== -1 || objectType.indexOf('html') !== -1) {
                return false;
            }
            for (let key in mixedVar) {
                if (mixedVar.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    /**
     * @param {*} inputValue
     * @returns {Number}
     */
    numericVal(inputValue) {
        if (this.empty(inputValue)) {
            return 0;
        }
        /** @type {Number} */
        const output = parseFloat(inputValue);
        if (isNaN(output)) {
            return 0;
        }
        return output;
    };

    /**
     * @param {HTMLElement} element
     * @param {String} propertyName
     * @returns {Number|String}
     */
    getStyle(element, propertyName) {
        /** @type {IEElementStyle|CSSStyleDeclaration} */
        const style = element.currentStyle || window.getComputedStyle(element);
        if (style.hasOwnProperty(propertyName)) {
            if (isNaN(parseFloat(style[propertyName]))) {
                return style[propertyName];
            }
            return this.numericVal(style[propertyName]);
        }
        return 0;
    }

    /**
     * @param {HTMLElement} element
     * @param {Boolean} [withMargin]
     * @returns {{width: Number, height: Number}}
     */
    getDimensions(element, withMargin = false) {
        /** @type {Number} */
        let outWidth = 0;
        /** @type {Number} */
        let outHeight = 0;
        if (!this.isHtmlElement(element)) {
            return {width: outWidth, height: outHeight};
        }
        outWidth = this.numericVal(element.offsetWidth);
        outHeight = this.numericVal(element.offsetHeight);
        if (withMargin === true) {
            outWidth += this.getStyle(element, 'marginRight') + this.getStyle(element, 'marginLeft');
            outHeight += this.getStyle(element, 'marginTop') + this.getStyle(element, 'marginBottom');
        }
        return {width: outWidth, height: outHeight};
    }

    /**
     * @param {String} inputString
     * @param {Boolean} [removeAllSpaces]
     * @returns {String}
     */
    rTrim(inputString, removeAllSpaces) {
        /** @type {Array} */
        let outputArray = inputString.replace('\xa0', ' ').split(' ').filter(a => {
            return a;
        });
        return (removeAllSpaces === true) ? outputArray.join('') : outputArray.join(' ');
    };

    /**
     * @param {Array} array
     * @param {*} needle
     * @returns {Boolean}
     */
    inArray(array, needle) {
        for (let value of array) {
            if (value === needle) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param {HTMLElement} element
     * @param {String} nameOfClass
     * @returns {Floating}
     */
    addClass(element, nameOfClass) {
        /** @type {String} */
        let fullClass = this.rTrim(element.className);
        /** @type {Array} */
        const classesNames = fullClass.split(' ');
        if (!this.inArray(classesNames, nameOfClass)) {
            if (fullClass.length > 0) {
                fullClass += ' ';
            }
            fullClass += nameOfClass;
            element.className = this.rTrim(fullClass);
        }
        return this;
    };

    /**
     * @param {HTMLElement} element
     * @param {String} nameOfClass
     * @returns {Floating}
     */
    removeClass(element, nameOfClass) {
        /** @type {String} */
        const fullClass = this.rTrim(element.className);
        /** @type {Array} */
        const classesNames = fullClass.split(' ');
        /** @type {String} */
        let newClass = '';
        if (this.inArray(classesNames, nameOfClass)) {
            fullClass.split(' ').map(value => {
                if (value !== nameOfClass && value.length > 0) {
                    newClass += ' ' + value;
                }
            });
            element.className = this.rTrim(newClass);
        }
        return this;
    };

    /**
     * @param {String} [idPrefix]
     * @returns {String}
     */
    floatingIDGenerator(idPrefix = 'floatBufferNumber') {
        /** @type {Number} */
        const randomNumber = Math.round(Math.random() * 1000000);
        /** @type {String} */
        let outputString = `${idPrefix}${randomNumber}`;
        if (this.floatingBuffer.hasOwnProperty(outputString)) {
            outputString = this.floatingIDGenerator();
        }
        return outputString;
    }

    /**
     * @param {HTMLElement} element
     * @param {Object} [options]
     * @returns {void}
     */
    createElementIndex(element, options = {}) {
        /** @type {String} */
        const id = this.floatingIDGenerator();
        this.floatingBuffer[id] = {};
        this.floatingBuffer[id]['mainElement'] = element;
        if (options.hasOwnProperty('wrapper') && !this.empty(options['wrapper'])) {
            if (this.isHtmlElement(options['wrapper']) && options['wrapper'] !== element) {
                this.floatingBuffer[id]['wrapper'] = options['wrapper'];
            } else {
                /** @type {Node} */
                let wrapper = element.parentNode;
                if (typeof options['wrapper'] === 'string') {
                    /** @type {Element} */
                    const findElement = document.querySelector(options['wrapper']);
                    if (!!findElement === true && findElement !== element) {
                        wrapper = findElement;
                    }
                }
                this.floatingBuffer[id]['wrapper'] = wrapper;
            }
        } else {
            this.floatingBuffer[id]['wrapper'] = element.parentNode;
        }
        for (let propertyName in this.defaultProperties) {
            if (this.defaultProperties.hasOwnProperty(propertyName)) {
                if (options.hasOwnProperty(propertyName) && !this.empty(options[propertyName])) {
                    this.floatingBuffer[id][propertyName] = options[propertyName];
                } else {
                    this.floatingBuffer[id][propertyName] = this.defaultProperties[propertyName];
                }
            }
        }
    }

    /**
     * @param {Number} scrollActual
     * @returns {void}
     */
    elementPosition(scrollActual) {
        for (let bufferKeyName in this.floatingBuffer) {
            if (this.floatingBuffer.hasOwnProperty(bufferKeyName)
                && typeof this.floatingBuffer[bufferKeyName] === 'object') {
                /** @type {Object} */
                const buffer = this.floatingBuffer[bufferKeyName];
                /** @type {HTMLElement} */
                const element = buffer.mainElement;
                /** @type {HTMLElement} */
                const wrapper = buffer.wrapper;
                /** @type {Number} */
                const offsetTop = buffer.offsetTop;
                /** @type {String} */
                const fixedSelector = buffer.fixedSelector;
                /** @type {String} */
                const absoluteSelector = buffer.absoluteSelector;
                /** @type {Number} */
                const wrapperBorderWidth = this.getStyle(wrapper, 'borderBottom');
                /** @type {Number} */
                const wrapperPaddingBottom = this.getStyle(wrapper, 'paddingBottom');
                /** @type {Number} */
                const wrapperHeight = this.getDimensions(wrapper).height - (wrapperBorderWidth + wrapperPaddingBottom);
                /** @type {Number} */
                const elementHeight = this.getDimensions(element, true).height;
                /** @type {Number} */
                const elementBottom = wrapper.offsetTop + wrapperHeight - (buffer.offsetBottom + elementHeight);

                if (this.empty(buffer['elementTop'])) {
                    buffer['elementTop'] = element.offsetTop;
                }
                /** @type {Number|undefined} */
                const defaultTop = buffer['elementTop'];

                if (scrollActual >= defaultTop - offsetTop && scrollActual < elementBottom - offsetTop) {
                    if (buffer.disableInlineStyles !== true) {
                        element.style.position = 'fixed';
                        element.style.top = `${offsetTop}px`;
                    }
                    if (buffer.disableClasses !== true) {
                        this.addClass(element, fixedSelector)
                            .removeClass(element, absoluteSelector);
                    }
                } else if (scrollActual >= elementBottom - offsetTop) {
                    if (buffer.disableInlineStyles !== true) {
                        element.style.position = 'absolute';
                        element.style.top = `${elementBottom}px`;
                    }
                    if (buffer.disableClasses !== true) {
                        this.addClass(element, absoluteSelector)
                            .removeClass(element, fixedSelector);
                    }
                } else {
                    if (buffer.disableInlineStyles !== true) {
                        element.style.position = 'relative';
                        element.style.top = '0';
                    }
                    if (buffer.disableClasses !== true) {
                        this.removeClass(element, fixedSelector)
                            .removeClass(element, absoluteSelector);
                    }
                    delete buffer['elementTop'];
                }
            }
        }
    }

    /**
     * @returns {Floating}
     */
    scrollEvent() {
        window.addEventListener('scroll', () => {
            const doc = document.documentElement;
            const scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            this.elementPosition(scrollTop);
        });
        return this;
    }

    /**
     * @returns {HTMLElement}
     */
    getCurrentScriptElement() {
        /** @var {{currentScript}} document */
        return document.currentScript || (() => {
            /** @type {NodeList} */
            const scripts = document.querySelectorAll('script');
            return scripts[scripts.length - 1];
        })();
    }

    /**
     * @param {HTMLElement|Node} element
     * @returns {HTMLElement}
     */
    getPreviousElement(element = null) {
        /** @type {HTMLElement|Node|null} */
        let previous;
        if (!!element === true) {
            previous = element.previousSibling;
        } else {
            previous = this.getCurrentScriptElement().previousSibling;
        }
        if (!!previous === true && previous.nodeType !== 1) {
            return this.getPreviousElement(previous);
        } else {
            return previous;
        }
    }

    /**
     * @param {*} input
     * @returns {Boolean}
     */
    isHtmlElement(input) {
        /** @type {String} */
        const objectType = Object.prototype.toString.call(input).toLowerCase();
        return objectType.indexOf('element') !== -1 || objectType.indexOf('html') !== -1;
    }

    /**
     * @param {String|HTMLElement|NodeList} [element]
     * @param {Object} [options]
     * @returns {Floating}
     */
    start(element = null, options = {}) {
        if (!!element !== true) {
            element = this.getPreviousElement();
        }
        if (this.isHtmlElement(element)) {
            this.createElementIndex(element, options);
        } else if (element !== null) {
            /** @type {String|HTMLElement|NodeList} */
            let mainElement = element;
            if (typeof element === 'string') {
                mainElement = document.querySelectorAll(element);
            }
            if (!!mainElement !== true || !mainElement.length) {
                console.trace('Element not found!');
                return this;
            }
            for (let element of mainElement) {
                this.createElementIndex(element, options);
            }
        } else {
            console.trace('Element not found!');
            return this;
        }
        this.elementPosition(document.documentElement.scrollTop);
        this.scrollEvent();
        return this;
    }
}