
    
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
  const resultsContainer = document.getElementById("search-results");

  if (!searchInput) return;

  searchInput.addEventListener("input", async function () {
    const query = this.value.trim().toLowerCase();
    resultsContainer.innerHTML = "";

    if (query === "") return;

    const results = [];

    for (const page of htmlPages) {
      try {
        const res = await fetch(page);
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const content = doc.body.textContent.toLowerCase();

        if (content.includes(query)) {
          const title = doc.querySelector("title")?.innerText || page;
          results.push({ title, url: page });
        }
      } catch (e) {
        console.error("搜索读取失败", page);
      }
    }

    if (results.length === 0) {
      resultsContainer.innerHTML = "<p>未找到相关内容。</p>";
    } else {
      const ul = document.createElement("ul");
      results.forEach(r => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${r.url}">${r.title}</a>`;
        ul.appendChild(li);
      });
      resultsContainer.appendChild(ul);
    }
  });
});
