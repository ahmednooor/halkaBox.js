/*  
    halkaBox.js , url: https://github.com/ahmednooor/halkaBox.js
    Version: 0.3
    Auther: Ahmed Noor , url: https://github.com/ahmednooor
    License: MIT , url: https://opensource.org/licenses/MIT
*/

// function for galleries
function halkaBoxGallery(selector) {
    "use strict";
    // variables
    var body = document.getElementsByTagName("body")[0],
        // collecting the gallery container div depending on the string passed in halkaBox.gallery()
        galleryContainer = document.querySelector("#" + selector),
        // collecting all the anchor tags from the gallery container div
        imageLinks = galleryContainer.querySelectorAll("a[data-hb=\"" + selector + "\"]"),
        // determine how many anchor tags have been collected
        imageLinksQty = imageLinks.length,
        // array to be used for image cahing and creating and appending respective image tags
        imageObjects = [],
        // incrementors/decrementors
        ir,
        i,
        p,
        // creating html elements for the lightbox popup
        hbWrapper = document.createElement("div"),
        hbMainContainer = document.createElement("div"),
        hbImageContainer = document.createElement("div"),
        hbLoader = document.createElement("div"),
        hbCloseIconContainer = document.createElement("div"),
        hbCloseIconElement = document.createElement("a"),
        hbLeftIconContainer = document.createElement("div"),
        hbLeftIconElement = document.createElement("a"),
        hbRightIconContainer = document.createElement("div"),
        hbRightIconElement = document.createElement("a"),
        hbClose,
        hbLeft,
        hbRight,
        // svg icons
        hbCloseIconSvg = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\"y=\"0px\" viewBox=\"0 0 357 357\" enable-background=\"new 0 0 357 357\" xml:space=\"preserve\"><g><g id=\"close\"><polygon points=\"357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5\"/></g></g></svg>",
        hbLeftIconSvg = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"viewBox=\"0 0 306 306\" enable-background=\"new 0 0 306 306\" xml:space=\"preserve\"><g><g id=\"chevron-right\"><polygon points=\"58.7,153 211.7,306 247.4,270.3 130.1,153 247.4,35.7 211.7,0\"/></g></g></svg>",
        hbRightIconSvg = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 306 306\" enable-background=\"new 0 0 306 306\" xml:space=\"preserve\"><g><g id=\"chevron-right\"><polygon points=\"94.3,0 58.7,35.7 175.9,153 58.7,270.3 94.3,306 247.4,153\"/></g></g></svg>",
        touchEnabled,
        viewport,
        touchPositionX,
        galleryImageClick;
    
    // setting attributes to created elements for the lightbox popup
    hbWrapper.setAttribute("class", "hb-wrapper");
    hbMainContainer.setAttribute("class", "hb-main-container");
    hbImageContainer.setAttribute("class", "hb-image-container");
    hbLoader.setAttribute("id", "hb-loader");
    hbLoader.setAttribute("class", "hb-loader");
    hbCloseIconContainer.setAttribute("class", "hb-close-icon-container");
    hbCloseIconElement.setAttribute("id", "hb-close-" + selector);
    hbCloseIconElement.setAttribute("class", "hb-close");
    hbLeftIconContainer.setAttribute("class", "hb-left-icon-container");
    hbLeftIconElement.setAttribute("id", "hb-left-" + selector);
    hbLeftIconElement.setAttribute("class", "hb-left");
    hbRightIconContainer.setAttribute("class", "hb-right-icon-container");
    hbRightIconElement.setAttribute("id", "hb-right-" + selector);
    hbRightIconElement.setAttribute("class", "hb-right");

    // appending elements in a parent child structure from top(children) to bottom(parents)
    hbRightIconContainer.appendChild(hbRightIconElement);
    hbRightIconElement.innerHTML = hbRightIconSvg;
    hbLeftIconContainer.appendChild(hbLeftIconElement);
    hbLeftIconElement.innerHTML = hbLeftIconSvg;
    hbCloseIconContainer.appendChild(hbCloseIconElement);
    hbCloseIconElement.innerHTML = hbCloseIconSvg;
    hbMainContainer.appendChild(hbLoader);
    hbMainContainer.appendChild(hbImageContainer);
    hbMainContainer.appendChild(hbCloseIconContainer);
    hbMainContainer.appendChild(hbLeftIconContainer);
    hbMainContainer.appendChild(hbRightIconContainer);
    hbWrapper.appendChild(hbMainContainer);
    
    // since the script creates the required html elements for the lightbox popup on pageload so its necessary to set display to none
    hbWrapper.style.display = "none";
    
    // creating image elements according to the imageLinksQty in the galleryContainer
    (function () {
        for (p = 0; p < imageLinksQty; p += 1) {
            imageObjects[p] = document.createElement("img");
            imageObjects[p].src = imageLinks[p].href;
            imageObjects[p].style.opacity = 0;
            imageObjects[p].style.display = "none";
            hbImageContainer.appendChild(imageObjects[p]);
        }
    }());
    
    // appending complete structure of above created lightbox popup elements to body
    body.appendChild(hbWrapper);
    
    // control variables, collecting the control icons from above created elements for lightbox popup and assigning them different IDs depending upon the selector argument so separately created elements of different galleries won't conflict
    hbClose = document.getElementById("hb-close-" + selector);
    hbLeft = document.getElementById("hb-left-" + selector);
    hbRight = document.getElementById("hb-right-" + selector);
    
    // control functions
    // function for jumping to next image
    function next(ev) {
        // set css animation property to the currently displayed image to slide out from center to left
        imageObjects[i].style.animation = "slideNextOut 0.3s ease-out forwards";
        // setTimeout for the animation to complete and then run the code inside
        window.setTimeout(function () {
            // set currently displayed and slided image opacity to 0
            imageObjects[i].style.opacity = 0;
            // set the current image display to none
            imageObjects[i].style.display = "none";
            // to check if the number of image has reached the maximum length of imageLinks if yes then set to -1
            if (i > (imageLinks.length - 2)) {
                i = -1;
            }
            // increment the number of image to display the next image
            i += 1;
            // set the display to block so that next image is visible
            imageObjects[i].style.display = "block";
            // set css animation to the next image to slide in from right to center
            imageObjects[i].style.animation = "slideNextIn 0.3s ease-out forwards";
        }, 300);
    }
    
    // function for jumping to previous image
    function previous(ev) {
        // set css animation property to the currently displayed image to slide out from center to right
        imageObjects[i].style.animation = "slidePreviousOut 0.3s ease-out forwards";
        // setTimeout for the animation to complete and then run the code inside
        window.setTimeout(function () {
            // set currently displayed and slided image opacity to 0
            imageObjects[i].style.opacity = 0;
            // set the current image display to none
            imageObjects[i].style.display = "none";
            // to check if the number of image has reached the minimum length of imageLinks if yes then set to imageLinks maximum length
            if (i === 0) {
                i = (imageLinks.length);
            }
            // decrement the number of image to display the previous image
            i -= 1;
            // set the display to block so that previous image is visible
            imageObjects[i].style.display = "block";
            // set css animation to the next image to slide in from left to center
            imageObjects[i].style.animation = "slidePreviousIn 0.3s ease-out forwards";
        }, 300);
    }
    
    // function for closing popup by clicking on close icon
    function iconClickClose(ev) {
        // set opacity of displayed image and the structure to 0 for fade out effect
        imageObjects[i].style.opacity = 0;
        hbWrapper.style.opacity = 0;
        // setTimeout for the fade out to complete and then run the code inside
        window.setTimeout(function () {
            // set the current image and the structure display to none and remove the hb-noscroll class from body
            imageObjects[i].style.display = "none";
            hbWrapper.style.display = "none";
            body.classList.remove("hb-noscroll");
        }, 300);
    }

    // function for closing popup by clicking on empty space
    function bgClickClose(ev) {
        // to prevent bubbling
        ev.stopPropagation();
        ev.preventDefault();
        // to check if the event occured only outside of image
        if (ev.target === hbImageContainer || ev.target === hbMainContainer) {
            // set opacity of displayed image and the structure to 0 for fade out effect
            imageObjects[i].style.opacity = 0;
            hbWrapper.style.opacity = 0;
            // setTimeout for the fade out to complete and then run the code inside
            window.setTimeout(function () {
                // set the current image and the structure display to none and remove the hb-noscroll class from body
                imageObjects[i].style.display = "none";
                hbWrapper.style.display = "none";
                body.classList.remove("hb-noscroll");
            }, 300);
        }
    }

    // function for keyboard support
    function keyboardSupport(key) {
        key.preventDefault();
        if (key.which === 37) {
            previous();
        } else if (key.which === 39) {
            next();
        } else if (key.which === 27) {
            iconClickClose();
        }
    }

    // functions for touch support
    touchEnabled = false;
    // calculate the width of the document so that if the document is zoomed the touch does not trigger
    viewport = window.innerWidth;
    function touchStart(event) {
        // to confirm it is a single touch and browser is not zoomed in
        if (window.innerWidth === viewport && event.touches.length === 1) {
            // collecting x axis position
            touchPositionX = event.changedTouches[0].pageX;
            return;
        } else {
            return false;
        }
    }
    function touchMove(event) {
        var touch = event.touches[0] || event.changedTouches[0],
            touches = event.touches.length;
        // to check if touchEnabled is false, touches are not two and browser is not zoomed in
        if (touchEnabled === false && window.innerWidth === viewport && touches !== 2) {
            event.preventDefault();
            // slide at least below mentioned pixels to trigger next or previous functions
            if (touch.pageX - touchPositionX > 50) {
                touchEnabled = true;
                previous();
            } else if (touch.pageX - touchPositionX < -50) {
                touchEnabled = true;
                next();
            }
            return;
        } else {
            return false;
        }
    }
    function touchEnd() {
        touchEnabled = false;
    }
    
    // function to trigger the plugin when a gallery image(imageLinks[i]) is clicked
    galleryImageClick = function galleryImageClickF(index) {
        return function (e) {
            e.preventDefault();

            // assigning the value of ir to i via index
            i = index;

            // set time out to wait for the below statements to complete since transition can not be applied to them
            window.setTimeout(function () {
                // set the popup html structure and currently clicked image opacity to 1
                hbWrapper.style.opacity = 1;
                imageObjects[i].style.opacity = 1;
            }, 300);
            
            // set animation of currently clicked image to none in case popup has been triggered before and then set display to block for image and popup structure
            imageObjects[i].style.animation = "none";
            imageObjects[i].style.display = "block";

            hbWrapper.style.display = "block";
            
            // add hb-noscroll class to body for preventing scroll when popup is open
            body.classList.add("hb-noscroll");

            // control function calling
            // jump to next image
            hbRight.onclick = next;

            // jump to previous image
            hbLeft.onclick = previous;

            // close by clicking on close icon
            hbClose.onclick = iconClickClose;

            // close by clicking on empty space 
            hbMainContainer.onclick = bgClickClose;

            // close by clicking on empty background space in popup
            hbImageContainer.onclick = bgClickClose;

            // control by using arrow keys and close by using escape key
            document.onkeyup = keyboardSupport;

            // control by slide gestures
            hbWrapper.addEventListener("touchstart", touchStart);
            hbWrapper.addEventListener("touchmove", touchMove);
            hbWrapper.addEventListener("touchend", touchEnd);
        };
    };
    
    // for loop to capture click events on gallery images(imageLinks) and run the galleryImageClick function
    for (ir = 0; ir < imageLinksQty; ir += 1) {
        // onclick to trigger plugin by using galleryImageClick as a self invoking function to preserve loop's value
        imageLinks[ir].onclick = (galleryImageClick)(ir);
    }
}

// function for single images
function halkaBoxSingles() {
    "use strict";
    // variables
    var body = document.getElementsByTagName("body")[0],
        // collecting all the anchor tags having data-hb-single attribute
        singleImageLinks = document.querySelectorAll("a[data-hb-single]"),
        // determine how many anchor tags have been collected
        singleImageLinksQty = singleImageLinks.length,
        // array to be used for image cahing and creating and appending respective image tags
        singleImageObjects = [],
        // incrementors/decrementors
        ir,
        i,
        p,
        // creating html elements for the lightbox popup
        hbWrapper = document.createElement("div"),
        hbMainContainer = document.createElement("div"),
        hbImageContainer = document.createElement("div"),
        hbLoader = document.createElement("div"),
        hbCloseIconContainer = document.createElement("div"),
        hbCloseIconElement = document.createElement("a"),
        hbClose,
        hbCloseIconSvg = "<svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\"xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\"y=\"0px\" viewBox=\"0 0 357 357\" enable-background=\"new 0 0 357 357\" xml:space=\"preserve\"><g><g id=\"close\"><polygon points=\"357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5\"/></g></g></svg>",
        singleImageClick;
    
    // setting attributes to created elements
    hbWrapper.setAttribute("class", "hb-wrapper");
    hbMainContainer.setAttribute("class", "hb-main-container");
    hbImageContainer.setAttribute("class", "hb-image-container");
    hbLoader.setAttribute("id", "hb-loader");
    hbLoader.setAttribute("class", "hb-loader");
    hbCloseIconContainer.setAttribute("class", "hb-close-icon-container");
    hbCloseIconElement.setAttribute("id", "hb-close-s");
    hbCloseIconElement.setAttribute("class", "hb-close");

    // appending elements in a parent child structure from top(children) to bottom(parents)
    hbCloseIconContainer.appendChild(hbCloseIconElement);
    hbCloseIconElement.innerHTML = hbCloseIconSvg;
    hbMainContainer.appendChild(hbLoader);
    hbMainContainer.appendChild(hbImageContainer);
    hbMainContainer.appendChild(hbCloseIconContainer);
    hbWrapper.appendChild(hbMainContainer);
    
    // since the script creates the required html elements for the lightbox popup on pageload so its necessary to set display to none
    hbWrapper.style.display = "none";
    
    // creating image elements according to the singleImageLinksQty in the galleryContainer
    (function () {
        for (p = 0; p < singleImageLinksQty; p += 1) {
            singleImageObjects[p] = document.createElement("img");
            singleImageObjects[p].src = singleImageLinks[p].href;
            singleImageObjects[p].style.opacity = 0;
            singleImageObjects[p].style.display = "none";
            hbImageContainer.appendChild(singleImageObjects[p]);
        }
    }());
    
    // appending complete structure to body
    body.appendChild(hbWrapper);
    
    // control variables
    hbClose = document.getElementById("hb-close-s");
    
    // control functions
    // function for closing popup by clicking on close icon
    function iconClickClose(ev) {
        // for fade out effect
        // set opacity of displayed image and the structure to 0 for fade out effect
        singleImageObjects[i].style.opacity = 0;
        hbWrapper.style.opacity = 0;
        // setTimeout for the fade out to complete and then run the code inside
        window.setTimeout(function () {
            // set the current image and the structure display to none and remove the hb-noscroll class from body
            singleImageObjects[i].style.display = "none";
            hbWrapper.style.display = "none";
            body.classList.remove("hb-noscroll");
        }, 300);
    }
    
    // function for closing popup by clicking on empty space
    function bgClickClose(ev) {
        // to prevent bubbling
        ev.stopPropagation();
        ev.preventDefault();
        // to check if the event occured only outside of image
        if (ev.target === hbImageContainer || ev.target === hbMainContainer) {
            // set opacity of displayed image and the structure to 0 for fade out effect
            singleImageObjects[i].style.opacity = 0;
            hbWrapper.style.opacity = 0;
            // setTimeout for the fade out to complete and then run the code inside
            window.setTimeout(function () {
                // set the current image and the structure display to none and remove the hb-noscroll class from body
                singleImageObjects[i].style.display = "none";
                hbWrapper.style.display = "none";
                body.classList.remove("hb-noscroll");
            }, 300);
        }
    }

    // function for keyboard support
    function keyboardSupport(key) {
        key.preventDefault();
        if (key.which === 27) {
            iconClickClose();
        }
    }

    // function to trigger the plugin when a gallery image is clicked
    singleImageClick = function singleImageClickF(index) {
        return function (e) {
            e.preventDefault();

            // assigning the value of ir to i via index
            i = index;
            
            // set time out to wait for the below statements to complete since transition can not be applied to them
            window.setTimeout(function () {
                // set the popup html structure and currently clicked image opacity to 1
                hbWrapper.style.opacity = 1;
                singleImageObjects[i].style.opacity = 1;
            }, 300);
            
            // set animation of currently clicked image to none in case popup has been triggered before and then set display to block for image and popup structure
            singleImageObjects[i].style.display = "block";
            hbWrapper.style.display = "block";

            // add hb-noscroll class to body for preventing scroll when popup is open
            body.classList.add("hb-noscroll");

            // control function calling
            // close by clicking on close icon
            hbClose.onclick = iconClickClose;

            // close by clicking on empty space 
            hbMainContainer.onclick = bgClickClose;

            // close by clicking on empty space 
            hbImageContainer.onclick = bgClickClose;

            // control by using arrow keys and close by using escape key
            document.onkeyup = keyboardSupport;
        };
    };
    
    // for loop to capture click events on single images(singleImageLinks) and run the singleImageClick function
    for (ir = 0; ir < singleImageLinksQty; ir += 1) {
        // onclick to trigger plugin by using singleImageClick as a self invoking function to preserve loop's value
        singleImageLinks[ir].onclick = (singleImageClick)(ir);
    }
}

// object for running both functions as methods
var halkaBox = {
    gallery: halkaBoxGallery,
    singles: halkaBoxSingles
};