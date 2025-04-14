document.addEventListener('DOMContentLoaded', function() {
    // 夜间模式切换
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️ ' : '🌙 ';
        });
        
        // 初始化主题
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '☀️ ' : '🌙 ';
    }
    
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

 



// 搜索数据：页面标题 + 链接
const pages = [
  { title: "首页", url: "index.html" },
  { title: "亚马逊佣金分类目录", url: "articles/亚马逊佣金分类目录.html" },
  { title: "亚马逊促销优惠券费用测算器", url: "calculators/亚马逊促销优惠券费用测算器.html" },
  { title: "BMI计算器", url: "calculators/bmi.html" },
];

// 搜索功能实现
document.getElementById("search-input").addEventListener("input", function () {
  const query = this.value.trim().toLowerCase();
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = "";

  if (query === "") return;

  const results = pages.filter(p => p.title.toLowerCase().includes(query));
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
