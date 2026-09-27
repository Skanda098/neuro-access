import { scrapeWebPage } from '../services/puppeteerService.js';
import { simplifyTextContent, generateImageDescription } from '../services/geminiService.js';

export const adaptWebPage = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'A valid target URL is required.' });
    }

    // 1. Scrape raw page
    const scrapedData = await scrapeWebPage(url);

    // 2. Simplify text via Gemini
    const simplifiedParagraphs = await simplifyTextContent(scrapedData.paragraphs);

    // 3. Generate image descriptors
    const imageObjects = await Promise.all(
      scrapedData.images.map(async (src) => ({
        src,
        description: await generateImageDescription(src)
      }))
    );

    res.status(200).json({
      title: scrapedData.title,
      paragraphs: simplifiedParagraphs,
      images: imageObjects
    });
  } catch (error) {
    console.error('Adapter Error:', error);
    res.status(500).json({ error: error.message || 'Failed to process content.' });
  }
};