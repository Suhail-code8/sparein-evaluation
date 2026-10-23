// recent news component
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

export default function RecentNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch latest news
  useEffect(() => {
    fetch('/api/news?limit=4')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setNews(data.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching news:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || news.length === 0) {
    return null;
  }

  const featured = news[0];
  const listItems = news.slice(1, 4);

  const formatDate = (isoString) => {
    if (!isoString) return 'Recent Update';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section className="editorial-journal-section" id="news">
      <div className="container">
        <div className="editorial-section-header">
          <div>
            <span className="editorial-kicker">[ FIELD DISPATCHES &amp; EXPOS ]</span>
            <h2 className="editorial-title">Factory News &amp; Exhibitions</h2>
            <p className="editorial-subtitle">
              Trade fairs, technical symposiums, and manufacturing updates from Taian Common Diesel.
            </p>
          </div>
        </div>

        <div className="journal-layout-grid">
          {/* featured article */}
          {featured && (
            <article className="journal-featured-card">
              {featured.imageUrl && (
                <div className="journal-featured-image-stage">
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="journal-featured-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="journal-featured-body">
                <div className="journal-date-tag">
                  <Calendar size={13} />
                  <span>{formatDate(featured.publishedDate)}</span>
                </div>
                <h3 className="journal-featured-title">{featured.title}</h3>
                <p className="journal-featured-excerpt">{featured.excerpt}</p>
                {featured.sourceUrl && (
                  <a
                    href={featured.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="journal-read-link"
                  >
                    <span>Read Original Dispatch</span>
                    <ArrowRight size={14} />
                  </a>
                )}
              </div>
            </article>
          )}

          {/* secondary news list */}
          <div className="journal-list-column">
            {listItems.map((item) => (
              <article key={item._id || item.sourceUrl} className="journal-list-item">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="journal-item-thumb"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="journal-item-content">
                  <div className="journal-date-tag" style={{ marginBottom: 4 }}>
                    <Calendar size={12} />
                    <span>{formatDate(item.publishedDate)}</span>
                  </div>
                  <h4 className="journal-item-title">{item.title}</h4>
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="journal-read-link"
                      style={{ fontSize: '0.72rem', marginTop: 4 }}
                    >
                      <span>Dispatch Details</span>
                      <ArrowRight size={12} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
