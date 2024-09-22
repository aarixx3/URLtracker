chrome.alarms.create('checkPrice', { periodInMinutes: 60 }); // Checks every hour

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkPrice') {
    chrome.storage.sync.get('url', async ({ url }) => {
      if (url) {
        const response = await fetch(url);
        const text = await response.text();
        const price = extractPrice(text); // Implement price extraction
        chrome.storage.sync.get('price', ({ price: oldPrice }) => {
          if (oldPrice && price < oldPrice) {
            chrome.notifications.create({
              title: 'Price Drop Alert!',
              message: `The price has dropped from $${oldPrice} to $${price}!`,
              iconUrl: 'icon128.png',
              type: 'basic'
            });
          }
          chrome.storage.sync.set({ price });
        });
      }
    });
  }
});

function extractPrice(html) {
  // Custom logic to extract price from the page HTML
  const regex = /\$\d+(\.\d{2})?/;
  const match = html.match(regex);
  return match ? parseFloat(match[0].replace('$', '')) : null;
}