/**
 * 2026 SW 랜딩 - Notice Carousel Layer Popup (SlideShare Style)
 * Automatically injects the notice layer popup modal and controls slide transitions.
 */

(function () {
  'use strict';

  // Determine base path for assets (subfolders like day1/ need '../')
  function getBasePath() {
    const p = window.location.pathname;
    if (p.includes('/day') || p.includes('/announcement/') || p.includes('/project_day/') || p.includes('/login/') || p.includes('/real-')) {
      return '../';
    }
    return '';
  }

  const BASE_PATH = getBasePath();

  // Notices data: Notice 11 is Final Interview Battle Method (Slide 0), Notice 10 is Interview Battle & Tech/Exec Interview (Slide 1), Notice 7 is Must-Read (Slide 2), Notice 9 is 11/10 online learning guide (Slide 3), Notice 8 is 3rd-week gstack guide (Slide 4), Notice 6 is Slide 5, Notice 5 is Slide 6, Notice 4 is Slide 7, Notice 3 is Slide 8, Notice 2 is Slide 9, Notice 1 is Slide 10
  const NOTICES_DATA = [
    {
      id: 11,
      isNew: true,
      tag: '🎯 마지막 면접 배틀 · 진행 방법',
      tagClass: 'tag-urgent',
      tabLabel: '🎯 1. 마지막 면접 배틀 진행 방법',
      title: '📢 [SW랜딩] 마지막 면접 배틀 (모의면접 → 리얼 면접) 진행 방법 안내',
      contentHtml: `
        <div style="margin-bottom: 18px; padding: 15px 18px; border-radius: 12px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(59, 130, 246, 0.18)); border: 1.5px solid rgba(52, 211, 153, 0.5); display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 1.5rem; line-height: 1;">🎯</span>
          <div style="color: #ecfdf5; font-size: 0.98rem; font-weight: 700; line-height: 1.58;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 6px; background: linear-gradient(135deg, #10b981, #2563eb); color: #fff; font-size: 0.78rem; font-weight: 800; margin-right: 6px; vertical-align: middle;">진행 가이드</span>
            마지막 면접 배틀 진행 방법입니다! 팀을 나누어 실전처럼 연습하고, 마지막에는 전문 면접관과 리얼 면접을 진행합니다.
          </div>
        </div>

        <!-- 4단계 진행 순서 -->
        <div class="notice-card-box highlight-blue" style="margin: 16px 0;">
          <h4 class="notice-box-title">📋 모의면접 배틀 4단계 진행 방법</h4>
          <ul class="notice-check-list" style="gap: 10px;">
            <li>
              <span class="check-icon">1️⃣</span>
              <span><strong>팀 구성 (면접관팀 vs 면접자팀):</strong> 면접관팀과 면접자팀으로 팀을 나누고, 각 팀은 역할을 정해 면접 질문·답변을 준비합니다.</span>
            </li>
            <li>
              <span class="check-icon">2️⃣</span>
              <span><strong>1차 면접 진행:</strong> 먼저 면접관팀과 면접자팀으로 마주 앉아 실제 면접처럼 날카롭게 질문하고 논리적으로 답변합니다.</span>
            </li>
            <li>
              <span class="check-icon">3️⃣</span>
              <span><strong>공수교대 (역할 교대!):</strong> 이후 <strong>면접관팀 ↔ 면접자팀</strong> 역할을 서로 바꿔 다시 한 번 면접을 진행합니다.</span>
            </li>
            <li>
              <span class="check-icon">4️⃣</span>
              <span><strong>리얼 면접 진행 (기술면접 → 임원면접):</strong> 마지막에는 <strong>전문 기술 면접관</strong>과 <strong>전문 임원 면접관</strong>이 직접 참여하여 실제 채용 면접처럼 <strong>기술면접 → 임원면접</strong> 순서로 진행합니다.</span>
            </li>
          </ul>
        </div>

        <!-- 핵심 포인트 -->
        <div class="notice-card-box highlight-amber" style="margin-bottom: 18px;">
          <h4 class="notice-box-title">💡 이번 면접 배틀의 핵심 포인트!</h4>
          <p class="notice-text-p" style="color: #fde68a; font-weight: 700; margin: 0; line-height: 1.7;">
            🎯 <strong>질문하는 경험(면접관 시선)</strong>과 <strong>답변하는 경험(지원자 시선)</strong>을 모두 해본 뒤, 마지막에 전문 면접관과의 <strong>리얼 면접(기술면접 → 임원면접)</strong>까지 완주합니다!
          </p>
        </div>

        <!-- 첨부 인포그래픽 이미지 -->
        <div class="notice-attachment-wrap" style="text-align: center; margin-top: 18px;">
          <div class="attachment-label">
            <span>📎 첨부파일: <strong>모의면접 진행 방법 (1. 팀 구성 → 2. 1차 면접 → 3. 공수교대 → 4. 리얼 면접)</strong></span>
            <span style="font-size: 0.78rem; color: #38bdf8;">클릭 시 원본 크기로 확대</span>
          </div>
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 14px; display: inline-block; max-width: 100%;">
            <img src="${BASE_PATH}img/notice_mock_interview_method.jpg" alt="모의면접 진행 방법 안내 인포그래픽" class="notice-team-img notice-zoomable-img" style="max-height: 600px; width: auto; max-width: 100%; border-radius: 10px; cursor: zoom-in; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" data-zoom-src="${BASE_PATH}img/notice_mock_interview_method.jpg" title="클릭하여 원본 크기로 보기" />
          </div>
        </div>
      `
    },
    {
      id: 10,
      tag: '🎤 실전 면접 안내',
      tagClass: 'tag-urgent',
      tabLabel: '🎤 2. 면접 배틀 · 기술/임원면접 안내',
      title: '📢 [SW랜딩] 모의 면접 배틀 & 기술면접 · 임원면접 실시 안내',
      contentHtml: `
        <div style="margin-bottom: 18px; padding: 15px 18px; border-radius: 12px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.22), rgba(139, 92, 246, 0.16)); border: 1.5px solid rgba(96, 165, 250, 0.5); display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 1.5rem; line-height: 1;">🏆</span>
          <div style="color: #e0f2fe; font-size: 0.98rem; font-weight: 700; line-height: 1.58;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 6px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: #fff; font-size: 0.78rem; font-weight: 800; margin-right: 6px; vertical-align: middle;">실전 면접</span>
            면접 배틀과 기술면접 · 임원면접을 실시합니다! 꼭 참여해서 실제 면접관과 함께 실무 면접을 진행해 보세요.
          </div>
        </div>

        <p class="notice-text-p" style="font-size: 1.05rem; font-weight: 700; color: #f8fafc; line-height: 1.72;">
          안녕하세요, SW랜딩 수강생 여러분!<br>
          이번 과정에서는 여러분의 실전 취업 경쟁력을 극대화하기 위해 <span style="color: #38bdf8;">모의 면접 배틀</span>과 <span style="color: #c084fc;">실제 면접관이 참여하는 기술면접 · 임원면접</span>을 실시합니다.
        </p>

        <!-- 1. 모의 면접 배틀 안내 -->
        <div class="notice-card-box highlight-blue" style="margin: 16px 0;">
          <h4 class="notice-box-title">🔥 1. 모의 면접 배틀 (면접관 팀 vs 면접자 팀 실전 대결)</h4>
          <p class="notice-text-p" style="margin-bottom: 10px;">
            팀별로 <strong>면접관 팀</strong>과 <strong>면접자 팀</strong>으로 역할을 나누어 실제 면접장처럼 질의응답 대결을 펼치며, 면접관의 평가 시선과 지원자의 답변 전략을 동시에 익힙니다.
          </p>
          <ul class="notice-check-list">
            <li><span class="check-icon">☑️</span> <span><strong>실전 면접 &amp; 팀 대결:</strong> 면접관 팀의 날카로운 압박·꼬리 질문과 면접자 팀의 논리적 방어 및 역량 어필</span></li>
            <li><span class="check-icon">☑️</span> <span><strong>즉각적인 피드백 &amp; 역량 평가:</strong> 답변 구조, 프로젝트 근거 제시, 커뮤니케이션 태도에 대한 실시간 피드백</span></li>
          </ul>
        </div>

        <!-- 2. 기술면접 · 임원면접 안내 -->
        <div class="notice-card-box highlight-green" style="margin-bottom: 18px;">
          <h4 class="notice-box-title">💼 2. 실제 면접관과 함께하는 기술면접 · 임원면접</h4>
          <ul class="notice-check-list" style="margin-bottom: 12px;">
            <li>
              <span class="check-icon">💻</span>
              <span><strong>기술 면접 (Technical Interview):</strong> 코딩, 시스템 설계, AI 활용 개발 워크플로 및 문제 해결 역량을 심층 평가하는 실무 면접</span>
            </li>
            <li>
              <span class="check-icon">👔</span>
              <span><strong>임원 면접 (Executive Interview):</strong> 리더십, 협업 태도, 성장 잠재력과 조직 적합성(Culture Fit)을 종합 평가하는 면접</span>
            </li>
          </ul>
          <p class="notice-text-p" style="color: #fde68a; font-weight: 700; margin: 0;">
            💡 실제 현업 면접관 앞에서 본인의 프로젝트와 역량을 직접 검증받을 수 있는 소중한 기회이니 빠짐없이 꼭 참여해 주세요!
          </p>
          <div style="margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="${BASE_PATH}career_interview.html" class="notice-action-link" style="display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 8px; background: rgba(59, 130, 246, 0.22); border: 1px solid rgba(96, 165, 250, 0.45); color: #93c5fd; text-decoration: none; font-weight: 700; font-size: 0.9rem;">
              🎯 AI SW 취업면접 가이드 바로가기 →
            </a>
          </div>
        </div>

        <!-- 3. 첨부 이미지 2장 -->
        <div class="notice-attachment-wrap" style="text-align: left; margin-top: 20px;">
          <div class="attachment-label">
            <span>👇 <strong>실전 모의 면접 배틀 &amp; 기술·임원면접 안내 이미지 (2장)</strong></span>
            <span style="font-size: 0.78rem; color: #38bdf8;">클릭 시 원본 크기로 확대</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-top: 10px;">
            <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; text-align: center;">
              <div style="font-size: 0.86rem; font-weight: 800; color: #38bdf8; margin-bottom: 8px;">01. 모의 면접 배틀 (면접관 팀 vs 면접자 팀 실전 대결)</div>
              <img src="${BASE_PATH}img/notice_interview_battle.jpg" alt="모의 면접 배틀 - 면접 실전 대결" class="notice-zoomable-img" style="width: 100%; border-radius: 8px; cursor: zoom-in; transition: transform 0.2s;" data-zoom-src="${BASE_PATH}img/notice_interview_battle.jpg" />
            </div>
            <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; text-align: center;">
              <div style="font-size: 0.86rem; font-weight: 800; color: #c084fc; margin-bottom: 8px;">02. 실제 면접관과 함께하는 기술 면접 &amp; 임원 면접</div>
              <img src="${BASE_PATH}img/notice_tech_exec_interview.jpg" alt="기술 면접 및 임원 면접 안내" class="notice-zoomable-img" style="width: 100%; border-radius: 8px; cursor: zoom-in; transition: transform 0.2s;" data-zoom-src="${BASE_PATH}img/notice_tech_exec_interview.jpg" />
            </div>
          </div>
        </div>
      `
    },
    {
      id: 7,
      isMustRead: true,
      tag: '🚨 필독 공지 · 저작권 및 배포 주의',
      tagClass: 'tag-urgent',
      tabLabel: '🚨 3. [필독] 저작권/Git 배포 안내',
      title: '[공지] LMS 교육 콘텐츠 무단 복사 및 Git 배포 관련 안내',
      contentHtml: `
        <div style="margin-bottom: 18px; padding: 14px 18px; border-radius: 12px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(185, 28, 28, 0.14)); border: 1.5px solid rgba(239, 68, 68, 0.55); display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 1.45rem; line-height: 1;">⚠️</span>
          <div style="color: #fecaca; font-size: 0.96rem; font-weight: 700; line-height: 1.55;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 6px; background: #ef4444; color: #fff; font-size: 0.78rem; font-weight: 800; margin-right: 6px; vertical-align: middle;">필수 숙지</span>
            모든 수강생 여러분께서는 저작권 보호 및 외부 배포와 관련하여 아래 안내 사항을 반드시 숙지해 주시기 바랍니다.
          </div>
        </div>

        <p class="notice-text-p" style="font-size: 1.05rem; font-weight: 700; color: #f8fafc; line-height: 1.7;">
          안녕하세요.<br>
          랜딩 교육과정을 운영하고 있는 이호준 교수입니다.
        </p>

        <p class="notice-text-p" style="font-size: 0.98rem; color: #e2e8f0; line-height: 1.78;">
          현재 여러분이 학습하고 있는 LMS 내 교육 콘텐츠는 <strong style="color: #fff;">에듀니티랩에서 개발하고 제공하는 교육 자산</strong>으로, <strong style="color: #fca5a5;">저작권 보호를 받는 자료</strong>입니다.
        </p>

        <p class="notice-text-p" style="font-size: 0.98rem; color: #e2e8f0; line-height: 1.78;">
          따라서 교육과정에서 제공되는 콘텐츠를 사전 허가 없이 복사하거나 <strong style="color: #fde68a;">GitHub, 개인 블로그, 외부 웹사이트 등</strong>에 게시 또는 배포하는 행위는 <strong style="color: #fca5a5; text-decoration: underline; text-underline-offset: 4px;">저작권 침해 등 법적 문제가 발생할 수 있습니다.</strong>
        </p>

        <!-- 엄격 금지 사항 (강조 박스) -->
        <div class="notice-card-box highlight-red" style="border: 1px solid rgba(239, 68, 68, 0.45); border-left: 4px solid #ef4444; background: linear-gradient(90deg, rgba(239, 68, 68, 0.14), rgba(20, 25, 38, 0.92)); margin: 18px 0;">
          <h4 class="notice-box-title" style="color: #fca5a5; font-size: 1.06rem; margin-bottom: 12px;">
            ⛔ 특히 다음 사항에 유의해 주시기 바랍니다 (무단 공개·배포 금지)
          </h4>
          <ul class="notice-check-list" style="gap: 10px;">
            <li style="padding: 10px 14px; border-radius: 10px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25);">
              <span class="check-icon" style="color: #f87171;">🚫</span>
              <span style="color: #fef2f2; font-weight: 600;">LMS의 <strong>교육자료, 실습 가이드, 교육카드 등</strong>을 무단으로 복사하여 외부에 공개하는 행위</span>
            </li>
            <li style="padding: 10px 14px; border-radius: 10px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25);">
              <span class="check-icon" style="color: #f87171;">🚫</span>
              <span style="color: #fef2f2; font-weight: 600;">교육 콘텐츠를 <strong>GitHub 등의 공개 저장소(Public Repository)에 그대로 업로드</strong>하는 행위</span>
            </li>
            <li style="padding: 10px 14px; border-radius: 10px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25);">
              <span class="check-icon" style="color: #f87171;">🚫</span>
              <span style="color: #fef2f2; font-weight: 600;">교육자료를 <strong>개인 블로그나 외부 사이트에 무단으로 게시하거나 재배포</strong>하는 행위</span>
            </li>
          </ul>
        </div>

        <!-- 허용 범위 및 주의사항 -->
        <div class="notice-card-box highlight-green" style="margin-bottom: 18px;">
          <h4 class="notice-box-title" style="color: #6ee7b7;">
            ✅ 직접 작성한 소스코드 · 개인 프로젝트 공유 안내
          </h4>
          <p class="notice-text-p" style="color: #ecfdf5; margin-bottom: 8px; line-height: 1.72;">
            다만, 교육과정에서 <strong>직접 작성한 소스코드나 개인 프로젝트 결과물을 GitHub에 업로드하고 공유하는 것은 가능</strong>합니다.
          </p>
          <p class="notice-text-p" style="color: #fde68a; font-weight: 700; margin: 0; line-height: 1.7;">
            💡 이 경우에도 <strong>에듀니티랩의 교육 콘텐츠(강의 교안, 가이드 문서, 원본 템플릿 등)가 함께 포함되지 않도록</strong> 각별히 주의해 주시기 바랍니다.
          </p>
        </div>

        <p class="notice-text-p" style="font-size: 0.98rem; color: #e2e8f0; line-height: 1.75;">
          본 교육과정은 여러분의 AI·SW 개발 역량 향상을 위해 제공되는 만큼, 교육 콘텐츠의 저작권을 존중하고 올바르게 활용해 주시기를 부탁드립니다.
        </p>

        <div class="notice-author-sign" style="margin-top: 18px;">
          <p class="notice-text-p" style="margin-bottom: 4px;">감사합니다.</p>
          <p class="notice-text-p" style="font-weight: 800; color: #f8fafc; font-size: 1.02rem;">이호준 교수 드림</p>
        </div>
      `
    },
    {
      id: 9,
      tag: '온라인 학습',
      tagClass: 'tag-urgent',
      tabLabel: '📢 4. 11/10 온라인 학습 안내',
      title: '📢 [SW랜딩] 11월 10일(화) 온라인 학습 안내',
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
            💡 LMS 접속부터 과제 제출까지 <strong>4시간</strong>을 채우고, 학습과 제출을 모두 <strong>11월 10일(화) 안에 완료</strong>해 주세요.
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
              <span><strong>「5~10day 과제」</strong> → <strong>「Day 8 (2개)」</strong> 중 택 1</span>
            </li>
            <li>
              <span class="check-icon">2️⃣</span>
              <span><strong>「코덱스 현업 과제」</strong> → <strong>「개발운영」</strong> 중 택 1</span>
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
              <img src="${BASE_PATH}img/notice_online_learning_guide_1110_02.png?v=20261110_01" alt="02 과제 선택 안내 (Day 8 및 개발운영)" class="notice-zoomable-img" style="width: 100%; border-radius: 8px; cursor: zoom-in; transition: transform 0.2s;" data-zoom-src="${BASE_PATH}img/notice_online_learning_guide_1110_02.png?v=20261110_01" />
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
      id: 8,
      tag: '3주차 교육 안내 · gstack 실습',
      tagClass: 'tag-faculty',
      tabLabel: '⚡ 5. [3주차] gstack 프로젝트 실습 안내',
      title: '📢 [3주차 교육 안내] gstack을 활용한 프로젝트 설계·진행 강의 및 실습',
      contentHtml: `
        <p class="notice-text-p" style="font-size: 1.05rem; font-weight: 700; color: #f8fafc; line-height: 1.7;">
          안녕하세요. 랜딩 과정을 운영하고 있는 이호준 교수입니다.
        </p>

        <p class="notice-text-p" style="font-size: 0.98rem; color: #e2e8f0; line-height: 1.78;">
          이번 교육에서는 <strong style="color: #38bdf8;">gstack을 활용한 AI 기반 프로젝트 설계 및 개발 프로세스</strong>를 학습하고, 직접 실습하는 시간을 갖습니다.
        </p>

        <p class="notice-text-p" style="font-size: 0.98rem; color: #e2e8f0; line-height: 1.78;">
          AI Agent를 활용한 개발은 단순히 AI에게 코드를 작성하도록 요청하는 것이 아닙니다. <strong style="color: #fff;">프로젝트를 기획하고, 요구사항을 분석하며, 설계부터 구현·검증까지 전체 개발 과정을 체계적으로 관리하는 역량</strong>이 중요합니다.
        </p>

        <p class="notice-text-p" style="font-size: 0.98rem; color: #e2e8f0; line-height: 1.78;">
          이번 시간에는 gstack을 활용하여 실제 개발 현장에서 이루어지는 프로젝트 진행 과정을 경험해 보겠습니다.
        </p>

        <!-- 주요 교육 내용 -->
        <div class="notice-card-box highlight-blue" style="margin: 18px 0;">
          <h4 class="notice-box-title">■ 주요 교육 내용</h4>
          <ul class="notice-check-list" style="gap: 10px;">
            <li>
              <span class="check-icon">01</span>
              <span><strong>gstack의 개념과 AI 기반 개발 워크플로 이해</strong></span>
            </li>
            <li>
              <span class="check-icon">02</span>
              <span><strong>프로젝트 아이디어 구체화 및 요구사항 분석</strong></span>
            </li>
            <li>
              <span class="check-icon">03</span>
              <span><strong>AI Agent를 활용한 프로젝트 구조 설계</strong></span>
            </li>
            <li>
              <span class="check-icon">04</span>
              <span><strong>역할별 검토와 피드백을 통한 개발 과정 개선</strong></span>
            </li>
            <li>
              <span class="check-icon">05</span>
              <span><strong>실제 프로젝트에 적용하는 실습 및 결과 공유</strong></span>
            </li>
          </ul>
        </div>

        <!-- 교육 목표 -->
        <div class="notice-card-box highlight-green" style="margin-bottom: 18px;">
          <h4 class="notice-box-title">■ 교육 목표</h4>
          <p class="notice-text-p" style="color: #ecfdf5; font-weight: 600; margin-bottom: 10px; line-height: 1.75;">
            AI가 코드를 만들어 주는 수준을 넘어, <strong style="color: #6ee7b7;">AI를 활용해 프로젝트 전체를 설계하고, 개발 과정을 주도하며, 결과물을 스스로 검증할 수 있는 역량</strong>을 기르는 것입니다.
          </p>
          <p class="notice-text-p" style="color: #fde68a; font-weight: 600; margin: 0; line-height: 1.7;">
            💡 이번 교육도 이론보다는 <strong>실습 중심(Hands-on)</strong>으로 진행됩니다.
          </p>
          <div style="margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="${BASE_PATH}real-project-gstack/index.html" class="notice-action-link" style="display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 8px; background: rgba(6, 182, 212, 0.22); border: 1px solid rgba(34, 211, 238, 0.45); color: #67e8f9; text-decoration: none; font-weight: 700; font-size: 0.9rem;">
              ⚡ Real Project gstack 강의실 바로가기 →
            </a>
          </div>
        </div>

        <p class="notice-text-p" style="font-size: 0.98rem; color: #e2e8f0; line-height: 1.75;">
          여러분이 AI 시대의 개발자로 성장하기 위해 필요한 실무 역량을 직접 경험하는 시간이 되기를 바랍니다.<br>
          적극적인 참여 부탁드립니다.
        </p>

        <!-- 첨부 인포그래픽 이미지 -->
        <div class="notice-attachment-wrap" style="text-align: center; margin-top: 18px;">
          <div class="attachment-label">
            <span>📎 첨부파일: <strong>3주차 교육 안내 — GStack을 활용한 프로젝트 설계·진행 강의 및 실습</strong></span>
            <span style="font-size: 0.78rem; color: #38bdf8;">클릭 시 원본 크기로 확대</span>
          </div>
          <div style="background: rgba(0,0,0,0.32); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px; display: inline-block; max-width: 100%;">
            <img src="${BASE_PATH}img/notice_gstack_week3_guide.png" alt="3주차 교육 안내 - GStack을 활용한 프로젝트 설계·진행 강의 및 실습" class="notice-team-img notice-zoomable-img" style="max-height: 580px; width: auto; max-width: 100%; border-radius: 10px; cursor: zoom-in; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" data-zoom-src="${BASE_PATH}img/notice_gstack_week3_guide.png" title="클릭하여 원본 크기로 보기" />
          </div>
        </div>

        <div class="notice-author-sign" style="margin-top: 18px;">
          <p class="notice-text-p" style="margin-bottom: 4px;">감사합니다.</p>
          <p class="notice-text-p" style="font-weight: 800; color: #f8fafc; font-size: 1.02rem;">이호준 교수 드림</p>
        </div>
      `
    },
    {
      id: 6,
      tag: '온라인 학습',
      tagClass: 'tag-urgent',
      tabLabel: '📢 6. 11/3 온라인 학습 안내',
      title: '📢 [SW랜딩] 11월 3일(화) 온라인 학습 안내',
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
            💡 LMS 접속부터 과제 제출까지 <strong>4시간</strong>을 채우고, 학습과 제출을 모두 <strong>11월 3일(화) 안에 완료</strong>해 주세요.
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
              <span><strong>「1~5day 과제」</strong> → <strong>「Day 5 (2개)」</strong> 중 택 1</span>
            </li>
            <li>
              <span class="check-icon">2️⃣</span>
              <span><strong>「코덱스 현업 과제」</strong> → <strong>「협업」</strong> 중 택 1</span>
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
              <img src="${BASE_PATH}img/notice_online_learning_guide_1103_02.png?v=20261103_02" alt="02 과제 선택 안내 (Day 5 및 협업)" class="notice-zoomable-img" style="width: 100%; border-radius: 8px; cursor: zoom-in; transition: transform 0.2s;" data-zoom-src="${BASE_PATH}img/notice_online_learning_guide_1103_02.png?v=20261103_02" />
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
      id: 5,
      tag: '팀 편성',
      tagClass: 'tag-urgent',
      tabLabel: '👥 7. 팀 재배정 안내',
      title: '📢 [2026 SW 랜딩] 팀 재배정 안내',
      contentHtml: `
        <p class="notice-text-p" style="font-size: 1.05rem; font-weight: 700; color: #f8fafc; line-height: 1.7;">
          안녕하세요, SW랜딩 운영팀입니다! 🙌<br>
          <span style="color: #38bdf8;">추가된 학습성향조사 데이터를 반영하여 팀을 다시 배정하게 되었습니다.</span>
        </p>

        <p class="notice-text-p" style="font-size: 0.98rem; color: #cbd5e1; line-height: 1.7;">
          개인별 학습성향을 분석하여 동료학습 시너지를 낼 수 있도록 팀을 구성하였으니, 아래 명단 및 첨부된 이미지에서 본인 팀을 확인해 주세요. 🙌
        </p>

        <!-- 팀 배정 요약 카드 (텍스트 명단) -->
        <div class="notice-card-box highlight-blue" style="margin: 18px 0;">
          <h4 class="notice-box-title" style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
            <span>📋 재배정 팀 명단 (총 4개 팀)</span>
            <span style="font-size: 0.78rem; color: #94a3b8; font-weight: 500;">학습성향조사 반영</span>
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px;">
            <div style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: 10px; padding: 12px 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <strong style="color: #60a5fa; font-size: 1.02rem;">1팀</strong>
                <span style="font-size: 0.76rem; background: rgba(59, 130, 246, 0.2); color: #93c5fd; padding: 2px 7px; border-radius: 999px;">4명</span>
              </div>
              <div style="font-size: 0.95rem; color: #f1f5f9; font-weight: 600; line-height: 1.6;">
                석지윤 · 김예찬 · 허동후 · 손영준
              </div>
            </div>
            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 10px; padding: 12px 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <strong style="color: #34d399; font-size: 1.02rem;">2팀</strong>
                <span style="font-size: 0.76rem; background: rgba(16, 185, 129, 0.2); color: #a7f3d0; padding: 2px 7px; border-radius: 999px;">4명</span>
              </div>
              <div style="font-size: 0.95rem; color: #f1f5f9; font-weight: 600; line-height: 1.6;">
                강모세 · 김나연 · 서상호 · 김지훈
              </div>
            </div>
            <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 10px; padding: 12px 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <strong style="color: #fbbf24; font-size: 1.02rem;">3팀</strong>
                <span style="font-size: 0.76rem; background: rgba(245, 158, 11, 0.2); color: #fde68a; padding: 2px 7px; border-radius: 999px;">4명</span>
              </div>
              <div style="font-size: 0.95rem; color: #f1f5f9; font-weight: 600; line-height: 1.6;">
                권태주 · 유승혁 · 하정무 · 은대영
              </div>
            </div>
            <div style="background: rgba(244, 63, 94, 0.08); border: 1px solid rgba(244, 63, 94, 0.25); border-radius: 10px; padding: 12px 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <strong style="color: #fb7185; font-size: 1.02rem;">4팀</strong>
                <span style="font-size: 0.76rem; background: rgba(244, 63, 94, 0.2); color: #fecdd3; padding: 2px 7px; border-radius: 999px;">4명</span>
              </div>
              <div style="font-size: 0.95rem; color: #f1f5f9; font-weight: 600; line-height: 1.6;">
                이진녕 · 김예원 · 류승지 · 이지민
              </div>
            </div>
          </div>
        </div>

        <!-- 소통과 협력 안내 -->
        <div class="notice-card-box highlight-amber" style="margin-bottom: 18px;">
          <h4 class="notice-box-title">🤝 팀 소통 및 협력 안내</h4>
          <p class="notice-text-p" style="margin: 0; color: #fde68a; line-height: 1.7;">
            이전에 안내드린 팀 구성과 달라진 점 양해 부탁드리며, 앞으로 팀원들과 활발히 소통하고 협력하며 좋은 결과 만들어가시길 바랍니다!
          </p>
        </div>

        <!-- 첨부 이미지 -->
        <div class="notice-attachment-wrap" style="text-align: center; margin-top: 18px;">
          <div class="attachment-label">
            <span>📎 첨부파일: <strong>[2026 SW 랜딩] 팀 재배정 안내표</strong></span>
            <span style="font-size: 0.78rem; color: #38bdf8;">클릭 시 원본 크기로 확대</span>
          </div>
          <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px; display: inline-block; max-width: 100%;">
            <img src="${BASE_PATH}img/notice_team_reassignment.png" alt="[2026 SW 랜딩] 팀 재배정 안내표" class="notice-team-img notice-zoomable-img" style="max-height: 520px; width: auto; max-width: 100%; border-radius: 10px; cursor: zoom-in; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" data-zoom-src="${BASE_PATH}img/notice_team_reassignment.png" title="클릭하여 원본 크기로 보기" />
          </div>
        </div>

        <div class="notice-author-sign">
          <p class="notice-text-p" style="margin-bottom: 4px;">
            문의사항은 언제든 편하게 DM 주세요. 😊
          </p>
          <p class="notice-text-p" style="font-weight: 700; color: #38bdf8;">
            2026 SW 랜딩 운영팀 드림
          </p>
        </div>
      `
    },
    {
      id: 4,
      tag: '온라인 학습',
      tagClass: 'tag-urgent',
      tabLabel: '📢 8. 10/27 온라인 학습 안내',
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
      tabLabel: '🚗 9. 교육시설/주차 안내',
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
      tabLabel: '👥 10. 초기 팀 구성 안내',
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
            <span>📎 첨부파일: <strong>2026 SW랜딩 초기 팀 구성 표</strong></span>
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
      tabLabel: '🚀 11. 모듈 1 학습 안내',
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
      <button type="button" class="notice-tab-btn ${idx === 0 ? 'is-active' : ''}" data-slide-index="${idx}" style="${notice.isMustRead ? 'border-color: rgba(239, 68, 68, 0.55);' : ''}">
        ${notice.isMustRead ? '<span class="notice-tab-badge-new" style="background: #ef4444; color: #fff;">필독</span>' : (notice.isNew ? '<span class="notice-tab-badge-new">NEW</span>' : '')}
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

      <!-- Image Lightbox for zooming notice images -->
      <div class="notice-lightbox-overlay" id="noticeLightboxOverlay">
        <img src="${BASE_PATH}img/notice_online_learning_guide_01.png" alt="공지 이미지 확대" class="notice-lightbox-img" />
      </div>
    `;

    document.body.appendChild(backdrop);

    // Update notice badges across page
    document.querySelectorAll('.notice-badge').forEach((badge) => {
      badge.textContent = NOTICES_DATA.length;
    });

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

  const DONT_SHOW_STORAGE_KEY = 'swlanding_notice_hide_20261113_interview_method';

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
    document.querySelectorAll('.notice-badge').forEach((badge) => {
      badge.textContent = NOTICES_DATA.length;
    });
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
