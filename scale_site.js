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

// scale for editing on smaller screens
function updateScale() {
    // set base size of app
    const baseSizeW = 1920;
    const baseSizeH = 1080;
    // determine size of window
    let wW = $(window).width();
    let wH = $(window).height();
    // set base scale %
    let newScale = 100;
    // compare ratios
    if(wW/wH < baseSizeW/baseSizeH) { 
        // tall ratio
        newScale = wW / baseSizeW * 100;
    } else { 
        // wide ratio
        newScale = wH / baseSizeH * 100;
    }
    // set zoom on body based on newScale
    $("body").css('zoom', newScale + '%');
    // for FireFox
    $("body").css('-moz-transform', 'scale(' + (newScale/100) + ')');
    $("main").css('-moz-transform', 'translate(-50%, 0)');
}
// update on load
updateScale();
// update on resize
$(window).resize(updateScale);
