/**
 * 2026 SW 랜딩 - Notice Carousel Layer Popup (SlideShare Style)
 * Automatically injects the notice layer popup modal and controls slide transitions.
 */

(function () {
  'use strict';

  // Determine base path for assets (subfolders like day1/ need '../')
  function getBasePath() {
    const p = window.location.pathname;
    if (p.includes('/day') || p.includes('/announcement/') || p.includes('/project_day/') || p.includes('/login/')) {
      return '../';
    }
    return '';
  }

  const BASE_PATH = getBasePath();

  // Notices data: Notice 4 is latest (Slide 0), Notice 3 is Slide 1, Notice 2 is Slide 2, Notice 1 is Slide 3
  const NOTICES_DATA = [
    {
      id: 4,
      tag: '온라인 학습 · NEW',
      tagClass: 'tag-urgent',
      tabLabel: '📢 1. 10/27 온라인 학습 안내',
      title: '📢 [SW랜딩] 10월 27일(화) 온라인 학습 안내',
      contentHtml: `
        <p class="notice-text-p" style="font-size: 1.05rem; font-weight: 700; color: #f8fafc;">
          이번 온라인 학습은 <span style="color: #38bdf8;">4시간 학습 + 과제 1개 제출</span>로 진행합니다.
        </p>

        <!-- 1. 학습시간 계산 기준 -->
        <div class="notice-card-box highlight-amber">
          <h4 class="notice-box-title">⏰ 학습시간 계산 기준</h4>
          <ul class="notice-check-list" style="margin-bottom: 10px;">
            <li><span class="check-icon">▶</span> <span><strong>시작(출입시간):</strong> LMS 접속 시각</span></li>
            <li><span class="check-icon">▶</span> <span><strong>종료(마감시간):</strong> 구글 클래스룸 과제 제출 시각</span></li>
          </ul>
          <p class="notice-text-p" style="color: #fde68a; font-weight: 600; margin: 0;">
            💡 LMS 접속부터 과제 제출까지 <strong>4시간</strong>을 채우고, 학습과 제출을 모두 <strong>10월 27일(화) 안에 완료</strong>해 주세요.
          </p>
        </div>

        <!-- 2. 총 4개 과제 중 1개 선택 -->
        <div class="notice-card-box highlight-blue">
          <h4 class="notice-box-title">📝 총 4개 과제 중 ✅ 1개만 선택해 주세요!</h4>
          <p class="notice-text-p">
            아래 두 메뉴에 있는 과제 4개 중 원하는 과제 1개를 선택해 수행하고 제출하면 됩니다.
          </p>
          <ul class="notice-check-list">
            <li>
              <span class="check-icon">1️⃣</span>
              <span><strong>「1~5day 과제」</strong> → <strong>「Day 1 (2개)」</strong> 중 택 1</span>
            </li>
            <li>
              <span class="check-icon">2️⃣</span>
              <span><strong>「코덱스 현업 과제」</strong> → <strong>「입문」</strong> 중 택 1</span>
            </li>
          </ul>
        </div>

        <!-- 3. 제출 전 꼭 확인하세요 -->
        <div class="notice-card-box highlight-green">
          <h4 class="notice-box-title">📌 제출 전 꼭 확인하세요!</h4>
          <p class="notice-text-p">
            <strong>「과제 제출 및 평가 규칙」</strong>을 읽고, 구글 클래스룸의 <strong>「1주 과제 제출 해주세요」</strong>에 본인 이름으로 제출해 주세요.
          </p>
          <div style="margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="${BASE_PATH}index.html" class="notice-action-link" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; text-decoration: none; font-weight: 700; font-size: 0.9rem;">
              🔗 LMS 접속하기
            </a>
            <a href="https://classroom.google.com/c/ODczMDM4OTY3MjY4?cjc=qxrgrpxz" target="_blank" rel="noopener noreferrer" class="notice-action-link" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; text-decoration: none; font-weight: 700; font-size: 0.9rem;">
              🔗 구글 클래스룸 바로가기 ↗
            </a>
          </div>
        </div>

        <!-- 4. 첨부 이미지 3장 안내 -->
        <div class="notice-attachment-wrap" style="text-align: left; margin-top: 20px;">
          <div class="attachment-label">
            <span>👇 <strong>자세한 진행 방법 (첨부 이미지 3장)</strong></span>
            <span style="font-size: 0.78rem; color: #38bdf8;">클릭 시 원본 크기로 확대</span>
          </div>
          <p class="notice-text-p" style="font-size: 0.88rem; color: #94a3b8; margin-bottom: 12px;">
            순서대로 확인하며 온라인 학습을 진행해 주세요. 이미지를 클릭하면 크게 볼 수 있습니다.
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
            <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px; text-align: center;">
              <div style="font-size: 0.82rem; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">01. 학습 시작 및 메뉴 안내</div>
              <img src="${BASE_PATH}img/notice_online_learning_guide_01.png" alt="01 온라인 학습 시작 안내" class="notice-zoomable-img" style="width: 100%; border-radius: 8px; cursor: zoom-in; transition: transform 0.2s;" data-zoom-src="${BASE_PATH}img/notice_online_learning_guide_01.png" />
            </div>
            <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px; text-align: center;">
              <div style="font-size: 0.82rem; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">02. 과제 4개 중 1개 선택</div>
              <img src="${BASE_PATH}img/notice_online_learning_guide_02.png" alt="02 과제 선택 안내" class="notice-zoomable-img" style="width: 100%; border-radius: 8px; cursor: zoom-in; transition: transform 0.2s;" data-zoom-src="${BASE_PATH}img/notice_online_learning_guide_02.png" />
            </div>
            <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px; text-align: center;">
              <div style="font-size: 0.82rem; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">03. 구글 클래스룸 제출 안내</div>
              <img src="${BASE_PATH}img/notice_online_learning_guide_03.png" alt="03 과제 제출 안내" class="notice-zoomable-img" style="width: 100%; border-radius: 8px; cursor: zoom-in; transition: transform 0.2s;" data-zoom-src="${BASE_PATH}img/notice_online_learning_guide_03.png" />
            </div>
          </div>
        </div>
      `
    },
    {
      id: 3,
      tag: '운영 안내',
      tagClass: 'tag-urgent',
      tabLabel: '🚗 2. 교육시설/주차 안내',
      title: '📢 [SW랜딩] 교육시설 이용 및 주차 안내',
      contentHtml: `
        <p class="notice-text-p" style="font-size: 1.02rem; font-weight: 600; color: #f8fafc;">
          안녕하세요, SW랜딩 운영팀입니다! 😊<br>
          오늘 공지사항이 많지요?
        </p>
        <p class="notice-text-p">
          여러분이 보다 편리하게 교육에 참여하실 수 있도록 주차, 학습공간 이용 및 노트북 대여 관련 사항을 안내드립니다.
        </p>

        <div class="notice-card-box highlight-amber">
          <h4 class="notice-box-title">🚗 1. 주차 안내</h4>
          <p class="notice-text-p">
            <strong>코드알파 건물 내 주차는 불가합니다.</strong><br>
            차량을 이용하시는 분들은 인근 주차 가능 공간을 이용해 주세요.
          </p>
        </div>

        <div class="notice-card-box highlight-blue">
          <h4 class="notice-box-title">🏢 2. 학습공간 이용 안내</h4>
          <p class="notice-text-p">
            코드알파 학습공간은 <strong>오후 10시(22시)까지</strong> 자유롭게 이용하실 수 있습니다.<br>
            오후 10시 이후에도 공간 이용이 필요한 경우, 반드시 사전에 <strong>대구디지털혁신진흥원 김재진 선임님</strong>께 말씀해 주세요.
          </p>
        </div>

        <div class="notice-card-box highlight-green">
          <h4 class="notice-box-title">💻 3. 노트북 대여 안내</h4>
          <p class="notice-text-p">
            개인 노트북이 없어 대여가 필요한 분들을 위해 장비 대여 가능 여부를 확인하고 있습니다.<br>
            다만, 현재 다른 교육과정에서도 장비를 사용하고 있어 <strong>노트북 대여가 어려울 수 있습니다.</strong><br>
            대여 가능 여부가 확정되는 대로 다시 안내드리겠습니다. <em>당분간은 가급적 개인 노트북을 지참해 주세요.</em>
          </p>
        </div>

        <div class="notice-author-sign">
          <p class="notice-text-p" style="margin-bottom: 4px;">
            💙 교육에 참여하시면서 불편한 점이나 궁금한 사항이 있다면 언제든 <strong>[김태선(운영)]</strong>에게 DM 주세요!
          </p>
          <p class="notice-text-p" style="color: #64748b; font-size: 0.88rem;">
            여러분이 편안한 환경에서 학습에 집중할 수 있도록 운영팀도 함께 노력하겠습니다. 감사합니다! 😊
          </p>
        </div>
      `
    },
    {
      id: 2,
      tag: '교수진 공지 · 팀 편성',
      tagClass: 'tag-faculty',
      tabLabel: '👥 3. 팀 구성 안내',
      title: '[공지] 학습 모듈별 팀 구성 안내',
      contentHtml: `
        <p class="notice-text-p" style="font-size: 1.05rem; font-weight: 700; color: #f8fafc;">
          안녕하세요. 이호준 교수입니다.
        </p>
        <p class="notice-text-p">
          어제 오리엔테이션(OT)에 함께해 주신 여러분께 감사드립니다.<br>
          OT 참여자들의 학습 성향을 바탕으로 팀을 구성하였습니다.
        </p>

        <div class="notice-card-box highlight-blue" style="line-height: 1.8;">
          <ul class="notice-check-list">
            <li>
              <span class="check-icon">✓</span>
              <span><strong>학습 토론 중심 운영:</strong> 이번 팀 구성은 공동 과제를 수행하기 위한 것이 아니라, 개인별 학습을 기본으로 하되 서로 토론하고 의견을 나누며 학습 효과를 높이기 위한 목적으로 운영됩니다.</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span><strong>모듈별 유연한 재구성:</strong> 모듈별로 참여 인원이 달라질 수 있기 때문에 각 모듈이 종료된 후에는 참여 현황과 학습 상황을 고려하여 팀이 재구성될 수 있습니다.</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span><strong>소통 최적화 편성:</strong> 이번 팀 편성은 OT 참여자를 기준으로 서로 소통하고 토론하기에 적합한 구성을 고려하였으며, 이후 모듈이 변경되거나 새로운 참여자가 합류하는 경우 일부 조정될 수 있습니다.</span>
            </li>
          </ul>
        </div>

        <p class="notice-text-p">
          각자의 학습을 충실히 진행하면서도 팀원들과 적극적으로 의견을 나누고 함께 성장하는 시간이 되기를 바랍니다.
        </p>

        <!-- Attachment: Team Organization Table Image -->
        <div class="notice-attachment-wrap">
          <div class="attachment-label">
            <span>📎 첨부파일: <strong>2026 SW랜딩 팀 구성 표</strong></span>
            <span style="font-size: 0.78rem; color: #38bdf8;">클릭 시 원본 크기로 확대</span>
          </div>
          <img src="${BASE_PATH}img/notice_team_table.png" alt="2026 SW랜딩 팀 구성 안내표" class="notice-team-img" id="noticeTeamTableImg" title="클릭하여 원본 크기로 보기" />
        </div>

        <div class="notice-author-sign">
          <p class="notice-text-p" style="margin-bottom: 2px;">감사합니다.</p>
          <p class="notice-text-p" style="font-weight: 700; color: #f8fafc;">이호준 드림</p>
        </div>
      `
    },
    {
      id: 1,
      tag: '학습 안내 · 모듈 1',
      tagClass: 'tag-learning',
      tabLabel: '🚀 4. 모듈 1 학습 안내',
      title: '🚀 [SW랜딩] 모듈 1 첫 번째 학습 안내',
      contentHtml: `
        <p class="notice-text-p" style="font-size: 1.05rem; font-weight: 700; color: #f8fafc;">
          안녕하세요! 🤗 @everyone
        </p>
        <p class="notice-text-p">
          드디어 오늘부터 SW랜딩 모듈 1의 첫 번째 학습이 시작됩니다! 🎉<br>
          어제 OT에서 뵌 여러분을 오늘 다시 만날 생각에 기대가 되네요!
        </p>

        <div class="notice-card-box highlight-blue">
          <h4 class="notice-box-title">📍 오늘의 교육 안내</h4>
          <ul class="notice-check-list">
            <li><span class="check-icon">⏰</span> <span><strong>시간:</strong> 오후 6시부터 오후 10시까지</span></li>
            <li><span class="check-icon">🏢</span> <span><strong>장소:</strong> 코드알파 8층</span></li>
            <li><span class="check-icon">💡</span> <span>원활한 교육 진행을 위해 늦지 않게 꼭꼭 참석해 주세요! 😊</span></li>
          </ul>
        </div>

        <div class="notice-card-box highlight-amber">
          <h4 class="notice-box-title">📱 모바일 출결 태깅 안내 (중요!)</h4>
          <p class="notice-text-p">
            오늘 오후 2시~3시 사이 <strong>모바일 태깅 시스템 설치 안내 문자</strong>가 발송될 예정입니다.<br>
            문자 안내에 따라 미리 설치해 주시고, 교육장 입장할 때와 퇴장할 때 반드시 태깅해 주세요!
          </p>
          <ul class="notice-check-list">
            <li><span class="check-icon">✅</span> <span><strong>출입할 때마다 태깅</strong>이 필요합니다.</span></li>
            <li><span class="check-icon">✅</span> <span><strong>마지막 태깅 기록을 기준</strong>으로 최종 교육 참여시간이 산정되니, 특히 퇴장 시 태깅을 잊지 말아 주세요!</span></li>
          </ul>
        </div>

        <div class="notice-card-box highlight-green">
          <h4 class="notice-box-title">📚 교육 안내자료 공유</h4>
          <p class="notice-text-p">
            오티에서 안내드린 교육 일정표, 수료기준, 학습 안내 등 꼭 알아두셔야 할 내용을 정리한 <strong>PDF 안내자료</strong>도 함께 공유드립니다.<br>
            교육 시작 전 한 번씩 살펴봐 주세요!
          </p>
          <p class="notice-text-p" style="font-size: 0.88rem; color: #94a3b8; margin-top: 8px;">
            📌 <em>오티자료는 디스코드를 통해 배포 되었습니다.</em>
          </p>
        </div>

        <div class="notice-author-sign">
          <p class="notice-text-p" style="margin-bottom: 6px;">
            궁금한 점이나 도움이 필요한 사항이 있다면 언제든 <strong>김태선(운영)</strong>에게 편하게 DM 주세요. ^^
          </p>
          <p class="notice-text-p" style="font-weight: 700; color: #38bdf8;">
            그럼 오늘 오후 6시, 코드알파 8층에서 만나요! 여러분의 첫 번째 학습을 응원합니다! 💙
          </p>
        </div>
      `
    }
  ];

  let currentSlide = 0;
  let modalBackdrop = null;
  let slidesTrack = null;
  let quickTabs = [];
  let dots = [];
  let prevBtn = null;
  let nextBtn = null;
  let counterPill = null;
  let arrowPrev = null;
  let arrowNext = null;

  // Build Modal DOM
  function createModalDOM() {
    if (document.getElementById('noticeModalBackdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'noticeModalBackdrop';
    backdrop.className = 'notice-modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'noticeMainTitle');

    // Slides HTML
    const slidesHtml = NOTICES_DATA.map((notice, idx) => `
      <div class="notice-slide" role="tabpanel" id="noticeSlide-${idx}" aria-label="공지 ${idx + 1}">
        <span class="notice-header-tag ${notice.tagClass}">${notice.tag}</span>
        <h3 class="notice-post-title">${notice.title}</h3>
        <div class="notice-body-content">
          ${notice.contentHtml}
        </div>
      </div>
    `).join('');

    // Tabs HTML
    const tabsHtml = NOTICES_DATA.map((notice, idx) => `
      <button type="button" class="notice-tab-btn ${idx === 0 ? 'is-active' : ''}" data-slide-index="${idx}">
        ${idx === 0 ? '<span class="notice-tab-badge-new">NEW</span>' : ''}
        ${notice.tabLabel}
      </button>
    `).join('');

    // Dots HTML
    const dotsHtml = NOTICES_DATA.map((_, idx) => `
      <button type="button" class="notice-dot ${idx === 0 ? 'is-active' : ''}" data-slide-index="${idx}" aria-label="공지 ${idx + 1}로 이동"></button>
    `).join('');

    backdrop.innerHTML = `
      <div class="notice-modal-dialog" id="noticeModalDialog">
        <!-- Header -->
        <div class="notice-modal-header">
          <div class="notice-header-left">
            <h2 class="notice-main-title" id="noticeMainTitle">
              <span style="color:#ef4444;">📢</span> [SW랜딩] 전체 공지사항
            </h2>
            <span class="notice-counter-pill" id="noticeCounterPill">1 / ${NOTICES_DATA.length} (최신순)</span>
          </div>
          <button type="button" class="notice-modal-close" id="noticeModalCloseBtn" aria-label="공지사항 닫기">✕</button>
        </div>

        <!-- Quick Tabs (SlideShare Navigation Bar) -->
        <div class="notice-quick-tabs" id="noticeQuickTabs">
          ${tabsHtml}
        </div>

        <!-- Viewport & Slider Track -->
        <div class="notice-slides-viewport" id="noticeSlidesViewport">
          <!-- SlideShare Side Arrows -->
          <button type="button" class="notice-nav-arrow prev" id="noticeArrowPrev" aria-label="이전 공지 (SlideShare)">‹</button>
          <button type="button" class="notice-nav-arrow next" id="noticeArrowNext" aria-label="다음 공지 (SlideShare)">›</button>

          <div class="notice-slides-track" id="noticeSlidesTrack">
            ${slidesHtml}
          </div>
        </div>

        <!-- Footer / Pagination -->
        <div class="notice-modal-footer">
          <div class="notice-footer-left">
            <label style="display: inline-flex; align-items: center; gap: 6px; color: #94a3b8; font-size: 0.82rem; cursor: pointer; user-select: none;">
              <input type="checkbox" id="noticeDontShowToday" style="cursor: pointer; accent-color: #38bdf8;" />
              오늘 하루 보지 않기
            </label>
          </div>
          <div class="notice-pagination-dots" id="noticePaginationDots">
            ${dotsHtml}
          </div>
          <div class="notice-footer-buttons">
            <button type="button" class="notice-control-btn btn-prev" id="noticePrevBtn" disabled>
              ‹ 이전 공지
            </button>
            <button type="button" class="notice-control-btn btn-next" id="noticeNextBtn">
              다음 공지 ›
            </button>
          </div>
        </div>
      </div>

      <!-- Image Lightbox for zooming team organization table -->
      <div class="notice-lightbox-overlay" id="noticeLightboxOverlay">
        <img src="${BASE_PATH}img/notice_team_table.png" alt="팀 구성 표 원본" class="notice-lightbox-img" />
      </div>
    `;

    document.body.appendChild(backdrop);

    // Cache elements
    modalBackdrop = backdrop;
    slidesTrack = document.getElementById('noticeSlidesTrack');
    quickTabs = Array.from(document.querySelectorAll('#noticeQuickTabs .notice-tab-btn'));
    dots = Array.from(document.querySelectorAll('#noticePaginationDots .notice-dot'));
    prevBtn = document.getElementById('noticePrevBtn');
    nextBtn = document.getElementById('noticeNextBtn');
    arrowPrev = document.getElementById('noticeArrowPrev');
    arrowNext = document.getElementById('noticeArrowNext');
    counterPill = document.getElementById('noticeCounterPill');

    // Bind events
    setupEvents();
  }

  // Slide transition logic
  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= NOTICES_DATA.length) index = NOTICES_DATA.length - 1;

    currentSlide = index;

    // Apply SlideShare horizontal slide
    if (slidesTrack) {
      slidesTrack.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;
    }

    // Scroll active slide content to top
    const activeSlide = document.getElementById(`noticeSlide-${currentSlide}`);
    if (activeSlide) activeSlide.scrollTop = 0;

    // Update Quick Tabs
    quickTabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === currentSlide);
    });

    // Update Dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentSlide);
    });

    // Update Counter
    if (counterPill) {
      const isLatest = currentSlide === 0 ? ' (최신)' : '';
      counterPill.textContent = `${currentSlide + 1} / ${NOTICES_DATA.length}${isLatest}`;
    }

    // Update Buttons State
    const isFirst = currentSlide === 0;
    const isLast = currentSlide === NOTICES_DATA.length - 1;

    if (prevBtn) prevBtn.disabled = isFirst;
    if (arrowPrev) arrowPrev.disabled = isFirst;

    if (nextBtn) {
      if (isLast) {
        nextBtn.textContent = '확인 완료 ✓';
        nextBtn.onclick = closeNotice;
      } else {
        nextBtn.innerHTML = '다음 공지 ›';
        nextBtn.onclick = () => goToSlide(currentSlide + 1);
      }
    }

    if (arrowNext) arrowNext.disabled = isLast;
  }

  const DONT_SHOW_STORAGE_KEY = 'swlanding_notice_hide_20261027';

  function openNotice(slideIndex = 0) {
    createModalDOM();
    goToSlide(slideIndex);
    modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeNotice() {
    if (!modalBackdrop) return;
    const dontShow = document.getElementById('noticeDontShowToday');
    if (dontShow && dontShow.checked) {
      const todayStr = new Date().toISOString().slice(0, 10);
      try {
        localStorage.setItem(DONT_SHOW_STORAGE_KEY, todayStr);
      } catch (e) {}
    }
    modalBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function setupEvents() {
    // Close button
    const closeBtn = document.getElementById('noticeModalCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeNotice);

    // Backdrop click
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeNotice();
      }
    });

    // Arrow Prev/Next buttons
    if (arrowPrev) arrowPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (arrowNext) arrowNext.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Footer Prev button
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));

    // Quick Tabs click
    quickTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const idx = parseInt(tab.getAttribute('data-slide-index'), 10);
        goToSlide(idx);
      });
    });

    // Dots click
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-slide-index'), 10);
        goToSlide(idx);
      });
    });

    // Keyboard navigation (Escape to close, Left/Right arrows to slide)
    window.addEventListener('keydown', (e) => {
      if (!modalBackdrop || !modalBackdrop.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeNotice();
      if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
      if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
    });

    // Touch swipe support (SlideShare mobile experience)
    let touchStartX = 0;
    let touchEndX = 0;
    const viewport = document.getElementById('noticeSlidesViewport');
    if (viewport) {
      viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 45) {
          if (diff > 0) goToSlide(currentSlide + 1); // Swipe left -> next
          else goToSlide(currentSlide - 1); // Swipe right -> prev
        }
      }, { passive: true });
    }

    // Dynamic Lightbox for zoomable images (team table and 3 online guide images)
    const lightbox = document.getElementById('noticeLightboxOverlay');
    const lightboxImg = lightbox ? lightbox.querySelector('.notice-lightbox-img') : null;

    if (lightbox && lightboxImg) {
      document.addEventListener('click', (e) => {
        const zoomTarget = e.target.closest('.notice-zoomable-img, #noticeTeamTableImg, [data-zoom-src]');
        if (zoomTarget) {
          const src = zoomTarget.getAttribute('data-zoom-src') || zoomTarget.getAttribute('src');
          if (src) {
            lightboxImg.src = src;
            lightbox.classList.add('is-active');
          }
        } else if (lightbox.classList.contains('is-active') && (e.target === lightbox || e.target === lightboxImg)) {
          lightbox.classList.remove('is-active');
        }
      });
    }
  }

  // Expose global methods
  window.openNoticeModal = openNotice;
  window.closeNoticeModal = closeNotice;

  // Auto-bind to any element with id="openNoticeBtn" or class="nav-notice-btn"
  function bindTriggers() {
    const triggers = document.querySelectorAll('#openNoticeBtn, .nav-notice-btn, [data-open-notice]');
    triggers.forEach((trigger) => {
      if (!trigger.dataset.noticeBound) {
        trigger.dataset.noticeBound = 'true';
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          openNotice(0); // Latest notice first
        });
      }
    });
  }

  // Auto-open notice popup on page load unless "don't show today" was checked
  function checkAutoOpen() {
    if (window.location.pathname.includes('login')) return;
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(DONT_SHOW_STORAGE_KEY);
      if (saved === todayStr) {
        return;
      }
    } catch (e) {}

    setTimeout(() => {
      openNotice(0);
    }, 400);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createModalDOM();
      bindTriggers();
      checkAutoOpen();
    });
  } else {
    createModalDOM();
    bindTriggers();
    checkAutoOpen();
  }

  // Periodic check in case triggers are dynamically rendered
  setTimeout(bindTriggers, 300);
  setTimeout(bindTriggers, 1200);
})();
