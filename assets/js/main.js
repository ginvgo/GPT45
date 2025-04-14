
document.addEventListener('DOMContentLoaded', function() {
    // 返回主页按钮
    const homeButton = document.getElementById('home-button');
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
});
// 弹窗控制
function togglePopup(popupId) {
  const popup = document.getElementById(popupId);
  popup.classList.toggle('active');
  document.body.style.overflow = popup.classList.contains('active') ? 'hidden' : '';
}

// 复制功能
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert(`已复制: ${text}`);
  }).catch(err => {
    console.error('复制失败:', err);
    // 兼容旧浏览器
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('已复制到剪贴板');
  });
}

// 点击外部关闭
document.querySelectorAll('.popup-overlay').forEach(popup => {
  popup.addEventListener('click', function(e) {
    if (e.target === this) togglePopup(this.id);
  });
});

 



// 搜索功能
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const heroSection = document.querySelector("main.container .hero");

  if (!searchInput || !heroSection || typeof htmlPages === "undefined") return;

  searchInput.addEventListener("keydown", async function (event) {
    const query = this.value.trim().toLowerCase();

    if (query === "") {
      removeSearchResults();
      return;
    }

    if (event.key === "Enter") {
      removeSearchResults();

      const resultsContainer = document.createElement("div");
      resultsContainer.id = "search-results";
      resultsContainer.className = "search-results-container";

      const results = [];

      for (const page of htmlPages) {
        try {
          const res = await fetch(page);
          const text = await res.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "text/html");
          const content = doc.body.textContent.toLowerCase();

          if (content.includes(query)) {
            const title = getFileTitle(page); // ← 使用文件名作为标题
            const description = doc.querySelector('meta[name="description"]')?.getAttribute("content") || "暂无描述信息。";
            const type = getPageType(page);
            results.push({ title, url: page, type, description });
          }
        } catch (e) {
          console.warn("读取页面失败：", page);
        }
      }

      if (results.length === 0) {
        resultsContainer.innerHTML = `<p class="no-results">未找到相关内容。</p>`;
      } else {
        const wrapper = document.createElement("div");
        wrapper.className = "results-cards";

        results.forEach(r => {
          const card = document.createElement("div");
          card.className = "result-card";

          card.innerHTML = `
            <div class="card-type">${r.type}</div>
            <a class="card-title" href="${r.url}" target="_blank">${r.title}</a>
            <div class="card-description">${r.description}</div>
          `;

          wrapper.appendChild(card);
        });

        resultsContainer.appendChild(wrapper);
      }

      heroSection.parentNode.insertBefore(resultsContainer, heroSection);
    }
  });

  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      removeSearchResults();
    }
  });

  function removeSearchResults() {
    const existing = document.getElementById("search-results");
    if (existing) existing.remove();
  }

  function getPageType(path) {
    if (path.includes("articles/")) return "文章";
    if (path.includes("tools/")) return "工具";
    if (path.includes("calculators/")) return "计算器";
    if (path.includes("resources/")) return "资源";
    return "页面";
  }

  function getFileTitle(path) {
    const filename = path.split("/").pop().replace(".html", "");
    return decodeURIComponent(filename);
  }
});
