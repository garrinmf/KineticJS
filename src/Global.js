/*
 * KineticJS JavaScript Framework v@@version
 * http://www.kineticjs.com/
 * Copyright 2013, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: @@date
 *
 * Copyright (C) 2011 - 2013 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * @namespace Kinetic
 */
var Kinetic = {};
(function() {
    Kinetic.version = '@@version';

    /**
     * @namespace Filters
     * @memberof Kinetic
     */
    Kinetic.Filters = {};

    /**
     * Node constructor. Nodes are entities that can be transformed, layered,
     * and have bound events. The stage, layers, groups, and shapes all extend Node.
     * @constructor
     * @memberof Kinetic
     * @abstract
     * @param {Object} config
     * @@nodeParams
     */
    Kinetic.Node = function(config) {
        this._init(config);
    };

    /**
     * Shape constructor.  Shapes are primitive objects such as rectangles,
     *  circles, text, lines, etc.
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Node
     * @param {Object} config
     * @@shapeParams
     * @@nodeParams
     * @example
     * var customShape = new Kinetic.Shape({<br>
     *   x: 5,<br>
     *   y: 10,<br>
     *   fill: 'red',<br>
     *   // a Kinetic.Canvas renderer is passed into the drawFunc function<br>
     *   drawFunc: function(canvas) {<br>
     *     var context = canvas.getContext();<br>
     *     context.beginPath();<br>
     *     context.moveTo(200, 50);<br>
     *     context.lineTo(420, 80);<br>
     *     context.quadraticCurveTo(300, 100, 260, 170);<br>
     *     context.closePath();<br>
     *     canvas.fillStroke(this);<br>
     *   }<br>
     *});
     */
    Kinetic.Shape = function(config) {
        this.__init(config);
    };

    /**
     * Container constructor.&nbsp; Containers are used to contain nodes or other containers
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Node
     * @abstract
     * @param {Object} config
     * @@nodeParams
     * @@containerParams
     */
    Kinetic.Container = function(config) {
        this.__init(config);
    };

    /**
     * Stage constructor.  A stage is used to contain multiple layers
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Container
     * @param {Object} config
     * @param {String|DomElement} config.container Container id or DOM element
     * @@nodeParams
     * @@containerParams
     * @example
     * var stage = new Kinetic.Stage({<br>
     *   width: 500,<br>
     *   height: 800,<br>
     *   container: 'containerId'<br>
     * });
     */
    Kinetic.Stage = function(config) {
        this.___init(config);
    };

    /**
     * Layer constructor.  Layers are tied to their own canvas element and are used
     * to contain groups or shapes
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Container
     * @param {Object} config
     * @param {Boolean} [config.clearBeforeDraw] set this property to false if you don't want
     * to clear the canvas before each layer draw.  The default value is true.
     * @@nodeParams
     * @@containerParams
     * @example
     * var layer = new Kinetic.Layer();
     */
    Kinetic.Layer = function(config) {
        this.___init(config);
    };

    /**
     * Group constructor.  Groups are used to contain shapes or other groups.
     * @constructor
     * @memberof Kinetic
     * @augments Kinetic.Container
     * @param {Object} config
     * @@nodeParams
     * @@containerParams
     * @example
     * var group = new Kinetic.Group();
     */
    Kinetic.Group = function(config) {
        this.___init(config);
    };

    /**
     * @namespace Global
     * @memberof Kinetic
     */
    Kinetic.Global = {
        stages: [],
        idCounter: 0,
        ids: {},
        names: {},
        //shapes hash.  rgb keys and shape values
        shapes: {},

        // event flags
        listenClickTap: false,
        inDblClickWindow: false,

        dblClickWindow: 400,

        /**
         * returns whether or not drag and drop is currently active
         * @method
         * @memberof Kinetic.Global
         */
        isDragging: function() {
            var dd = Kinetic.DD;

            // if DD is not included with the build, then
            // drag and drop is not even possible
            if (!dd) {
                return false;
            }
            // if DD is included with the build
            else {
                return dd.isDragging;
            }
        },
        /**
        * returns whether or not a drag and drop operation is ready, but may
        *  not necessarily have started
        * @method
        * @memberof Kinetic.Global
        */
        isDragReady: function() {
            var dd = Kinetic.DD;

            // if DD is not included with the build, then
            // drag and drop is not even possible
            if (!dd) {
                return false;
            }
            // if DD is included with the build
            else {
                return !!dd.node;
            }
        },
        _addId: function(node, id) {
            if(id !== undefined) {
                this.ids[id] = node;
            }
        },
        _removeId: function(id) {
            if(id !== undefined) {
                delete this.ids[id];
            }
        },
        _addName: function(node, name) {
            if(name !== undefined) {
                if(this.names[name] === undefined) {
                    this.names[name] = [];
                }
                this.names[name].push(node);
            }
        },
        _removeName: function(name, _id) {
            if(name !== undefined) {
                var nodes = this.names[name];
                if(nodes !== undefined) {
                    for(var n = 0; n < nodes.length; n++) {
                        var no = nodes[n];
                        if(no._id === _id) {
                            nodes.splice(n, 1);
                        }
                    }
                    if(nodes.length === 0) {
                        delete this.names[name];
                    }
                }
            }
        }
    };
})();

// Uses Node, AMD or browser globals to create a module.

// If you want something that will work in other stricter CommonJS environments,
// or if you need to create a circular dependency, see commonJsStrict.js

// Defines a module "returnExports" that depends another module called "b".
// Note that the name of the module is implied by the file name. It is best
// if the file name and the exported global have matching names.

// If the 'b' module also uses this type of boilerplate, then
// in the browser, it will create a global .b that is used below.

// If you do not want to support the browser global path, then you
// can remove the `root` use and the passing `this` as the first arg to
// the top function.



// if the module has no dependencies, the above pattern can be simplified to
( function(root, factory) {
    if( typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = function(win) {
            window = win || window;
            Kinetic.setupRequestAnimFrame();
            document = window.document;
            return factory();
        };
    }
    else if( typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    }
    else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function() {

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return Kinetic;
}));

if (typeof window === 'undefined' && typeof require !== 'undefined') {
    Kinetic.createCanvas = function() {
        // Merge a DOM (jsdom or browser DOM) node with a node-canvas implementation
        var canvas = document.createElement('canvas');
        canvas.impl = new Canvas();
        for (var key in canvas.impl) {
            (function(k){
                if (k === 'undefined' || k === 'toString') return;
                if (typeof canvas.impl[k] === 'function') {
                    canvas[k] = function() {
                        return canvas.impl[k].apply(canvas.impl, arguments);
                    }
                }
                else {
                    canvas.__defineSetter__(k, function(val) {canvas.impl[k] = val;});
                    canvas.__defineGetter__(k, function() {return canvas.impl[k];});
                }
            })(key);
        }
        canvas.__defineGetter__
        canvas.style = canvas.style || {};
        return canvas;
    }
}
else {
    Kinetic.createCanvas = function() {
        return document.createElement('canvas');
    }
};
Kinetic.setupRequestAnimFrame = function() {
    if (typeof window !== 'undefined') {
        Kinetic.requestAnimFrame = (function(callback) {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();
    }
    else {
        Kinetic.requestAnimFrame = function(callback) {setTimeout(callback, 1000 / 60)};
    }
}

Kinetic.setupRequestAnimFrame();
