import { extract as extractFeed } from '@extractus/feed-extractor'
import { extract as extractArticle } from '@extractus/article-extractor'
import { userAgent } from '../src/lib/server/fetch.js'
import db from '../src/lib/server/database.js'

//const headers = new Headers()
//headers.set('user-agent', userAgent)
//headers.set('origin', 'https://www.nasdaq.com')

const headers = {
  'user-agent': userAgent,
  'origin': 'https://www.nasdaq.com',
  'accept': 'text/html, application/json, */*',
  'accept-language': 'en-US,en;q=0.9',
  'sec-fetch-site': 'same-site',
  'sec-fetch-mode': 'cors',
  'sec-fetch-dest': 'empty'
}

const feeds = [
  //'https://feeds.content.dowjones.io/public/rss/mw_topstories',
  //'https://www.nasdaq.com/feed/rssoutbound?category=Stocks',
  'https://www.investing.com/rss/news.rss',
  //'https://www.cnbc.com/id/15839069/device/rss/rss.html',
  //'https://www.cnbc.com/id/100003114/device/rss/rss.html',
  'https://www.cnbc.com/id/20409666/device/rss/rss.html',
  'https://www.fool.ca/feed/'
]

for (const feed of feeds) {
  const feedData = await extractFeed(feed)
  if (feedData && feedData.entries.length) {
    for (const entry of feedData.entries) {
      const article = await extractArticle(entry.link, undefined, {headers})
      if (article) {
        let {url,author,source,published,title,description,image} = article
        published = published ? new Date(published).toISOString() : new Date()
        const data = {author,source,published,title,description,image}
        const result = await db.article.upsert({where:{url}, create:{url,...data}, update:data})
        if (result.createdAt.toISOString().slice(0,10) === new Date().toISOString().slice(0,10)) {
          console.log(result.title)
        }
      }
    }
  }
}
process.exit(0)