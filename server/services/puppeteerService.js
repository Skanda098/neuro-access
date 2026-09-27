import puppeteer from 'puppeteer';

export const scrapeWebPage = async (targetUrl) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const extractedData = await page.evaluate(() => {
      // Remove noisy elements
      const selectorsToRemove = [
        'header', 'footer', 'nav', 'aside', 'script', 'style', 'iframe',
        '.ad', '.ads', '.advertisement', '.social-share', '#comments'
      ];
      selectorsToRemove.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => el.remove());
      });

      // Extract main heading
      const title = document.querySelector('h1')?.innerText?.trim() || document.title || 'Extracted Article';

      // Extract paragraphs
      const paragraphs = Array.from(document.querySelectorAll('p'))
        .map((p) => p.innerText.trim())
        .filter((text) => text.length > 25);

      // Extract primary images
      const images = Array.from(document.querySelectorAll('img'))
        .map((img) => img.src)
        .filter((src) => src && src.startsWith('http') && !src.includes('svg') && !src.includes('logo'))
        .slice(0, 3);

      return { title, paragraphs, images };
    });

    return extractedData;
  } catch (error) {
    throw new Error(`Puppeteer Scraping Failed: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
};