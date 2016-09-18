import webdriver from 'selenium-webdriver';

export function getCupcake () {
    const streamScreenshot = 'http://static-cdn1.ustream.tv/i/channel/live/1_21314620,640x360,b:2016072813.jpg';
    return new Promise((resolve, reject) => resolve(streamScreenshot));
}

export function getEnhancedCupcake () {
    let driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();
    let window = driver.manage().window();
    window.setSize(600, 400);

    let streamUrl = 'http://www.ustream.tv/embed/21314620?html5ui&autoplay=true&volume=0&controls=false&showtitle=false';
    driver.get(streamUrl);
    return getEnhancedScreenshot(driver);
}

async function getEnhancedScreenshot(driver, duration) {
    let data = await driver.takeScreenshot();
    if (isStreamLoaded(data)) {
        let content = {
            content_type: 'image/png',
            file_name: 'enhanced.png',
            data
        };

        driver.quit();
        return content;
    }
    else {
        await driver.wait(() => false, 500, 'waiting for stream')
            .catch(() => {});
        return waitForStreamPlaying(driver);
    }
}

function isStreamLoaded (png) {
    return png.indexOf(new Array(2000).join('A')) === -1;
}
