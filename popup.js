document.getElementById('trackBtn').addEventListener('click', () => {
  const url = document.getElementById('url').value;
  chrome.storage.sync.set({ url }, () => {
    alert('Price tracking started for ' + url);
  });
});