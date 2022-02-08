const puppeteer = require('puppeteer');

const classname = ['dl-search-result-name',
'js-search-result-path'];

var selector = ['img[itemprop="image"]', 'span[itemprop="name"]',
'div[class="dl-profile-skill-chip"]', 'span[class="dl-text dl-text-red"]', 
'div[class="dl-profile-card-content dl-profile-card-content-column"] ' 
+ 'div[class="dl-profile-text"] div', 'div[class="dl-profile-card-content"] ' 
+ 'div[class="dl-profile-text"] div', 'div[class="dl-profile-text js-bio ' 
+ 'dl-profile-bio"]', 'div[class="dl-profile-box"] div[class="dl-display-flex"]',
'time[itemprop="openingHours"][class="dl-openings-day"]' + 
'div[class="dl-openings-day-slots"]'];

var linkList = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const scrapInfo = async (pageDefault, selector, index) =>
    await pageDefault.evaluate((selector, url) => {
                    
        let tmp = {};
        
        tmp['url'] = url;
        tmp['imgUrl'] = document.querySelector(selector[0]).src;
        tmp['name'] = document.querySelector(selector[1]).innerText;
        tmp['keyword'] = [...document.querySelectorAll(selector[2])]
                        .map((e) => e.innerText);
        
        try { tmp['creditCard'] = document.querySelector(selector[3]).innerText;
        } catch { tmp['creditCard'] = undefined };
        try { tmp['socialSecurityCard'] = 
            document.querySelectorAll(selector[4])[1].innerText }
        catch { tmp['socialSecurityCard'] = undefined };
        tmp['address'] = document.querySelector(selector[5]).innerText;
        tmp['presText'] = document.querySelector(selector[6]).innerText;
        try {
            tmp['number'] = document.querySelector(selector[7]).innerText;
            tmp['callHours'] = document.querySelector(selector[8]).innerText;
        } catch { tmp['number'] = undefined;
            tmp['callHours'] = undefined;
        }
        return tmp;
    }, selector, linkList[index]);


const fetchData = async (pageDefault, selector, index) => {
    await pageDefault.goto(linkList[index],
        { waitUntil: 'domcontentloaded' });

    return new Promise(async (resolve, reject) => {
        const ret = scrapInfo(pageDefault, selector, index);
        
        if (ret) {
            resolve(ret);
        } else {
            reject('Failed to scrap profile.');
        }
    });
}

const fetchLinks = async (pageDefault, classname) => {
    linkList = await pageDefault.evaluate((classname, linkList) => {
        let elements = document.getElementsByClassName(classname.join(' '));        
        for (item of elements) {
            linkList.push(item.href);
            console.log("item href = ", item.href);
        } return linkList;
    }, classname, linkList);
};

const profileFinder = async (queryResearch, queryNumber) => {
    const browser = await puppeteer.launch(
        { args: ['--disable-site-isolation-trials',
        '--disable-web-security', '--disable-features=IsolateOrigins'], }
    );
    const defaultContext = await browser.defaultBrowserContext();
    const [pageDefault] = await defaultContext.pages();
    await pageDefault.setRequestInterception(true)
    pageDefault.on('request', (request) => {
        if (request.resourceType() === 'image') request.abort()
        else request.continue()
    })
    await pageDefault.goto('https://www.doctolib.fr/' +
        `${queryResearch[0]}/${queryResearch[1]}`,
        { waitUntil: 'domcontentloaded' });

    await fetchLinks(pageDefault, classname);
    return fetchData(pageDefault, selector, queryNumber);
}

module.exports = {
    profileFinder,
};
