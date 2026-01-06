export const loadCss = (url, id) => {
  // 先移除同名的link标签，避免重复加载
  removeCss(id);

  // 创建link标签
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = url;
  link.type = 'text/css';

  // 插入到head标签中
  document.head.appendChild(link);
};

export const removeCss = (id) => {
  const existingLink = document.getElementById(id);
  if (existingLink) {
    document.head.removeChild(existingLink);
  }
};