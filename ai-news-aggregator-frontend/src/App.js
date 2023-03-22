import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [news, setNews] = useState([]);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [groupedNews, setGroupedNews] = useState({});

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/news');
        setNews(response.data);
  
        const fetchedGroupedNews = response.data.reduce((acc, article) => {
          const source = article.source.match(/(openai|aws|google)/)[0];
          if (!acc[source]) {
            acc[source] = { open: false, articles: [] };
          }
          acc[source].articles.push(article);
          return acc;
        }, {});
  
        setGroupedNews(fetchedGroupedNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
  
    fetchNews();
  }, []);
  

  const handleHeaderClick = (column) => {
    if (sortedColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedColumn(column);
      setSortOrder('asc');
    }

    const sortedNews = [...news].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setNews(sortedNews);
  };

const toggleGroup = (source) => {
  const newGroupedNews = { ...groupedNews };
  newGroupedNews[source].open = !newGroupedNews[source].open;
  setGroupedNews(newGroupedNews);
};

return (
  <div className="App">
    <h1>AI News Aggregator</h1>
    <table>
      <thead>
        <tr>
          <th style={{ width: '50px' }}>Index</th>
          <th onClick={() => handleHeaderClick('title')}>Title</th>
          <th onClick={() => handleHeaderClick('source')}>Source</th>
          <th onClick={() => handleHeaderClick('date')}>Date</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(groupedNews).map((source, sourceIndex) => (
          <React.Fragment key={source}>
            <tr className="group-header" onClick={() => toggleGroup(source)}>
              <td colSpan="5">
                {source.toUpperCase()} ({groupedNews[source].articles.length} articles)
              </td>
            </tr>
            {groupedNews[source].open &&
              groupedNews[source].articles.map((article, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td>{index + 1}</td>
                  <td>
                    <a href={article.source} target="_blank" rel="noreferrer">
                      {article.title}
                    </a>
                  </td>
                  <td>{article.source}</td>
                  <td>{new Date(article.date).toLocaleDateString()}</td>
                  <td>
                    {article.image && (
                      <img src={article.image} alt={article.title} width="100" />
                    )}
                  </td>
                </tr>
              ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
);


  return (
    <div className="App">
      <h1>AI News Aggregator</h1>
      <table>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>Index</th>
            <th onClick={() => handleHeaderClick('title')}>Title</th>
            <th onClick={() => handleHeaderClick('source')}>Source</th>
            <th onClick={() => handleHeaderClick('date')}>Date</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedNews).map((source, sourceIndex) => (
            <React.Fragment key={source}>
              <tr className="group-header" onClick={() => toggleGroup(source)}>
                <td colSpan="5">
                  {source.toUpperCase()} ({groupedNews[source].articles.length} articles)
                </td>
              </tr>
              {groupedNews[source].open &&
                groupedNews[source].articles.map((article, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td>{index + 1}</td>
                    <td>
                      <a href={article.source} target="_blank" rel="noreferrer">
                        {article.title}
                      </a>
                    </td>
                    <td>{article.source}</td>
                    <td>{new Date(article.date).toLocaleDateString()}</td>
                    <td>
                      {article.image && (
                        <img src={article.image} alt={article.title} width="100" />
                      )}
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
