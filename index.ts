const fetch = require('node-fetch');
import * as cheerio from 'cheerio';
import * as urlParser from 'url';

const url = "https://www.qnmu.org.au/Web"

const newUrls = [
    "https://www.qnmu.org.au/Web",
    "https://www.qnmu.org.au/Shared_Content",
    "www.qnmu.org.au/cpd",
    "www.qnmu.org.au/CoronavirusInformation"
]


const getUrl = (link: string) => {
    if (link.includes('http')) {
        return link
    } else if (link.startsWith('/')) {
        // console.log(`SHOURTCUT ${link}` )
        return `${url}/${link}`
    } else {
        return `${url}/${link}`
    }
}

const seenUrls = {} as any
const foundOldLinks = {} as any
let crawlCount = 0
let pageFinished:any
const crawl = async (url: string) => {
    pageFinished = false
    seenUrls[url] = true
    crawlCount ++
    const res = await fetch(url)
    const html = await res.text()
    const $ = cheerio.load(html)
    const links = $("a").map((i, link) => link.attribs.href).get()
    
    const { host } = urlParser.parse(url) as any
    
    const hostLinks = links.filter((link, i) => {
        return link.includes(host)
    })
    
    for (let link of hostLinks) {
        if (!newUrls.some((website: any) => link.toLowerCase().includes(website.toLowerCase()))) {
            console.log(`Old Link: ${link} found on URL ${url}`);
            foundOldLinks[url] = foundOldLinks[url] ? [...foundOldLinks[url], link] : [link]
        }
        if (link.includes(newUrls[0]) && !seenUrls[getUrl(link)]) {
            await crawl(getUrl(link))
        }
    }
}

const crawlAll = async () => {
    const results = await crawl(url)
    
}

crawlAll()
// crawl(url)

// Log the results when all pages have finished being crawled

// if same old link found on multiple pages, flag that.