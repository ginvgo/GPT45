
    
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

 



// 搜索数据
document.getElementById("search-input").addEventListener("input", async function () {
  const query = this.value.trim().toLowerCase();
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = "";

  if (query === "") return;

  const htmlPages = [
    "index.html",
    "articles/亚马逊佣金分类目录.html",
    "calculators/亚马逊促销优惠券费用测算器.html",
    "calculators/bmi.html"
    // 后期新增的页面可手动或用工具自动加入列表
  ];

  const results = [];

  for (const page of htmlPages) {
    try {
      const res = await fetch(page);
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const content = doc.body.textContent.toLowerCase();

      if (content.includes(query)) {
        const titleTag = doc.querySelector("title");
        results.push({
          title: titleTag ? titleTag.innerText : page,
          url: page
        });
      }
    } catch (err) {
      console.error("读取失败: " + page);
    }
  }

  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>未找到相关结果。</p>";
    return;
  }

  const ul = document.createElement("ul");
  results.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${p.url}">${p.title}</a>`;
    ul.appendChild(li);
  });
  resultsContainer.appendChild(ul);
});
