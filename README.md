# svg-path-streamline

Round the sharp corners from an SVG path

Live demo: https://danmarshall.github.io/svg-path-streamline/browser

## Installation

### Node

```
npm install svg-path-streamline --save
```

### Browser

```html
<script src="https://pomax.github.io/bezierjs/bezier.js" type="text/javascript"></script>
<script src="https://microsoft.github.io/maker.js/target/js/browser.maker.js" type="text/javascript"></script>
<script src="https://danmarshall.github.io/svg-path-streamline/browser/index.js" type="text/javascript"></script>
```

## Usage

```js
var sps = require('svg-path-streamline');

var streamline = FIX sps(svgData, distance, options);
```

## Parameters

### svgData

Input is a string of either SVG `path` data, or point coordinates from SVG `polyline` or `polygon`.

### radius

Numeric radius to round corners.

### options

Object with these optional properties:

| option | type | default | description |
|---|---|---|---|
| bezierAccuracy | number | 0.5 | Distance of accuracy for Bezier curves. A lower number is more accurate but requires more computation. Using zero is not recommended as it may never finish computing. This number is relative to the unit system of your SVG; so if you are rendering pixels, then 0.5 is accurate to half a pixel. |
| tagName | string | 'path' | SVG tag name of the type of data:<br/>'path' - SVG path language<br/>'polygon' - point coordinates, closed shape<br/>'polyline' - point coordinates, open shape |

### return value

Output is a string of SVG `path` data.

## Examples

Simple example in JavaScript:

```js
var sps = require('svg-path-streamline');
var svgData = "M 95 35 L 59 35 L 48 0 L 36 35 L 0 35 L 29 56 L 18 90 L 48 69 L 77 90 L 66 56 Z";
var streamline = sps(svgData, 10);
```

Example in HTML:

```html
<svg id="star" fill="none" stroke="black">
 <path d="M 95 35 L 59 35 L 48 0 L 36 35 L 0 35 L 29 56 L 18 90 L 48 69 L 77 90 L 66 56 Z" />
</svg>

<script type="text/javascript">
 var sps = require('svg-path-streamline');
 var starPath = document.querySelector('#star path');
 var d = starPath.getAttribute('d');
 var streamline = sps(d, 10);
 starPath.setAttribute('d', streamline);
</script>
```

## License
Apache 2.0
