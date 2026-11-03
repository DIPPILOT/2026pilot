document.querySelectorAll('.copy').forEach((button) => {
  button.addEventListener('click', async () => {
    const code = button.parentElement.querySelector('code').textContent;
    await navigator.clipboard.writeText(code);
    const before = button.textContent;
    button.textContent = '완료';
    button.classList.add('copied');
    window.setTimeout(() => {
      button.textContent = before;
      button.classList.remove('copied');
    }, 1200);
  });
});

const tabs = document.querySelectorAll('.tab');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.prompt-panel').forEach((panel) => {
      panel.classList.remove('active');
      panel.hidden = true;
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.getElementById(tab.dataset.target);
    panel.hidden = false;
    panel.classList.add('active');
  });
});
