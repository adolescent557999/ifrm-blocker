(function () {
    if (window.top !== window.self) {
      try {
        window.top.location.href = window.self.location.href;
      } catch (e) {
        document.documentElement.innerHTML = "";
  
        const CONFIG = {
          logo: "https://yourdomain.com/logo.png",
          brandName: "YourSiteName",
          countdown: 10,
          webhook: "https://yourdomain.com/log.php"
        };
  
        const LANG = navigator.language.slice(0, 2).toLowerCase();
        const messages = {
          en: {
            title: "🚫 Access Blocked",
            msg: "This page can't be viewed inside another site (iframe).",
            redirect: "Redirecting in",
            button: "Open Page Now"
          },
          es: {
            title: "🚫 Acceso bloqueado",
            msg: "Esta página no se puede ver dentro de otro sitio (iframe).",
            redirect: "Redireccionando en",
            button: "Abrir página ahora"
          },
          fr: {
            title: "🚫 Accès bloqué",
            msg: "Cette page ne peut pas être affichée dans un autre site (iframe).",
            redirect: "Redirection dans",
            button: "Ouvrir la page maintenant"
          },
          hi: {
            title: "🚫 पहुंच अवरुद्ध",
            msg: "यह पृष्ठ किसी अन्य साइट के अंदर नहीं देखा जा सकता (iframe)।",
            redirect: "पुनः निर्देशित किया जा रहा है",
            button: "पृष्ठ अभी खोलें"
          }
        };
  
        const t = messages[LANG] || messages["en"];
        const pageUrl = window.location.href;
  
        const style = document.createElement("style");
        style.textContent = `
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #d32f2f, #b71c1c);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }
          .warning-box {
            text-align: center;
            max-width: 90%;
            padding: 2rem;
            background: rgba(0,0,0,0.3);
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
            animation: fadeIn 0.5s ease-out;
          }
          .warning-box img {
            width: 64px;
            height: 64px;
            margin-bottom: 1rem;
          }
          .warning-box h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
          }
          .warning-box p {
            font-size: 1.1rem;
            margin-bottom: 1.2rem;
          }
          .warning-box a {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: #ffffff;
            color: #b71c1c;
            font-weight: bold;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 1rem;
            transition: background 0.3s ease;
          }
          .warning-box a:hover {
            background: #ffebee;
          }
          .countdown {
            font-size: 1.2rem;
            margin-top: 1rem;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `;
        document.head.appendChild(style);
  
        const box = document.createElement("div");
        box.className = "warning-box";
        box.innerHTML = `
          <img src="${CONFIG.logo}" alt="${CONFIG.brandName} Logo" />
          <h1>${t.title}</h1>
          <p>${t.msg}</p>
          <div class="countdown">${t.redirect} <span id="count">${CONFIG.countdown}</span>s...</div>
          <a href="${pageUrl}" target="_top">${t.button}</a>
        `;
        document.body.appendChild(box);
  
        let count = CONFIG.countdown;
        const interval = setInterval(() => {
          count--;
          document.getElementById("count").textContent = count;
          if (count <= 0) {
            clearInterval(interval);
            window.top.location.href = pageUrl;
          }
        }, 1000);
  
        if (CONFIG.webhook) {
          fetch(CONFIG.webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "iframe-blocked",
              url: pageUrl,
              userAgent: navigator.userAgent,
              time: new Date().toISOString()
            })
          }).catch(() => {});
        }
  
        window.stop();
      }
    }
  })();
  