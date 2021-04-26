export default function getShareURL(platform, { text, title, url }) {
  platform = platform.toLowerCase();
  const textURI = encodeURIComponent(text);
  const titleURI = encodeURIComponent(title);
  const urlURI = encodeURIComponent(url);
  switch (platform) {
    case 'whatsapp':
      return `https://api.whatsapp.com/send?text=${textURI}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${textURI}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u${urlURI}`;
    case 'reddit':
      return `http://www.reddit.com/submit?url=${urlURI}&title=${titleURI}`;
    case 'telegram':
      return `https://telegram.me/share/url?url=${urlURI}&text=${titleURI}`;
    case 'email':
      return `mailto:?subject=${titleURI}&body=${textURI}`;
    default:
      return '';
  }
}
