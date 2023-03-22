from flask import Flask, jsonify
from flask_cors import CORS
import feedparser

app = Flask(__name__)
CORS(app)

RSS_FEEDS = {
    'openai': 'https://openai.com/feed/',
    'aws': 'https://aws.amazon.com/blogs/ai/feed/',
    'google': 'https://ai.googleblog.com/feeds/posts/default?alt=rss',
}

def get_articles_from_feed(feed_url):
    feed = feedparser.parse(feed_url)
    articles = []

    for entry in feed.entries:
        image_url = None
        if 'media_thumbnail' in entry:
            image_url = entry.media_thumbnail[0]['url']
        elif 'media_content' in entry:
            image_url = entry.media_content[0]['url']

        articles.append({
            'title': entry.title,
            'source': entry.link,
            'date': entry.published,
            'image': image_url,
        })

    return articles


@app.route('/api/news', methods=['GET'])
def get_news():
    aggregated_news = []

    for source, feed_url in RSS_FEEDS.items():
        articles = get_articles_from_feed(feed_url)
        aggregated_news.extend(articles)

    return jsonify(aggregated_news)

if __name__ == '__main__':
    app.run(debug=True)
