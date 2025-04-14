document.addEventListener("DOMContentLoaded", function() {
  // 初始化所有功能
  initHomeButton();
  initPopupControl();
  initCopyToClipboard();
  initSearchFunctionality();
});

// 返回主页按钮功能
function initHomeButton() {
  const homeButton = document.getElementById('home-button');
  if (homeButton) {
    homeButton.addEventListener('click', function() {
      window.location.href = '../index.html';
    });
  }
}

// 弹窗控制功能
function togglePopup(popupId) {
  const popup = document.getElementById(popupId);
  popup.classList.toggle('active');
  document.body.style.overflow = popup.classList.contains('active') ? 'hidden' : '';
}

function initPopupControl() {
  document.querySelectorAll('.popup-overlay').forEach(popup => {
    popup.addEventListener('click', function(e) {
      if (e.target === this) togglePopup(this.id);
    });
  });
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

function initCopyToClipboard() {
  // 你可以为需要的元素绑定复制事件，如：
  // document.querySelector('#copy-button').addEventListener('click', () => copyToClipboard('some text'));
}

// 搜索功能
function initSearchFunctionality() {
  const searchInput = document.getElementById("search-input");
  const heroSection = document.querySelector("main.container .hero");

  if (!searchInput || !heroSection || typeof htmlPages === "undefined" || typeof resources === "undefined") return;

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

      const results = await getSearchResults(query);

      if (results.length === 0) {
        wrapper.innerHTML = `<div class="result-card"><div class="card-type">没有找到匹配内容</div><div class="card-title">请尝试使用其他关键词</div></div>`;
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
}

// 获取搜索结果
async function getSearchResults(query) {
  const results = [];

  // 处理 HTML 页面
  for (const page of htmlPages) {
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

  // 处理非 HTML 文件（例如 .xlsx, .pdf 等）
  resources.forEach(file => {
    const fileName = getFileTitle(file).toLowerCase();
    if (fileName.includes(query)) {
      results.push({
        title: getFileTitle(file),
        url: file,
        type: "资源",
      });
    }
  });

  return results;
}

// 获取文件类型（文章、工具、资源等）
function getPageType(path) {
  if (path.includes("articles/")) return "文章";
  if (path.includes("tools/")) return "工具";
  if (path.includes("calculators/")) return "计算器";
  if (path.includes("resources/")) return "资源";
  return "页面";
}

// 获取文件名（去除扩展名）
function getFileTitle(path) {
  const filename = path.split("/").pop().replace(/\.[^.]+$/, ""); // 去除扩展名
  return decodeURIComponent(filename);
}

// 移除搜索结果
function removeSearchResults() {
  const existing = document.getElementById("search-results");
  if (existing) existing.remove();
}
