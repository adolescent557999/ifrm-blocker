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
  if (window.top !== window.self) {
    try {
      // Try to break out of iframe
      window.top.location.href = window.self.location.href;
    } catch (e) {
      // Wait for DOM to be ready
      window.addEventListener("DOMContentLoaded", function () {
        // Basic CSS and HTML styles
        document.head.innerHTML = `
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: Arial, sans-serif;
            }
            body, html {
              height: 100%;
              background: #1a1a1a;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              animation: fadeIn 1s ease-in;
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .block-container {
              text-align: center;
              padding: 2rem;
            }
            .block-title {
              font-size: 2rem;
              margin-bottom: 1rem;
              color: #ff4d4f;
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            .block-message {
              font-size: 1.2rem;
              margin-bottom: 1.5rem;
            }
            .redirect-timer {
              font-size: 1.1rem;
              margin-bottom: 1rem;
              color: #ccc;
            }
            .redirect-btn {
              padding: 0.75rem 1.5rem;
              background-color: #ff4d4f;
              border: none;
              color: white;
              font-size: 1rem;
              border-radius: 5px;
              cursor: pointer;
              transition: background 0.3s ease;
            }
            .redirect-btn:hover {
              background-color: #ff1a1a;
            }
          </style>
        `;

        // Main HTML content
        document.body.innerHTML = `
          <div class="block-container">
            <h1 class="block-title">🚫 Security Block</h1>
            <p class="block-message">This page cannot be viewed in a frame for security reasons.</p>
            <p class="redirect-timer">Redirecting in <span id="countdown">5</span> seconds...</p>
            <button class="redirect-btn" onclick="window.top.location.href = window.location.href">Open Now</button>
          </div>
        `;

        // Countdown logic
        let counter = 5;
        const countdownEl = document.getElementById("countdown");
        const interval = setInterval(() => {
          counter--;
          countdownEl.textContent = counter;
          if (counter === 0) {
            clearInterval(interval);
            window.top.location.href = window.location.href;
          }
        }, 1000);

        document.close();
        window.stop();
      });
    }
  }
})();

