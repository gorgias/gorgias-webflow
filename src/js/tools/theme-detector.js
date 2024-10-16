document.getElementById('get-theme-btn').addEventListener('click', async function (e) {
  e.preventDefault();  // Prevent default form submission

  const shopUrl = document.getElementById('shop-url').value;
  const resultElement = document.getElementById('theme-result');

  if (!shopUrl) {
    resultElement.innerText = 'Please enter a valid Shopify store URL.';
    return;
  }

  try {
    // Send the Shopify store URL to the Cloudflare Worker backend
    const response = await fetch('https://shopify-theme-detector.gorgias.workers.dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopUrl: shopUrl })
    });

    const data = await response.json();

    if (data.error) {
      resultElement.innerText = `Error: ${data.error}`;
    } else if (data.theme) {
      resultElement.innerText = `Theme: ${data.theme.name}`;
    } else {
      resultElement.innerText = 'Could not detect theme.';
    }
  } catch (error) {
    resultElement.innerText = `Error: ${error.message}`;
  }
});