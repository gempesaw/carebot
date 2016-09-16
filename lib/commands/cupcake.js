import path from 'chromedriver';
import webdriver from 'selenium-webdriver';
import * as fs from 'fs';

export function getCupcake () {
    const streamScreenshot = 'http://static-cdn1.ustream.tv/i/channel/live/1_21314620,640x360,b:2016072813.jpg';
    return new Promise((resolve, reject) => resolve(streamScreenshot));
}

let streamUrl = 'http://www.ustream.tv/embed/21314620?html5ui&autoplay=false&volume=0&controls=false&showtitle=false';
export function getEnhancedCupcake () {
    let driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();

    driver.get(streamUrl);

    return driver.findElement({ id: 'thumbnail' })
        .then( getThumbnailUrl )
        .then( url => {
            driver.quit();
            return url;
        })
        .catch(err => 'uhh, something went wrong: ' + err);
}

function getThumbnailUrl(elem)  {
    return elem.getAttribute('style')
        .then( attr => {
            if (attr === '') {
                throw 'empty attr';
            }
            else {
                return attr;
            }
        })
        .then(extractThumbnailUrl)
        .catch(err => getThumbnailUrl(elem));
}

function extractThumbnailUrl(style) {
    return style.match(/"(.*)"/)[1];
}
