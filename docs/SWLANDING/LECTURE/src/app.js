document.addEventListener('DOMContentLoaded', async () => {
  // --- Load Session Files Dynamically ---
  async function loadSessions() {
    const wrapper = document.querySelector('.slides-wrapper');
    if (wrapper.querySelectorAll('.slide-card').length > 0) {
      return; // Skip fetching if slides are already inlined
    }

    const sessions = [
      'session/session1.html',
      'session/session2.html',
      'session/session3.html',
      'session/session4.html',
      'session/session5.html',
      'session/session6.html',
      'session/session7.html',
      'session/session8.html',
      'session/session9.html',
      'session/session10.html'
    ];
    
    const fetches = sessions.map(file => fetch(file).then(r => {
      if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
      return r.text();
    }));
    
    try {
      const htmlContents = await Promise.all(fetches);
      htmlContents.forEach((html, sessionIndex) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const slideCards = tempDiv.querySelectorAll('.slide-card');
        slideCards.forEach(card => {
          card.classList.add(`session-${sessionIndex + 1}`);
          wrapper.appendChild(card);
        });
      });
    } catch (error) {
      console.error('Error loading session files:', error);
      
      // Render a premium looking CORS warning modal / banner
      const errorDiv = document.createElement('div');
      errorDiv.id = 'cors-warning-overlay';
      errorDiv.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(15, 23, 42, 0.95);
        display: flex; justify-content: center; align-items: center;
        z-index: 99999;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #f8fafc;
        padding: 20px;
        box-sizing: border-box;
      `;
      errorDiv.innerHTML = `
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; max-width: 500px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; transform: translateY(0); transition: all 0.3s ease;">
          <div style="background: rgba(239, 68, 68, 0.15); width: 64px; height: 64px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 24px;">
            <svg style="width: 32px; height: 32px; fill: #ef4444;" viewBox="0 0 24 24">
              <path d="M12,2L1,21H23L12,2M12,6L19.53,19H4.47L12,6M11,10V14H13V10H11M11,16V18H13V16H11Z"/>
            </svg>
          </div>
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #f1f5f9;">슬라이드 데이터를 불러올 수 없습니다</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; text-align: left;">
            현재 파일 시스템 프로토콜(<code>file://</code>)을 통해 브라우저로 직접 실행했거나 웹 서버 환경이 구성되지 않아 브라우저 보안 정책(CORS)에 의해 파일 로드가 차단되었습니다.
          </p>
          <div style="background: #0f172a; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: left; font-size: 13px; line-height: 1.5; border: 1px solid #1e293b;">
            <strong style="color: #38bdf8; display: block; margin-bottom: 8px;">해결 방법:</strong>
            1. VS Code가 켜져 있다면, 우측 하단의 <strong style="color: #fb7185;">Go Live</strong> (Live Server) 버튼을 클릭하세요.<br>
            2. 또는 터미널에서 아래 명령어로 로컬 서버를 구동해 실행하세요:<br>
            <code style="background: #1e293b; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 6px; color: #e2e8f0; font-family: monospace;">python -m http.server 8000</code>
          </div>
          <p style="font-size: 11px; color: #64748b; margin-top: 16px;">상세 로그: ${error.message}</p>
        </div>
      `;
      document.body.appendChild(errorDiv);
      throw error; // stop execution
    }
  }

  await loadSessions();

  // --- State Initialization ---
  const state = {
    currentSlide: 0,
    viewMode: 'presentation', // 'presentation' | 'dashboard'
    theme: 'dark',
    isDrawing: false,
    drawerOpen: false,
    timer: {
      secondsLeft: 0,
      intervalId: null,
      isRunning: false
    }
  };

  // --- Element Selectors ---
  const slides = document.querySelectorAll('.slide-card');

  // Inject page numbers into slides dynamically
  slides.forEach((slide, index) => {
    const pageNum = document.createElement('div');
    pageNum.className = 'slide-page-number';
    pageNum.textContent = index + 1;
    slide.appendChild(pageNum);
  });

  const progressBar = document.querySelector('.progress-bar');
  const slideProgressText = document.querySelector('.slide-progress-info');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const toggleViewBtn = document.getElementById('toggle-view');
  const printPdfBtn = document.getElementById('print-pdf');

  const presentationViewport = document.querySelector('.slides-wrapper');
  const dashboardViewport = document.querySelector('.dashboard-viewport');
  const searchInput = document.getElementById('search-slides');
  const cardsGrid = document.querySelector('.cards-grid');

  // Drawer / Presenter Tools
  const toolsToggle = document.getElementById('toggle-tools');
  const toolsDrawer = document.getElementById('tools-drawer');
  const themeToggle = document.getElementById('toggle-theme');
  const drawingToggle = document.getElementById('toggle-drawing');
  const clearDrawingBtn = document.getElementById('clear-drawing');
  const scriptDisplay = document.getElementById('script-display');
  const visualDisplay = document.getElementById('visual-display');

  // Timer Elements
  const timerDisplay = document.querySelector('.timer-display');
  const timerStartBtn = document.getElementById('timer-start');
  const timerResetBtn = document.getElementById('timer-reset');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const flashScreen = document.getElementById('flash-screen');

  // Drawing Canvas
  const drawingCanvas = document.getElementById('drawing-canvas');
  const ctx = drawingCanvas.getContext('2d');
  let isDrawingActive = false;
  let lastX = 0;
  let lastY = 0;

  // --- Dynamic Slide Viewport Scaling ---
  function resizeSlides() {
    const mainViewport = document.querySelector('.main-viewport');
    const wrapper = document.querySelector('.slides-wrapper');
    if (!mainViewport || !wrapper) return;

    if (window.innerWidth <= 768) {
      // Mobile vertical scroll mode: clear dynamic scaling
      wrapper.style.transform = '';
      wrapper.style.width = '';
      wrapper.style.height = '';
      return;
    }

    // Design resolution reference
    const designWidth = 1366;
    const designHeight = 768;

    // Viewport padding (defined in CSS: 55px top, 95px bottom, 20px left/right)
    const paddingX = 40; // 20px * 2
    const paddingY = 150; // 55px top + 95px bottom

    const availableWidth = mainViewport.clientWidth - paddingX;
    const availableHeight = mainViewport.clientHeight - paddingY;

    // Calculate scale factor to fit the slides-wrapper within available space
    const scale = Math.min(availableWidth / designWidth, availableHeight / designHeight);

    // Apply explicit sizing and scaling transform
    wrapper.style.width = `${designWidth}px`;
    wrapper.style.height = `${designHeight}px`;
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.transformOrigin = 'center center';
    wrapper.style.flexShrink = '0';
  }

  // --- Initialize Canvas Resolution ---
  function resizeCanvas() {
    drawingCanvas.width = drawingCanvas.parentElement.clientWidth;
    drawingCanvas.height = drawingCanvas.parentElement.clientHeight;
    // Retain canvas drawings on resize isn't strictly necessary for a simple pointer pen, 
    // but resetting size clears context variables.
    ctx.strokeStyle = '#f72585';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  // Combined resize handler
  function handleResize() {
    resizeSlides();
    resizeCanvas();
  }

  window.addEventListener('resize', handleResize);
  // Initial size deferred slightly until slide-cards lay out
  setTimeout(handleResize, 300);

  // --- View Control (Presentation vs Dashboard) ---
  function setViewMode(mode) {
    state.viewMode = mode;
    const appContainer = document.querySelector('.app-container');
    if (mode === 'presentation') {
      if (appContainer) appContainer.classList.remove('dashboard-mode');
      presentationViewport.style.display = 'flex';
      dashboardViewport.style.display = 'none';
      document.querySelector('.navigation-bar').style.display = 'flex';
      toggleViewBtn.classList.remove('active');
      toggleViewBtn.innerHTML = `
        <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
          <path d="M4,4H20V12H4V4M4,14H11V20H4V14M13,14H20V20H13V14Z" />
        </svg>
        대시보드 <span class="badge">Esc</span>
      `;
      // Close draw mode and drawer when leaving dashboard just to be clean
      handleResize();
    } else {
      if (appContainer) appContainer.classList.add('dashboard-mode');
      presentationViewport.style.display = 'none';
      dashboardViewport.style.display = 'block';
      document.querySelector('.navigation-bar').style.display = 'none';
      toggleViewBtn.classList.add('active');
      toggleViewBtn.innerHTML = `
        <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
          <path d="M21,16V4H3V16H21M21,2H3C1.89,2 1,2.89 1,4V16C1,17.1 1.89,18 3,18H10V20H8V22H16V20H14V18H21C22.1,18 23,17.1 23,16V4C23,2.89 22.1,2 21,2Z" />
        </svg>
        슬라이드보기 <span class="badge">Esc</span>
      `;
      // Render dashboard cards
      renderDashboard();
    }
  }

  toggleViewBtn.addEventListener('click', () => {
    setViewMode(state.viewMode === 'presentation' ? 'dashboard' : 'presentation');
  });

  if (printPdfBtn) {
    printPdfBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --- Mouse Wheel & Touch Scroll Navigation (Presentation View) ---
  let wheelTimeout = null;
  window.addEventListener('wheel', (e) => {
    if (state.viewMode !== 'presentation') return;
    if (state.drawerOpen || state.isDrawing) return;

    // Avoid hijacking scroll inside code boxes or presenter notes
    const scrollable = e.target.closest('.code-container, .presenter-tools-drawer, .script-display-box');
    if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
      return;
    }

    if (wheelTimeout) return;

    if (e.deltaY > 15 || e.deltaX > 15) {
      nextSlide();
      wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 300);
    } else if (e.deltaY < -15 || e.deltaX < -15) {
      prevSlide();
      wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 300);
    }
  }, { passive: true });

  let touchStartX = 0;
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (state.viewMode !== 'presentation') return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (state.viewMode !== 'presentation') return;
    if (state.drawerOpen || state.isDrawing) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        nextSlide();
      } else if (deltaX > 0) {
        prevSlide();
      }
    }
  }, { passive: true });

  // --- Presenter Drawer Toggle ---
  toolsToggle.addEventListener('click', () => {
    state.drawerOpen = !state.drawerOpen;
    if (state.drawerOpen) {
      toolsDrawer.classList.add('open');
      toolsToggle.style.borderColor = 'var(--accent-cyan)';
    } else {
      toolsDrawer.classList.remove('open');
      toolsToggle.style.borderColor = '';
    }
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (state.drawerOpen && !toolsDrawer.contains(e.target) && !toolsToggle.contains(e.target)) {
      state.drawerOpen = false;
      toolsDrawer.classList.remove('open');
      toolsToggle.style.borderColor = '';
    }
  });

  // --- Theme Control (Dark/Light) ---
  function setTheme(theme) {
    state.theme = theme;
    document.body.setAttribute('data-theme', theme);
    if (theme === 'light') {
      themeToggle.classList.add('active');
      themeToggle.querySelector('.btn-text').textContent = '다크 모드 전환';
    } else {
      themeToggle.classList.remove('active');
      themeToggle.querySelector('.btn-text').textContent = '발표용 라이트 모드';
    }
  }

  themeToggle.addEventListener('click', () => {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  // --- Slide Navigation Logic ---
  function showSlide(index) {
    if (index < 0 || index >= slides.length) return;

    // Deactivate current slide
    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev');
      if (idx < index) {
        slide.classList.add('prev');
      }
    });

    state.currentSlide = index;
    slides[index].classList.add('active');

    // Update hash router
    window.location.hash = `slide-${index + 1}`;

    // Update Navigation UI
    const progressPercent = ((index + 1) / slides.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    slideProgressText.textContent = `${index + 1} / ${slides.length}`;

    // Disable boundary navigation buttons
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;

    // Reset drawing layer between slides to prevent annotations bleeding across slides
    clearCanvas();

    // Update Presenter Notes and Visual Guide in tools drawer
    const activeSlide = slides[index];
    const scriptEl = activeSlide.querySelector('.presenter-notes');
    const visualEl = activeSlide.querySelector('.visual-guide-notes');

    if (scriptDisplay) {
      scriptDisplay.textContent = scriptEl ? scriptEl.textContent.trim() : '발표자 대본이 작성되지 않았습니다.';
    }
    if (visualDisplay) {
      visualDisplay.textContent = visualEl ? visualEl.textContent.trim() : '시각화 가이드가 작성되지 않았습니다.';
    }
  }

  function nextSlide() {
    if (state.currentSlide < slides.length - 1) {
      showSlide(state.currentSlide + 1);
    }
  }

  function prevSlide() {
    if (state.currentSlide > 0) {
      showSlide(state.currentSlide - 1);
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // If typing in search box, ignore navigation hotkeys
    if (document.activeElement === searchInput) {
      if (e.key === 'Escape') {
        searchInput.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ': // Spacebar
        if (state.viewMode === 'presentation' && !state.isDrawing) {
          e.preventDefault();
          nextSlide();
        }
        break;
      case 'ArrowLeft':
      case 'PageUp':
        if (state.viewMode === 'presentation' && !state.isDrawing) {
          e.preventDefault();
          prevSlide();
        }
        break;
      case 'Home':
        if (state.viewMode === 'presentation') {
          e.preventDefault();
          showSlide(0);
        }
        break;
      case 'End':
        if (state.viewMode === 'presentation') {
          e.preventDefault();
          showSlide(slides.length - 1);
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (state.isDrawing) {
          toggleDrawingMode(false);
        } else {
          setViewMode(state.viewMode === 'presentation' ? 'dashboard' : 'presentation');
        }
        break;
      case 'd':
      case 'D':
        if (e.ctrlKey) {
          e.preventDefault();
          setViewMode(state.viewMode === 'presentation' ? 'dashboard' : 'presentation');
        }
        break;
      case 'p':
      case 'P':
        // Ctrl+P is standard print, let's avoid overriding it if Ctrl is pressed
        if (!e.ctrlKey && state.viewMode === 'presentation') {
          e.preventDefault();
          toggleDrawingMode(!state.isDrawing);
        }
        break;
      case 't':
      case 'T':
        if (!e.ctrlKey) {
          e.preventDefault();
          toolsToggle.click();
        }
        break;
    }
  });

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // --- Hash Route Loading ---
  function parseHash() {
    const hash = window.location.hash;
    const match = hash.match(/^#slide-(\d+)$/);
    if (match) {
      const slideNum = parseInt(match[1], 10) - 1;
      if (slideNum >= 0 && slideNum < slides.length) {
        showSlide(slideNum);
        setViewMode('presentation');
        return;
      }
    }
    showSlide(0);
  }

  window.addEventListener('hashchange', parseHash);
  parseHash(); // Trigger on initial load

  // --- Drawing Board Logic (Instructor Pointer Pen) ---
  function toggleDrawingMode(active) {
    state.isDrawing = active;
    const canvasLayer = document.querySelector('.drawing-canvas-layer');
    const drawingIndicator = document.getElementById('drawing-indicator');

    if (active) {
      canvasLayer.classList.add('drawing-active');
      drawingToggle.classList.add('active');
      drawingToggle.querySelector('.btn-text').textContent = '포인터 펜 끄기 (P)';
      drawingIndicator.style.display = 'block';
      isDrawingActive = true;
    } else {
      canvasLayer.classList.remove('drawing-active');
      drawingToggle.classList.remove('active');
      drawingToggle.querySelector('.btn-text').textContent = '포인터 펜 켜기 (P)';
      drawingIndicator.style.display = 'none';
      isDrawingActive = false;
    }
  }

  drawingToggle.addEventListener('click', () => {
    toggleDrawingMode(!state.isDrawing);
  });

  function clearCanvas() {
    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  }

  clearDrawingBtn.addEventListener('click', clearCanvas);

  // Drawing event handlers
  let drawing = false;

  function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) * (canvas.width / rect.width),
      y: (evt.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function startDrawing(e) {
    if (!isDrawingActive) return;
    drawing = true;
    const pos = getMousePos(drawingCanvas, e);
    [lastX, lastY] = [pos.x, pos.y];
  }

  function draw(e) {
    if (!drawing || !isDrawingActive) return;
    const pos = getMousePos(drawingCanvas, e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    [lastX, lastY] = [pos.x, pos.y];
  }

  function stopDrawing() {
    drawing = false;
  }

  drawingCanvas.addEventListener('mousedown', startDrawing);
  drawingCanvas.addEventListener('mousemove', draw);
  drawingCanvas.addEventListener('mouseup', stopDrawing);
  drawingCanvas.addEventListener('mouseout', stopDrawing);

  // --- Countdown Timer Logic ---
  function updateTimerDisplay() {
    const mins = Math.floor(state.timer.secondsLeft / 60);
    const secs = state.timer.secondsLeft % 60;
    const displayStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    timerDisplay.textContent = displayStr;

    if (state.timer.secondsLeft <= 30 && state.timer.secondsLeft > 0) {
      timerDisplay.classList.add('timer-warning');
    } else {
      timerDisplay.classList.remove('timer-warning');
    }
  }

  function startTimer() {
    if (state.timer.secondsLeft <= 0) return;

    state.timer.isRunning = true;
    timerStartBtn.classList.remove('active-play');
    timerStartBtn.classList.add('active-pause');
    timerStartBtn.textContent = '일시 정지';

    state.timer.intervalId = setInterval(() => {
      state.timer.secondsLeft--;
      updateTimerDisplay();

      if (state.timer.secondsLeft <= 0) {
        clearInterval(state.timer.intervalId);
        state.timer.isRunning = false;
        triggerTimerFlash();
        resetTimerUI();
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(state.timer.intervalId);
    state.timer.isRunning = false;
    timerStartBtn.classList.remove('active-pause');
    timerStartBtn.classList.add('active-play');
    timerStartBtn.textContent = '타이머 시작';
  }

  function resetTimerUI() {
    timerStartBtn.classList.remove('active-pause');
    timerStartBtn.classList.add('active-play');
    timerStartBtn.textContent = '타이머 시작';
  }

  function triggerTimerFlash() {
    // Flash background for visual alarm
    flashScreen.style.display = 'block';

    // Play alert sound if user allowed audio context
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, 800);
    } catch (err) {
      console.log('Audio Context not allowed or initialized yet.', err);
    }

    setTimeout(() => {
      flashScreen.style.display = 'none';
    }, 3000);
  }

  timerStartBtn.addEventListener('click', () => {
    if (state.timer.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  timerResetBtn.addEventListener('click', () => {
    clearInterval(state.timer.intervalId);
    state.timer.isRunning = false;
    state.timer.secondsLeft = 0;
    updateTimerDisplay();
    resetTimerUI();
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mins = parseInt(btn.getAttribute('data-mins'), 10);
      clearInterval(state.timer.intervalId);
      state.timer.isRunning = false;
      state.timer.secondsLeft = mins * 60;
      updateTimerDisplay();
      resetTimerUI();
    });
  });

  updateTimerDisplay();

  // --- Copy Prompt Code Block Logic ---
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('copy-btn')) {
      const btn = e.target;
      const codeBlock = btn.closest('.code-container').querySelector('.code-block');
      const textToCopy = codeBlock.textContent.trim();

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.textContent;
        btn.textContent = '복사 완료!';
        btn.classList.add('copied');

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  });

  // --- Dashboard Rendering and Filtering ---
  function renderDashboard(filterQuery = '') {
    cardsGrid.innerHTML = '';
    const lowercaseQuery = filterQuery.toLowerCase();
    let matchesCount = 0;

    slides.forEach((slide, idx) => {
      const titleEl = slide.querySelector('.slide-title');
      const categoryEl = slide.querySelector('.slide-category');
      const title = titleEl ? titleEl.textContent : '슬라이드';
      const category = categoryEl ? categoryEl.textContent : '구분 없음';

      // Get some description preview text from slide body
      let desc = '';
      const paragraphs = slide.querySelectorAll('.slide-body p, .slide-body li');
      if (paragraphs.length > 0) {
        desc = Array.from(paragraphs)
          .slice(0, 2)
          .map(p => p.textContent)
          .join(' ')
          .substring(0, 100) + '...';
      }

      // Check filters
      if (
        title.toLowerCase().includes(lowercaseQuery) ||
        category.toLowerCase().includes(lowercaseQuery) ||
        desc.toLowerCase().includes(lowercaseQuery)
      ) {
        matchesCount++;
        const card = document.createElement('div');
        card.className = 'dashboard-card';
        card.setAttribute('data-index', idx);

        // Inherit session class from slide
        const sessionClass = Array.from(slide.classList).find(c => c.startsWith('session-'));
        if (sessionClass) {
          card.classList.add(sessionClass);
        }

        // Pick badge day color based on category/meta
        const dayBadgeEl = slide.querySelector('.day-badge');
        const dayTextFromHtml = dayBadgeEl ? dayBadgeEl.textContent.trim() : '';
        const isDay1 = dayTextFromHtml.includes('1일차') || category.includes('1일차');
        const dayText = isDay1 ? '1일차' : '2일차';

        card.innerHTML = `
          <div class="card-num">
            <span>Slide ${idx + 1}</span>
            <span class="card-tag" style="background:${isDay1 ? 'rgba(157,78,221,0.15)' : 'rgba(79,70,229,0.15)'};color:${isDay1 ? 'var(--accent-purple)' : 'var(--accent-blue)'}">${dayText}</span>
          </div>
          <div class="card-title">${title}</div>
          <div class="card-desc">${desc}</div>
          <div class="card-tags">
            <span class="card-tag">${category}</span>
          </div>
        `;

        card.addEventListener('click', () => {
          setViewMode('presentation');
          showSlide(idx);
        });

        cardsGrid.appendChild(card);
      }
    });

    if (matchesCount === 0) {
      cardsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
          검색 결과에 맞는 슬라이드가 없습니다.
        </div>
      `;
    }
  }

  // Hook up search filter event listener
  searchInput.addEventListener('input', (e) => {
    renderDashboard(e.target.value);
  });

  // --- Session 1 Practice Tabs Logic ---
  const practiceData = {
    1: {
      label: "고객 메일",
      situation: "배송 지연 및 환불 요청 고객 메일 대응",
      data: `"지난주 주문한 제품이 아직도 배송되지 않았습니다. 2-3일 내 배송이라더니 일주일이 지났네요. 환불해주세요."`,
      prompts: [
        "고객 불만 메일에 답장해줘.",
        "너는 친절한 고객지원 담당자야. 고객 불만 메일에 답장해줘.",
        "고객 불만 메일을 분석하고, 불만 원인, 사과 문장, 해결 방안, 후속 조치로 나누어 답장 초안을 작성해줘."
      ]
    },
    2: {
      label: "회의록",
      situation: "부서별 논의사항이 섞여 있는 가공되지 않은 회의록 요약",
      data: `디자인팀: 메인 UI 시안 나왔는데 로고 위치 수정 필요함.\n마케팅팀: 다음 주 화요일 프로모션 집행 예정. 예산 500만원 승인 요청.\n개발팀: 로그인 API 연동 완료, 이번 주 금요일까지 테스트 서버 배포 가능.`,
      prompts: [
        "이 회의록 요약해줘.",
        "너는 꼼꼼한 프로젝트 매니저(PM)야. 이 회의록을 요약해줘.",
        "회의록에서 결정사항, 부서별 액션 아이템(담당자, 기한 포함), 차기 회의 일정을 분류하고 표 형식으로 구조화해서 정리해줘."
      ]
    },
    3: {
      label: "소스 코드",
      situation: "버그가 있거나 리팩토링이 필요한 비효율적인 코드 분석",
      data: `function calculateTotal(items) {\n  var total = 0;\n  for (var i = 0; i < items.length; i++) {\n    total = total + items[i].price;\n  }\n  return total;\n}\n// 빈 배열이 전달되거나 items가 undefined일 때 오류가 발생할 수 있습니다.`,
      prompts: [
        "이 코드 에러 고쳐줘.",
        "너는 10년 차 시니어 소프트웨어 엔지니어이자 코드 리뷰어야. 이 코드의 에러를 찾고 개선안을 제시해줘.",
        "주어진 코드의 구문 에러 원인, 성능 개선점, 리팩토링된 안전한 코드, 그리고 코드 동작 테스트 케이스를 나누어 JSON 형태로 출력해줘."
      ]
    },
    4: {
      label: "매출 데이터",
      situation: "원시 매출 데이터를 기반으로 마케팅 전략 수립",
      data: `2026년 상반기 매출 현황 - 1월: 1,200만원 (오픈 효과) | 2월: 1,500만원 | 3월: 980만원 (계절성 요인) | 4월: 800만원 (경쟁사 진입) | 5월: 1,100만원 (가정의 달 프로모션) | 6월: 750만원 (장마 및 물류 지연)`,
      prompts: [
        "이 매출 데이터 분석해줘.",
        "너는 데이터 분석 전문가이자 마케팅 전략가야. 이 매출 데이터를 분석해서 전략을 세워줘.",
        "데이터를 기반으로 매출 급감/급증 항목 식별, 원인 분석(가설), 타겟 마케팅 액션 플랜 3가지를 도출하여 보고서 포맷(목차 포함)으로 작성해줘."
      ]
    },
    5: {
      label: "마케팅 문구",
      situation: "신제품 출시를 위한 다채널 홍보 카피 작성",
      data: `신제품: AI 기반 맞춤형 프롬프트 생성/관리 플랫폼 'Antigravity'\n타겟 독자: 실무 효율성을 높이고 싶은 2030 직장인\n핵심 기능: 업무 템플릿 제공, 원클릭 복사, 협업 저장소`,
      prompts: [
        "신제품 마케팅 문구 써줘.",
        "너는 크리에이티브한 카피라이터야. 신제품 마케팅 문구를 써줘.",
        "타겟 독자(2030 직장인)에 맞춰 제품의 핵심 가치 소구점을 정리하고, 채널별(인스타그램 숏폼, 블로그 정보성 글, 이메일 뉴스레터) 목적에 맞는 톤앤매너로 각각 구별하여 작성해줘."
      ]
    }
  };

  // --- Session 2 Practice Tabs Data ---
  const practiceData2 = {
    1: {
      situation: "AI 기반 맞춤형 프롬프트 생성/관리 플랫폼 'Antigravity' 출시 안내문 작성",
      personas: [
        "친절한 고객 지원 상담원 (고객 혜택 위주 이메일)",
        "논리적인 서비스 기획자 (기술 스펙 위주 사양서)",
        "업계 전문가 (시장 분석 및 트렌드 칼럼)"
      ],
      titles: [
        "Persona A: 상담원 / 공감형",
        "Persona B: 기획자 / 논리형",
        "Persona C: 전문가 / 트렌드형"
      ],
      prompts: [
`Role: 고객 상담원
Instruction: 신규 서비스 출시 안내문 작성
Context: 타겟은 마케팅 담당자, 부드럽고 친절한 말투 사용
Output: 고객 혜택 위주의 메일 본문 포맷`,
`Role: 서비스 기획자
Instruction: 신규 서비스 출시 안내문 작성
Context: 전문적이고 논리적인 기술 세부 장점 강조
Output: Markdown 표 및 기능 설명 문서 포맷`,
`Role: IT 트렌드 분석 전문가
Instruction: 신규 서비스 출시 배경 및 산업적 임팩트 칼럼 작성
Context: 시장 변화 흐름(LLM/Agent) 대조, 분석적이고 권위 있는 어조
Output: 제목 1개, 서론-본론-결론의 3단 구성 (1,000자 이내)`
      ]
    },
    2: {
      situation: "배송 지연 및 파손 클레임 건에 대한 대응 방안 및 답변 작성",
      personas: [
        "공감형 CS 담당자 (정서적 공감 및 사과 메일)",
        "법무 및 규정 준수 자문관 (책임 범위 및 보상 안내)",
        "CS 총괄 매니저 (쿠폰 및 재발송 대안 제시)"
      ],
      titles: [
        "Persona A: CS 담당자 / 공감형",
        "Persona B: 법무 자문 / 규정준수",
        "Persona C: CS 매니저 / 대안제시"
      ],
      prompts: [
`Role: 정서적 공감형 CS 담당자
Instruction: 배송 지연 고객에 대한 사과 메일 작성
Context: 1주일 지연 상황, 고객의 실망감 적극 공감, 위로 문구 포함
Output: 감성적이고 정중한 사과문 형식`,
`Role: 기업 법무 및 규정 준수 자문관
Instruction: 배송 지연 보상 범위 안내문 작성
Context: 이용약관 제12조(면책) 및 제15조(보상) 기준, 법적 분쟁 방지 목적
Output: 객관적이고 명확한 보상 한도 설명문`,
`Role: CS 총괄 매니저
Instruction: 배송 지연 고객 회복을 위한 보상 제안 메일 작성
Context: 쿠폰 지급(1만원권) 및 재발송 처리 제안, 고객 이탈 방지 우선
Output: 비즈니스 타협안과 대안이 명시된 구조화된 이메일`
      ]
    },
    3: {
      situation: "'원클릭 프롬프트 최적화' 기능의 설명 매뉴얼 작성",
      personas: [
        "초보자 맞춤형 프롬프트 강사 (비유식 가이드)",
        "시니어 AI 시스템 엔지니어 (알고리즘 및 아키텍처 스펙)",
        "B2B 기술 영업 팀장 (생산성 향상 및 비용 절감)"
      ],
      titles: [
        "Persona A: 프롬프트 튜터 / 초보자용",
        "Persona B: AI 엔지니어 / 개발자용",
        "Persona C: 기술 영업 / 비즈니스용"
      ],
      prompts: [
`Role: 초보자 맞춤형 프롬프트 강사
Instruction: '원클릭 프롬프트 최적화' 기능 매뉴얼 작성
Context: AI를 처음 접하는 기획/마케팅 비전공자 대상, 비유와 예시 사용
Output: 친근한 구어체, 단계별(Step-by-step) 설명 가이드`,
`Role: 시니어 AI 시스템 엔지니어
Instruction: '원클릭 프롬프트 최적화' 기능 아키텍처 가이드 작성
Context: 개발자 및 시스템 운영자 대상, 알고리즘 및 데이터 흐름 설명
Output: 기술 스펙 명세서 및 API 파라미터 구조(JSON 등)`,
`Role: B2B 기술 영업 팀장
Instruction: '원클릭 프롬프트 최적화' 도입 제안서 작성
Context: 기업 구매 결정권자 대상, 업무 생산성 40% 향상 등 비용 대비 효과 강조
Output: ROI 중심의 요약 보고서 포맷`
      ]
    },
    4: {
      situation: "사내 AI 도구 사용 시 개인정보 및 소스코드 보안 수칙 안내문 작성",
      personas: [
        "인사팀/조직문화 담당자 (친근한 협조 요청 공지)",
        "정보보호최고책임자 CISO (징계 및 통제 규정 공문)",
        "개발 파트장 (개발자 실무 활용 팁 및 대안)"
      ],
      titles: [
        "Persona A: 인사팀 / 조직문화",
        "Persona B: CISO / 정보보안",
        "Persona C: 개발 파트장 / 개발실무"
      ],
      prompts: [
`Role: 친근한 사내 조직문화 담당자
Instruction: 사내 AI 활용 보안 수칙 안내 메시지 작성
Context: 전 임직원 대상, 부드러운 권유와 협조 요청, 가벼운 톤앤매너
Output: 사내 메신저 공지글 형태 (이모지 적극 사용)`,
`Role: 엄격한 정보보호최고책임자(CISO)
Instruction: 사내 AI 도구 사용 규정 및 위반 시 조치 사항 공지 작성
Context: 위반 시 보안 징계 위원회 회부 조항 언급, 철저한 통제 목적
Output: 공문서 포맷, 원칙과 금지 사항 중심의 불릿 리스트`,
`Role: 실무 효율을 중시하는 개발 파트장
Instruction: 안전한 AI 도구 활용 가이드 가이드라인 작성
Context: 실무 효율을 지키면서 소스코드 유출을 피하는 실질적인 팁(로컬 모델 사용 등) 제공
Output: 개발자 맞춤형 Quick-tip 가이드 포맷`
      ]
    },
    5: {
      situation: "신규 플랫폼 비즈니스 사업계획서 1페이지 요약본 작성",
      personas: [
        "열정적인 스타트업 창업가 (스토리 중심 피치 대본)",
        "깐깐한 VC 심사역 (수치 및 투자 타당성 의견서)",
        "글로벌 트렌드 애널리스트 (거시적 시장 변화 분석)"
      ],
      titles: [
        "Persona A: 창업가 / 피치대본",
        "Persona B: VC 심사역 / 타당성분석",
        "Persona C: 애널리스트 / 시장전망"
      ],
      prompts: [
`Role: 열정적인 기술 스타트업 창업가
Instruction: 투자자 미팅용 1분 피치 및 요약문 작성
Context: 세상을 바꿀 비전과 창업 동기, 해결하려는 문제의 가치 소구
Output: 스토리텔링형 피치 대본 (스피치 톤)`,
`Role: 깐깐한 벤처캐피탈(VC) 수석 심사역
Instruction: 해당 사업계획서 투자 타당성 검토 의견서 요약
Context: 시장 규모(TAM-SAM-SOM), 수익 모델(LTV/CAC), 경쟁사 대비 우위 데이터 검증
Output: 수치와 리스크 분석 중심의 요약표(Table)`,
`Role: 거시 경제 및 산업 트렌드 애널리스트
Instruction: 해당 플랫폼 비즈니스의 시장 동향 및 성장 분석 보고서 작성
Context: 글로벌 플랫폼 트렌드 변화 및 시장 지배력 전망 분석
Output: 전문적인 레포트 초안 형식`
      ]
    }
  };

  // --- Session 3 Practice Tabs Data ---
  const practiceData3 = {
    1: {
      situation: "정기 회의록 원문을 표, 불릿, JSON으로 변환",
      step1: "컬럼: 구분, 내용, 담당자, 기한",
      step2: "핵심 내용 중심 요약",
      step3: "Decisions와 Tasks 배열 구조로 출력",
      raw: `5월 정기 회의에서 신규 교육 프로그램 홍보 일정이 논의되었다.
홍보 문안은 김민지가 이번 주 금요일까지 초안을 작성하기로 했다.
랜딩 페이지 수정은 박준호가 다음 주 화요일까지 완료한다.
예산은 기존 안에서 10% 증액하는 방향으로 검토하기로 했다.
수강생 모집 공지는 다음 주 수요일 오전에 발송한다.
추가로 교육 만족도 조사 문항을 이서연이 정리하기로 했다.`,
      schema: `{
  "decisions": ["결정사항들"],
  "tasks": [
    { "task": "할 일", "owner": "담당자", "due_date": "기한" }
  ]
}`
    },
    2: {
      situation: "고객 통화 녹취록 텍스트에서 주요 이슈, 문의 내용, 후속 조치 구조화",
      step1: "컬럼: 분류, 핵심내용, 담당부서/담당자, 처리상태",
      step2: "고객 클레임 상세 요약 및 심각도 분류",
      step3: "customer_issue 및 action 객체 형태로 출력",
      raw: `"고객 지원팀 이지은입니다. 어제 구매한 제품(주문번호: A-9023) 전원 버튼이 작동하지 않는다는 불만이 접수되었습니다. 전화 통화로 확인해보니 충전 케이블 연결 시에만 불이 켜지고 평소에는 켜지지 않는다고 하네요. 무상 교환 대상이라 왕복 배송비는 당사 부담으로 처리하고 신규 제품 발송 일정을 모레까지 잡아두었습니다. 고객님이 빠른 배송을 원하셔서 우체국 택배로 접수했습니다."`,
      schema: `{
  "customer_issue": {
    "order_number": "주문번호",
    "symptom": "증상 설명",
    "is_warranty": true
  },
  "action": {
    "type": "무상교환 및 재발송",
    "carrier": "우체국택배",
    "estimated_ship_date": "모레"
  }
}`
    },
    3: {
      situation: "자유 형식으로 작성된 개발 버그 리포트를 시스템 등록용 데이터로 정제",
      step1: "컬럼: 버그위치, 발생현상, 재현조건, 마감일",
      step2: "발생 원인과 긴급 조치 가이드 요약",
      step3: "bug_report 및 debugging 객체 형태로 출력",
      raw: `"결제 화면에서 카카오페이 결제 버튼을 누르면 화면이 멈추고 502 에러가 뜹니다. 개발팀 최영수 대리가 재현해보니 사파리 브라우저에서만 발생하고 크롬에서는 결제가 잘 되네요. API 서버 로그를 확인한 결과 결제 콜백 URL에서 타임아웃이 나고 있었습니다. 이 문제는 이번 주 목요일 서비스 오픈 전까지 긴급 패치로 완료되어야 합니다."`,
      schema: `{
  "bug_report": {
    "feature": "카카오페이 결제",
    "error_code": "502 Bad Gateway",
    "environment": "Safari Browser"
  },
  "debugging": {
    "root_cause": "결제 콜백 URL 타임아웃",
    "assignee": "최영수",
    "priority": "Critical",
    "due_date": "이번 주 목요일"
  }
}`
    },
    4: {
      situation: "설명서 및 홍보글 텍스트에서 가격, 블루투스/배터리 스펙, 장단점 추출",
      step1: "컬럼: 스펙항목, 세부사양, 만족도, 비고",
      step2: "헤드폰 강점 및 주요 보완점 리스트 요약",
      step3: "product_name, price, specs, review 객체로 출력",
      raw: `"새로 출시된 노이즈 캔슬링 헤드폰 'SoundClear V2'는 가격이 299,000원입니다. 블루투스 5.3을 지원하고 배터리는 최대 40시간 동안 지속됩니다. 강점은 탁월한 저음역대 음질과 부드러운 메모리폼 이어패드 덕분에 장시간 착용이 편하다는 점입니다. 다만, 단점은 전용 파우치가 생각보다 부피가 크고 충전 케이블 길이가 30cm로 너무 짧다는 평가가 있습니다."`,
      schema: `{
  "product_name": "SoundClear V2",
  "price": 299000,
  "specs": {
    "bluetooth_version": "5.3",
    "battery_life": "40 hours"
  },
  "review": {
    "pros": ["저음역대 음질 우수", "착용감 편안"],
    "cons": ["파우치 부피 큼", "케이블 너무 짧음"]
  }
}`
    },
    5: {
      situation: "사내 임직원들의 희망도서 신청 및 예산 정산 텍스트 정보 정제",
      step1: "컬럼: 순번, 도서명, 출판사, 도서정가, 신청자, 신청일",
      step2: "희망도서 총 수량 및 승인된 예산 합계 요약",
      step3: "purchase_status 및 books 배열 구조로 출력",
      raw: `"이번 달 희망도서 신청 현황입니다. 김하은 대리가 '러스트 프로그래밍 가이드(한빛미디어, 32000원)'를 6월 5일에 신청했고, 최동훈 과장은 'AI 시대의 경영 전략(길벗, 22000원)'을 6월 8일에 신청했습니다. 두 권 모두 도서관 예산 범위 내에 있어 승인 완료되었으며 도서 구입 후 다음 주 금요일까지 사내 비치를 마칠 계획입니다."`,
      schema: `{
  "purchase_status": {
    "approval_date": "6월 5일~8일",
    "display_due_date": "다음 주 금요일"
  },
  "books": [
    {
      "title": "러스트 프로그래밍 가이드",
      "publisher": "한빛미디어",
      "price": 32000,
      "applicant": "김하은"
    },
    {
      "title": "AI 시대의 경영 전략",
      "publisher": "길벗",
      "price": 22000,
      "applicant": "최동훈"
    }
  ]
}`
    }
  };

  function updatePracticeSetSession1(setId) {
    const selected = practiceData[setId];
    if (!selected) return;

    // Update Slide 8
    const s8Sit = document.getElementById('slide8-situation-text');
    const s8Lab = document.getElementById('slide8-label-text');
    const s8Data = document.getElementById('slide8-data-block');
    if (s8Sit) s8Sit.textContent = selected.situation;
    if (s8Lab) s8Lab.textContent = selected.label;
    if (s8Data) s8Data.textContent = selected.data;

    // Update Slide 9
    const s9P1 = document.getElementById('slide9-prompt-1');
    const s9P2 = document.getElementById('slide9-prompt-2');
    const s9P3 = document.getElementById('slide9-prompt-3');
    if (s9P1) s9P1.textContent = selected.prompts[0];
    if (s9P2) s9P2.textContent = selected.prompts[1];
    if (s9P3) s9P3.textContent = selected.prompts[2];

    // Sync active tabs on screen for session 1
    document.querySelectorAll('.session-1 .practice-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-set') === String(setId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function updatePracticeSetSession2(setId) {
    const selected = practiceData2[setId];
    if (!selected) return;

    // Update Slide 18
    const s18Sit = document.getElementById('slide18-situation-text');
    const s18PA = document.getElementById('slide18-persona-a-desc');
    const s18PB = document.getElementById('slide18-persona-b-desc');
    const s18PC = document.getElementById('slide18-persona-c-desc');
    if (s18Sit) s18Sit.textContent = selected.situation;
    if (s18PA) s18PA.textContent = selected.personas[0];
    if (s18PB) s18PB.textContent = selected.personas[1];
    if (s18PC) s18PC.textContent = selected.personas[2];

    // Update Slide 19
    const s19TA = document.getElementById('slide19-title-a');
    const s19TB = document.getElementById('slide19-title-b');
    const s19TC = document.getElementById('slide19-title-c');
    const s19PA = document.getElementById('slide19-persona-a');
    const s19PB = document.getElementById('slide19-persona-b');
    const s19PC = document.getElementById('slide19-persona-c');
    
    if (s19TA) s19TA.textContent = selected.titles[0];
    if (s19TB) s19TB.textContent = selected.titles[1];
    if (s19TC) s19TC.textContent = selected.titles[2];
    if (s19PA) s19PA.textContent = selected.prompts[0];
    if (s19PB) s19PB.textContent = selected.prompts[1];
    if (s19PC) s19PC.textContent = selected.prompts[2];

    // Sync active tabs on screen for session 2
    document.querySelectorAll('.session-2 .practice-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-set') === String(setId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function updatePracticeSetSession3(setId) {
    const selected = practiceData3[setId];
    if (!selected) return;

    // Update Slide 29
    const s29Sit = document.getElementById('slide29-situation-text');
    const s29S1 = document.getElementById('slide29-step1');
    const s29S2 = document.getElementById('slide29-step2');
    const s29S3 = document.getElementById('slide29-step3');
    if (s29Sit) s29Sit.textContent = selected.situation;
    if (s29S1) s29S1.textContent = selected.step1;
    if (s29S2) s29S2.textContent = selected.step2;
    if (s29S3) s29S3.textContent = selected.step3;

    // Update Slide 30
    const s30Raw = document.getElementById('slide30-raw-text');
    const s30Schema = document.getElementById('slide30-schema-text');
    if (s30Raw) s30Raw.textContent = selected.raw;
    if (s30Schema) s30Schema.textContent = selected.schema;

    // Sync active tabs on screen for session 3
    document.querySelectorAll('.session-3 .practice-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-set') === String(setId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --- Session 4 Practice Tabs Data ---
  const practiceData4 = {
    1: {
      situation: "정기 회의록을 기반으로 3단계 워크플로우를 체이닝하여 실행 계획 수립",
      row1: { purpose: "회의록 요약", desc: "핵심 위주 200자 내 요약", output: "Bullet Point" },
      row2: { purpose: "핵심 이슈 추출", desc: "문제점 및 지연 요인 식별", output: "JSON 스키마" },
      row3: { purpose: "액션 아이템 생성", desc: "각 이슈별 조치 사항 수립", output: "Markdown 표" }
    },
    2: {
      situation: "고객 상담 이력에서 감정 분석, 문제 원인 규명 및 최종 고객 케어 조치 수립",
      row1: { purpose: "상담 요약 및 감정", desc: "분노/불만 정도 파악 및 100자 요약", output: "Text + Sentiment" },
      row2: { purpose: "근본 원인 규명", desc: "제품/배송/서비스 중 요인 분류", output: "JSON 스키마" },
      row3: { purpose: "케어 플랜 작성", desc: "맞춤형 보상 및 고객 사후 케어 가이드", output: "Bullet Point" }
    },
    3: {
      situation: "레거시 코드의 구조적 진단, 리팩토링 및 최종 단위 테스트 시나리오 설계",
      row1: { purpose: "구조적 문제 진단", desc: "병목/메모리누수/가독성 이슈 요약", output: "Bullet Point" },
      row2: { purpose: "코드 리팩토링", desc: "가독성 및 효율성 극대화 최적화 코드 작성", output: "Refactored Code" },
      row3: { purpose: "테스트 시나리오 작성", desc: "정상/경계값/오류 조건 케이스 도출", output: "JSON 스키마" }
    },
    4: {
      situation: "신제품 아이디어 정의, 경쟁 우위 소구점(USP) 추출 및 최종 SNS 카피 일정 작성",
      row1: { purpose: "기획 아이디어 요약", desc: "제품 특징 및 타겟 고객 150자 요약", output: "Bullet Point" },
      row2: { purpose: "USP 3가지 추출", desc: "경쟁사 대조 차별점 3가지 정량화", output: "JSON 스키마" },
      row3: { purpose: "광고 카피 생성", desc: "인스타/블로그 등 채널별 타겟 광고 문구 작성", output: "Markdown 표" }
    },
    5: {
      situation: "사업계획서 요약, 예상 매출 모델 및 리스크 분석, 최종 투자자용 스피치 대본 도출",
      row1: { purpose: "비즈니스 핵심 요약", desc: "문제 정의 및 솔루션 200자 요약", output: "Bullet Point" },
      row2: { purpose: "리스크 분석", desc: "재무/시장 경쟁 리스크 요소 식별", output: "JSON 스키마" },
      row3: { purpose: "피치 대본 작성", desc: "1분 내외 스피치용 스토리텔링 스크립트 작성", output: "Text script" }
    }
  };

  // --- Session 5 Practice Tabs Data ---
  const practiceData5 = {
    1: {
      situation: "제공된 5개 고객 리뷰 데이터를 분류하고 판단 이유 및 후속 조치를 표로 완성합니다.",
      samples: [
        "강의 내용이 실무에 바로 적용할 수 있어서 좋았습니다.",
        "신청 페이지 오류 때문에 결제가 두 번 되었습니다. 확인 바랍니다.",
        "다음 교육 일정은 언제 열리나요?",
        "강사님 설명은 좋았지만 실습 시간이 조금 부족했습니다. (복합)",
        "자료 다운로드 링크가 열리지 않습니다."
      ],
      prompt: `너는 리뷰 분석 전문가야. 주어진 리뷰를 아래 기준에 따라 분류해줘.

분류 기준:
- 긍정: 만족, 칭찬
- 부정: 불만, 오류, 결제 실패
- 문의: 일정, 절차 요청

예외 규칙:
- 긍정과 부정이 섞여 있으면 "부정"으로 분류한다.
- 정보가 모호하면 "추가 확인 필요"로 분류한다.

출력형식:
리뷰: [원문]
분류: [분류결과]
이유: [판단근거]`
    },
    2: {
      situation: "사내 시스템 이메일 문의의 긴급도와 담당 부서를 자동으로 평가하고 배정합니다.",
      samples: [
        "오늘 배포된 버전 로그인 기능이 안 됩니다. 빨리 확인해주세요!",
        "개발자 계정 추가 절차가 어떻게 되나요? 가이드 부탁합니다.",
        "지난주 정기 회의 자료 아카이빙 폴더 위치 아시는 분 있나요?",
        "모바일 앱 로그인 시 간헐적으로 화면이 튕기는 현상이 보고되었습니다.",
        "이번 주 금요일 사무실 대청소 예정이니 개인 물품 정리 바랍니다."
      ],
      prompt: `너는 IT 서비스 데스크 상담원이야. 인입된 이메일을 아래 기준에 따라 긴급도 분류해줘.

분류 기준:
- 긴급 장애: 핵심 기능 먹통, 다수 사용자 장애
- 일반 요청: 계정 생성, 권한 요청, 매뉴얼 질의
- 단순 공지: 일반 행사 공지, 아카이빙 등 정보성

예외 규칙:
- 장애인지 요청인지 판단이 어려우면 "일반 요청"으로 우선 분류한다.
- 보안 관련 긴급 요청은 "긴급 장애"와 동등한 등급으로 다룬다.

출력형식:
메일: [원문]
분류: [분류결과]
이유: [판단근거]`
    },
    3: {
      situation: "시스템 이슈 리포트의 심각도(Severity)를 자동으로 판별하고 후속 조치 유형을 분류합니다.",
      samples: [
        "결제 모듈에서 API 키가 암호화되지 않고 로그에 노출되고 있습니다.",
        "메인 페이지 로고 이미지 파일의 오른쪽 여백이 5px 어긋나 있습니다.",
        "상품 상세 페이지에서 스크롤을 끝까지 내리면 간헐적으로 로딩 무한루프에 빠집니다.",
        "장바구니에 담긴 상품 수량 변경 버튼 클릭 시 반응 속도가 2초 이상 걸립니다.",
        "회원탈퇴 기능의 비밀번호 재확인 팝업 디자인을 모던하게 고치면 좋겠습니다."
      ],
      prompt: `너는 소프트웨어 QA 엔지니어이자 이슈 트래커야. 버그 리포트를 아래 기준에 따라 분류해줘.

분류 기준:
- 보안(Security): 데이터 노출, 권한 탈취 리스크
- 오류(Bug): 기능 미작동, 에러 코드 발생, 루프
- 제안(Enhancement): 디자인 변경, 단순 개선 제안

예외 규칙:
- 버그와 개선 제안이 혼재된 경우 "오류(Bug)"로 상향 조정한다.
- 재현율이 명시되지 않으면 "추가 분석 필요"를 이유에 적는다.

출력형식:
이슈: [원문]
분류: [분류결과]
이유: [판단근거]`
    },
    4: {
      situation: "마케팅 프로모션 후 고객 피드백의 구매 의향을 바탕으로 Lead 등급을 판단합니다.",
      samples: [
        "가격 제안서를 이메일로 보내주시면 내부 검토 후 이번 주 내로 연락드리겠습니다.",
        "기능은 흥미롭지만 현재 저희 예산 범위에는 맞지 않는 것 같습니다. 나중에 연락할게요.",
        "플랫폼 가입 절차는 완료했는데, 실제 템플릿 사용 방법 세션을 진행해주실 수 있나요?",
        "무료 체험 버전 기능 제한 해제 조건과 연간 구독 할인 혜택이 궁금합니다.",
        "그냥 인터넷 검색하다가 들어와서 한 번 써봤습니다. 쓸만하네요."
      ],
      prompt: `너는 B2B 마케팅 잠재고객 분석가야. 고객 메시지를 아래 기준에 따라 분석해줘.

분류 기준:
- Hot Lead: 즉각적인 구매 의향, 견적 및 할인 문의, 미팅 요청
- Warm Lead: 기능 사용법 질의, 예산 조율 필요, 무료 체험 중
- Cold Lead: 단순 가벼운 평가, 관심 부족

예외 규칙:
- 예산이 부족하다고 하나 구체적인 제품 문의를 한 경우 "Warm Lead"로 분류한다.
- 미팅 일정을 잡으려 하는 경우 무조건 "Hot Lead"로 상향한다.

출력형식:
메시지: [원문]
분류: [분류결과]
이유: [판단근거]`
    },
    5: {
      situation: "사내 지출 영수증 내역을 읽고 지출 적격성 심사 및 승인 가이드를 분기 처리합니다.",
      samples: [
        "야근 식대로 12,000원을 사용했고 법인카드 영수증을 첨부했습니다.",
        "거래처 선물 구입비로 45,000원 지출했으며 간이영수증을 첨부했습니다.",
        "사무실 탕비실 다과 구매 명목으로 89,000원 법인카드 지출 및 품의서 링크 첨부 완료.",
        "개인 소장용 도서 구매비로 55,000원을 지출하고 지출 결의서를 작성했습니다.",
        "세미나 참석용 열차 티켓으로 27,000원 개인 신용카드 영수증과 영수증 분실 사유서 첨부."
      ],
      prompt: `너는 사내 재무 및 감사 감사관이야. 지출 내역을 아래 규정에 따라 승인 여부를 심사해줘.

분류 기준:
- Approved(승인): 규정 내 지출, 적격 영수증 첨부 완료
- Pending(보완): 간이 영수증 대체, 사유서 추가 검토 필요
- Rejected(반려): 개인 지출 의심, 규정 한도 초과 및 위반

예외 규칙:
- 간이 영수증 청구 금액이 3만원을 초과하는 지출은 무조건 "Rejected" 처리한다.
- 사유서가 미비하면 "Pending"으로 분류하고 보완을 요구한다.

출력형식:
지출: [원문]
분류: [분류결과]
이유: [판단근거]`
    }
  };

  // --- Session 6 Practice Tabs Data ---
  const practiceData6 = {
    1: {
      situation: "문의 접수, 감정 분석, 부서 자동 배정 및 초안 발송 자동화 설계",
      candidates: [
        { name: "고객 문의 메일 분류 및 초안 작성", rep: 5, rul: 4, dat: 5, tot: "14 (선정)" },
        { name: "디자인 시안 창의적 아이디어 도출", rep: 3, rul: 1, dat: 2, tot: "6 (탈락)" },
        { name: "주간 매출 보고 데이터 취합 요약", rep: 4, rul: 5, dat: 5, tot: "14 (후보)" }
      ],
      design: `# AI 에이전트 설계서 (세트 1: CS 자동 답변)
1. 프로젝트명: CS 자동 답변 및 티켓 발급 봇
2. 문제 정의: 수작업 분류 및 조치 지연으로 인한 고객 불만 누적
3. 입력 데이터: 이메일 본문, 게시판 고객 문의 텍스트
4. 처리 단계 (Workflow):
   - Step 1: 3문장 요약 및 분노/일반 감정 분석
   - Step 2: 불만 원인 및 해결을 위한 담당 부서 배정 (JSON)
   - Step 3: 부서별 전달용 티켓 정보 및 임시 답변 초안 작성
5. 조건 분기: 부정 감정이 "매우 높음"일 경우 유관 부서 긴급 알림(Slack) 전송
6. Persona: 고객 만족을 최우선으로 하는 정교한 CS 기획 파트장`
    },
    2: {
      situation: "녹취록 실시간 번역, 부서별 할 일 추출(JSON) 및 협업 도구 연동 설계",
      candidates: [
        { name: "줌 녹취록 다국어 번역 및 할 일 추출 연동", rep: 5, rul: 5, dat: 4, tot: "14 (선정)" },
        { name: "사내 연말 네트워킹 이벤트 프로그램 기획", rep: 3, rul: 2, dat: 2, tot: "7 (탈락)" },
        { name: "신임 사원 4주 온보딩 교육 일정 스케줄러", rep: 4, rul: 4, dat: 5, tot: "13 (후보)" }
      ],
      design: `# AI 에이전트 설계서 (세트 2: 회의록 번역 및 트래커)
1. 프로젝트명: 다국어 회의록 자동 번역 및 할 일 트래커
2. 문제 정의: 글로벌 회의 후 수작업 요약 및 작업 할당 지연으로 인한 업무 병목
3. 입력 데이터: 줌(Zoom) 또는 MS Teams 음성 인식 텍스트(STT)
4. 처리 단계 (Workflow):
   - Step 1: 회의록 핵심 결정사항 10줄 요약 및 한국어 번역
   - Step 2: 결정사항 기반 부서별 할 일 및 기한 추출 (JSON)
   - Step 3: 할 일 정보의 Jira/Notion API 전송용 페이로드 생성
5. 조건 분기: '긴급 패치' 키워드 포함 시 개발팀 메인 채널에 P0 등급 알림
6. Persona: 글로벌 프로젝트를 조율하는 논리적이고 빈틈없는 시니어 PM`
    },
    3: {
      situation: "Git PR 소스코드 취약점 및 구문 에러 검사, 리팩토링 피드백 자동화 설계",
      candidates: [
        { name: "Git PR 발생 시 코드 보안/버그 정적 검사", rep: 5, rul: 5, dat: 5, tot: "15 (선정)" },
        { name: "신제품 브랜딩 로고 디자인 폰트 선정", rep: 2, rul: 1, dat: 2, tot: "5 (탈락)" },
        { name: "사내 위키 기술 블로그 문서 마크다운 포맷팅", rep: 4, rul: 4, dat: 4, tot: "12 (후보)" }
      ],
      design: `# AI 에이전트 설계서 (세트 3: PR 자동 코드 리뷰어)
1. 프로젝트명: PR 자동 코드 리뷰어 및 버그 검사기
2. 문제 정의: 개발진의 코드 리뷰 시간 누적으로 인한 릴리즈 지연 및 보안 취약점 배포 리스크
3. 입력 데이터: Git Diff 소스코드 텍스트 파일
4. 처리 단계 (Workflow):
   - Step 1: 구문 에러, 하드코딩된 API 키 등 보안 취약점 1차 검사
   - Step 2: 코드 컨벤션 위반 및 비효율적 반복 루프 개선안 도출 (JSON)
   - Step 3: 리팩토링된 최적화 코드 및 PR 피드백 코멘트 작성
5. 조건 분기: 보안 취약점(Critical) 발견 시 머지(Merge) 차단 및 경고 라벨 지정
6. Persona: 10년 차 이상의 꼼꼼하고 직설적인 시니어 시스템 개발자`
    },
    4: {
      situation: "가격 데이터 비교 모니터링, 프로모션 카피 자동 생성 설계",
      candidates: [
        { name: "새벽 경쟁사 가격 모니터링 및 실시간 광고 카피 최적화", rep: 4, rul: 5, dat: 5, tot: "14 (선정)" },
        { name: "신년 프로모션 이벤트 선물 포장 상자 색상 선정", rep: 2, rul: 1, dat: 1, tot: "4 (탈락)" },
        { name: "정기 고객 이메일 뉴스레터 본문 초안 작성", rep: 4, rul: 4, dat: 4, tot: "12 (후보)" }
      ],
      design: `# AI 에이전트 설계서 (세트 4: 실시간 마케팅 카피 생성기)
1. 프로젝트명: 경쟁사 가격 분석 및 실시간 마케팅 카피 생성기
2. 문제 정의: 경쟁사의 가격 변동에 빠르게 대처할 프로모션 기획 및 다채널 문구 작성 지연
3. 입력 데이터: 경쟁사 상품 가격 크롤링 텍스트, 당사 원가 데이터
4. 처리 단계 (Workflow):
   - Step 1: 경쟁사 대비 당사 가격 경쟁력 분석 및 최적 조정가 제안
   - Step 2: 타겟 고객에 맞춘 프로모션 문구 및 핵심 가치 소구안 작성
   - Step 3: 인스타그램, 블로그, 이메일용 채널별 맞춤형 카피 생성
5. 조건 분기: 당사 마진율이 15% 이하로 내려갈 경우 가격 조정 일시 중단 및 담당자 경고
6. Persona: 데이터 기반 의사결정을 하는 크리에이티브한 퍼포먼스 마케팅 팀장`
    },
    5: {
      situation: "영수증 OCR 정밀 매칭, 사내 규정 준수 심사 및 반려 사유서 작성 자동화 설계",
      candidates: [
        { name: "지출 결의 영수증 텍스트 및 규정 적격성 검증", rep: 5, rul: 5, dat: 5, tot: "15 (선정)" },
        { name: "사원 개인이 소장할 마케팅 서평 작성", rep: 2, rul: 1, dat: 2, tot: "5 (탈락)" },
        { name: "월간 도서 예산 내 희망도서 구매 승인 처리", rep: 4, rul: 4, dat: 5, tot: "13 (후보)" }
      ],
      design: `# AI 에이전트 설계서 (세트 5: 지출 적격성 자동 검무 봇)
1. 프로젝트명: 사내 지출 결의 적격성 자동 검무 봇
2. 문제 정의: 지출 증빙 서류의 수작업 규정 검토에 따른 재무팀 업무 과부하 및 정산 지연
3. 입력 데이터: 지출 결의서 항목, 카드 영수증 OCR 텍스트
4. 처리 단계 (Workflow):
   - Step 1: 영수증 일시, 금액, 가맹점 정보 추출 및 영수증 진위 대조
   - Step 2: 사내 지출 규정(시간외 식대 한도 등) 준수 여부 검증 (JSON)
   - Step 3: 심사 결과 보고(Approved/Pending/Rejected) 및 반려 사유서 작성
5. 조건 분기: 간이 영수증 금액 3만원 초과 혹은 규정 위반 발견 시 즉시 '반려(Rejected)' 및 메일 발송
6. Persona: 규정을 엄격히 준수하고 실수가 없는 철저한 재무 감사팀 수석 회계사`
    }
  };

  function updatePracticeSetSession4(setId) {
    const selected = practiceData4[setId];
    if (!selected) return;

    // Update Slide 40
    const s40Sit = document.getElementById('slide40-situation-text');
    if (s40Sit) s40Sit.textContent = selected.situation;

    // Update Slide 41
    const s41R1P = document.getElementById('slide41-row1-purpose');
    const s41R1D = document.getElementById('slide41-row1-desc');
    const s41R1O = document.getElementById('slide41-row1-output');
    const s41R2P = document.getElementById('slide41-row2-purpose');
    const s41R2D = document.getElementById('slide41-row2-desc');
    const s41R2O = document.getElementById('slide41-row2-output');
    const s41R3P = document.getElementById('slide41-row3-purpose');
    const s41R3D = document.getElementById('slide41-row3-desc');
    const s41R3O = document.getElementById('slide41-row3-output');

    if (s41R1P) s41R1P.textContent = selected.row1.purpose;
    if (s41R1D) s41R1D.textContent = selected.row1.desc;
    if (s41R1O) s41R1O.textContent = selected.row1.output;
    if (s41R2P) s41R2P.textContent = selected.row2.purpose;
    if (s41R2D) s41R2D.textContent = selected.row2.desc;
    if (s41R2O) s41R2O.textContent = selected.row2.output;
    if (s41R3P) s41R3P.textContent = selected.row3.purpose;
    if (s41R3D) s41R3D.textContent = selected.row3.desc;
    if (s41R3O) s41R3O.textContent = selected.row3.output;

    // Sync active tabs on screen for session 4
    document.querySelectorAll('.session-4 .practice-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-set') === String(setId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Toggle visibility of the sample boxes for Session 4
    const s40SampleBox1 = document.getElementById('slide40-sample-box-1');
    const s40SampleBox4 = document.getElementById('slide40-sample-box-4');

    if (s40SampleBox1) {
      s40SampleBox1.style.display = (setId === 1) ? 'block' : 'none';
    }
    if (s40SampleBox4) {
      s40SampleBox4.style.display = (setId === 4) ? 'block' : 'none';
    }
  }

  function updatePracticeSetSession5(setId) {
    const selected = practiceData5[setId];
    if (!selected) return;

    // Update Slide 52
    const s52Sit = document.getElementById('slide52-situation-text');
    if (s52Sit) s52Sit.textContent = selected.situation;

    for (let i = 1; i <= 5; i++) {
      const el = document.getElementById(`slide52-sample-${i}`);
      if (el) el.textContent = selected.samples[i - 1];
    }

    // Update Slide 53
    const s53Prompt = document.getElementById('slide53-prompt-text');
    if (s53Prompt) s53Prompt.textContent = selected.prompt;

    // Sync active tabs on screen for session 5
    document.querySelectorAll('.session-5 .practice-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-set') === String(setId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function updatePracticeSetSession6(setId) {
    const selected = practiceData6[setId];
    if (!selected) return;

    // Update Slide 60
    const s60Design = document.getElementById('slide60-design-text');
    if (s60Design) s60Design.textContent = selected.design;

    // Update Slide 61
    const s61Sit = document.getElementById('slide61-situation-text');
    if (s61Sit) s61Sit.textContent = selected.situation;

    // Update Slide 62
    for (let i = 1; i <= 3; i++) {
      const rowName = document.getElementById(`slide62-row${i}-name`);
      const rowRep = document.getElementById(`slide62-row${i}-rep`);
      const rowRul = document.getElementById(`slide62-row${i}-rul`);
      const rowDat = document.getElementById(`slide62-row${i}-dat`);
      const rowTot = document.getElementById(`slide62-row${i}-tot`);

      if (rowName) rowName.textContent = selected.candidates[i - 1].name;
      if (rowRep) rowRep.textContent = selected.candidates[i - 1].rep;
      if (rowRul) rowRul.textContent = selected.candidates[i - 1].rul;
      if (rowDat) rowDat.textContent = selected.candidates[i - 1].dat;
      if (rowTot) rowTot.innerHTML = `<strong>${selected.candidates[i - 1].tot.split(' ')[0]}</strong> ${selected.candidates[i - 1].tot.includes('(') ? selected.candidates[i - 1].tot.substring(selected.candidates[i - 1].tot.indexOf('(')) : ''}`;
    }

    // Sync active tabs on screen for session 6
    document.querySelectorAll('.session-6 .practice-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-set') === String(setId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Use event delegation for dynamically loaded slides
  document.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.practice-tabs .tab-btn');
    if (tabBtn) {
      const setId = parseInt(tabBtn.getAttribute('data-set'), 10);
      const slide = tabBtn.closest('.slide-card');
      if (slide) {
        if (slide.classList.contains('session-1')) {
          updatePracticeSetSession1(setId);
        } else if (slide.classList.contains('session-2')) {
          updatePracticeSetSession2(setId);
        } else if (slide.classList.contains('session-3')) {
          updatePracticeSetSession3(setId);
        } else if (slide.classList.contains('session-4')) {
          updatePracticeSetSession4(setId);
        } else if (slide.classList.contains('session-5')) {
          updatePracticeSetSession5(setId);
        } else if (slide.classList.contains('session-6')) {
          updatePracticeSetSession6(setId);
        }
      }
    }
  });
});
