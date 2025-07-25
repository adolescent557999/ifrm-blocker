// == lazy-load images ==
document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    observer.observe(img);
  });
});

// == clean "?m=1" from Blogger URLs ==
(function () {
  if (window.location.search.includes("m=1")) {
    const cleanURL = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, cleanURL);
  }
})();

(function () {
  const processPosts = (json) => {
    const currentPostUrl = window.location.href;
    const allPosts = json.feed.entry || [];

    const filtered = allPosts
      .filter(post => post.link.find(l => l.rel === 'alternate').href !== currentPostUrl)
      .sort(() => Math.random() - 0.5)
      .slice(0, 9);

    const grid = document.getElementById('relatedPostsGrid');
    if (!grid) return;

    grid.innerHTML = filtered.map(post => {
      const postUrl = post.link.find(l => l.rel === 'alternate').href;
      const title = post.title.$t;

      const content = post.content?.$t || '';
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const firstImage = tempDiv.querySelector('img');
      const imageUrl = firstImage?.src || 'https://dummyimage.com/600x400/000/fff&text=No+Image';

      return `
        <div class='col-md-4 mb-4'>
          <div class='card h-100'>
            <a class='text-decoration-none' href='${postUrl}'>
              <img alt='${title}' class='card-img-top' loading='lazy' src='${imageUrl}' style='height: 200px; object-fit: cover;'/>
              <div class='position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center playbtn'>
                <svg class='responsive-svg-icon' viewBox='0 0 64 64'>
                  <circle cx='32' cy='32' fill='#FF0000' r='32'/>
                  <path d='M44 32L26 42V22L44 32Z' fill='white'/>
                </svg>
              </div>
              <div class='bg-dark'>
                <h4 class='text-white ps-1 m-0 p-2 card-title'>
                  <span class='text-truncate d-block'>${title}</span>
                </h4>
              </div>
            </a>
          </div>
        </div>
      `;
    }).join('');
  };

  // Load Blogger feed JSONP
  const script = document.createElement('script');
  script.src = '/feeds/posts/default?alt=json-in-script&callback=processPosts&max-results=50&fields=entry(title,link,content)';
  document.body.appendChild(script);
})();

(function () {
  if (window.top !== window.self) {
    try {
      // Try to break out of iframe
      window.top.location.href = window.self.location.href;
    } catch (e) {
      // Wait for DOM before writing fallback
      window.addEventListener("DOMContentLoaded", function () {
        document.documentElement.innerHTML = "";
        document.write(`
          <div class="container-fluid vh-100 d-flex align-items-center justify-content-center bg-danger" style="background:#dc3545;display:flex;align-items:center;justify-content:center;">
            <div class="text-center text-white">
              <h2 style="margin-bottom:1rem;">🚫 Security Block</h2>
              <p class="lead">This content cannot be viewed in a frame.</p>
              <a href="${window.location.href}" style="color:#fff;text-decoration:underline;font-weight:bold;" target="_top">
                Click to open directly
              </a>
            </div>
          </div>
        `);
        document.close();
        window.stop();
      });
    }
  }
})();
