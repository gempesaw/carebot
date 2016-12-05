import webdriver from 'selenium-webdriver';
import memoize from 'memoizee';

export function getCupcake () {
    const streamScreenshot = 'http://static-cdn1.ustream.tv/i/channel/live/1_21314620,640x360,b:2016072813.jpg';
    return Promise.resolve(streamScreenshot);
}

export const getEnhancedCupcake = memoize(getCupcakeScreenshot, { promise: true });
export const clearCupcakeCache = () => getEnhancedCupcake.clear();

function getCupcakeScreenshot (dayNumber) {
    let driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
    let window = driver.manage().window();
    window.setSize(1024, 683);

    let streamUrl = 'http://www.ustream.tv/embed/21314620?html5ui&autoplay=true&volume=0&controls=false&showtitle=false';
    driver.get(streamUrl);
    return getEnhancedScreenshot(driver);
}

async function getEnhancedScreenshot(driver, duration = 0) {
    let data = await driver.takeScreenshot();
    if (isStreamLoaded(data)) {
        driver.quit();
        return getCupcakeResponse(data);
    }
    else {
        return retryEnhancedScreenshot(driver, duration);
    }
}

function getCupcakeResponse(data) {
    let content = {
        content_type: 'image/png',
        file_name: 'enhanced.png',
        data
    };
    return content;
}

function retryEnhancedScreenshot(driver, duration = 0) {
    const maxDuration = 3500;

    if (duration > maxDuration) {
        return driver.quit().then(() => {
            throw `Hmm, the cupcake stream took more than \`${maxDuration}ms\` to load...`;
        });
    }
    else {
        driver.wait(() => false, 500, 'waiting for stream')
            .catch(() => {});
        return getEnhancedScreenshot(driver, duration + 500);
    }
}

function isStreamLoaded (png) {
    return png.indexOf(new Array(600).join('A')) === -1;
}
