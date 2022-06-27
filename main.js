/*!
 * Copyright (c) 2020 WADe Clarke - All Rights Reserved
 *
 * This script is copyrighted and may not be used without
 * permission outside of the Integrated Media Environments
 * course in the Interactive Media Design program at Durham
 * College. Copying and re-posting on another site or app
 * without licensing is strictly prohibited.
 *
 * Contact me if you would like to license this script or
 * if you are in need of a custom script at
 * wade.clarke@durhamcollege.ca
**/

// EDITABLE VARIABLES START ////////////////////////////////

// speed of image animation in seconds
const animationSpeed = 0.5;

// time in seconds to wait before instructions reappear
const idleWaitTime = 30;

// sets what keys will be checked
// main screens - collection screen 1 = key 1
//              - collection screen 2 = key 2
//              - collection screen 3 = key 3
// highlight screens - highlight screen 1 = key 4
//                   - highlight screen 2 = key 5
//                   - highlight screen 3 = key 6
const keys = [49, 50, 51, 52, 53, 54]; // keys 1, 2, 3, 4, 5, 6

// EDITABLE VARIABLES END //////////////////////////////////

// global vars
let animating = false,
    activeLift = true,
    currentScreenNum,
    idleTimer,
    waitTime,
    highlighting = false,
    highlightToggle = true,
    activeKeys = [false, false, false];

// hide all sections
$('section').hide();

// show instructions screen
function displayScreenSaver() {

    // fade instructions screen on
    gsap.to('#instructions', {
        duration: 1,
        opacity: 1,
        onComplete: function () {

            // hide highlight screen elements
            $('.more-info').hide();

            // re-enable access to picking up other items
            highlighting = false;

            // reset highlighting toogle
            highlightToggle = true;

            // resst catalogue screen
            transitonScreenOff();

            // reset current screen number
            currentScreenNum = null;
        }
    });
}

// transitions all elements off screen
function transitonScreenOff() {

    // remove elements that are not part of the loop below
    $('.background, .title, .other').fadeOut(animationSpeed * 1000);

    // loop through all 'element' classes
    $('#screen' + currentScreenNum + ' .element').each(function (index) {

        // animate elements off screen
        // only edit property and easing
        let element = $(this);
        gsap.to(element, {
            duration: animationSpeed,
            delay: animationSpeed + index * 0.1,
            y: -1080,
            ease: "back.in",
            onComplete: function () {

                // hide element after animation
                element.hide();

                // reset positioning property values
                this.pause(0);
            }
        });
    });
}

// trigger function for image animation
function displayScreen(screenNum) {

    // output screen number to browser console
    console.log("Screen Number: " + screenNum);

    // disable interactivity during animation
    animating = true;

    // disable keys
    activeLift = false;

    // hide instructions if showing
    gsap.to('#instructions', {
        duration: 1,
        opacity: 0
    });

    // number of elements in section
    // default set to 6.67 to delay transition when not transitioning off first
    // wait enough time for instructions to fade off (6.67 * 150 = 1000 millisecs = 1 sec)
    let numEle = 6.67;

    // checks if currentScreenNum has been set
    if (currentScreenNum) {

        // sets how many elements in section
        numEle = $('#screen' + currentScreenNum + ' .element').length;

        // transitions all images off screen
        transitonScreenOff();
    }

    // wait enough time for images to transition off
    setTimeout(function () {

        // shows active screen if hidden
        $('#screen' + screenNum).show();

        // show screen background
        $('#screen' + screenNum + ' .background').show();

        // transition background on
        gsap.fromTo('#screen' + screenNum + ' .background', {
            duration: animationSpeed,
            opacity: 0
        }, {
            opacity: 1
        });

        // transitions all elements with a 'element' class onto screen
        $('#screen' + screenNum + ' .element').each(function (index) {

            // sets the delay for each element
            // each one will be offset by 0.1s + the duration
            waitTime = index * 0.1 + animationSpeed;

            // resets visibility of current element
            $(this).show();

            // animate element onto screen
            // only edit property and easing
            gsap.from($(this), {
                duration: animationSpeed,
                delay: waitTime,
                x: 1920,
                ease: "back.out"
            });
        });

        // show screen title
        $('#screen' + screenNum + ' .title').show();

        // transition title on after final/total wait time (delay) from above
        gsap.fromTo('#screen' + screenNum + ' .title', {
            duration: animationSpeed,
            left: -$(this).width()
        }, {
            delay: waitTime + animationSpeed,
            left: 5,
            ease: "back.out"
        });

        // show instructions/other content
        $('#screen' + screenNum + ' .other').show();

        // transition instructions/other content on after final/total wait time (delay) from above
        gsap.fromTo('#screen' + screenNum + ' .other', {
            duration: animationSpeed,
            opacity: 0
        }, {
            delay: waitTime + animationSpeed,
            opacity: 1,
            onComplete: function () {
                // enable interactivity
                animating = false;
            }
        });

    }, numEle * 150);

    // sets current screen number for use when transitioning content off the screen
    currentScreenNum = screenNum;

    // clear idle timer
    clearTimeout(idleTimer);

    // start idle timer
    idleTimer = setTimeout(displayScreenSaver, idleWaitTime * 1000);
}

// trigger for screen highlight overlay
function highlight(screenNum) {

    // check if hightlight is hidden or showing
    if (highlightToggle) {

        // output highlight number to browser console
        console.log("Highlight " + screenNum + " showing");

        // show hidden highlight elemnts
        $('#screen' + screenNum + ' .more-info').show();

        // HIGHLIGHT SCREEN TWEENS START //////////////////////////////////

        // must all be using fromTo's to make sure same tweens happens every time

        // animate on highlight/more info
        let highlightTweens = gsap.timeline();

        // fade in BG
        highlightTweens.fromTo('#screen' + screenNum + ' .highlight-bg', {
            duration: 1.5, opacity: 0
        }, {
            opacity: 1,


        });

        // fade in product
        highlightTweens.fromTo('#screen' + screenNum + ' .highlight-product', {
            duration: 1, opacity: 0
        }, {
            opacity: 1
        });

        // more tweens would go here
        // add in position changes and easing to create interest

        // HIGHLIGHT SCREEN TWEENS END //////////////////////////////////

        // disables access to picking up other items
        highlighting = true;

        // runs else next time
        highlightToggle = false;

    } else {

        // output highlight number to browser console
        console.log("Highlight " + screenNum + " hiding");

        // fade out highlight/more info
        $('#screen' + screenNum + ' .more-info').fadeOut();

        // enables access to picking up other items
        highlighting = false;

        // runs if next time
        highlightToggle = true;
    }

    // clear idle timer
    clearTimeout(idleTimer);

    // restart idle timer
    idleTimer = setTimeout(displayScreenSaver, idleWaitTime * 1000);
}

// listen for down keypress
document.onkeydown = function (e) {

    // grab the keystoke
    e = e || window.event;

    // sets activeKeys to true
    if (e.keyCode == keys[0]) { activeKeys[0] = true; }
    if (e.keyCode == keys[1]) { activeKeys[1] = true; }
    if (e.keyCode == keys[2]) { activeKeys[2] = true; }

    // F key - go fullscreen
    if (e.keyCode == 70) { $(document).fullScreen(true); }

    // ` key - connect/disconnect to sensor
    if (e.keyCode == 192) { connectArduino(); }
};

// listen for up keypress
document.onkeyup = function (e) {

    // grab the keystoke
    e = e || window.event;

    // only check keys when active true
    if (activeLift) {
        if (e.keyCode == keys[0] && currentScreenNum != 1 && !highlighting) { displayScreen(1); }
        if (e.keyCode == keys[1] && currentScreenNum != 2 && !highlighting) { displayScreen(2); }
        if (e.keyCode == keys[2] && currentScreenNum != 3 && !highlighting) { displayScreen(3); }
    }

    // screen highlight overlay
    if (e.keyCode == keys[3] && currentScreenNum == 1 && !animating) { highlight(1); }
    if (e.keyCode == keys[4] && currentScreenNum == 2 && !animating) { highlight(2); }
    if (e.keyCode == keys[5] && currentScreenNum == 3 && !animating) { highlight(3); }

    // sets activeKeys to false
    if (e.keyCode == keys[0]) { activeKeys[0] = false; }
    if (e.keyCode == keys[1]) { activeKeys[1] = false; }
    if (e.keyCode == keys[2]) { activeKeys[2] = false; }
};

// loop checks for all keys active
setInterval(function () {
    if (activeKeys[0] && activeKeys[1] && activeKeys[2]) {
        activeLift = true;
    } else {
        activeLift = false;
    }
}, 10);

// loop to check sensor/button data
function checkSensors() {

    // display screen 1
    if (!allData.sensor1 && (allData.sensor2 && allData.sensor3) && currentScreenNum != 1 && !highlighting) { displayScreen(1); }

    // display screen 2
    if (!allData.sensor2 && (allData.sensor1 && allData.sensor3) && currentScreenNum != 2 && !highlighting) { displayScreen(2); }

    // display screen 3
    if (!allData.sensor3 && (allData.sensor1 && allData.sensor1) && currentScreenNum != 3 && !highlighting) { displayScreen(3); }

    // display highlight screen 1
    if (allData.btn1 && currentScreenNum == 1 && !animating) { highlight(1); }

    // display highlight screen 2
    if (allData.btn2 && currentScreenNum == 2 && !animating) { highlight(2); }

    // display highlight screen 3
    if (allData.btn3 && currentScreenNum == 3 && !animating) { highlight(3); }
}

// loop just to check activeKeys in console or data from sensor if available
setInterval(function () {
    if (arduinoActive) {
        checkSensors();
    } else {
        console.log(activeKeys);
    }
}, 1000);

//bhdcdscs

gsap.to('#s21', {
    duration: 2,
    opacity: 1,
    onComplete: function () {

        // hide highlight screen elements
        $('.more-info').hide();

        // re-enable access to picking up  items
        highlighting = false;

        // reset highlighting toogle
        highlightToggle = true;

        // resst catalogue screen
        transitonScreenOff();

        // reset current screen number
        currentScreenNum = null;
    }
});