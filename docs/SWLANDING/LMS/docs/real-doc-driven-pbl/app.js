(function () {
  'use strict';

  var KEY = 'dip-doc-driven-pbl-v1';
  var defaults = { learner: '', activeMission: 1, checks: {} };
  var state;

  try {
    state = Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || '{}'));
  } catch (error) {
    state = Object.assign({}, defaults);
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(state));
    var label = document.getElementById('saveState');
    if (label) {
      label.textContent = '저장됨';
      setTimeout(function () {
        label.textContent = '자동 저장';
      }, 900);
    }
  }

  function slug(value) {
    return (value || 'my-team')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9가-힣_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'my-team';
  }

  function setup() {
    var pathEl = document.getElementById('projectPath');
    if (pathEl) {
      pathEl.textContent = 'teams/' + slug(state.learner) + '/kiosk-pbl/';
    }
  }

  function toast(message) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
    setTimeout(function () {
      el.classList.remove('is-visible');
    }, 1800);
  }

  function mission(value, scroll) {
    var current = Math.max(1, Math.min(4, Number(value) || 1));
    state.activeMission = current;
    document.querySelectorAll('[data-mission-panel]').forEach(function (el) {
      var on = Number(el.dataset.missionPanel) === current;
      el.hidden = !on;
      el.classList.toggle('is-active', on);
    });
    document.querySelectorAll('[data-mission-tab]').forEach(function (el) {
      var on = Number(el.dataset.missionTab) === current;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-current', on ? 'step' : 'false');
    });
    save();
    if (scroll) {
      var ws = document.getElementById('mission-workspace');
      if (ws) ws.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function progress() {
    var all = Array.from(document.querySelectorAll('[data-check]'));
    var done = all.filter(function (x) { return x.checked; }).length;
    var pct = all.length ? Math.round((done / all.length) * 100) : 0;

    document.getElementById('completedCount').textContent = done;
    document.getElementById('totalCount').textContent = all.length;
    document.getElementById('progressPercent').textContent = pct + '%';
    document.getElementById('progressBar').style.width = pct + '%';
    document.querySelector('.progress-track').setAttribute('aria-valuenow', String(pct));

    for (var m = 1; m <= 4; m += 1) {
      var group = all.filter(function (x) { return x.dataset.check.indexOf('m' + m + '-') === 0; });
      var count = group.filter(function (x) { return x.checked; }).length;
      var countEl = document.querySelector('[data-check-count="' + m + '"]');
      var statusEl = document.querySelector('[data-mission-status="' + m + '"]');
      if (countEl) countEl.textContent = count + ' / ' + group.length;
      if (statusEl) statusEl.textContent = count === group.length ? '완료 ✓' : count + '/' + group.length;
      document.querySelectorAll('[data-mission-tab="' + m + '"]').forEach(function (tab) {
        tab.classList.toggle('is-complete', count === group.length);
      });
    }
  }

  function copy(text, message) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        toast(message);
      });
      return;
    }
    var area = document.createElement('textarea');
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    toast(message);
  }

  function download() {
    var lines = [
      '# Codex × Antigravity PBL 진행 기록',
      '',
      '- 이름/팀명: ' + (state.learner || '미입력'),
      '- 작업 경로: teams/' + slug(state.learner) + '/kiosk-pbl/',
      '- 저장 시각: ' + new Date().toLocaleString('ko-KR'),
      ''
    ];
    for (var m = 1; m <= 4; m += 1) {
      lines.push('## 미션 ' + m);
      document.querySelectorAll('[data-check^="m' + m + '-"]').forEach(function (input) {
        lines.push('- [' + (input.checked ? 'x' : ' ') + '] ' + input.closest('label').querySelector('span').textContent.trim());
      });
      lines.push('');
    }
    lines.push(
      '## 내가 직접 결정한 것',
      '- ',
      '',
      '## AI 제안을 수정하거나 거절한 것',
      '- ',
      '',
      '## 다음 검증',
      '- '
    );
    var blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'DOC_DRIVEN_PBL_PROGRESS.md';
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
    toast('진행 기록을 저장했습니다.');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function formatInline(str) {
    return escapeHtml(str)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  function renderFolderTreeHtml(rawLines) {
    var rows = [];
    rawLines.forEach(function (raw) {
      if (!raw || !raw.trim()) return;
      var line = raw.replace(/\r/g, '');
      var comment = '';
      var hashIdx = line.indexOf('#');
      if (hashIdx !== -1) {
        comment = line.slice(hashIdx + 1).trim();
        line = line.slice(0, hashIdx);
      }

      var branchMatch = line.match(/[├└]──\s*/);
      if (!branchMatch) {
        var rootName = line.trim();
        if (!rootName) return;
        rows.push(
          '<div class="md-tree-root">' +
            '<span class="md-tree-icon">📦</span>' +
            '<strong class="md-tree-root-name">' + escapeHtml(rootName) + '</strong>' +
            (comment
              ? '<span class="md-tree-comment">' + escapeHtml(comment) + '</span>'
              : '<span class="md-tree-badge">PROJECT ROOT</span>') +
          '</div>'
        );
        return;
      }

      var prefix = line.slice(0, branchMatch.index);
      // Calculate nesting level based on prefix length before ├── / └──
      var normalizedPrefix = prefix.replace(/^\s{0,4}/, '');
      var depth = Math.floor(normalizedPrefix.length / 3) + 1;
      if (depth < 1) depth = 1;
      if (depth > 3) depth = 3;

      var itemName = line.slice(branchMatch.index + branchMatch[0].length).trim();
      var isFolder = /\/$/.test(itemName);

      rows.push(
        '<div class="md-tree-row depth-' + depth + (isFolder ? ' is-folder' : ' is-file') + '">' +
          '<div class="md-tree-left">' +
            '<span class="md-tree-branch" aria-hidden="true"></span>' +
            '<span class="md-tree-icon" aria-hidden="true">' + (isFolder ? '📁' : '📄') + '</span>' +
            (isFolder
              ? '<strong class="md-tree-folder">' + escapeHtml(itemName) + '</strong>'
              : '<code class="md-tree-file">' + escapeHtml(itemName) + '</code>') +
          '</div>' +
          (comment ? '<span class="md-tree-comment">' + escapeHtml(comment) + '</span>' : '') +
        '</div>'
      );
    });

    return '<div class="md-folder-tree" role="tree">' + rows.join('') + '</div>';
  }

  function flushCodeBlock(codeLines, html) {
    if (!codeLines.length) return;
    var joined = codeLines.join('\n');
    if (/[├└]──/.test(joined)) {
      html.push(renderFolderTreeHtml(codeLines));
    } else {
      html.push('<pre><code>' + escapeHtml(joined) + '</code></pre>');
    }
  }

  function renderMarkdown(md) {
    var lines = String(md || '').replace(/\r\n/g, '\n').split('\n');
    var html = [];
    var inCode = false;
    var codeLines = [];
    var inIndentedCode = false;
    var indentedLines = [];
    var inList = false;
    var inTable = false;
    var tableRows = [];

    function flushList() {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
    }

    function flushIndented() {
      if (inIndentedCode) {
        inIndentedCode = false;
        flushCodeBlock(indentedLines, html);
        indentedLines = [];
      }
    }

    function flushTable() {
      if (!inTable) return;
      inTable = false;
      if (!tableRows.length) return;
      html.push('<table>');
      tableRows.forEach(function (row, idx) {
        if (idx === 1 && /^[\s|:-]+$/.test(row.raw)) return;
        var tag = idx === 0 ? 'th' : 'td';
        html.push('<tr>' + row.cells.map(function (c) { return '<' + tag + '>' + formatInline(c) + '</' + tag + '>'; }).join('') + '</tr>');
      });
      html.push('</table>');
      tableRows = [];
    }

    lines.forEach(function (line) {
      if (line.trim().indexOf('```') === 0) {
        flushList();
        flushTable();
        flushIndented();
        if (!inCode) {
          inCode = true;
          codeLines = [];
        } else {
          inCode = false;
          flushCodeBlock(codeLines, html);
          codeLines = [];
        }
        return;
      }
      if (inCode) {
        codeLines.push(line);
        return;
      }

      // Support 4-space indented code blocks or bare ASCII tree lines
      if (/^(    |\t)/.test(line) || /[├└]──/.test(line)) {
        flushList();
        flushTable();
        inIndentedCode = true;
        indentedLines.push(line.replace(/^(    |\t)/, ''));
        return;
      } else if (inIndentedCode && !line.trim()) {
        return;
      } else {
        flushIndented();
      }

      if (line.trim().indexOf('|') === 0 && line.trim().lastIndexOf('|') === line.trim().length - 1) {
        flushList();
        inTable = true;
        var cells = line.trim().slice(1, -1).split('|').map(function (c) { return c.trim(); });
        tableRows.push({ raw: line.trim(), cells: cells });
        return;
      } else {
        flushTable();
      }

      if (!line.trim()) {
        flushList();
        return;
      }
      if (line.indexOf('### ') === 0) {
        flushList();
        html.push('<h3>' + formatInline(line.slice(4)) + '</h3>');
      } else if (line.indexOf('## ') === 0) {
        flushList();
        html.push('<h2>' + formatInline(line.slice(3)) + '</h2>');
      } else if (line.indexOf('# ') === 0) {
        flushList();
        html.push('<h1>' + formatInline(line.slice(2)) + '</h1>');
      } else if (/^(\s*[-*]|\s*\d+\.)\s+/.test(line)) {
        if (!inList) {
          html.push('<ul class="plain-list">');
          inList = true;
        }
        html.push('<li>' + formatInline(line.replace(/^(\s*[-*]|\s*\d+\.)\s+/, '')) + '</li>');
      } else {
        flushList();
        html.push('<p>' + formatInline(line) + '</p>');
      }
    });

    flushList();
    flushTable();
    flushIndented();
    if (inCode) {
      flushCodeBlock(codeLines, html);
    }
    return html.join('\n');
  }

  function openMarkdownModal(path, labelText) {
    var backdrop = document.getElementById('docModalBackdrop');
    var pathEl = document.getElementById('docModalPath');
    var titleEl = document.getElementById('docModalTitle');
    var bodyEl = document.getElementById('docModalBody');
    var downloadEl = document.getElementById('docModalDownload');
    if (!backdrop || !bodyEl) return;

    pathEl.textContent = path;
    titleEl.textContent = labelText || path;
    downloadEl.href = path;
    downloadEl.setAttribute('download', path.split('/').pop());
    bodyEl.innerHTML = '<p style="color:#94a3b8;">문서를 불러오는 중입니다...</p>';
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';

    fetch(path + '?v=' + Date.now())
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (md) {
        bodyEl.innerHTML = renderMarkdown(md);
      })
      .catch(function () {
        bodyEl.innerHTML = '<p>문서를 미리볼 수 없습니다. 상단의 <strong>원본 MD 다운로드</strong> 버튼을 눌러 확인해 주세요.</p>';
      });
  }

  function closeMarkdownModal() {
    var backdrop = document.getElementById('docModalBackdrop');
    if (!backdrop) return;
    backdrop.hidden = true;
    document.body.style.overflow = '';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var learner = document.getElementById('projectName');
    learner.value = state.learner;
    learner.addEventListener('input', function () {
      state.learner = learner.value;
      setup();
      save();
    });

    document.querySelectorAll('[data-check]').forEach(function (input) {
      input.checked = Boolean(state.checks[input.dataset.check]);
      input.addEventListener('change', function () {
        state.checks[input.dataset.check] = input.checked;
        progress();
        save();
      });
    });

    document.querySelectorAll('[data-mission-tab]').forEach(function (x) {
      x.addEventListener('click', function () {
        mission(x.dataset.missionTab, true);
      });
    });

    document.querySelectorAll('[data-jump-mission]').forEach(function (x) {
      x.addEventListener('click', function () {
        mission(x.dataset.jumpMission, true);
      });
    });

    document.querySelectorAll('[data-next-mission]').forEach(function (x) {
      x.addEventListener('click', function () {
        mission(x.dataset.nextMission, true);
      });
    });

    document.querySelectorAll('[data-copy-target]').forEach(function (x) {
      x.addEventListener('click', function () {
        copy(document.getElementById(x.dataset.copyTarget).textContent, '프롬프트 템플릿을 복사했습니다.');
      });
    });

    document.getElementById('copyCommand').addEventListener('click', function () {
      copy(
        'mkdir -p teams/' + slug(state.learner) + '/kiosk-pbl/{service-planning,service-analysis,service-implementation,service-validation}',
        '폴더 생성 명령을 복사했습니다.'
      );
    });

    document.getElementById('downloadProgress').addEventListener('click', download);

    document.getElementById('resetProgress').addEventListener('click', function () {
      if (!confirm('모든 체크 기록을 초기화할까요?')) return;
      state = Object.assign({}, defaults, { checks: {} });
      localStorage.removeItem(KEY);
      learner.value = '';
      document.querySelectorAll('[data-check]').forEach(function (x) {
        x.checked = false;
      });
      setup();
      progress();
      mission(1, false);
      toast('진행 상태를 초기화했습니다.');
    });

    // Bind Markdown preview links
    document.querySelectorAll('[data-preview-md]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var path = link.getAttribute('data-preview-md');
        var strongEl = link.querySelector('strong');
        var title = strongEl ? strongEl.textContent.trim() : link.textContent.trim();
        openMarkdownModal(path, title);
      });
    });

    var modalClose = document.getElementById('docModalClose');
    var modalBackdrop = document.getElementById('docModalBackdrop');
    if (modalClose) modalClose.addEventListener('click', closeMarkdownModal);
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop) closeMarkdownModal();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalBackdrop && !modalBackdrop.hidden) {
        closeMarkdownModal();
      }
    });

    setup();
    progress();
    mission(state.activeMission, false);
  });
})();
