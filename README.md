# halkaBox.js
A simple and basic Javascript lightbox.

[Demo Page](https://ahmednooor.github.io/halkaBox.js)

![Screenshot](https://github.com/ahmednooor/halkaBox.js/blob/master/screenshot.jpg)

## Features
* Made with Javascript. No dependencies required
* Simple and lightweight
* Multiple galleries
* Swipe gestures supported on touch devices

## Usage Example

### Files
'''html
<link rel="stylesheet" href="css/halkaBox.min.css">
<script src="js/halkaBox.min.js"></script>
'''

### Markup
'''html
<div id="gallery1">
    <a href="img/01.jpg" data-hb="gallery1"><img src="img/01.jpg" alt="1"></a>
    <a href="img/02.jpg" data-hb="gallery1"><img src="img/02.jpg" alt="2"></a>
    <a href="img/03.jpg" data-hb="gallery1"><img src="img/03.jpg" alt="3"></a>
</div>

<div id="gallery2">
    <a href="img/04.jpg" data-hb="gallery2"><img src="img/04.jpg" alt="4"></a>
    <a href="img/05.jpg" data-hb="gallery2"><img src="img/05.jpg" alt="5"></a>
    <a href="img/06.jpg" data-hb="gallery2"><img src="img/06.jpg" alt="6"></a>
</div>

<a href="img/07.jpg" data-hb-single><img src="img/07.jpg" alt="7"></a>
<a href="img/08.jpg" data-hb-single><img src="img/07.jpg" alt="8"></a>
'''

### Javascript
'''javascript
halkaBox.gallery("gallery1");
halkaBox.gallery("gallery2");
halkaBox.singles();
'''

## Compatibility
All latest versions of,
* Chrome
* Firefox
* Edge
* IE
* Opera

### Feel free to report any issues and share your feedback.

## Licence and Credits

License: [MIT](https://opensource.org/licenses/MIT)
Author:  [Ahmed Noor](https://github.com/ahmednooor)
Credits: [Unsplash](https://https://unsplash.com/) for images. [Google](https://www.google.com) for control icons.