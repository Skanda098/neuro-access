import React from 'react';
import './ReaderView.css';

export const ReaderView = ({ data }) => {
  if (!data) return null;

  return (
    <article className="reader-view">
      <h1 className="article-title">{data.title}</h1>
      <div className="article-body">
        {data.paragraphs.map((paragraph, index) => (
          <React.Fragment key={index}>
            <p className="adapted-paragraph">{paragraph}</p>
            {data.images[index] && (
              <figure className="adapted-image-container">
                <img src={data.images[index].src} alt={data.images[index].description} />
                <figcaption><strong>AI Image Description:</strong> {data.images[index].description}</figcaption>
              </figure>
            )}
          </React.Fragment>
        ))}
      </div>
    </article>
  );
};