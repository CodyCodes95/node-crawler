const fetch = require('node-fetch');
import * as cheerio from 'cheerio';
import * as urlParser from 'url';

const getUrl = (link: string) => {
    if (link.includes('http')) {
        return link
    } else if (link.startsWith('/')) {
        return `http://127.0.0.1:5500/${link}`
    } else {
        return `http://127.0.0.1:5500/${link}`
    }
}

const seenUrls = {} as any

const crawl = async (url: string) => {
    if (seenUrls[url]) return
    seenUrls[url] = true
    console.log(`Crawling ${url}`);
    const res = await fetch(url)
    const html = await res.text()
    const $ = cheerio.load(html)
    const links = $("a").map((i, link) => link.attribs.href).get()

    const { host } = urlParser.parse(url) as any

    links.filter(link => link.includes(host)).forEach(link => {
        console.log(link)
        crawl(getUrl(link))
    })
}

    
crawl("http://127.0.0.1:5500/html/index.html")