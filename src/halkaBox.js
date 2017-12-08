/*  
    halkaBox.js , url: https://github.com/ahmednooor/halkaBox.js
    Version: 1.1.0
    Auther: Ahmed Noor , url: https://github.com/ahmednooor
    License: MIT , url: https://opensource.org/licenses/MIT
*/

var halkaBox = (function () {
    "use strict";
    var options = {
        // default options
        hideButtons: true,     // hide buttons on touch devices (true || false)
        animation: "slide",    // animation type on next/prev ("slide" || "fade")
        theme: "light",        // lightbox overlay theme ("light" || "dark")
        preload: 2             // number of images to preload
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
            imageLinks = document.getElementsByClassName(selector),
            // determine how many anchor tags have been collected
            imageLinksQty = imageLinks.length,
            // array to be used for image cahing and creating and appending respective image tags
            imageObjects = [],
            // incrementors/decrementors
            ir,
            curIndex,
            // creating html elements for the lightbox popup
            hbWrapper = document.createElement("div"),
            hbMainContainer = document.createElement("div"),
            hbImageContainer = document.createElement("div"),
            hbCloseIconContainer = document.createElement("div"),
            hbCloseIconElement = document.createElement("button"),
            hbLeftIconContainer = document.createElement("div"),
            hbLeftIconElement = document.createElement("button"),
            hbRightIconContainer = document.createElement("div"),
            hbRightIconElement = document.createElement("button"),
            hbCounter = document.createElement("p"),
            hbCounterTotal = document.createElement("span"),
            hbCounterCurrent = document.createElement("span"),
            hbClose,
            hbLeft,
            hbRight,
            hbGalleryCounter,
            hbGalleryCounterTotal,
            hbGalleryCounterCurrent,
            // svg icons
            hbCloseIconSvg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 580 580" style="enable-background:new 0 0 580 580;" xml:space="preserve"><path d="M332.1,290l235-235c11.7-11.7,11.7-30.7,0-42.4c-11.7-11.7-30.7-11.7-42.4,0L290,247.2L55.3,12.5c-11.7-11.7-30.7-11.7-42.4,0C1.2,24.3,1.2,43.2,12.9,55l235,235l-235,235c-11.7,11.7-11.7,30.7,0,42.4c5.9,5.9,13.5,8.8,21.2,8.8s15.4-2.9,21.2-8.8L290,332.8l234.7,234.7c5.9,5.9,13.5,8.8,21.2,8.8s15.4-2.9,21.2-8.8c11.7-11.7,11.7-30.7,0-42.4L332.1,290z"/></svg>',
            hbLeftIconSvg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 580 580" style="enable-background:new 0 0 580 580;" xml:space="preserve"><path d="M576,289.5c0-16.6-13.4-30-30-30H106.4L311,55c11.7-11.7,11.7-30.7,0-42.4c-11.7-11.7-30.7-11.7-42.4,0L12.8,268.3C7,274.1,3.9,281.8,4,289.7c0,0.1,0,0.2,0,0.3c0,0.1,0,0.2,0,0.3c-0.1,7.9,3,15.7,8.8,21.4l255.8,255.8c5.9,5.9,13.5,8.8,21.2,8.8s15.4-2.9,21.2-8.8c11.7-11.7,11.7-30.7,0-42.4L106.4,320.5H546c16.6,0,30-13.4,30-30c0-0.2,0-0.3,0-0.5	C576,289.8,576,289.7,576,289.5z"/></svg>',
            hbRightIconSvg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 580 580" style="enable-background:new 0 0 580 580;" xml:space="preserve"><path d="M576,290c0-0.1,0-0.2,0-0.3c0.1-7.9-3-15.7-8.8-21.4L311.5,12.5c-11.7-11.7-30.7-11.7-42.4,0s-11.7,30.7,0,42.4l204.5,204.5 H34c-16.6,0-30,13.4-30,30c0,0.2,0,0.3,0,0.5c0,0.2,0,0.3,0,0.5c0,16.6,13.4,30,30,30h439.6L269,525c-11.7,11.7-11.7,30.7,0,42.4 c5.9,5.9,13.5,8.8,21.2,8.8s15.4-2.9,21.2-8.8l255.7-255.8c5.8-5.8,8.8-13.6,8.8-21.4C576,290.2,576,290.1,576,290z"/></svg>',
            touchEnabled,
            viewport,
            orientPortrait,
            touchPositionX,
            touch2PositionX,
            touchPositionY,
            touch2PositionY,
            isZoomed = false,
            zoomPercentage = 100,
            eventsBinder,
            eventsUnbinder,
            lightboxTrigger,
            option,
            customOptions = {},
            controlsHidden = true,
            captionHidden = true;
        
        // inheriting properties from options to customOptions
        for (option in options) {
            if (options.hasOwnProperty(option)) {
                customOptions[option] = options[option];
            }
        }
        
        // changing customOptions for separate galleries if user wants separate options for separate galleries
        for (option in customOptionsParam) {
            if (customOptionsParam.hasOwnProperty(option)) {
                customOptions[option] = customOptionsParam[option];
            }
        }

        // setting attributes to created elements for the lightbox overlay
        hbWrapper.setAttribute("class", "hb-wrapper");
        hbWrapper.setAttribute("id", "hb-wrapper" + selector);
        hbMainContainer.setAttribute("class", "hb-main-container");
        hbImageContainer.setAttribute("class", "hb-image-container");
        hbCloseIconContainer.setAttribute("class", "hb-close-icon-container");
        hbCloseIconElement.setAttribute("id", "hb-close-" + selector);
        hbCloseIconElement.setAttribute("class", "hb-close");
        hbLeftIconContainer.setAttribute("class", "hb-left-icon-container");
        hbLeftIconElement.setAttribute("id", "hb-left-" + selector);
        hbLeftIconElement.setAttribute("class", "hb-left");
        hbRightIconContainer.setAttribute("class", "hb-right-icon-container");
        hbRightIconElement.setAttribute("id", "hb-right-" + selector);
        hbRightIconElement.setAttribute("class", "hb-right");
        hbCounter.setAttribute("id", "hb-counter-" + selector);
        hbCounter.setAttribute("class", "hb-counter");
        hbCounterTotal.setAttribute("id", "hb-counter-total" + selector);
        hbCounterTotal.setAttribute("class", "hb-counter-total");
        hbCounterCurrent.setAttribute("id", "hb-counter-current" + selector);
        hbCounterCurrent.setAttribute("class", "hb-counter-current");

        // appending elements in a parent child structure from top(children) to bottom(parents)
        hbCounter.appendChild(hbCounterCurrent);
        hbCounter.appendChild(hbCounterTotal);
        hbCounterTotal.innerHTML = "/ " + imageLinksQty;
        hbRightIconContainer.appendChild(hbRightIconElement);
        hbRightIconElement.innerHTML = hbRightIconSvg;
        hbLeftIconContainer.appendChild(hbLeftIconElement);
        hbLeftIconElement.innerHTML = hbLeftIconSvg;
        hbCloseIconContainer.appendChild(hbCloseIconElement);
        hbCloseIconElement.innerHTML = hbCloseIconSvg;
        hbMainContainer.appendChild(hbImageContainer);
        hbMainContainer.appendChild(hbCloseIconContainer);
        hbMainContainer.appendChild(hbLeftIconContainer);
        hbMainContainer.appendChild(hbRightIconContainer);
        hbMainContainer.appendChild(hbCounter);
        hbWrapper.appendChild(hbMainContainer);

        // for hiding buttons if touch is supported or image is single
        if (("ontouchstart" in window && customOptions.hideButtons === true) || selector === "hb-single" || imageLinksQty === 1) {
            hbRightIconContainer.style.display = "none";
            hbLeftIconContainer.style.display = "none";
        }
        if (selector === "hb-single" || imageLinksQty === 1) {
            hbCounter.style.display = "none";
        }
        
        // for setting dark theme
        if (customOptions.theme === "dark") {
            hbMainContainer.setAttribute("style", "background-color: #000; background-color: rgba(0, 0, 0, 0.9);");
            hbRightIconElement.children[0].style.fill = "#fff";
            hbLeftIconElement.children[0].style.fill = "#fff";
            hbCloseIconElement.children[0].style.fill = "#fff";
            hbCounter.style.color = "#fff";
            if (window.innerWidth <= 960) {
                hbRightIconContainer.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
                hbLeftIconContainer.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
                hbCloseIconContainer.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
                hbCounter.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
            }
        }
        
        // since the script creates the required html elements for the lightbox overlay on pageload so its necessary to set display to none
        hbWrapper.style.display = "none";

        // preloading functions
        function preloadNext(index, limit) {
            if (index + limit >= imageLinksQty) {
                limit = imageLinksQty - index - 1;
            }
            var x = index;
            function preloadImage() {
                if (!imageObjects[x] && x <= (index + limit)) {
                    var loader = document.createElement("div");
                    loader.classList.add("hb-loader");
                    if (customOptions.theme === "dark") {
                        loader.style.borderTop = "5px solid #999";
                    }
                    var newImage = document.createElement("img");
                    imageObjects[x] = document.createElement("div");
                    imageObjects[x].classList.add("hb-image-div");
                    imageObjects[x].style.opacity = 0;
                    imageObjects[x].style.display = "none";
                    hbImageContainer.appendChild(imageObjects[x]);
                    imageObjects[x].appendChild(loader);
                    imageObjects[x].appendChild(newImage);
                    if (imageLinks[x].getAttribute("title")) {
                        var captionText = document.createElement("p");
                        captionText.classList.add("hb-caption");
                        captionText.innerHTML = '<span class="hb-caption-text">' + imageLinks[x].getAttribute("title") + '</span>';
                        imageObjects[x].appendChild(captionText);
                        if (customOptions.theme === "light") {
                            captionText.classList.add("hb-caption-white");
                        } else if (customOptions.theme === "dark") {
                            captionText.classList.add("hb-caption-black");
                        }
                    }
                    newImage.onload = function () {
                        loader.style.display = "none";
                        x += 1;
                        preloadImage();
                    };
                    newImage.onerror = function () {
                        var errText = document.createElement("p");
                        errText.innerHTML = "Image not found.";
                        if (customOptions.theme === "light") {
                            errText.classList.add("hb-err-text-black");
                        } else if (customOptions.theme === "dark") {
                            errText.classList.add("hb-err-text-white");
                        }
                        loader.style.display = "none";
                        imageObjects[x].appendChild(errText);
                        x += 1;
                        preloadImage();
                    };
                    newImage.src = imageLinks[x].href;
                } else if (x <= (index + limit)){
                    x += 1;
                    preloadImage();
                }
            }
            preloadImage();
        }
        function preloadPrev(index, limit) {
            if (index - limit < 0) {
                limit = index;
            }
            var x = index;
            function preloadImage() {
                if (!imageObjects[x] && x >= (index - limit)) {
                    var loader = document.createElement("div");
                    loader.classList.add("hb-loader");
                    if (customOptions.theme === "dark") {
                        loader.style.borderTop = "5px solid #999";
                    }
                    var newImage = document.createElement("img");
                    imageObjects[x] = document.createElement("div");
                    imageObjects[x].classList.add("hb-image-div");
                    imageObjects[x].style.opacity = 0;
                    imageObjects[x].style.display = "none";
                    hbImageContainer.appendChild(imageObjects[x]);
                    imageObjects[x].appendChild(loader);
                    imageObjects[x].appendChild(newImage);
                    if (imageLinks[x].getAttribute("title")) {
                        var captionText = document.createElement("p");
                        captionText.classList.add("hb-caption");
                        captionText.innerHTML = '<span class="hb-caption-text">' + imageLinks[x].getAttribute("title") + '</span>';
                        imageObjects[x].appendChild(captionText);
                        if (customOptions.theme === "light") {
                            captionText.classList.add("hb-caption-white");
                        } else if (customOptions.theme === "dark") {
                            captionText.classList.add("hb-caption-black");
                        }
                    }
                    newImage.onload = function () {
                        loader.style.display = "none";
                        x -= 1;
                        preloadImage();
                    };
                    newImage.onerror = function () {
                        var errText = document.createElement("p");
                        errText.innerHTML = "Image not found.";
                        if (customOptions.theme === "light") {
                            errText.classList.add("hb-err-text-black");
                        } else if (customOptions.theme === "dark") {
                            errText.classList.add("hb-err-text-white");
                        }
                        loader.style.display = "none";
                        imageObjects[x].appendChild(errText);
                        x -= 1;
                        preloadImage();
                    };
                    newImage.src = imageLinks[x].href;
                } else if (x >= (index - limit)){
                    x -= 1;
                    preloadImage();
                }
            }
            preloadImage();
        }

        // appending complete structure of above created lightbox overlay elements to body
        body.appendChild(hbWrapper);

        // control variables, collecting the control icons from above created elements for lightbox overlay and assigning them different IDs depending upon the selector argument so separately created elements of different galleries won't conflict
        hbClose = document.getElementById("hb-close-" + selector);
        hbLeft = document.getElementById("hb-left-" + selector);
        hbRight = document.getElementById("hb-right-" + selector);

        hbGalleryCounter = document.getElementById("hb-counter-" + selector);
        hbGalleryCounterTotal = document.getElementById("hb-counter-total" + selector);
        hbGalleryCounterCurrent = document.getElementById("hb-counter-current" + selector);

        // counter function
        function updateCounter(index) {
            hbGalleryCounterCurrent.innerHTML = index + 1 + " ";
        }

        // control functions
        // function for jumping to next image
        function next(event) {
            if (imageLinksQty > 1 && selector !== "hb-single") {
                if (customOptions.animation === "slide") {
                    // set css animation property to the currently displayed image to slide out from center to left
                    imageObjects[curIndex].style.animation = "slideNextOut 0.3s ease-out forwards";
                    // setTimeout for the animation to complete and then run the code inside
                    window.setTimeout(function () {
                        // set currently displayed and slided image opacity to 0
                        imageObjects[curIndex].style.opacity = 0;
                        // set the current image display to none
                        imageObjects[curIndex].style.display = "none";
                        resetZoom(imageObjects[curIndex].getElementsByTagName("img")[0]);
                        // to check if the number of image has reached the maximum length of imageLinks if yes then set to -1
                        if (curIndex > (imageLinksQty - 2)) {
                            curIndex = -1;
                        }
                        // increment the number of image to display the next image
                        curIndex += 1;
                        updateCounter(curIndex);
                        preloadNext(curIndex, customOptions.preload);
                        // set the display to block so that next image is visible
                        imageObjects[curIndex].style.display = "block";
                        // set css animation to the next image to slide in from right to center
                        imageObjects[curIndex].style.animation = "slideNextIn 0.3s ease-out forwards";
                    }, 300);
                } else if (customOptions.animation === "fade") {
                    // set opacity of the current image to 0
                    imageObjects[curIndex].style.opacity = 0;
                    // setTimeout for the opacity transition to complete and then run the code inside
                    window.setTimeout(function () {
                        // set the current image display to none
                        imageObjects[curIndex].style.display = "none";
                        resetZoom(imageObjects[curIndex].getElementsByTagName("img")[0]);
                        // to check if the number of image has reached the maximum length of imageLinks if yes then set to -1
                        if (curIndex > (imageLinksQty - 2)) {
                            curIndex = -1;
                        }
                        // increment the number of image to display the next image
                        curIndex += 1;
                        updateCounter(curIndex);
                        preloadNext(curIndex, customOptions.preload);
                        // set the display to block so that next image is visible
                        imageObjects[curIndex].style.display = "block";
                        window.setTimeout(function () {
                            // set the opacity of the next image to 1
                            imageObjects[curIndex].style.opacity = 1;
                        }, 50);
                    }, 300);
                }
            }
        }
        
        // function for jumping to previous image
        function previous(event) {
            if (imageLinksQty > 1 && selector !== "hb-single") {
                if (customOptions.animation === "slide") {
                    // set css animation property to the currently displayed image to slide out from center to right
                    imageObjects[curIndex].style.animation = "slidePreviousOut 0.3s ease-out forwards";
                    // setTimeout for the animation to complete and then run the code inside
                    window.setTimeout(function () {
                        // set currently displayed and slided image opacity to 0
                        imageObjects[curIndex].style.opacity = 0;
                        // set the current image display to none
                        imageObjects[curIndex].style.display = "none";
                        resetZoom(imageObjects[curIndex].getElementsByTagName("img")[0]);
                        // to check if the number of image has reached the minimum length of imageLinks if yes then set to imageLinks maximum length
                        if (curIndex === 0) {
                            curIndex = (imageLinksQty);
                        }
                        // decrement the number of image to display the previous image
                        curIndex -= 1;
                        updateCounter(curIndex);
                        preloadPrev(curIndex, customOptions.preload);
                        // set the display to block so that previous image is visible
                        imageObjects[curIndex].style.display = "block";
                        // set css animation to the next image to slide in from left to center
                        imageObjects[curIndex].style.animation = "slidePreviousIn 0.3s ease-out forwards";
                    }, 300);
                } else if (customOptions.animation === "fade") {
                    // set opacity of the current image to 0
                    imageObjects[curIndex].style.opacity = 0;
                    // setTimeout for the animation to complete and then run the code inside
                    window.setTimeout(function () {
                        // set the current image display to none
                        imageObjects[curIndex].style.display = "none";
                        resetZoom(imageObjects[curIndex].getElementsByTagName("img")[0]);
                        // to check if the number of image has reached the minimum length of imageLinks if yes then set to imageLinks maximum length
                        if (curIndex === 0) {
                            curIndex = (imageLinksQty);
                        }
                        // decrement the number of image to display the previous image
                        curIndex -= 1;
                        updateCounter(curIndex);
                        preloadPrev(curIndex, customOptions.preload);
                        // set the display to block so that next image is visible
                        imageObjects[curIndex].style.display = "block";
                        window.setTimeout(function () {
                            // set the opacity of the next image to 1
                            imageObjects[curIndex].style.opacity = 1;
                        }, 50);
                    }, 300);
                }
            }
        }

        // function for closing lightbox overlay
        function closeLightbox(event) {
            event.preventDefault();
            // set opacity of displayed image and the structure to 0 for fade out effect
            imageObjects[curIndex].style.opacity = 0;
            hbWrapper.style.opacity = 0;

            // setTimeout for the fade out to complete and then run the code inside
            window.setTimeout(function () {
                // set the current image and the structure display to none
                imageObjects[curIndex].style.display = "none";
                hbWrapper.style.display = "none";
                resetZoom(imageObjects[curIndex].getElementsByTagName("img")[0]);
            }, 300);
            // to set focus to the element that triggered the lightbox and blur it again to preven user-agent focus styles
            imageLinks[curIndex].focus();
            imageLinks[curIndex].blur();
            // unbind events attached to the elements inside overlay
            eventsUnbinder();

            controlsHidden = true;
            captionHidden = true;
        }

        // function for closing popup by clicking on empty space
        function bgClickClose(event) {
            // to prevent bubbling
            event.stopPropagation();
            event.preventDefault();
            // to check if the event occured only outside of image
            if (event.target === hbImageContainer || event.target === hbMainContainer || event.target === imageObjects[curIndex]) {
                // calling close function
                closeLightbox(event);
            } else {
                showHideControlsCaption();
            }
        }

        // function for keyboard support
        function keyboardSupport(key) {
            key.stopPropagation();
            key.preventDefault();
            if (key.which === 27) {
                closeLightbox(key);
            } else if (key.which === 37 && selector !== "hb-single") {
                previous();
            } else if (key.which === 39 && selector !== "hb-single") {
                next();
            }
        }

        // functions for touch support
        touchEnabled = false;
        // calculate the width of the document so that if the document is zoomed the touch does not trigger
        viewport = window.innerWidth;
        // check if the view orientation on a mobile is portrait or not
        orientPortrait = window.innerWidth < window.innerHeight ? true : false;
        function resetZoom(img) {
            img.removeAttribute("style");
            img.style.transition = "all 150ms ease-out";
            zoomPercentage = 100;
            isZoomed = false;
            window.setTimeout(function() {
                img.removeAttribute("style");
            }, 160);
        }
        function checkCorners(img) {
            var imgComputedWidth = parseInt(window.getComputedStyle(img,null).getPropertyValue("width"));
            var imgComputedHeight = parseInt(window.getComputedStyle(img,null).getPropertyValue("height"));
            var imgComputedLeft = parseInt(window.getComputedStyle(img,null).getPropertyValue("left"));
            var imgComputedTop = parseInt(window.getComputedStyle(img,null).getPropertyValue("top"));

            img.style.transition = "all 150ms ease-out";
            
            if (imgComputedWidth >= window.innerWidth) {
                if (imgComputedLeft > (imgComputedWidth/2)) {
                    img.style.left = (imgComputedWidth/2) + "px";
                    img.style.right = "auto";
                } else if (imgComputedLeft < -1*(imgComputedWidth - window.innerWidth - (imgComputedWidth/2))) {
                    img.style.left = -1*(imgComputedWidth - window.innerWidth - (imgComputedWidth/2)) + "px";
                    img.style.right = "auto";
                }
            } else if (imgComputedWidth < window.innerWidth) {
                if (imgComputedLeft < (imgComputedWidth/2)) {
                    img.style.left = (imgComputedWidth/2) + "px";
                    img.style.right = "auto";
                } else if (imgComputedLeft > window.innerWidth - imgComputedWidth + (imgComputedWidth/2)) {
                    img.style.left = window.innerWidth - imgComputedWidth + (imgComputedWidth/2) + "px";
                    img.style.right = "auto";
                }
            }
            
            if (imgComputedHeight >= window.innerHeight) {
                if (imgComputedTop > (imgComputedHeight/2)) {
                    img.style.top = (imgComputedHeight/2) + "px";
                    img.style.bottom = "auto";
                } else if (imgComputedTop < -1*(imgComputedHeight - window.innerHeight - (imgComputedHeight/2))) {
                    img.style.top = -1*(imgComputedHeight - window.innerHeight - (imgComputedHeight/2)) + "px";
                    img.style.bottom = "auto";
                }
            } else if (imgComputedHeight < window.innerHeight) {
                if (imgComputedTop < (imgComputedHeight/2)) {
                    img.style.top = (imgComputedHeight/2) + "px";
                    img.style.bottom = "auto";
                } else if (imgComputedTop > window.innerHeight - imgComputedHeight + (imgComputedHeight/2)) {
                    img.style.top = window.innerHeight - imgComputedHeight + (imgComputedHeight/2) + "px";
                    img.style.bottom = "auto";
                }
            }

            if (imgComputedWidth <= window.innerWidth && imgComputedHeight <= window.innerHeight) {
                resetZoom(img);
            }

            window.setTimeout(function() {
                img.style.transition = null;
            }, 160);
        }
        function moveImage(x, y, img) {
            var numericLeft = window.getComputedStyle(img,null).getPropertyValue("left");
            var numericTop = window.getComputedStyle(img,null).getPropertyValue("top");
            
            img.style.position = "absolute";

            img.style.top = (parseInt(numericTop) + (y)) + "px";
            img.style.left = (parseInt(numericLeft) + (x)) + "px";
            img.style.right = "auto";
            img.style.bottom = "auto";
        }
        function zoomImage(img) {
            var imgComputedWidth = parseInt(window.getComputedStyle(img, null).getPropertyValue("width"));
            var imgComputedHeight = parseInt(window.getComputedStyle(img, null).getPropertyValue("height"));

            if (zoomPercentage >= 50 && zoomPercentage <= 400 && imgComputedWidth < img.naturalWidth && imgComputedHeight < img.naturalHeight) {
                img.style.position = "absolute";
                img.style.maxWidth = parseInt(zoomPercentage) + "%";
                img.style.maxHeight = parseInt(zoomPercentage) + "%";
                isZoomed = true;
            } else if (zoomPercentage >= 50 && zoomPercentage <= 400 && zoomPercentage <= parseInt(img.style.maxWidth)) {
                img.style.position = "absolute";
                img.style.maxWidth = parseInt(zoomPercentage) + "%";
                img.style.maxHeight = parseInt(zoomPercentage) + "%";
                isZoomed = true;
            } else if (imgComputedWidth >= img.naturalWidth || imgComputedHeight >= img.naturalHeight) {
                zoomPercentage = parseInt(img.style.maxWidth);
            } else if (zoomPercentage >= 400) {
                zoomPercentage = 400;
            } else {
                isZoomed = false;
            }
        }
        function touchStart(event) {
            // if orientation has been changed then set orientPortrait to false or vice versa and set viewort equal to new window.innerWidth
            if ((window.innerWidth < window.innerHeight) !== orientPortrait) {
                orientPortrait = orientPortrait === true ? false : true;
                viewport = window.innerWidth;
            }
            // collecting x,y axis positions
            touchPositionX = event.touches[0].clientX;
            touchPositionY = event.touches[0].clientY;
            if (event.touches.length > 1) {
                touch2PositionX = event.touches[1].clientX;
                touch2PositionY = event.touches[1].clientY;
            } else {
                return false;
            }
        }
        function touchMove(event) {
            event.preventDefault();
            var touch = event.touches[0] || event.changedTouches[0],
                touches = event.touches.length;
            // to check if touchEnabled is false, touches are not two and browser is not zoomed in
            if (touchEnabled === false && isZoomed === false && window.innerWidth === viewport && touches !== 2) {
                // slide at least below mentioned pixels to trigger next or previous functions
                if (touch.clientX - touchPositionX > 50 && (touch.clientY - touchPositionY < 25 && touch.clientY - touchPositionY > -25)) {
                    touchEnabled = true;
                    previous();
                } else if (touch.clientX - touchPositionX < -50 && (touch.clientY - touchPositionY < 25 && touch.clientY - touchPositionY > -25)) {
                    touchEnabled = true;
                    next();
                }
                return;
            } else if (touches === 2) {
                touchEnabled = true;
                var oldTouchSpan = Math.sqrt(Math.pow(touch2PositionX - touchPositionX, 2) + Math.pow(touch2PositionY - touchPositionY, 2));
                var newTouchSpan = Math.sqrt(Math.pow(event.touches[1].clientX - event.touches[0].clientX, 2) + Math.pow(event.touches[1].clientY - event.touches[0].clientY, 2));

                touchPositionX = event.touches[0].clientX;
                touchPositionY = event.touches[0].clientY;
                touch2PositionX = event.touches[1].clientX;
                touch2PositionY = event.touches[1].clientY;

                if (oldTouchSpan < newTouchSpan) {
                    zoomPercentage += newTouchSpan - oldTouchSpan;
                } else {
                    zoomPercentage -= oldTouchSpan - newTouchSpan;
                }
                
                zoomImage(imageObjects[curIndex].getElementsByTagName("img")[0]);
            } else if (isZoomed === true) {
                touchEnabled = true;
                var touchDiffX = event.touches[0].clientX - touchPositionX;
                var touchDiffY = event.touches[0].clientY - touchPositionY;
                
                touchPositionX = event.touches[0].clientX;
                touchPositionY = event.touches[0].clientY;
                
                moveImage(touchDiffX, touchDiffY, imageObjects[curIndex].getElementsByTagName("img")[0]);
            } else {
                return false;
            }
        }
        function touchEnd() {
            touchEnabled = false;
            checkCorners(imageObjects[curIndex].getElementsByTagName("img")[0]);
        }

        // functions to hide controls / captions
        function hideControls() {
            hbRightIconContainer.style.opacity = 0;
            hbLeftIconContainer.style.opacity = 0;
            hbCloseIconContainer.style.opacity = 0;
            hbCounter.style.opacity = 0;
            controlsHidden = true;
        }
        function showControls() {
            hbRightIconContainer.style.opacity = null;
            hbLeftIconContainer.style.opacity = null;
            hbCloseIconContainer.style.opacity = null;
            hbCounter.style.opacity = null;
            controlsHidden = false;
        }
        function hideCaption() {
            var captions = hbImageContainer.getElementsByClassName("hb-caption");
            var j = 0;
            for (j = 0; j < captions.length; j += 1) {
                captions[j].style.display = "none";
            }
            captionHidden = true;
        }
        function showCaption() {
            var captions = hbImageContainer.getElementsByClassName("hb-caption");
            var j = 0;
            for (j = 0; j < captions.length; j += 1) {
                captions[j].style.display = null;
            }
            captionHidden = false;
        }
        function showHideControlsCaption(event) {
            if (captionHidden) {
                showCaption();
            } else {
                hideCaption();
            }

            if (controlsHidden && !captionHidden) {
                showControls();
            } else if (!controlsHidden && captionHidden) {
                hideControls();
            }
        }

        // function to bind events
        eventsBinder = function eventsBinderF() {
            // check if the selecter is not eq-to "hb-single" then attach next/prev & touch events
            if (selector !== "hb-single") {
                hbRight.addEventListener("click", next, false);
                hbLeft.addEventListener("click", previous, false);
            }
            hbWrapper.addEventListener("touchstart", touchStart, false);
            hbWrapper.addEventListener("touchmove", touchMove, false);
            hbWrapper.addEventListener("touchend", touchEnd, false);
            hbClose.addEventListener("click", closeLightbox, false);
            hbImageContainer.addEventListener("click", bgClickClose, false);
            window.addEventListener("mouseout", hideControls, false);
            window.addEventListener("mouseover", showControls, false);
            window.addEventListener("keyup", keyboardSupport, false);
        };

        // function to unbind events
        eventsUnbinder = function eventsUnbinderF() {
            // check if the selecter is not eq-to "hb-single" then remove next/prev & touch events
            if (selector !== "hb-single") {
                hbRight.removeEventListener("click", next);
                hbLeft.removeEventListener("click", previous);
            }
            hbWrapper.removeEventListener("touchstart", touchStart);
            hbWrapper.removeEventListener("touchmove", touchMove);
            hbWrapper.removeEventListener("touchend", touchEnd);
            hbClose.removeEventListener("click", closeLightbox);
            hbImageContainer.removeEventListener("click", bgClickClose);
            window.removeEventListener("mouseout", hideControls);
            window.removeEventListener("mouseover", showControls);
            window.removeEventListener("keyup", keyboardSupport);
        };

        // function to trigger the lightbox overlay when an image link(imageLinks[i]) is clicked
        lightboxTrigger = function lightboxTriggerF(index) {
            return function (event) {
                event.preventDefault();

                // assigning the value of ir to i via index
                curIndex = index;

                imageLinks[curIndex].blur();

                updateCounter(curIndex);

                hbWrapper.style.display = "block";
                window.setTimeout(function () {
                    hbWrapper.style.opacity = 1;
                }, 50);
                
                preloadNext(curIndex, customOptions.preload);
                preloadPrev(curIndex, customOptions.preload);
                imageObjects[curIndex].style.animation = "none";
                imageObjects[curIndex].style.display = "block";
                imageObjects[curIndex].style.opacity = 1;

                resetZoom(imageObjects[curIndex].getElementsByTagName("img")[0]);

                // show/hide controls according to controlsHidden and captionHidden switches
                showHideControlsCaption();

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
