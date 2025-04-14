
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

      const wrapper = document.createElement("div");
      wrapper.className = "results-cards";

      const results = [];

      for (const page of htmlPages) {
        const isHtml = page.endsWith(".html");
        const isExcel = page.endsWith(".xlsx");
        const fileName = decodeURIComponent(page.split("/").pop().toLowerCase());

        if (isExcel) {
          // 对于 .xlsx 文件，仅使用文件名匹配
          if (fileName.includes(query)) {
            results.push({
              title: getFileTitle(page),
              url: page,
              type: "资源",
            });
          }
          continue; // 跳过其他处理，继续下一个文件
        }

        if (isHtml) {
          // 对 HTML 文件进行内容匹配
          try {
            const res = await fetch(page);
            const text = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            const content = doc.body.textContent.toLowerCase();

            if (content.includes(query)) {
              results.push({
                title: getFileTitle(page),
                url: page,
                type: getPageType(page),
              });
            }
          } catch (e) {
            console.warn("无法读取页面：", page);
          }
        }
      }

      if (results.length === 0) {
        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
          <div class="card-type">没有找到匹配内容</div>
          <div class="card-title">请尝试使用其他关键词</div>
        `;
        wrapper.appendChild(card);
      } else {
        results.forEach(r => {
          const card = document.createElement("div");
          card.className = "result-card";
          card.innerHTML = `
            <div class="card-type">${r.type}</div>
            <a class="card-title" href="${r.url}" target="_blank">${r.title}</a>
          `;
          wrapper.appendChild(card);
        });
      }

      resultsContainer.appendChild(wrapper);
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
    const filename = path.split("/").pop().replace(/\.[^.]+$/, ""); // 去除扩展名
    return decodeURIComponent(filename);
  }
});
