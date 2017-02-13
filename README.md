# halkaBox.js
A simple and basic Javascript lightbox.

[Demo Page](https://ahmednooor.github.io/halkaBox.js)

![Screenshot](https://github.com/ahmednooor/halkaBox.js/blob/master/demo/screenshot.png)

## Features
* Made with Javascript. No dependencies required.
* Simple and lightweight.
* Multiple galleries. Custom options for each.
* Keyboard arrow keys to navigate and escape to close supported.
* Swipe gestures supported on touch devices.
* SVG Icons.
* Transitions via CSS Keyframes.

## Usage Example

### Files
```html
<link rel="stylesheet" href="css/halkaBox.min.css">
<script src="js/halkaBox.min.js"></script>
```

### Markup for Galleries
> Anchor tags with same `data-hb` values will be treated as galleries.

```html
<a href="..." data-hb="gallery1"><img src="..." alt="..."></a>
<a href="..." data-hb="gallery1"><img src="..." alt="..."></a>
<a href="..." data-hb="gallery1"><img src="..." alt="..."></a>

<a href="..." data-hb="gallery2"><img src="..." alt="..."></a>
<a href="..." data-hb="gallery2"><img src="..." alt="..."></a>
<a href="..." data-hb="gallery2"><img src="..." alt="..."></a>
```
### Markup for Single Images
> `data-hb="single"` is reserved for single images. This way you can set options for all single images at once.

```html
<a href="..." data-hb="single"><img src="..." alt="..."></a>
<a href="..." data-hb="single"><img src="..." alt="..."></a>
<a href="..." data-hb="single"><img src="..." alt="..."></a>
```
> Or you can set a unique `data-hb` value to a single anchor tag and it will be treated as a single image. You can use custom options for each single image this way.

```html
<a href="..." data-hb="singleImage1"><img src="..." alt="..."></a>
<a href="..." data-hb="singleImage2"><img src="..." alt="..."></a>
```

### Javascript for Galleries
```javascript
halkaBox.run("gallery1");
halkaBox.run("gallery2");
```

### Javascript for Single Images
```javascript
halkaBox.run("single");
halkaBox.run("singleImage1");
halkaBox.run("singleImage2");
```

## Options
### Setting Options Globally
```javascript
halkaBox.options({
    hideButtons: true,  // hide buttons on touch devices (true || false)
    animation: "slide", // animation type on next/prev ("slide" || "fade")
    theme: "light",     // lightbox overlay theme ("light" || "dark")
    preload: 2          // number of images to preload
});
halkaBox.run("...");
...
```
> `halkaBox.options()` should come before `halkaBox.run()`.

### Setting Options Individually
```javascript
halkaBox.run("...", {
    hideButtons: true,  // hide buttons on touch devices (true || false)
    animation: "slide", // animation type on next/prev ("slide" || "fade")
    theme: "light",     // lightbox overlay theme ("light" || "dark")
    preload: 2          // number of images to preload
});
...
```

### Available Options
| Option | Value Type | Default Value | Available Values | Description |
| --- | --- | --- | --- | --- |
| `hideButtons` | `Boolean` | `true` | `true`, `false` | Hides next/previous buttons on touch devices. |
| `animation` | `String` | `"slide"` | `"slide"`, `"fade"` | Sets animation type on next/previous actions. |
| `theme` | `String` | `"light"` | `"light"`, `"dark"` | Sets lightbox overlay theme. |
| `preload` | `Number` | `2` | `0`, `1,2,3, ...` | Sets the number of images to preload. |

## Compatibility
All the latest versions of,

* Chrome
* Firefox
* Edge
* IE
* Opera

> Feel free to report any issues and share your feedback in the issues tracker.

> NOTE: If you are going to look at source code, beware that you will be entering in a procedural mess :D

## Licence and Credits

License: [MIT](https://opensource.org/licenses/MIT)

Author:  [Ahmed Noor](https://github.com/ahmednooor)

Credits: [Unsplash](https://unsplash.com/) for images. [Google](https://www.google.com) for control icons.