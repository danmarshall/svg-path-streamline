require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"svg-path-streamline":[function(require,module,exports){
"use strict";
var makerjs = require("makerjs");
function streamline(svgData, filletRadius, opts) {
    var defaultOptions = {
        bezierAccuracy: 0.25,
        tagName: 'path'
    };
    var o = makerjs.extendObject(defaultOptions, opts);
    var closed = true;
    var input;
    switch (o.tagName) {
        case 'polyline':
            closed = false;
        //fall through
        case 'polygon':
            //use points. 
            //Need to mirror them on y axis because they are expected to be in MakerJs coordinate space
            input = makerjs.model.mirror(new makerjs.models.ConnectTheDots(closed, svgData), false, true);
            break;
        default:
            input = makerjs.importer.fromSVGPathData(svgData, { bezierAccuracy: o.bezierAccuracy });
            break;
    }
    var isArray = Array.isArray(filletRadius);
    var result = { models: { input: input, filletsPerChain: { models: {} } } };
    function fillet(chainToFillet, index) {
        var filletResult = { paths: {} };
        var added = 0;
        var links = chainToFillet.links;
        function tryAdd(i1, i2, radius) {
            var c1 = makerjs.path.clone(links[i1].walkedPath.pathContext);
            var c2 = makerjs.path.clone(links[i2].walkedPath.pathContext);
            var f = makerjs.path.fillet(links[i1].walkedPath.pathContext, links[i2].walkedPath.pathContext, radius);
            if (f) {
                console.log(c1, c2);
                filletResult.paths['fillet' + added] = f;
                added++;
            }
            return f;
        }
        function add(i1, i2) {
            if (isArray) {
                for (var i = 0; i < filletRadius.length; i++) {
                    var f = tryAdd(i1, i2, filletRadius[i]);
                    if (f)
                        break;
                }
            }
            else {
                tryAdd(i1, i2, filletRadius);
            }
        }
        for (var i = 1; i < links.length; i++) {
            add(i - 1, i);
        }
        if (chainToFillet.endless) {
            add(links.length - 1, 0);
        }
        if (!added)
            return null;
        result.models['filletsPerChain'].models[index] = filletResult;
    }
    makerjs.model.findChains(input, function (chains, loose, layer) {
        chains.forEach(fillet);
    });
    return makerjs.exporter.toSVGPathData(result, false, [0, 0]);
}
exports.__esModule = true;
exports["default"] = streamline;
module.exports = streamline;

},{"makerjs":"makerjs"}]},{},[]);
