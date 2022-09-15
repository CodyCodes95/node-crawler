const fetch = require('node-fetch');
import * as cheerio from 'cheerio';
import * as urlParser from 'url';

const url = "https://www.qnmu.org.au/Web"
const newUrls = [
    "qnmu.org.au/Web",
  "qnmu.org.au/Shared_Content"
]


const getUrl = (link: string) => {
    if (link.includes('http')) {
        return link
    } else if (link.startsWith('/')) {
        return `${url}/${link}`
    } else {
        return `${url}/${link}`
    }
}

const seenUrls = {} as any
const foundOldLinks = {} as any

let i = 0

const crawl = async (url: string) => {
    if (seenUrls[url]) return
    i++
    seenUrls[url] = true
    // console.log(`Crawling ${i} ${url}`);
    const res = await fetch(url)
    const html = await res.text()
    const $ = cheerio.load(html)
    const links = $("a").map((i, link) => link.attribs.href).get()

    const { host } = urlParser.parse(url) as any

    links.filter(link => link.includes(host)).forEach(link => {
        // oldLinkFinder(link, oldUrl, newUrls)
        if (!foundOldLinks[link] && !newUrls.some((website) => link.toLowerCase().includes(website.toLowerCase()))) {
            foundOldLinks[link] = true
            console.log(`Old Link: ${link} found on URL ${url}`);
        }
        crawl(getUrl(link))
    })
}

    
crawl(url)