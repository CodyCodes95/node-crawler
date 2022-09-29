const fetch = require('node-fetch');
import * as cheerio from 'cheerio';
import * as urlParser from 'url';

const url = "https://www.qnmu.org.au/Web"

const newUrls = [
    "https://www.qnmu.org.au/Web",
    "https://www.qnmu.org.au/Shared_Content",
    "www.qnmu.org.au/cpd",
    "www.qnmu.org.au/CoronavirusInformation",
    "https://www.qnmu.org.au/Awards_event",
    "https://www.qnmu.org.au/DocumentsFolder",
    "http://www.qnmu.org.au/join"
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
    // console.log(`Crawling ${url}`)
    crawlCount ++
    const res = await fetch(url)
    const html = await res.text()
    const $ = cheerio.load(html)
    const links = $("a").map((i, link) => link.attribs.href).get()
    
    const { host } = urlParser.parse(url) as any
    
    for (let link of links.filter(link => link.includes(host))) {
        if (!newUrls.some((website: any) => link.toLowerCase().includes(website.toLowerCase()))) {
            if (link.toLowerCase() !== "https://www.qnmu.org.au/") {
                console.log(`Old Link: ${link} found on URL ${url}`);
                console.log(" ")
            foundOldLinks[url] = foundOldLinks[url] ? [...foundOldLinks[url], link] : [link]
        }
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

// Option to return all of a specific URL