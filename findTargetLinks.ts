const fetch = require('node-fetch');
import * as cheerio from 'cheerio';
import * as urlParser from 'url';

const url = "https://www.qnmu.org.au/Web"

const targetUrls = [
    "https://www.qnmu.org.au/CPd",
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
const foundTargetLinks = {} as any
let crawlCount = 0
// let pageFinished:any
const crawl = async (url: string) => {
    // pageFinished = false
    console.log(`Crawling ${url}`)
    seenUrls[url] = true
    crawlCount ++
    const res = await fetch(url)
    const html = await res.text()
    const $ = cheerio.load(html)
    const links = $("a").map((i, link) => link.attribs.href).get()
    const { host } = urlParser.parse(url) as any
    
    for (let link of links.filter(link => link.includes(host))) {
        if (targetUrls.some((website: any) => link.toLowerCase().includes(website.toLowerCase()))) {
            console.log(`Found Link: ${link} found on URL ${url}`);
            foundTargetLinks[url] = foundTargetLinks[url] ? [...foundTargetLinks[url], link] : [link]
        }
        if (link.includes(url) && !seenUrls[getUrl(link)]) {
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