function createBookmarkElement(bookmark, currentUrl) {
  const li = document.createElement('li');
  li.textContent = bookmark.title;
  li.addEventListener('click', () => {
    chrome.bookmarks.update(bookmark.id, { url: currentUrl }, () => {
      window.close();
    });
  });
  return li;
}

async function findMatchingBookmarks(currentOrigin) {
  return new Promise((resolve) => {
    chrome.bookmarks.search({}, (bookmarks) => {
      const matchingBookmarks = bookmarks.filter((bookmark) => {
        if (!bookmark.url) return false;
        const bookmarkOrigin = new URL(bookmark.url).origin;
        return currentOrigin === bookmarkOrigin;
      });
      resolve(matchingBookmarks);
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const matchingBookmarksList = document.getElementById('matchingBookmarksList');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentUrl = tab.url;
  const currentOrigin = new URL(currentUrl).origin;

  const matchingBookmarks = await findMatchingBookmarks(currentOrigin);
  matchingBookmarks.forEach((bookmark) => {
    const bookmarkElement = createBookmarkElement(bookmark, currentUrl);
    matchingBookmarksList.appendChild(bookmarkElement);
  });
});
