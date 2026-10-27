(function () {
  'use strict';

  var STORAGE_KEY = 'realBenchmarkPblV1';
  var defaultState = { projectName: '', service: '', activeMission: 1, checks: {} };
  var services = {
    musinsa: { label: '무신사', slug: 'musinsa' },
    youtube: { label: '유튜브', slug: 'youtube' },
    daangn: { label: '당근', slug: 'daangn' }
  };
  var state = loadState();
  var saveTimer;
  var toastTimer;

  function loadState() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Object.assign({}, defaultState, saved || {}, { checks: Object.assign({}, (saved && saved.checks) || {}) });
    } catch (error) {
      return Object.assign({}, defaultState, { checks: {} });
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    var indicator = document.getElementById('saveState');
    if (indicator) {
      indicator.textContent = '저장됨';
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () { indicator.textContent = '자동 저장'; }, 1200);
    }
  }

  function showToast(message) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2200);
  }

  function safeSlug(value) {
    var slug = String(value || '').trim().toLowerCase()
      .replace(/[^a-z0-9가-힣_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return slug || 'my-name';
  }

  function currentPath() {
    var service = services[state.service] ? services[state.service].slug : 'service';
    return 'teams/' + safeSlug(state.projectName) + '/' + service + '/';
  }

  function folderCommand() {
    var path = currentPath().replace(/\/$/, '');
    return 'mkdir -p "' + path + '/"{research/evidence,docs/01-product,docs/02-business,docs/03-engineering,development/apps/web,development/packages/ui/src,development/packages/config,development/tests/e2e,reports}';
  }

  function updateSetup() {
    document.getElementById('projectPath').textContent = currentPath();
    document.querySelectorAll('[data-service]').forEach(function (button) {
      var selected = button.dataset.service === state.service;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function selectMission(number, shouldScroll) {
    var mission = Math.max(1, Math.min(4, Number(number) || 1));
    state.activeMission = mission;
    document.querySelectorAll('[data-mission-panel]').forEach(function (panel) {
      var active = Number(panel.dataset.missionPanel) === mission;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    document.querySelectorAll('[data-mission-tab]').forEach(function (tab) {
      var active = Number(tab.dataset.missionTab) === mission;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-current', active ? 'step' : 'false');
    });
    saveState();
    if (shouldScroll) {
      document.getElementById('mission-workspace').scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(function () {
        var title = document.getElementById('mission' + mission + '-title');
        if (title) title.setAttribute('tabindex', '-1'), title.focus({ preventScroll: true });
      }, 450);
    }
  }

  function updateProgress() {
    var allChecks = Array.prototype.slice.call(document.querySelectorAll('[data-check]'));
    var completed = allChecks.filter(function (input) { return input.checked; }).length;
    var percent = allChecks.length ? Math.round((completed / allChecks.length) * 100) : 0;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('totalCount').textContent = allChecks.length;
    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('progressBar').style.width = percent + '%';
    document.querySelector('.progress-track').setAttribute('aria-valuenow', String(percent));

    for (var mission = 1; mission <= 4; mission += 1) {
      var missionChecks = allChecks.filter(function (input) { return input.dataset.check.indexOf('m' + mission + '-') === 0; });
      var missionDone = missionChecks.filter(function (input) { return input.checked; }).length;
      var count = document.querySelector('[data-check-count="' + mission + '"]');
      var status = document.querySelector('[data-mission-status="' + mission + '"]');
      if (count) count.textContent = missionDone + ' / ' + missionChecks.length;
      if (status) status.textContent = missionDone === missionChecks.length ? '완료' : missionDone + '/' + missionChecks.length;
      document.querySelectorAll('[data-mission-tab="' + mission + '"]').forEach(function (tab) {
        tab.classList.toggle('is-complete', missionDone === missionChecks.length);
      });
    }
  }

  function copyText(text, successMessage) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { showToast(successMessage); });
      return;
    }
    var area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    showToast(successMessage);
  }

  function downloadProgress() {
    var lines = [
      '# 리얼 벤치마킹 PBL 진행 기록',
      '',
      '- 이름/팀명: ' + (state.projectName || '미입력'),
      '- 선택 서비스: ' + (services[state.service] ? services[state.service].label : '미선택'),
      '- 작업 경로: `' + currentPath() + '`',
      '- 내려받은 시각: ' + new Date().toLocaleString('ko-KR'),
      '',
      '## 체크포인트'
    ];
    for (var mission = 1; mission <= 4; mission += 1) {
      lines.push('', '### 미션 ' + mission);
      document.querySelectorAll('[data-check^="m' + mission + '-"]').forEach(function (input) {
        var label = input.closest('label').querySelector('span').textContent.trim();
        lines.push('- [' + (input.checked ? 'x' : ' ') + '] ' + label);
      });
    }
    lines.push('', '## 다음 작업', '- 완료되지 않은 체크포인트의 근거 파일 위치를 기록하세요.', '- 세부 평가는 `EVALUATION_RUBRIC.md`를 사용하세요.', '');
    var blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'REAL_BENCHMARK_PROGRESS.md';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    showToast('진행 기록을 Markdown으로 저장했습니다.');
  }

  function initialize() {
    var projectName = document.getElementById('projectName');
    projectName.value = state.projectName;
    projectName.addEventListener('input', function () {
      state.projectName = projectName.value;
      updateSetup();
      saveState();
    });

    document.querySelectorAll('[data-service]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.service = state.service === button.dataset.service ? '' : button.dataset.service;
        updateSetup();
        saveState();
        showToast(state.service ? services[state.service].label + ' 프로젝트로 설정했습니다.' : '서비스 선택을 해제했습니다.');
      });
    });

    document.querySelectorAll('[data-check]').forEach(function (input) {
      input.checked = Boolean(state.checks[input.dataset.check]);
      input.addEventListener('change', function () {
        state.checks[input.dataset.check] = input.checked;
        saveState();
        updateProgress();
      });
    });

    document.querySelectorAll('[data-mission-tab]').forEach(function (button) {
      button.addEventListener('click', function () { selectMission(button.dataset.missionTab, true); });
    });
    document.querySelectorAll('[data-jump-mission]').forEach(function (button) {
      button.addEventListener('click', function () { selectMission(button.dataset.jumpMission, true); });
    });
    document.querySelectorAll('[data-next-mission]').forEach(function (button) {
      button.addEventListener('click', function () { selectMission(button.dataset.nextMission, true); });
    });
    document.querySelectorAll('[data-copy-target]').forEach(function (button) {
      button.addEventListener('click', function () {
        var source = document.getElementById(button.dataset.copyTarget);
        copyText(source.textContent, '템플릿을 복사했습니다.');
      });
    });

    document.getElementById('copyCommand').addEventListener('click', function () {
      copyText(folderCommand(), '폴더 생성 명령을 복사했습니다.');
    });
    document.getElementById('downloadProgress').addEventListener('click', downloadProgress);
    document.getElementById('resetProgress').addEventListener('click', function () {
      if (!window.confirm('선택한 서비스와 모든 체크 기록을 초기화할까요?')) return;
      localStorage.removeItem(STORAGE_KEY);
      state = Object.assign({}, defaultState, { checks: {} });
      projectName.value = '';
      document.querySelectorAll('[data-check]').forEach(function (input) { input.checked = false; });
      updateSetup();
      updateProgress();
      selectMission(1, false);
      showToast('진행 기록을 초기화했습니다.');
    });

    updateSetup();
    updateProgress();
    selectMission(state.activeMission, false);
  }

  document.addEventListener('DOMContentLoaded', initialize);
})();
