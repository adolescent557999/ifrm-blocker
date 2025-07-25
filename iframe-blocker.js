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

// == iframe protection ==
(function () {
  if (window.top !== window.self) {
    try {
      // Try to break out of iframe
      window.top.location.href = window.self.location.href;
    } catch (e) {
      // If same-origin policy blocks redirect, replace DOM with a warning
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
    }
  }
})();
