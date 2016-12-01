/*  
    halkaBox.js , url: https://github.com/ahmednooor/halkaBox.js
    Version: 0.4
    Auther: Ahmed Noor , url: https://github.com/ahmednooor
    License: MIT , url: https://opensource.org/licenses/MIT
*/

var halkaBox = (function () {
    "use strict";
    var options = {
            // default options
            hideButtons: true,     // hide buttons on touch devices (true || false)
            animation: "slide",    // animation type on next/prev ("slide" || "fade")
            theme: "light"         // lightbox overlay theme ("light" || "dark")
        };
    
    // function to set options for all galleries and single images
    function optionSetter(opt) {
        var prop;
        for (prop in opt) {
            if (opt.hasOwnProperty(prop)) {
                options[prop] = opt[prop];
            }
        }
        return options;
    }
    
    // main function
    function initHalkaBox(selector, customOptionsParam) {
        // variables
        var body = document.getElementsByTagName("body")[0],
            // collecting all the anchor tags having data-hb attribute with their respective values
            imageLinks = document.querySelectorAll("a[data-hb=\"" + selector + "\"]"),
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
            eventsBinder,
            eventsUnbinder,
            lightboxTrigger,
            props,
            customOptions = {};
        
        // inheriting properties from options to customOptions
        for (props in options) {
            if (options.hasOwnProperty(props)) {
                customOptions[props] = options[props];
            }
        }
        
        // changing customOptions for separate galleries if user wants separate options for separate galleries
        for (props in customOptionsParam) {
            if (customOptionsParam.hasOwnProperty(props)) {
                customOptions[props] = customOptionsParam[props];
            }
        }

        // setting attributes to created elements for the lightbox overlay
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

        // for hiding buttons if touch is supported or image is single
        if (("ontouchstart" in window && customOptions.hideButtons === true) || selector === "single" || imageLinks.length === 1) {
            hbRightIconContainer.style.display = "none";
            hbLeftIconContainer.style.display = "none";
        }
        
        // for setting dark theme
        if (customOptions.theme === "dark") {
            hbMainContainer.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
            hbRightIconElement.children[0].style.fill = "#fff";
            hbLeftIconElement.children[0].style.fill = "#fff";
            hbCloseIconElement.children[0].style.fill = "#fff";
            hbLoader.style.borderTop = "5px solid #999";
            if (window.innerWidth <= 960) {
                hbRightIconElement.children[0].style.fill = "#111";
                hbLeftIconElement.children[0].style.fill = "#111";
                hbCloseIconElement.children[0].style.fill = "#111";
            }
        }
        
        // since the script creates the required html elements for the lightbox overlay on pageload so its necessary to set display to none
        hbWrapper.style.display = "none";

        // creating and cahing image elements according to the imageLinksQty
        (function imageCacheF() {
            for (p = 0; p < imageLinksQty; p += 1) {
                imageObjects[p] = document.createElement("img");
                imageObjects[p].src = imageLinks[p].href;
                imageObjects[p].style.opacity = 0;
                imageObjects[p].style.display = "none";
                hbImageContainer.appendChild(imageObjects[p]);
            }
        }());

        // appending complete structure of above created lightbox overlay elements to body
        body.appendChild(hbWrapper);

        // control variables, collecting the control icons from above created elements for lightbox overlay and assigning them different IDs depending upon the selector argument so separately created elements of different galleries won't conflict
        hbClose = document.getElementById("hb-close-" + selector);
        hbLeft = document.getElementById("hb-left-" + selector);
        hbRight = document.getElementById("hb-right-" + selector);

        // control functions
        // function for jumping to next image
        function next(ev) {
            if (imageLinks.length !== 1) {
                if (customOptions.animation === "slide") {
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
                } else if (customOptions.animation === "fade") {
                    // set opacity of the current image to 0
                    imageObjects[i].style.opacity = 0;
                    // setTimeout for the opacity transition to complete and then run the code inside
                    window.setTimeout(function () {
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
                        window.setTimeout(function () {
                            // set the opacity of the next image to 1
                            imageObjects[i].style.opacity = 1;
                        }, 100);
                    }, 300);
                }
            }
        }
        
        // function for jumping to previous image
        function previous(ev) {
            if (imageLinks.length !== 1) {
                if (customOptions.animation === "slide") {
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
                } else if (customOptions.animation === "fade") {
                    // set opacity of the current image to 0
                    imageObjects[i].style.opacity = 0;
                    // setTimeout for the animation to complete and then run the code inside
                    window.setTimeout(function () {
                        // set the current image display to none
                        imageObjects[i].style.display = "none";
                        // to check if the number of image has reached the minimum length of imageLinks if yes then set to imageLinks maximum length
                        if (i === 0) {
                            i = (imageLinks.length);
                        }
                        // decrement the number of image to display the previous image
                        i -= 1;
                        // set the display to block so that next image is visible
                        imageObjects[i].style.display = "block";
                        window.setTimeout(function () {
                            // set the opacity of the next image to 1
                            imageObjects[i].style.opacity = 1;
                        }, 100);
                    }, 300);
                }
            }
        }

        // function for closing lightbox overlay
        function closeLightbox(ev) {
            ev.preventDefault();
            // set opacity of displayed image and the structure to 0 for fade out effect
            imageObjects[i].style.opacity = 0;
            hbWrapper.style.opacity = 0;

            // setTimeout for the fade out to complete and then run the code inside
            window.setTimeout(function () {
                // set the current image and the structure display to none
                imageObjects[i].style.display = "none";
                hbWrapper.style.display = "none";
            }, 300);
            // to set focus to the element that triggered the lightbox and blur it again to preven user-agent focus styles
            imageLinks[i].focus();
            imageLinks[i].blur();
            // unbind events attached to the elements inside overlay
            eventsUnbinder();
        }

        // function for closing popup by clicking on empty space
        function bgClickClose(ev) {
            // to prevent bubbling
            ev.stopPropagation();
            ev.preventDefault();
            // to check if the event occured only outside of image
            if (ev.target === hbImageContainer || ev.target === hbMainContainer) {
                // calling close function
                closeLightbox(ev);
            }
        }

        // function for keyboard support
        function keyboardSupport(key) {
            key.stopPropagation();
            key.preventDefault();
            if (key.which === 27) {
                closeLightbox(key);
            } else if (key.which === 37 && selector !== "single") {
                previous();
            } else if (key.which === 39 && selector !== "single") {
                next();
            }
        }

        // functions for touch support
        touchEnabled = false;
        // calculate the width of the document so that if the document is zoomed the touch does not trigger
        viewport = screen.width;
        function touchStart(event) {
            // to confirm it is a single touch and browser is not zoomed in
            if ((screen.availWidth <= viewport || screen.availHeight <= viewport) && event.touches.length === 1) {
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
            if (touchEnabled === false && (screen.availWidth <= viewport || screen.availHeight <= viewport) && touches !== 2) {
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

        // function to bind events
        eventsBinder = function eventsBinderF() {
            // check if the selecter is not eq-to "single" then attach next/prev events
            if (selector !== "single") {
                hbRight.addEventListener("click", next);
                hbLeft.addEventListener("click", previous);
            }
            hbClose.addEventListener("click", closeLightbox);
            hbMainContainer.addEventListener("click", bgClickClose);
            hbImageContainer.addEventListener("click", bgClickClose);
            window.addEventListener("keyup", keyboardSupport);
            // check if the selecter is not eq-to "single" then attach next/prev touch events
            if (selector !== "single") {
                hbWrapper.addEventListener("touchstart", touchStart);
                hbWrapper.addEventListener("touchmove", touchMove);
                hbWrapper.addEventListener("touchend", touchEnd);
            }
        };

        // function to unbind events
        eventsUnbinder = function eventsUnbinderF() {
            // check if the selecter is not eq-to "single" then remove next/prev events
            if (selector !== "single") {
                hbRight.removeEventListener("click", next);
                hbLeft.removeEventListener("click", previous);
            }
            hbClose.removeEventListener("click", closeLightbox);
            hbMainContainer.removeEventListener("click", bgClickClose);
            hbImageContainer.removeEventListener("click", bgClickClose);
            window.removeEventListener("keyup", keyboardSupport);
            // check if the selecter is not eq-to "single" then remove next/prev touch events
            if (selector !== "single") {
                hbWrapper.removeEventListener("touchstart", touchStart);
                hbWrapper.removeEventListener("touchmove", touchMove);
                hbWrapper.removeEventListener("touchend", touchEnd);
            }
        };

        // function to trigger the lightbox overlay when an image link(imageLinks[i]) is clicked
        lightboxTrigger = function lightboxTriggerF(index) {
            return function (e) {
                e.preventDefault();

                // assigning the value of ir to i via index
                i = index;


                // set time out to wait for the below statements to complete with transition effect
                window.setTimeout(function () {
                    // set the popup html structure and currently clicked image opacity to 1
                    hbWrapper.style.opacity = 1;
                    imageObjects[i].style.opacity = 1;
                    imageLinks[i].blur();
                }, 100);

                // set animation of currently clicked image to none in case lightbox overlay has been previously triggered and then set display to block for image and popup structure
                imageObjects[i].style.animation = "none";
                imageObjects[i].style.display = "block";
                hbWrapper.style.display = "block";

                // bind events to the elements inside overlay
                eventsBinder();
            };
        };

        // for loop to capture click events on image links(imageLinks) and run the lightboxTrigger function
        for (ir = 0; ir < imageLinksQty; ir += 1) {
            // click event to trigger lightbox overlay by calling lightboxTrigger
            imageLinks[ir].addEventListener("click", lightboxTrigger(ir));
        }
    }

    // return initHalkaBox and optionSetter functions as an object to be used as an API
    return {
        run: initHalkaBox,
        options: optionSetter
    };
}());