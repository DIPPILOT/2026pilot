/**
 * PC 관리자 화면 애플리케이션
 * - 기획서의 8개 화면(로그인, 대시보드, 주문 관리, 메뉴 관리, 품절 관리, 매출 조회, 매장 설정, 사용자 및 권한) 구현
 * - 상태 변경·품절·주문 중지 확인 절차, 변경 이력(Audit Log), 소리/아이콘/문구 알림, 동시 수정 및 오프라인 예외 처리 지원
 */

(function () {
  'use strict';

  const ADMIN_SESSION_KEY = 'SANDWICH_ADMIN_SESSION_V1';

  let storeState = window.KioskStore.loadState();

  function loadAdminSession() {
    try {
      const raw = localStorage.getItem(ADMIN_SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    // 기본값: 바로 테스트할 수 있도록 점장 계정 로그인 상태 제공 (로그아웃하여 로그인 화면 및 계정 잠금 테스트 가능)
    return {
      isLoggedIn: true,
      currentUserId: 'usr-admin',
      currentView: 'DASHBOARD',
      selectedOrderId: 'ord-1001',
      orderFilters: {
        search: '',
        dateRange: 'TODAY',
        status: 'ALL',
        paymentStatus: 'ALL',
        orderType: 'ALL',
        includeCancelled: true
      },
      editingMenuId: null,
      selectedSoldOutMenuIds: [],
      salesPeriod: 'DAILY', // DAILY | WEEKLY | MONTHLY
      salesMenuFilter: 'ALL',
      simOffline: false
    };
  }

  let adminSession = loadAdminSession();

  function saveAdminSession() {
    try {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminSession));
    } catch (e) {}
  }

  function getCurrentUser() {
    return (
      storeState.users.find((u) => u.id === adminSession.currentUserId) ||
      storeState.users[0]
    );
  }

  function hasPermission(perm) {
    const u = getCurrentUser();
    if (!u) return false;
    return (u.permissions || []).includes(perm);
  }

  function playAlertSound() {
    if (!storeState.store.alertSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (e) {}
  }

  function showToast(msg) {
    const el = document.getElementById('admin-toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      el.hidden = true;
    }, 4500);
  }

  function openModal(title, bodyHtml, footerButtons) {
    const backdrop = document.getElementById('admin-modal-backdrop');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const footerEl = document.getElementById('modal-footer');
    if (!backdrop || !titleEl || !bodyEl || !footerEl) return;

    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    footerEl.innerHTML = '';

    (footerButtons || []).forEach(function (btnCfg) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn ' + (btnCfg.className || 'btn-secondary');
      b.textContent = btnCfg.label;
      b.addEventListener('click', function () {
        if (btnCfg.onClick) btnCfg.onClick();
      });
      footerEl.appendChild(b);
    });

    backdrop.hidden = false;
  }

  function closeModal() {
    const backdrop = document.getElementById('admin-modal-backdrop');
    if (backdrop) backdrop.hidden = true;
  }

  /* ============================================================================
   * 상단 바 & 사이드바 업데이트
   * ============================================================================ */

  function updateShellChrome() {
    const loginView = document.getElementById('login-view');
    const adminShell = document.getElementById('admin-shell');
    if (!adminSession.isLoggedIn) {
      if (loginView) loginView.hidden = false;
      if (adminShell) adminShell.hidden = true;
      return;
    }
    if (loginView) loginView.hidden = true;
    if (adminShell) adminShell.hidden = false;

    const user = getCurrentUser();
    const store = storeState.store;

    document.getElementById('topbar-store-name').textContent = store.name;

    const recPill = document.getElementById('topbar-order-status-pill');
    const recIcon = document.getElementById('topbar-reception-icon');
    const recText = document.getElementById('topbar-reception-text');
    const togglePauseBtn = document.getElementById('topbar-toggle-pause-btn');

    if (store.isOrderPaused) {
      recPill.className = 'reception-pill is-paused';
      recIcon.textContent = '⏸️';
      recText.textContent = '주문 접수 일시 중지됨';
      togglePauseBtn.textContent = '접수 재개';
    } else {
      recPill.className = 'reception-pill is-receiving';
      recIcon.textContent = '🟢';
      recText.textContent = '모바일 주문 접수 중';
      togglePauseBtn.textContent = '일시 중지';
    }

    const newOrdersCount = storeState.orders.filter((o) => o.status === 'PAID').length;
    const activeOrdersCount = storeState.orders.filter((o) =>
      ['PAID', 'ACCEPTED', 'PREPARING', 'READY'].includes(o.status)
    ).length;
    const soldOutCount = storeState.menus.filter((m) => m.isSoldOut).length;

    const newOrderAlert = document.getElementById('topbar-new-order-alert');
    const newOrderText = document.getElementById('topbar-new-order-text');
    if (newOrderAlert && newOrderText) {
      newOrderText.textContent =
        newOrdersCount > 0 ? `신규 미접수 ${newOrdersCount}건` : '신규 대기 주문 없음';
      newOrderAlert.style.opacity = newOrdersCount > 0 ? '1' : '0.65';
    }

    const navBadgeNew = document.getElementById('nav-badge-new');
    const navBadgeOrders = document.getElementById('nav-badge-orders');
    const navBadgeSoldout = document.getElementById('nav-badge-soldout');

    if (navBadgeNew) {
      navBadgeNew.hidden = newOrdersCount === 0;
      navBadgeNew.textContent = String(newOrdersCount);
    }
    if (navBadgeOrders) {
      navBadgeOrders.hidden = activeOrdersCount === 0;
      navBadgeOrders.textContent = String(activeOrdersCount);
    }
    if (navBadgeSoldout) {
      navBadgeSoldout.hidden = soldOutCount === 0;
      navBadgeSoldout.textContent = String(soldOutCount);
    }

    document.getElementById('topbar-user-badge').textContent = user.roleName;
    document.getElementById('topbar-user-name').textContent = user.name;
    document.getElementById('topbar-last-sync').textContent = window.KioskStore.formatTimeOnly(
      storeState.lastUpdatedAt
    );

    const offlineBanner = document.getElementById('admin-offline-banner');
    const offlineToggle = document.getElementById('admin-offline-toggle');
    if (offlineBanner) offlineBanner.hidden = !adminSession.simOffline;
    if (offlineToggle) offlineToggle.checked = Boolean(adminSession.simOffline);

    document.querySelectorAll('.nav-item').forEach(function (btn) {
      const v = btn.getAttribute('data-view');
      if (v === adminSession.currentView) {
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.removeAttribute('aria-current');
      }
    });
  }

  /* ============================================================================
   * 주문 상태 변경 및 취소 모달 (확인 절차 및 이력 기록)
   * ============================================================================ */

  function changeOrderStatus(orderId, nextStatus, customNote) {
    if (adminSession.simOffline) {
      showToast('🚫 오프라인 상태에서는 주문 상태를 변경할 수 없습니다.');
      return;
    }
    const user = getCurrentUser();
    const order = storeState.orders.find((o) => o.id === orderId);
    if (!order) return;

    const nextMeta = window.KioskStore.ORDER_STATUS[nextStatus] || { label: nextStatus };

    storeState = window.KioskStore.saveState(
      function (st) {
        const target = st.orders.find((o) => o.id === orderId);
        if (!target) return st;
        target.status = nextStatus;
        target.history.push({
          status: nextStatus,
          note: customNote || `[${nextMeta.label}] 단계로 상태 변경`,
          actor: user.name,
          timestamp: new Date().toISOString()
        });
        return st;
      },
      {
        event: 'ORDER_STATUS_CHANGED',
        orderId: orderId,
        audit: {
          category: '주문 관리',
          action: `주문 ${order.orderNumber} 상태를 [${nextMeta.label}](으)로 변경`,
          actor: user.name
        }
      }
    );

    showToast(`✅ 주문 ${order.orderNumber} 상태가 [${nextMeta.label}](으)로 변경되었습니다.`);
    render();
  }

  function promptCancelOrder(orderId) {
    if (adminSession.simOffline) {
      showToast('🚫 오프라인 상태에서는 주문을 취소할 수 없습니다.');
      return;
    }
    if (!hasPermission('ORDER_CANCEL')) {
      showToast('⚠️ 주문 취소 권한이 없습니다. (매니저 또는 점장 권한 필요)');
      return;
    }
    const order = storeState.orders.find((o) => o.id === orderId);
    if (!order) return;

    const bodyHtml = `
      <div class="alert-box alert-danger">
        ⚠️ <strong>주문 취소 및 환불 확인:</strong> 주문번호 <strong>${order.orderNumber}</strong> (${window.KioskStore.formatPrice(order.finalAmount)}) 주문을 취소하면 고객 주문 상태 화면에 즉시 취소 및 환불 안내가 표시됩니다.
      </div>
      <div class="form-group">
        <label for="cancel-reason-select" class="form-label">취소 사유 선택 (필수)</label>
        <select id="cancel-reason-select" class="form-select">
          <option value="재료 소진으로 인한 주문 취소">재료 소진으로 인한 주문 취소</option>
          <option value="고객 요청에 의한 주문 취소">고객 요청에 의한 주문 취소</option>
          <option value="매장 조리 지연으로 인한 취소">매장 조리 지연으로 인한 취소</option>
          <option value="결제 중복/오류 확인에 따른 취소">결제 중복/오류 확인에 따른 취소</option>
        </select>
      </div>
      <div class="form-group">
        <label for="cancel-reason-detail" class="form-label">상세 안내 문구 (고객 화면 노출)</label>
        <input type="text" id="cancel-reason-detail" class="form-input" value="결제 수단 승인 취소가 즉시 진행됩니다." />
      </div>
    `;

    openModal(`주문 취소 처리 (${order.orderNumber})`, bodyHtml, [
      { label: '닫기', className: 'btn-secondary', onClick: closeModal },
      {
        label: '🚫 주문 취소 및 환불 실행',
        className: 'btn-danger',
        onClick: function () {
          const reasonSel = document.getElementById('cancel-reason-select');
          const detailInp = document.getElementById('cancel-reason-detail');
          const reason = reasonSel ? reasonSel.value : '매장 취소';
          const refundNote = detailInp ? detailInp.value : '승인 취소 완료';
          const user = getCurrentUser();

          storeState = window.KioskStore.saveState(
            function (st) {
              const target = st.orders.find((o) => o.id === orderId);
              if (target) {
                target.status = 'CANCELLED';
                target.paymentStatus = 'REFUNDED';
                target.cancelReason = reason;
                target.refundStatus = refundNote;
                target.history.push({
                  status: 'CANCELLED',
                  note: `주문 취소 처리 (사유: ${reason} / 환불: ${refundNote})`,
                  actor: user.name,
                  timestamp: new Date().toISOString()
                });
              }
              return st;
            },
            {
              event: 'ORDER_STATUS_CHANGED',
              orderId: orderId,
              audit: {
                category: '주문 취소',
                action: `주문 ${order.orderNumber} 취소 및 환불 처리 (사유: ${reason})`,
                actor: user.name
              }
            }
          );

          closeModal();
          showToast(`🚫 주문 ${order.orderNumber} 취소 및 환불 처리가 완료되었습니다.`);
          render();
        }
      }
    ]);
  }

  function openReceiptModal(orderId) {
    const order = storeState.orders.find((o) => o.id === orderId);
    if (!order) return;
    const pm = window.KioskStore.PAYMENT_METHODS[order.paymentMethod] || { name: order.paymentMethod };
    const itemsRows = order.items
      .map(function (it) {
        const opts = (it.selectedOptions || []).map((o) => o.itemName).join(', ');
        return `
          <tr>
            <td style="padding:4px 0;">
              <strong>${it.menuName}</strong><br/>
              <span style="font-size:0.75rem; color:#64748b;">${opts || '기본'}</span>
            </td>
            <td style="text-align:center;">${it.quantity}</td>
            <td style="text-align:right;">${window.KioskStore.formatPrice(it.totalPrice)}</td>
          </tr>
        `;
      })
      .join('');

    const html = `
      <div style="font-family:monospace; border:1px dashed #334155; padding:16px; background:#f8fafc;">
        <div style="text-align:center; border-bottom:1px dashed #94a3b8; padding-bottom:10px; margin-bottom:10px;">
          <strong style="font-size:1.15rem;">[영수증 / 주문서] ${storeState.store.name}</strong><br/>
          <span>연락처: ${storeState.store.phone} | ${storeState.store.address}</span><br/>
          <strong style="font-size:1.4rem; display:block; margin-top:6px;">주문번호: ${order.orderNumber} (${
            order.orderType === 'DINE_IN' ? '매장식사' : '포장'
          })</strong>
        </div>
        <div style="margin-bottom:10px; font-size:0.82rem;">
          • 결제일시: ${window.KioskStore.formatDateTime(order.createdAt)}<br/>
          • 결제수단: ${pm.name} (${order.paymentStatus})
        </div>
        <table style="width:100%; border-collapse:collapse; font-size:0.84rem; margin-bottom:10px;">
          <thead>
            <tr style="border-bottom:1px solid #cbd5e1;">
              <th style="text-align:left;">품명/옵션</th>
              <th style="text-align:center;">수량</th>
              <th style="text-align:right;">금액</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>
        <div style="border-top:1px dashed #94a3b8; padding-top:8px; display:flex; justify-content:space-between; font-size:1rem; font-weight:900;">
          <span>총 결제금액</span>
          <span>${window.KioskStore.formatPrice(order.finalAmount)}</span>
        </div>
        ${
          order.customerRequest
            ? `<div style="margin-top:8px; padding:6px; background:#fffbeb; border:1px solid #fde68a; font-size:0.8rem;">
                요청사항: ${order.customerRequest}
              </div>`
            : ''
        }
        <div style="margin-top:12px; font-size:0.75rem; color:#64748b; text-align:center;">
          ${storeState.store.receiptFooter}
        </div>
      </div>
    `;

    openModal(`영수증 및 주문 내역 출력 (${order.orderNumber})`, html, [
      { label: '닫기', className: 'btn-secondary', onClick: closeModal },
      {
        label: '🖨️ 프린터 출력 실행',
        className: 'btn-primary',
        onClick: function () {
          closeModal();
          showToast(`🖨️ 주문 ${order.orderNumber} 영수증 출력 명령을 전송했습니다.`);
        }
      }
    ]);
  }

  function promptToggleOrderPause() {
    if (adminSession.simOffline) {
      showToast('🚫 오프라인 상태에서는 변경할 수 없습니다.');
      return;
    }
    const isPaused = storeState.store.isOrderPaused;
    const user = getCurrentUser();

    if (!isPaused) {
      const bodyHtml = `
        <div class="alert-box alert-warning">
          ⚠️ <strong>모바일 주문 접수 일시 중지 확인:</strong> 주문을 일시 중지하면 모바일로 접속한 고객이 신규 주문을 진행할 수 없습니다.
        </div>
        <div class="form-group">
          <label for="pause-msg-input" class="form-label">고객 안내 문구</label>
          <textarea id="pause-msg-input" class="form-textarea" rows="3">${storeState.store.pauseMessage}</textarea>
        </div>
      `;
      openModal('모바일 주문 접수 일시 중지', bodyHtml, [
        { label: '취소', className: 'btn-secondary', onClick: closeModal },
        {
          label: '⏸️ 주문 접수 일시 중지 실행',
          className: 'btn-danger',
          onClick: function () {
            const msg = document.getElementById('pause-msg-input').value;
            storeState = window.KioskStore.saveState(
              function (st) {
                st.store.isOrderPaused = true;
                st.store.pauseMessage = msg;
                return st;
              },
              {
                event: 'STORE_PAUSE_CHANGED',
                audit: {
                  category: '매장 설정',
                  action: '모바일 주문 접수 일시 중지 설정',
                  actor: user.name
                }
              }
            );
            closeModal();
            showToast('⏸️ 모바일 주문 접수가 일시 중지되었습니다.');
            render();
          }
        }
      ]);
    } else {
      storeState = window.KioskStore.saveState(
        function (st) {
          st.store.isOrderPaused = false;
          return st;
        },
        {
          event: 'STORE_PAUSE_CHANGED',
          audit: {
            category: '매장 설정',
            action: '모바일 주문 접수 재개',
            actor: user.name
          }
        }
      );
      showToast('🟢 모바일 주문 접수가 정상 재개되었습니다.');
      render();
    }
  }

  /* ============================================================================
   * 2. 대시보드 화면
   * ============================================================================ */

  function renderDashboardView(main) {
    const orders = storeState.orders;
    const menus = storeState.menus;
    const delayLimit = storeState.store.delayThresholdMinutes || 15;

    const newCount = orders.filter((o) => o.status === 'PAID').length;
    const acceptedCount = orders.filter((o) => o.status === 'ACCEPTED').length;
    const preparingCount = orders.filter((o) => o.status === 'PREPARING').length;
    const readyCount = orders.filter((o) => o.status === 'READY').length;
    const cancelledCount = orders.filter((o) => o.status === 'CANCELLED').length;

    const waitingOrders = orders.filter((o) => ['PAID', 'ACCEPTED', 'PREPARING'].includes(o.status));
    let oldestOrder = null;
    let maxWaitMins = 0;
    waitingOrders.forEach(function (o) {
      const mins = window.KioskStore.getElapsedMinutes(o.createdAt);
      if (mins >= maxWaitMins) {
        maxWaitMins = mins;
        oldestOrder = o;
      }
    });

    // 즉시 확인할 알림 생성
    const urgentAlerts = [];
    if (storeState.store.isOrderPaused) {
      urgentAlerts.push({
        type: 'danger',
        icon: '⏸️',
        text: '현재 모바일 주문 접수가 [일시 중지] 상태입니다.',
        actionLabel: '즉시 접수 재개',
        onClick: promptToggleOrderPause
      });
    }
    if (newCount > 0) {
      urgentAlerts.push({
        type: 'warning',
        icon: '🔔',
        text: `접수되지 않은 신규 주문이 ${newCount}건 있습니다. 즉시 확인해 주세요.`,
        actionLabel: '주문 관리 열기',
        onClick: function () {
          adminSession.currentView = 'ORDERS';
          saveAdminSession();
          render();
        }
      });
    }
    const delayedOrders = waitingOrders.filter(
      (o) => window.KioskStore.getElapsedMinutes(o.createdAt) >= delayLimit
    );
    if (delayedOrders.length > 0) {
      urgentAlerts.push({
        type: 'danger',
        icon: '⏰',
        text: `기준 시간(${delayLimit}분)을 초과한 지연 주문이 ${delayedOrders.length}건 있습니다 (${delayedOrders
          .map((d) => d.orderNumber)
          .join(', ')}).`,
        actionLabel: '해당 주문 보기',
        onClick: function () {
          adminSession.selectedOrderId = delayedOrders[0].id;
          adminSession.currentView = 'ORDERS';
          saveAdminSession();
          render();
        }
      });
    }
    const soldOutMenus = menus.filter((m) => m.isSoldOut);
    if (soldOutMenus.length > 0) {
      urgentAlerts.push({
        type: 'info',
        icon: '🚫',
        text: `현재 품절 처리된 메뉴가 ${soldOutMenus.length}개 있습니다 (${soldOutMenus.map((m) => m.name).join(', ')}).`,
        actionLabel: '품절 관리 이동',
        onClick: function () {
          adminSession.currentView = 'SOLDOUT';
          saveAdminSession();
          render();
        }
      });
    }

    // 당일 판매 요약 계산
    const validOrders = orders.filter((o) => o.status !== 'CANCELLED');
    const cancelledOrders = orders.filter((o) => o.status === 'CANCELLED');
    const totalSales = validOrders.reduce((acc, o) => acc + o.finalAmount, 0);
    const totalRefund = cancelledOrders.reduce((acc, o) => acc + o.finalAmount, 0);
    const avgOrder = validOrders.length > 0 ? Math.round(totalSales / validOrders.length) : 0;

    // 인기 메뉴 집계
    const menuCounts = {};
    validOrders.forEach(function (o) {
      (o.items || []).forEach(function (it) {
        menuCounts[it.menuName] = (menuCounts[it.menuName] || 0) + it.quantity;
      });
    });
    const topMenus = Object.entries(menuCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    // 빠른 주문 처리 테이블
    const activeOrderRows = orders
      .filter((o) => o.status !== 'PICKED_UP' && o.status !== 'CANCELLED')
      .map(function (o) {
        const stMeta = window.KioskStore.ORDER_STATUS[o.status] || { label: o.status, badgeClass: '' };
        const elapsed = window.KioskStore.getElapsedMinutes(o.createdAt);
        let nextActionBtn = '';
        if (o.status === 'PAID') {
          nextActionBtn = `<button type="button" class="btn btn-primary btn-sm dash-quick-status" data-id="${o.id}" data-next="ACCEPTED">주문 접수</button>`;
        } else if (o.status === 'ACCEPTED') {
          nextActionBtn = `<button type="button" class="btn btn-primary btn-sm dash-quick-status" data-id="${o.id}" data-next="PREPARING">조리 시작</button>`;
        } else if (o.status === 'PREPARING') {
          nextActionBtn = `<button type="button" class="btn btn-primary btn-sm dash-quick-status" data-id="${o.id}" data-next="READY">준비 완료 알림</button>`;
        } else if (o.status === 'READY') {
          nextActionBtn = `<button type="button" class="btn btn-secondary btn-sm dash-quick-status" data-id="${o.id}" data-next="PICKED_UP">수령 완료</button>`;
        }

        return `
          <tr>
            <td><strong>${o.orderNumber}</strong></td>
            <td>${o.orderType === 'DINE_IN' ? '🍽️ 매장' : '🛍️ 포장'}</td>
            <td>
              ${o.items[0] ? o.items[0].menuName : ''}${o.items.length > 1 ? ` 외 ${o.items.length - 1}건` : ''}
              ${o.customerRequest ? '<span class="badge status-preparing" style="margin-left:4px;">요청사항</span>' : ''}
            </td>
            <td><span class="badge ${stMeta.badgeClass}">${stMeta.icon} ${stMeta.label}</span></td>
            <td><strong style="color:${elapsed >= delayLimit ? 'var(--danger)' : 'inherit'};">${elapsed}분 경과</strong></td>
            <td>
              <div style="display:flex; gap:6px;">
                ${nextActionBtn}
                <button type="button" class="btn btn-outline btn-sm dash-open-detail" data-id="${o.id}">상세</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');

    main.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">📊 실시간 매장 대시보드</h1>
        <div style="display:flex; gap:8px;">
          <button type="button" id="dash-pause-btn" class="btn ${storeState.store.isOrderPaused ? 'btn-primary' : 'btn-warning'}">
            ${storeState.store.isOrderPaused ? '🟢 모바일 주문 접수 재개' : '⏸️ 모바일 주문 일시 중지'}
          </button>
        </div>
      </div>

      <!-- 실시간 주문 현황 KPI -->
      <section class="kpi-grid" aria-label="실시간 주문 현황 건수">
        <div class="kpi-card" style="border-left:4px solid var(--info);">
          <span class="kpi-label">🔔 새 주문 (미접수)</span>
          <strong class="kpi-value" style="color:var(--info);">${newCount}건</strong>
          <span class="kpi-sub">즉시 접수 확인 필요</span>
        </div>
        <div class="kpi-card" style="border-left:4px solid #4f46e5;">
          <span class="kpi-label">📋 접수 완료 (조리대기)</span>
          <strong class="kpi-value">${acceptedCount}건</strong>
          <span class="kpi-sub">조리 시작 대기</span>
        </div>
        <div class="kpi-card" style="border-left:4px solid var(--accent);">
          <span class="kpi-label">🥪 준비 중 (조리중)</span>
          <strong class="kpi-value" style="color:var(--accent);">${preparingCount}건</strong>
          <span class="kpi-sub">예상 준비 ${storeState.store.estimatedPrepMinutes}분</span>
        </div>
        <div class="kpi-card" style="border-left:4px solid var(--primary);">
          <span class="kpi-label">✅ 준비 완료 (픽업대기)</span>
          <strong class="kpi-value" style="color:var(--primary);">${readyCount}건</strong>
          <span class="kpi-sub">고객 호출 완료</span>
        </div>
        <div class="kpi-card" style="border-left:4px solid var(--danger);">
          <span class="kpi-label">🚫 취소 / 결제오류</span>
          <strong class="kpi-value" style="color:var(--danger);">${cancelledCount}건</strong>
          <span class="kpi-sub">환불액 ${window.KioskStore.formatPrice(totalRefund)}</span>
        </div>
        <div class="kpi-card" style="border-left:4px solid #64748b;">
          <span class="kpi-label">⏳ 최장 대기 주문</span>
          <strong class="kpi-value">${oldestOrder ? oldestOrder.orderNumber : '없음'}</strong>
          <span class="kpi-sub">${oldestOrder ? `${maxWaitMins}분째 대기 중` : '대기 주문 없음'}</span>
        </div>
      </section>

      <!-- 즉시 확인할 알림 -->
      <section class="panel" aria-labelledby="urgent-heading">
        <div class="panel-header">
          <h2 id="urgent-heading" class="panel-title">🚨 즉시 확인할 알림 및 조치 항목</h2>
        </div>
        <div id="urgent-alerts-container">
          ${
            urgentAlerts.length === 0
              ? '<div class="alert-box alert-info" style="margin:0;">🟢 모든 주문과 시스템이 정상 처리 중입니다.</div>'
              : ''
          }
        </div>
      </section>

      <div class="panel-grid-2">
        <!-- 진행 중인 주문 빠른 처리 -->
        <section class="panel" aria-labelledby="quick-order-heading">
          <div class="panel-header">
            <h2 id="quick-order-heading" class="panel-title">⚡ 진행 중인 주문 빠른 상태 변경</h2>
            <button type="button" id="dash-go-orders" class="btn btn-outline btn-sm">전체 주문 관리 →</button>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <caption>진행 중인 실시간 주문 목록</caption>
              <thead>
                <tr>
                  <th scope="col">주문번호</th>
                  <th scope="col">방식</th>
                  <th scope="col">상품 요약</th>
                  <th scope="col">현재 상태</th>
                  <th scope="col">경과</th>
                  <th scope="col">빠른 조치</th>
                </tr>
              </thead>
              <tbody>
                ${activeOrderRows || '<tr><td colspan="6" style="text-align:center;">진행 중인 주문이 없습니다.</td></tr>'}
              </tbody>
            </table>
          </div>
        </section>

        <!-- 당일 판매 요약 & 빠른 품절 토글 -->
        <div>
          <section class="panel" aria-labelledby="today-sales-heading">
            <div class="panel-header">
              <h2 id="today-sales-heading" class="panel-title">💰 당일 판매 요약</h2>
              <button type="button" id="dash-go-sales" class="btn btn-outline btn-sm">상세 매출 조회 →</button>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
              <div style="padding:10px; background:var(--bg-subtle); border-radius:6px;">
                <span style="font-size:0.78rem; color:var(--text-secondary);">결제 완료 금액 (${validOrders.length}건)</span>
                <strong style="display:block; font-size:1.25rem; color:var(--primary);">${window.KioskStore.formatPrice(totalSales)}</strong>
              </div>
              <div style="padding:10px; background:var(--bg-subtle); border-radius:6px;">
                <span style="font-size:0.78rem; color:var(--text-secondary);">평균 주문 금액 (객단가)</span>
                <strong style="display:block; font-size:1.25rem;">${window.KioskStore.formatPrice(avgOrder)}</strong>
              </div>
            </div>
            <h3 style="margin:0 0 6px; font-size:0.86rem;">🔥 당일 인기 판매 메뉴</h3>
            <ul style="margin:0 0 12px; padding-left:18px; font-size:0.84rem;">
              ${topMenus.map(([name, qty]) => `<li><strong>${name}</strong> — ${qty}개 판매</li>`).join('')}
            </ul>

            <h3 style="margin:0 0 6px; font-size:0.86rem;">🕒 시간대별 주문 추이</h3>
            <div class="bar-chart" aria-hidden="true">
              <div class="bar-col"><div class="bar-fill" style="height:35%;"></div><span class="bar-label">08-10시</span></div>
              <div class="bar-col"><div class="bar-fill" style="height:95%;"></div><span class="bar-label">11-13시</span></div>
              <div class="bar-col"><div class="bar-fill" style="height:60%;"></div><span class="bar-label">13-15시</span></div>
              <div class="bar-col"><div class="bar-fill" style="height:45%;"></div><span class="bar-label">15-17시</span></div>
              <div class="bar-col"><div class="bar-fill" style="height:75%;"></div><span class="bar-label">17-19시</span></div>
              <div class="bar-col"><div class="bar-fill" style="height:30%;"></div><span class="bar-label">19-21시</span></div>
            </div>
            <!-- 접근성 대체 데이터 테이블 -->
            <table class="data-table" style="margin-top:8px; font-size:0.76rem;">
              <caption>시간대별 주문 건수 요약표</caption>
              <thead>
                <tr>
                  <th scope="col">08-10시</th>
                  <th scope="col">11-13시</th>
                  <th scope="col">13-15시</th>
                  <th scope="col">15-17시</th>
                  <th scope="col">17-19시</th>
                  <th scope="col">19-21시</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>7건</td>
                  <td>19건</td>
                  <td>12건</td>
                  <td>9건</td>
                  <td>15건</td>
                  <td>6건</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="panel" aria-labelledby="quick-soldout-heading">
            <div class="panel-header">
              <h2 id="quick-soldout-heading" class="panel-title">🚫 빠른 메뉴 품절 토글</h2>
              <button type="button" id="dash-go-soldout" class="btn btn-outline btn-sm">상세 품절 관리 →</button>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${menus
                .map(
                  (m) => `
                  <button
                    type="button"
                    class="btn btn-sm ${m.isSoldOut ? 'btn-danger' : 'btn-secondary'} dash-toggle-soldout"
                    data-menu-id="${m.id}"
                  >
                    ${m.emoji} ${m.name} (${m.isSoldOut ? '품절됨·해제' : '판매중'})
                  </button>
                `
                )
                .join('')}
            </div>
          </section>
        </div>
      </div>
    `;

    // 즉시 확인 알림 렌더링
    const alertBoxContainer = document.getElementById('urgent-alerts-container');
    if (alertBoxContainer && urgentAlerts.length > 0) {
      urgentAlerts.forEach(function (al) {
        const div = document.createElement('div');
        div.className = `alert-box alert-${al.type}`;
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.innerHTML = `<span>${al.icon} ${al.text}</span>`;
        if (al.actionLabel && al.onClick) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'btn btn-sm btn-secondary';
          b.textContent = al.actionLabel;
          b.addEventListener('click', al.onClick);
          div.appendChild(b);
        }
        alertBoxContainer.appendChild(div);
      });
    }

    const pauseBtn = document.getElementById('dash-pause-btn');
    if (pauseBtn) pauseBtn.addEventListener('click', promptToggleOrderPause);

    const goOrdersBtn = document.getElementById('dash-go-orders');
    if (goOrdersBtn) {
      goOrdersBtn.addEventListener('click', function () {
        adminSession.currentView = 'ORDERS';
        saveAdminSession();
        render();
      });
    }

    const goSalesBtn = document.getElementById('dash-go-sales');
    if (goSalesBtn) {
      goSalesBtn.addEventListener('click', function () {
        adminSession.currentView = 'SALES';
        saveAdminSession();
        render();
      });
    }

    const goSoldoutBtn = document.getElementById('dash-go-soldout');
    if (goSoldoutBtn) {
      goSoldoutBtn.addEventListener('click', function () {
        adminSession.currentView = 'SOLDOUT';
        saveAdminSession();
        render();
      });
    }

    main.querySelectorAll('.dash-quick-status').forEach(function (btn) {
      btn.addEventListener('click', function () {
        changeOrderStatus(btn.getAttribute('data-id'), btn.getAttribute('data-next'));
      });
    });

    main.querySelectorAll('.dash-open-detail').forEach(function (btn) {
      btn.addEventListener('click', function () {
        adminSession.selectedOrderId = btn.getAttribute('data-id');
        adminSession.currentView = 'ORDERS';
        saveAdminSession();
        render();
      });
    });

    main.querySelectorAll('.dash-toggle-soldout').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!hasPermission('SOLD_OUT_MANAGE')) {
          showToast('⚠️ 품절 관리 권한이 없습니다. (매니저 이상 가능)');
          return;
        }
        const mId = btn.getAttribute('data-menu-id');
        const user = getCurrentUser();
        storeState = window.KioskStore.saveState(
          function (st) {
            const m = st.menus.find((x) => x.id === mId);
            if (m) {
              m.isSoldOut = !m.isSoldOut;
              m.soldOutAt = m.isSoldOut ? new Date().toISOString() : null;
              m.soldOutBy = m.isSoldOut ? user.name : null;
              m.soldOutReason = m.isSoldOut ? '대시보드 즉시 품절 처리' : '';
            }
            return st;
          },
          {
            event: 'SOLD_OUT_CHANGED',
            audit: {
              category: '품절 관리',
              action: `대시보드에서 메뉴 품절 상태 즉시 변경`,
              actor: user.name
            }
          }
        );
        showToast('✅ 메뉴 품절 상태가 고객 화면에 실시간 반영되었습니다.');
        render();
      });
    });
  }

  /* ============================================================================
   * 3. 주문 관리 화면 (좌측 목록 + 우측 상세 분할 화면)
   * ============================================================================ */

  function renderOrdersView(main) {
    const f = adminSession.orderFilters;
    const filteredOrders = storeState.orders.filter(function (o) {
      if (!f.includeCancelled && o.status === 'CANCELLED') return false;
      if (f.status !== 'ALL' && o.status !== f.status) return false;
      if (f.paymentStatus !== 'ALL' && o.paymentStatus !== f.paymentStatus) return false;
      if (f.orderType !== 'ALL' && o.orderType !== f.orderType) return false;
      if (f.search) {
        const q = f.search.toLowerCase();
        const matchNum = o.orderNumber.toLowerCase().includes(q);
        const matchMenu = o.items.some((i) => i.menuName.toLowerCase().includes(q));
        if (!matchNum && !matchMenu) return false;
      }
      return true;
    });

    const selectedOrder =
      filteredOrders.find((o) => o.id === adminSession.selectedOrderId) ||
      filteredOrders[0] ||
      null;
    if (selectedOrder) {
      adminSession.selectedOrderId = selectedOrder.id;
    }

    const rowsHtml = filteredOrders
      .map(function (o) {
        const stMeta = window.KioskStore.ORDER_STATUS[o.status] || { label: o.status, badgeClass: '' };
        const elapsed = window.KioskStore.getElapsedMinutes(o.createdAt);
        const isSelected = selectedOrder && selectedOrder.id === o.id;
        return `
          <tr class="clickable-row ${isSelected ? 'is-selected' : ''}" data-order-id="${o.id}">
            <td><strong>${o.orderNumber}</strong></td>
            <td>
              <div>${window.KioskStore.formatTimeOnly(o.createdAt)}</div>
              <small style="color:var(--text-muted);">${elapsed}분 경과</small>
            </td>
            <td>${o.orderType === 'DINE_IN' ? '🍽️ 매장' : '🛍️ 포장'}</td>
            <td>
              <div>${o.items[0] ? o.items[0].menuName : ''}${o.items.length > 1 ? ` 외 ${o.items.length - 1}건` : ''}</div>
              ${o.customerRequest ? '<span class="badge status-preparing">💬 요청사항 있음</span>' : ''}
            </td>
            <td><strong>${window.KioskStore.formatPrice(o.finalAmount)}</strong></td>
            <td>${o.paymentStatus === 'REFUNDED' ? '<span class="badge status-cancelled">환불완료</span>' : '<span class="badge status-ready">결제완료</span>'}</td>
            <td><span class="badge ${stMeta.badgeClass}">${stMeta.icon} ${stMeta.label}</span></td>
          </tr>
        `;
      })
      .join('');

    let detailHtml = '<div class="panel"><p>목록에서 주문을 선택해 주세요.</p></div>';
    if (selectedOrder) {
      const stMeta = window.KioskStore.ORDER_STATUS[selectedOrder.status] || { label: selectedOrder.status, badgeClass: '' };
      const pmMeta = window.KioskStore.PAYMENT_METHODS[selectedOrder.paymentMethod] || { name: selectedOrder.paymentMethod };

      const itemsDetailHtml = selectedOrder.items
        .map(function (it) {
          const addOpts = (it.selectedOptions || []).filter((o) => o.groupId === 'opt-extra');
          const exclOpts = (it.selectedOptions || []).filter((o) => o.groupId === 'opt-exclude');
          const normalOpts = (it.selectedOptions || []).filter(
            (o) => o.groupId !== 'opt-extra' && o.groupId !== 'opt-exclude'
          );

          return `
            <div style="padding:10px; border:1px solid var(--border); border-radius:8px; margin-bottom:8px; background:var(--bg-subtle);">
              <div style="display:flex; justify-content:space-between; font-weight:800; font-size:0.95rem;">
                <span>${it.menuName} × ${it.quantity}개</span>
                <span>${window.KioskStore.formatPrice(it.totalPrice)}</span>
              </div>
              <div style="font-size:0.82rem; color:var(--text-secondary); margin-top:4px;">
                • 기본 선택: ${normalOpts.map((o) => `${o.groupName}(${o.itemName})`).join(', ') || '기본'}
              </div>
              ${
                addOpts.length > 0
                  ? `<div style="font-size:0.82rem; color:#065f46; font-weight:700; margin-top:2px;">
                      ➕ 추가 재료: ${addOpts.map((o) => o.itemName).join(', ')}
                    </div>`
                  : ''
              }
              ${
                exclOpts.length > 0
                  ? `<div style="font-size:0.82rem; color:#991b1b; font-weight:700; margin-top:2px;">
                      ⛔ 제외 재료: ${exclOpts.map((o) => o.itemName).join(', ')}
                    </div>`
                  : ''
              }
            </div>
          `;
        })
        .join('');

      const historyHtml = (selectedOrder.history || [])
        .map(
          (h) => `
          <li style="margin-bottom:4px; font-size:0.8rem;">
            <strong>[${window.KioskStore.formatTimeOnly(h.timestamp)}]</strong> ${h.note} — <em>처리자: ${h.actor}</em>
          </li>
        `
        )
        .join('');

      detailHtml = `
        <section class="panel" aria-labelledby="detail-order-title">
          <div class="panel-header">
            <div>
              <span style="font-size:0.78rem; color:var(--text-secondary);">주문 상세 정보</span>
              <h2 id="detail-order-title" class="panel-title" style="font-size:1.3rem;">
                주문번호 ${selectedOrder.orderNumber} (${selectedOrder.orderType === 'DINE_IN' ? '🍽️ 매장 식사' : '🛍️ 포장 주문'})
              </h2>
            </div>
            <span class="badge ${stMeta.badgeClass}" style="font-size:0.85rem; padding:6px 12px;">
              ${stMeta.icon} ${stMeta.label}
            </span>
          </div>

          <!-- 상태 변경 버튼 그룹 -->
          <div style="margin-bottom:14px; padding:12px; background:var(--bg-subtle); border-radius:8px; border:1px solid var(--border);">
            <strong style="display:block; margin-bottom:8px; font-size:0.82rem;">⚡ 주문 상태 변경 (클릭 시 고객 화면에 즉시 반영)</strong>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="btn btn-sm ${selectedOrder.status === 'ACCEPTED' ? 'btn-primary' : 'btn-secondary'} order-status-btn" data-status="ACCEPTED" ${
                selectedOrder.status === 'CANCELLED' ? 'disabled' : ''
              }>📋 주문 접수</button>
              <button type="button" class="btn btn-sm ${selectedOrder.status === 'PREPARING' ? 'btn-primary' : 'btn-secondary'} order-status-btn" data-status="PREPARING" ${
                selectedOrder.status === 'CANCELLED' ? 'disabled' : ''
              }>🥪 준비 중</button>
              <button type="button" class="btn btn-sm ${selectedOrder.status === 'READY' ? 'btn-primary' : 'btn-secondary'} order-status-btn" data-status="READY" ${
                selectedOrder.status === 'CANCELLED' ? 'disabled' : ''
              }>🔔 준비 완료</button>
              <button type="button" class="btn btn-sm ${selectedOrder.status === 'PICKED_UP' ? 'btn-primary' : 'btn-secondary'} order-status-btn" data-status="PICKED_UP" ${
                selectedOrder.status === 'CANCELLED' ? 'disabled' : ''
              }>✅ 수령 완료</button>
              <button type="button" id="detail-cancel-order-btn" class="btn btn-sm btn-danger" ${
                selectedOrder.status === 'CANCELLED' ? 'disabled' : ''
              }>🚫 주문 취소/환불</button>
              <button type="button" id="detail-print-receipt-btn" class="btn btn-sm btn-outline" style="margin-left:auto;">
                🖨️ 영수증/주문서 출력
              </button>
            </div>
          </div>

          ${
            selectedOrder.status === 'CANCELLED'
              ? `<div class="alert-box alert-danger">
                  <strong>🚫 취소 사유:</strong> ${selectedOrder.cancelReason || '-'}<br/>
                  <strong>💳 환불 상태:</strong> ${selectedOrder.refundStatus || '환불 완료'}
                </div>`
              : ''
          }

          ${
            selectedOrder.customerRequest
              ? `<div class="alert-box alert-warning">
                  💬 <strong>고객 요청사항:</strong> ${selectedOrder.customerRequest}
                </div>`
              : '<div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:10px;">• 고객 요청사항 없음</div>'
          }

          <h3 style="margin:0 0 8px; font-size:0.9rem;">상품별 옵션 및 제외·추가 재료</h3>
          ${itemsDetailHtml}

          <div style="padding:10px; background:var(--bg-subtle); border-radius:8px; margin-bottom:12px; font-size:0.84rem;">
            <div style="display:flex; justify-content:space-between;">
              <span>결제 수단 및 시각</span>
              <strong>${pmMeta.name} (${window.KioskStore.formatDateTime(selectedOrder.paidAt)})</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:4px; font-size:1rem; color:var(--primary);">
              <strong>총 결제 금액</strong>
              <strong>${window.KioskStore.formatPrice(selectedOrder.finalAmount)}</strong>
            </div>
          </div>

          <h3 style="margin:0 0 6px; font-size:0.88rem;">🕒 주문 상태 및 관리자 처리 이력</h3>
          <ul style="margin:0; padding-left:18px;">
            ${historyHtml}
          </ul>
        </section>
      `;
    }

    main.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">📋 주문 관리</h1>
      </div>

      <!-- 검색 및 필터 바 -->
      <section class="filter-bar" aria-label="주문 검색 및 필터">
        <input
          type="search"
          id="order-filter-search"
          class="form-input"
          style="width:200px;"
          placeholder="주문번호(A-101) 또는 메뉴명 검색"
          value="${f.search}"
        />
        <select id="order-filter-date" class="form-select" style="width:130px;" aria-label="주문일 범위">
          <option value="TODAY" ${f.dateRange === 'TODAY' ? 'selected' : ''}>오늘 주문</option>
          <option value="WEEK" ${f.dateRange === 'WEEK' ? 'selected' : ''}>최근 7일</option>
          <option value="ALL" ${f.dateRange === 'ALL' ? 'selected' : ''}>전체 기간</option>
        </select>
        <select id="order-filter-status" class="form-select" style="width:140px;" aria-label="주문 상태 필터">
          <option value="ALL" ${f.status === 'ALL' ? 'selected' : ''}>주문상태: 전체</option>
          <option value="PAID" ${f.status === 'PAID' ? 'selected' : ''}>결제완료(신규)</option>
          <option value="ACCEPTED" ${f.status === 'ACCEPTED' ? 'selected' : ''}>접수</option>
          <option value="PREPARING" ${f.status === 'PREPARING' ? 'selected' : ''}>준비 중</option>
          <option value="READY" ${f.status === 'READY' ? 'selected' : ''}>준비 완료</option>
          <option value="PICKED_UP" ${f.status === 'PICKED_UP' ? 'selected' : ''}>수령 완료</option>
          <option value="CANCELLED" ${f.status === 'CANCELLED' ? 'selected' : ''}>취소됨</option>
        </select>
        <select id="order-filter-pay" class="form-select" style="width:140px;" aria-label="결제 상태 필터">
          <option value="ALL" ${f.paymentStatus === 'ALL' ? 'selected' : ''}>결제상태: 전체</option>
          <option value="PAID" ${f.paymentStatus === 'PAID' ? 'selected' : ''}>결제 완료</option>
          <option value="REFUNDED" ${f.paymentStatus === 'REFUNDED' ? 'selected' : ''}>환불 완료</option>
        </select>
        <select id="order-filter-type" class="form-select" style="width:130px;" aria-label="주문 방식 필터">
          <option value="ALL" ${f.orderType === 'ALL' ? 'selected' : ''}>방식: 전체</option>
          <option value="DINE_IN" ${f.orderType === 'DINE_IN' ? 'selected' : ''}>매장 식사</option>
          <option value="TAKEOUT" ${f.orderType === 'TAKEOUT' ? 'selected' : ''}>포장 주문</option>
        </select>
        <label style="display:inline-flex; align-items:center; gap:4px; font-weight:700; font-size:0.82rem; cursor:pointer;">
          <input type="checkbox" id="order-filter-cancel" ${f.includeCancelled ? 'checked' : ''} />
          <span>취소 주문 포함</span>
        </label>
      </section>

      <div class="orders-split-layout">
        <!-- 좌측 주문 목록 -->
        <section class="panel" aria-label="주문 목록">
          <div class="panel-header">
            <h2 class="panel-title">주문 목록 (${filteredOrders.length}건)</h2>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <caption>필터링된 주문 목록</caption>
              <thead>
                <tr>
                  <th scope="col">주문번호</th>
                  <th scope="col">시각/경과</th>
                  <th scope="col">방식</th>
                  <th scope="col">상품 요약</th>
                  <th scope="col">결제금액</th>
                  <th scope="col">결제상태</th>
                  <th scope="col">주문상태</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml || '<tr><td colspan="7" style="text-align:center;">조건에 맞는 주문이 없습니다.</td></tr>'}
              </tbody>
            </table>
          </div>
        </section>

        <!-- 우측 주문 상세 -->
        <div>${detailHtml}</div>
      </div>
    `;

    // 필터 이벤트
    document.getElementById('order-filter-search').addEventListener('input', function (e) {
      adminSession.orderFilters.search = e.target.value;
      saveAdminSession();
      render();
    });
    document.getElementById('order-filter-date').addEventListener('change', function (e) {
      adminSession.orderFilters.dateRange = e.target.value;
      saveAdminSession();
      render();
    });
    document.getElementById('order-filter-status').addEventListener('change', function (e) {
      adminSession.orderFilters.status = e.target.value;
      saveAdminSession();
      render();
    });
    document.getElementById('order-filter-pay').addEventListener('change', function (e) {
      adminSession.orderFilters.paymentStatus = e.target.value;
      saveAdminSession();
      render();
    });
    document.getElementById('order-filter-type').addEventListener('change', function (e) {
      adminSession.orderFilters.orderType = e.target.value;
      saveAdminSession();
      render();
    });
    document.getElementById('order-filter-cancel').addEventListener('change', function (e) {
      adminSession.orderFilters.includeCancelled = e.target.checked;
      saveAdminSession();
      render();
    });

    main.querySelectorAll('tr[data-order-id]').forEach(function (row) {
      row.addEventListener('click', function () {
        adminSession.selectedOrderId = row.getAttribute('data-order-id');
        saveAdminSession();
        render();
      });
    });

    main.querySelectorAll('.order-status-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!selectedOrder) return;
        changeOrderStatus(selectedOrder.id, btn.getAttribute('data-status'));
      });
    });

    const cancelBtn = document.getElementById('detail-cancel-order-btn');
    if (cancelBtn && selectedOrder) {
      cancelBtn.addEventListener('click', function () {
        promptCancelOrder(selectedOrder.id);
      });
    }

    const printBtn = document.getElementById('detail-print-receipt-btn');
    if (printBtn && selectedOrder) {
      printBtn.addEventListener('click', function () {
        openReceiptModal(selectedOrder.id);
      });
    }
  }

  /* ============================================================================
   * 4. 메뉴 관리 화면
   * ============================================================================ */

  function renderMenusView(main) {
    const sortedMenus = storeState.menus
      .slice()
      .sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

    const editingMenu =
      storeState.menus.find((m) => m.id === adminSession.editingMenuId) ||
      sortedMenus[0];
    if (editingMenu && !adminSession.editingMenuId) {
      adminSession.editingMenuId = editingMenu.id;
    }

    const rowsHtml = sortedMenus
      .map(function (m, idx) {
        const isSel = editingMenu && editingMenu.id === m.id;
        return `
          <tr class="clickable-row ${isSel ? 'is-selected' : ''}" data-menu-id="${m.id}">
            <td>
              <strong>${m.displayOrder || idx + 1}위</strong>
              <button type="button" class="btn btn-outline btn-sm menu-order-up" data-id="${m.id}" title="순서 위로">▲</button>
              <button type="button" class="btn btn-outline btn-sm menu-order-down" data-id="${m.id}" title="순서 아래로">▼</button>
            </td>
            <td>
              <span style="font-size:1.3rem;">${m.emoji || '🥪'}</span>
              <strong>${m.name}</strong>
              ${m.badge ? `<span class="badge status-preparing">${m.badge}</span>` : ''}
            </td>
            <td>${m.category === 'SANDWICH' ? '샌드위치' : '음료'}</td>
            <td><strong>${window.KioskStore.formatPrice(m.price)}</strong></td>
            <td>${m.isSelling ? '<span class="badge status-ready">노출/판매중</span>' : '<span class="badge status-pickedup">숨김</span>'}</td>
            <td>${m.isSoldOut ? '<span class="badge status-cancelled">🚫 품절</span>' : '<span class="badge status-paid">정상</span>'}</td>
            <td>
              <small>${m.updatedBy || '관리자'}<br/>${window.KioskStore.formatTimeOnly(m.updatedAt)}</small>
            </td>
          </tr>
        `;
      })
      .join('');

    main.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">🥪 메뉴 관리</h1>
        <button type="button" id="add-new-menu-btn" class="btn btn-primary">+ 신규 메뉴 등록</button>
      </div>

      <div class="orders-split-layout">
        <section class="panel" aria-label="등록 메뉴 목록">
          <div class="panel-header">
            <h2 class="panel-title">전체 메뉴 목록 (${sortedMenus.length}개)</h2>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <caption>전체 메뉴 및 노출 순서 표</caption>
              <thead>
                <tr>
                  <th scope="col">노출 순서</th>
                  <th scope="col">메뉴명</th>
                  <th scope="col">카테고리</th>
                  <th scope="col">기본 가격</th>
                  <th scope="col">모바일 노출</th>
                  <th scope="col">품절 여부</th>
                  <th scope="col">최종 수정</th>
                </tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>
        </section>

        <!-- 우측 메뉴 편집 패널 -->
        <section class="panel" aria-labelledby="menu-edit-heading">
          <div class="panel-header">
            <h2 id="menu-edit-heading" class="panel-title">
              ✏️ 메뉴 상세 및 옵션 정보 편집
            </h2>
          </div>
          <div id="menu-form-error" class="alert-box alert-danger" role="alert" hidden></div>
          ${
            editingMenu
              ? `
              <form id="menu-edit-form" novalidate>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div class="form-group">
                    <label for="edit-menu-name" class="form-label">메뉴명 (필수)</label>
                    <input type="text" id="edit-menu-name" class="form-input" value="${editingMenu.name}" required />
                  </div>
                  <div class="form-group">
                    <label for="edit-menu-category" class="form-label">카테고리</label>
                    <select id="edit-menu-category" class="form-select">
                      <option value="SANDWICH" ${editingMenu.category === 'SANDWICH' ? 'selected' : ''}>샌드위치 (빵·사이즈·재료·세트 옵션)</option>
                      <option value="BEVERAGE" ${editingMenu.category === 'BEVERAGE' ? 'selected' : ''}>음료 (사이즈·온도·얼음·당도 옵션)</option>
                    </select>
                  </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
                  <div class="form-group">
                    <label for="edit-menu-price" class="form-label">기본 가격 (원)</label>
                    <input type="number" id="edit-menu-price" class="form-input" value="${editingMenu.price}" min="0" step="100" required />
                  </div>
                  <div class="form-group">
                    <label for="edit-menu-badge" class="form-label">강조 배지</label>
                    <input type="text" id="edit-menu-badge" class="form-input" value="${editingMenu.badge || ''}" placeholder="인기 / 신메뉴" />
                  </div>
                  <div class="form-group">
                    <label for="edit-menu-emoji" class="form-label">아이콘(이모지)</label>
                    <input type="text" id="edit-menu-emoji" class="form-input" value="${editingMenu.emoji || '🥪'}" />
                  </div>
                </div>

                <div class="form-group">
                  <label for="edit-menu-desc" class="form-label">메뉴 설명 (필수)</label>
                  <textarea id="edit-menu-desc" class="form-textarea" rows="2">${editingMenu.description}</textarea>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div class="form-group">
                    <label for="edit-menu-allergens" class="form-label">알레르기 유발 물질 안내</label>
                    <input type="text" id="edit-menu-allergens" class="form-input" value="${editingMenu.allergens || ''}" />
                  </div>
                  <div class="form-group">
                    <label for="edit-menu-origin" class="form-label">원재료 및 원산지 안내</label>
                    <input type="text" id="edit-menu-origin" class="form-input" value="${editingMenu.originInfo || ''}" />
                  </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div class="form-group">
                    <label for="edit-menu-hours" class="form-label">판매 시간</label>
                    <input type="text" id="edit-menu-hours" class="form-input" value="${editingMenu.saleHours || '08:00 ~ 20:30'}" />
                  </div>
                  <div class="form-group" style="display:flex; flex-direction:column; justify-content:center; gap:6px; padding-top:14px;">
                    <label style="display:flex; align-items:center; gap:6px; font-weight:700; cursor:pointer;">
                      <input type="checkbox" id="edit-menu-selling" ${editingMenu.isSelling ? 'checked' : ''} />
                      <span>모바일 화면 노출 (판매 활성)</span>
                    </label>
                    <label style="display:flex; align-items:center; gap:6px; font-weight:700; cursor:pointer;">
                      <input type="checkbox" id="edit-menu-recommend" ${editingMenu.isRecommended ? 'checked' : ''} />
                      <span>추천 메뉴 탭에 노출</span>
                    </label>
                  </div>
                </div>

                <div class="alert-box alert-info" style="font-size:0.8rem;">
                  ℹ️ <strong>옵션 그룹 및 추가 금액 규칙:</strong> 현재 <strong>${
                    editingMenu.category === 'SANDWICH' ? '샌드위치 표준 옵션(빵 종류, 사이즈, 세트, 추가/제외 재료)' : '음료 표준 옵션(사이즈, 온도, 얼음 양, 당도)'
                  }</strong>이 연결되어 있습니다. 저장 시 진행 중인 주문이나 고객 장바구니에 가격 변동 알림이 자동 전달됩니다.
                </div>

                <div style="display:flex; justify-content:flex-end; gap:8px;">
                  <button type="submit" class="btn btn-primary">💾 변경사항 검증 및 저장</button>
                </div>
              </form>
            `
              : ''
          }
        </section>
      </div>
    `;

    main.querySelectorAll('tr[data-menu-id]').forEach(function (row) {
      row.addEventListener('click', function (ev) {
        if (ev.target.closest('button')) return;
        adminSession.editingMenuId = row.getAttribute('data-menu-id');
        saveAdminSession();
        render();
      });
    });

    main.querySelectorAll('.menu-order-up').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        moveMenuOrder(id, -1);
      });
    });
    main.querySelectorAll('.menu-order-down').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        moveMenuOrder(id, 1);
      });
    });

    const addMenuBtn = document.getElementById('add-new-menu-btn');
    if (addMenuBtn) {
      addMenuBtn.addEventListener('click', function () {
        if (!hasPermission('MENU_MANAGE')) {
          showToast('⚠️ 메뉴 등록/수정 권한이 없습니다.');
          return;
        }
        const user = getCurrentUser();
        const newId = 'menu-custom-' + Date.now();
        storeState = window.KioskStore.saveState(
          function (st) {
            st.menus.push({
              id: newId,
              name: '새로운 시그니처 메뉴',
              category: 'SANDWICH',
              isRecommended: true,
              badge: '신메뉴',
              price: 6500,
              description: '신선한 재료로 만든 신규 메뉴 설명을 입력해 주세요.',
              emoji: '🥖',
              bgColor: '#f0fdf4',
              allergens: '밀, 우유, 대두 함유',
              originInfo: '국내산',
              saleHours: '08:00 ~ 20:30',
              isSelling: true,
              isSoldOut: false,
              displayOrder: st.menus.length + 1,
              updatedBy: user.name,
              updatedAt: new Date().toISOString()
            });
            return st;
          },
          {
            event: 'MENU_UPDATED',
            audit: {
              category: '메뉴 관리',
              action: '신규 메뉴 등록 초안 생성',
              actor: user.name
            }
          }
        );
        adminSession.editingMenuId = newId;
        saveAdminSession();
        showToast('✅ 신규 메뉴가 추가되었습니다. 우측에서 상세 정보를 수정해 주세요.');
        render();
      });
    }

    const editForm = document.getElementById('menu-edit-form');
    if (editForm && editingMenu) {
      editForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (adminSession.simOffline) {
          showToast('🚫 오프라인 상태에서는 저장할 수 없습니다.');
          return;
        }
        if (!hasPermission('MENU_MANAGE')) {
          showToast('⚠️ 메뉴 수정 권한이 없습니다.');
          return;
        }

        const errEl = document.getElementById('menu-form-error');
        const nameVal = document.getElementById('edit-menu-name').value.trim();
        const descVal = document.getElementById('edit-menu-desc').value.trim();
        const priceVal = Number(document.getElementById('edit-menu-price').value);

        // 저장 전 유효성 검증 (기획서 요구사항)
        if (!nameVal || !descVal) {
          errEl.hidden = false;
          errEl.textContent = '⚠️ 필수 정보 누락: 메뉴명과 메뉴 설명은 비워둘 수 없습니다.';
          return;
        }
        if (isNaN(priceVal) || priceVal < 0) {
          errEl.hidden = false;
          errEl.textContent = '⚠️ 잘못된 금액: 기본 가격은 0원 이상의 유효한 숫자여야 합니다.';
          return;
        }

        const duplicate = storeState.menus.find(
          (m) => m.id !== editingMenu.id && m.name.trim() === nameVal
        );
        if (duplicate) {
          errEl.hidden = false;
          errEl.textContent = '⚠️ 중복된 메뉴명: 이미 동일한 이름의 메뉴가 등록되어 있습니다.';
          return;
        }

        const user = getCurrentUser();
        storeState = window.KioskStore.saveState(
          function (st) {
            const target = st.menus.find((m) => m.id === editingMenu.id);
            if (target) {
              target.name = nameVal;
              target.category = document.getElementById('edit-menu-category').value;
              target.price = priceVal;
              target.badge = document.getElementById('edit-menu-badge').value.trim();
              target.emoji = document.getElementById('edit-menu-emoji').value.trim() || '🥪';
              target.description = descVal;
              target.allergens = document.getElementById('edit-menu-allergens').value.trim();
              target.originInfo = document.getElementById('edit-menu-origin').value.trim();
              target.saleHours = document.getElementById('edit-menu-hours').value.trim();
              target.isSelling = document.getElementById('edit-menu-selling').checked;
              target.isRecommended = document.getElementById('edit-menu-recommend').checked;
              target.updatedBy = user.name;
              target.updatedAt = new Date().toISOString();
            }
            return st;
          },
          {
            event: 'MENU_UPDATED',
            audit: {
              category: '메뉴 관리',
              action: `[${nameVal}] 메뉴 정보 및 가격(${window.KioskStore.formatPrice(priceVal)}) 수정`,
              actor: user.name
            }
          }
        );

        showToast(`💾 [${nameVal}] 메뉴 정보가 저장되어 고객 화면에 즉시 반영되었습니다.`);
        render();
      });
    }
  }

  function moveMenuOrder(menuId, delta) {
    const user = getCurrentUser();
    storeState = window.KioskStore.saveState(function (st) {
      const sorted = st.menus.slice().sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
      const idx = sorted.findIndex((m) => m.id === menuId);
      const swapIdx = idx + delta;
      if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return st;
      const temp = sorted[idx];
      sorted[idx] = sorted[swapIdx];
      sorted[swapIdx] = temp;
      sorted.forEach(function (m, i) {
        m.displayOrder = i + 1;
      });
      return st;
    });
    render();
  }

  /* ============================================================================
   * 5. 품절 관리 화면 (메뉴 단위 + 옵션/재료 단위 품절 + 재개 시간 예약 + 일괄 변경)
   * ============================================================================ */

  function renderSoldOutView(main) {
    const menus = storeState.menus.slice().sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

    const menuRowsHtml = menus
      .map(function (m) {
        const checked = adminSession.selectedSoldOutMenuIds.includes(m.id);
        return `
          <tr>
            <td>
              <input type="checkbox" class="soldout-bulk-check" value="${m.id}" ${checked ? 'checked' : ''} aria-label="${m.name} 선택" />
            </td>
            <td><strong>${m.emoji} ${m.name}</strong></td>
            <td>${m.isSoldOut ? '<span class="badge status-cancelled">🚫 품절</span>' : '<span class="badge status-ready">🟢 판매중</span>'}</td>
            <td>${m.soldOutAt ? `${window.KioskStore.formatTimeOnly(m.soldOutAt)} (${m.soldOutBy || '-'})` : '-'}</td>
            <td>
              <input type="text" class="form-input soldout-reason-input" data-id="${m.id}" value="${m.soldOutReason || ''}" placeholder="예: 당일 재료 소진" style="min-width:150px;" />
            </td>
            <td>
              <input type="time" class="form-input soldout-resume-input" data-id="${m.id}" value="${m.resumeAt || ''}" style="width:125px;" />
            </td>
            <td>
              <button type="button" class="btn btn-sm ${m.isSoldOut ? 'btn-primary' : 'btn-danger'} soldout-single-toggle" data-id="${m.id}">
                ${m.isSoldOut ? '판매 재개(해제)' : '즉시 품절 처리'}
              </button>
            </td>
          </tr>
        `;
      })
      .join('');

    // 옵션/재료 단위 품절 관리 렌더링
    const allOptionGroups = []
      .concat(
        (storeState.optionTemplates.SANDWICH || []).map((g) => Object.assign({ catLabel: '샌드위치' }, g)),
        (storeState.optionTemplates.BEVERAGE || []).map((g) => Object.assign({ catLabel: '음료' }, g))
      );

    const optionGroupsHtml = allOptionGroups
      .map(function (grp) {
        const itemsHtml = grp.items
          .map(function (it) {
            return `
              <button
                type="button"
                class="btn btn-sm ${it.soldOut ? 'btn-danger' : 'btn-secondary'} opt-item-soldout-btn"
                data-cat="${grp.catLabel === '샌드위치' ? 'SANDWICH' : 'BEVERAGE'}"
                data-grp="${grp.id}"
                data-item="${it.id}"
              >
                ${it.soldOut ? '🚫' : '🟢'} ${it.name} (${it.soldOut ? '품절됨' : '정상'})
              </button>
            `;
          })
          .join('');
        return `
          <div style="margin-bottom:10px; padding-bottom:10px; border-bottom:1px dashed var(--border);">
            <strong style="display:block; margin-bottom:6px; font-size:0.86rem;">[${grp.catLabel}] ${grp.name}</strong>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">${itemsHtml}</div>
          </div>
        `;
      })
      .join('');

    main.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">🚫 품절 관리 (메뉴 및 세부 옵션·재료 단위)</h1>
        <label style="display:flex; align-items:center; gap:6px; background:#fff; padding:8px 12px; border-radius:8px; border:1px solid var(--border); font-weight:800; cursor:pointer;">
          <input type="checkbox" id="toggle-show-soldout-menus" ${storeState.store.ShowSoldOutMenus ? 'checked' : ''} />
          <span>품절 메뉴를 고객 화면에 [품절 배지]와 함께 노출 (체크 해제 시 목록에서 숨김)</span>
        </label>
      </div>

      <section class="panel" aria-labelledby="menu-soldout-heading">
        <div class="panel-header">
          <h2 id="menu-soldout-heading" class="panel-title">1. 메뉴별 품절 상태 및 자동 판매 재개 예약</h2>
          <div style="display:flex; gap:6px;">
            <button type="button" id="bulk-soldout-on-btn" class="btn btn-danger btn-sm">선택 메뉴 일괄 품절</button>
            <button type="button" id="bulk-soldout-off-btn" class="btn btn-primary btn-sm">선택 메뉴 일괄 해제</button>
          </div>
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <caption>전체 메뉴 품절 및 재개 예정 시각 관리 표</caption>
            <thead>
              <tr>
                <th scope="col">선택</th>
                <th scope="col">메뉴명</th>
                <th scope="col">현재 상태</th>
                <th scope="col">품절 시각 / 처리자</th>
                <th scope="col">품절 사유</th>
                <th scope="col">자동 재개 예약</th>
                <th scope="col">동작</th>
              </tr>
            </thead>
            <tbody>${menuRowsHtml}</tbody>
          </table>
        </div>
      </section>

      <section class="panel" aria-labelledby="opt-soldout-heading">
        <div class="panel-header">
          <h2 id="opt-soldout-heading" class="panel-title">2. 특정 옵션 또는 재료 단위 품절 관리 (클릭 시 고객 옵션 선택창에 즉시 반영)</h2>
        </div>
        ${optionGroupsHtml}
      </section>
    `;

    const showSoldoutCheck = document.getElementById('toggle-show-soldout-menus');
    if (showSoldoutCheck) {
      showSoldoutCheck.addEventListener('change', function () {
        const user = getCurrentUser();
        storeState = window.KioskStore.saveState(
          function (st) {
            st.store.ShowSoldOutMenus = showSoldoutCheck.checked;
            return st;
          },
          {
            event: 'SOLD_OUT_CHANGED',
            audit: {
              category: '품절 관리',
              action: `품절 메뉴 고객 노출 방식을 [${showSoldoutCheck.checked ? '품절 표시 노출' : '목록 숨김'}](으)로 변경`,
              actor: user.name
            }
          }
        );
        showToast('✅ 품절 메뉴 고객 노출 방식이 업데이트되었습니다.');
      });
    }

    main.querySelectorAll('.soldout-bulk-check').forEach(function (chk) {
      chk.addEventListener('change', function () {
        const id = chk.value;
        if (chk.checked) {
          if (!adminSession.selectedSoldOutMenuIds.includes(id)) {
            adminSession.selectedSoldOutMenuIds.push(id);
          }
        } else {
          adminSession.selectedSoldOutMenuIds = adminSession.selectedSoldOutMenuIds.filter((x) => x !== id);
        }
        saveAdminSession();
      });
    });

    main.querySelectorAll('.soldout-single-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!hasPermission('SOLD_OUT_MANAGE')) {
          showToast('⚠️ 품절 관리 권한이 없습니다.');
          return;
        }
        const id = btn.getAttribute('data-id');
        const reasonInput = main.querySelector(`.soldout-reason-input[data-id="${id}"]`);
        const resumeInput = main.querySelector(`.soldout-resume-input[data-id="${id}"]`);
        const user = getCurrentUser();

        storeState = window.KioskStore.saveState(
          function (st) {
            const m = st.menus.find((x) => x.id === id);
            if (m) {
              m.isSoldOut = !m.isSoldOut;
              m.soldOutAt = m.isSoldOut ? new Date().toISOString() : null;
              m.soldOutBy = m.isSoldOut ? user.name : null;
              m.soldOutReason = m.isSoldOut ? (reasonInput ? reasonInput.value : '재료 소진') : '';
              m.resumeAt = m.isSoldOut ? (resumeInput ? resumeInput.value : '') : null;
            }
            return st;
          },
          {
            event: 'SOLD_OUT_CHANGED',
            audit: {
              category: '품절 관리',
              action: `메뉴 품절 상태 변경`,
              actor: user.name
            }
          }
        );
        showToast('✅ 메뉴 품절 상태가 반영되었습니다.');
        render();
      });
    });

    const bulkOnBtn = document.getElementById('bulk-soldout-on-btn');
    const bulkOffBtn = document.getElementById('bulk-soldout-off-btn');
    if (bulkOnBtn) {
      bulkOnBtn.addEventListener('click', function () {
        applyBulkSoldOut(true);
      });
    }
    if (bulkOffBtn) {
      bulkOffBtn.addEventListener('click', function () {
        applyBulkSoldOut(false);
      });
    }

    main.querySelectorAll('.opt-item-soldout-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!hasPermission('SOLD_OUT_MANAGE')) {
          showToast('⚠️ 품절 관리 권한이 없습니다.');
          return;
        }
        const cat = btn.getAttribute('data-cat');
        const grpId = btn.getAttribute('data-grp');
        const itemId = btn.getAttribute('data-item');
        const user = getCurrentUser();
        let targetName = '';

        storeState = window.KioskStore.saveState(
          function (st) {
            const groups = st.optionTemplates[cat] || [];
            const grp = groups.find((g) => g.id === grpId);
            const item = grp ? grp.items.find((i) => i.id === itemId) : null;
            if (item) {
              item.soldOut = !item.soldOut;
              item.soldOutReason = item.soldOut ? '재료 소진' : '';
              targetName = item.name;
            }
            return st;
          },
          {
            event: 'SOLD_OUT_CHANGED',
            audit: {
              category: '옵션 품절',
              action: `세부 옵션/재료 품절 토글`,
              actor: user.name
            }
          }
        );
        showToast(`✅ 옵션 [${targetName}] 품절 상태가 고객 화면에 즉시 반영되었습니다.`);
        render();
      });
    });
  }

  function applyBulkSoldOut(makeSoldOut) {
    if (adminSession.selectedSoldOutMenuIds.length === 0) {
      showToast('ℹ️ 먼저 체크박스로 메뉴를 1개 이상 선택해 주세요.');
      return;
    }
    const user = getCurrentUser();
    storeState = window.KioskStore.saveState(
      function (st) {
        st.menus.forEach(function (m) {
          if (adminSession.selectedSoldOutMenuIds.includes(m.id)) {
            m.isSoldOut = makeSoldOut;
            m.soldOutAt = makeSoldOut ? new Date().toISOString() : null;
            m.soldOutBy = makeSoldOut ? user.name : null;
            m.soldOutReason = makeSoldOut ? '일괄 품절 처리' : '';
          }
        });
        return st;
      },
      {
        event: 'SOLD_OUT_CHANGED',
        audit: {
          category: '품절 관리',
          action: `${adminSession.selectedSoldOutMenuIds.length}개 메뉴 일괄 ${makeSoldOut ? '품절' : '품절 해제'} 처리`,
          actor: user.name
        }
      }
    );
    adminSession.selectedSoldOutMenuIds = [];
    saveAdminSession();
    showToast(`✅ 선택 메뉴 일괄 ${makeSoldOut ? '품절' : '해제'} 처리가 완료되었습니다.`);
    render();
  }

  /* ============================================================================
   * 6. 매출 조회 화면
   * ============================================================================ */

  function renderSalesView(main) {
    const mult = adminSession.salesPeriod === 'DAILY' ? 1 : adminSession.salesPeriod === 'WEEKLY' ? 6.5 : 27;
    const validOrders = storeState.orders.filter((o) => o.status !== 'CANCELLED');
    const cancelledOrders = storeState.orders.filter((o) => o.status === 'CANCELLED');

    const baseSales = validOrders.reduce((acc, o) => acc + o.finalAmount, 0);
    const totalSales = Math.round(baseSales * mult);
    const totalCount = Math.round(validOrders.length * mult);
    const avgOrder = totalCount > 0 ? Math.round(totalSales / totalCount) : 0;
    const totalRefund = Math.round(cancelledOrders.reduce((acc, o) => acc + o.finalAmount, 0) * mult);

    // 메뉴별 집계
    const menuSalesMap = {};
    storeState.menus.forEach(function (m) {
      menuSalesMap[m.id] = { id: m.id, name: m.name, qty: 0, amount: 0 };
    });
    validOrders.forEach(function (o) {
      (o.items || []).forEach(function (it) {
        if (!menuSalesMap[it.menuId]) {
          menuSalesMap[it.menuId] = { id: it.menuId, name: it.menuName, qty: 0, amount: 0 };
        }
        menuSalesMap[it.menuId].qty += Math.round(it.quantity * mult);
        menuSalesMap[it.menuId].amount += Math.round(it.totalPrice * mult);
      });
    });

    const menuSalesList = Object.values(menuSalesMap)
      .filter((m) => adminSession.salesMenuFilter === 'ALL' || m.id === adminSession.salesMenuFilter)
      .sort((a, b) => b.amount - a.amount);

    // 결제수단별 집계
    const payStats = { CARD: 0, KAKAOPAY: 0, NAVERPAY: 0, MOBILEPAY: 0 };
    validOrders.forEach(function (o) {
      payStats[o.paymentMethod] = (payStats[o.paymentMethod] || 0) + Math.round(o.finalAmount * mult);
    });

    main.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">📈 매출 조회 및 마감 정산</h1>
        <div style="display:flex; gap:8px;">
          <button type="button" id="download-sales-csv-btn" class="btn btn-secondary">📥 조회 결과 CSV 다운로드</button>
          <button type="button" id="open-closing-modal-btn" class="btn btn-primary">🧾 당일 마감 데이터 확인</button>
        </div>
      </div>

      <section class="filter-bar" aria-label="매출 기간 및 메뉴 필터">
        <div style="display:flex; gap:6px;">
          <button type="button" class="btn btn-sm ${adminSession.salesPeriod === 'DAILY' ? 'btn-primary' : 'btn-secondary'} sales-period-btn" data-p="DAILY">일별 매출</button>
          <button type="button" class="btn btn-sm ${adminSession.salesPeriod === 'WEEKLY' ? 'btn-primary' : 'btn-secondary'} sales-period-btn" data-p="WEEKLY">주별 매출</button>
          <button type="button" class="btn btn-sm ${adminSession.salesPeriod === 'MONTHLY' ? 'btn-primary' : 'btn-secondary'} sales-period-btn" data-p="MONTHLY">월별 매출</button>
        </div>
        <select id="sales-menu-filter" class="form-select" style="width:220px; margin-left:auto;" aria-label="메뉴별 필터">
          <option value="ALL">전체 메뉴 보기</option>
          ${storeState.menus
            .map(
              (m) =>
                `<option value="${m.id}" ${adminSession.salesMenuFilter === m.id ? 'selected' : ''}>${m.name}</option>`
            )
            .join('')}
        </select>
      </section>

      <section class="kpi-grid" aria-label="매출 핵심 지표">
        <div class="kpi-card">
          <span class="kpi-label">총 실매출 금액</span>
          <strong class="kpi-value" style="color:var(--primary);">${window.KioskStore.formatPrice(totalSales)}</strong>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">결제 완료 주문 건수</span>
          <strong class="kpi-value">${totalCount}건</strong>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">평균 주문 금액</span>
          <strong class="kpi-value">${window.KioskStore.formatPrice(avgOrder)}</strong>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">취소 및 환불 금액</span>
          <strong class="kpi-value" style="color:var(--danger);">${window.KioskStore.formatPrice(totalRefund)}</strong>
        </div>
      </section>

      <div class="panel-grid-2">
        <section class="panel" aria-labelledby="menu-sales-heading">
          <div class="panel-header">
            <h2 id="menu-sales-heading" class="panel-title">메뉴별 판매 수량 및 매출</h2>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <caption>메뉴별 판매 실적 표</caption>
              <thead>
                <tr>
                  <th scope="col">메뉴명</th>
                  <th scope="col">판매 수량</th>
                  <th scope="col">매출 금액</th>
                </tr>
              </thead>
              <tbody>
                ${menuSalesList
                  .map(
                    (m) => `
                  <tr>
                    <td><strong>${m.name}</strong></td>
                    <td>${m.qty}개</td>
                    <td><strong>${window.KioskStore.formatPrice(m.amount)}</strong></td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </section>

        <section class="panel" aria-labelledby="pay-method-sales-heading">
          <div class="panel-header">
            <h2 id="pay-method-sales-heading" class="panel-title">결제 수단별 매출 및 취소·환불 내역</h2>
          </div>
          <table class="data-table">
            <caption>결제 수단별 금액 표</caption>
            <thead>
              <tr>
                <th scope="col">결제 수단</th>
                <th scope="col">결제 금액</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>💳 신용·체크카드</td><td><strong>${window.KioskStore.formatPrice(payStats.CARD)}</strong></td></tr>
              <tr><td>💛 카카오페이</td><td><strong>${window.KioskStore.formatPrice(payStats.KAKAOPAY)}</strong></td></tr>
              <tr><td>💚 네이버페이</td><td><strong>${window.KioskStore.formatPrice(payStats.NAVERPAY)}</strong></td></tr>
              <tr><td>📱 애플·삼성페이</td><td><strong>${window.KioskStore.formatPrice(payStats.MOBILEPAY)}</strong></td></tr>
            </tbody>
          </table>
        </section>
      </div>
    `;

    main.querySelectorAll('.sales-period-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        adminSession.salesPeriod = btn.getAttribute('data-p');
        saveAdminSession();
        render();
      });
    });

    document.getElementById('sales-menu-filter').addEventListener('change', function (e) {
      adminSession.salesMenuFilter = e.target.value;
      saveAdminSession();
      render();
    });

    document.getElementById('download-sales-csv-btn').addEventListener('click', function () {
      const csvRows = [
        ['메뉴명', '판매수량', '매출금액'],
        ...menuSalesList.map((m) => [m.name, m.qty, m.amount])
      ];
      const csvString = '\uFEFF' + csvRows.map((r) => r.join(',')).join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `freshsand_sales_${adminSession.salesPeriod.toLowerCase()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('📥 매출 데이터 CSV 파일 다운로드가 완료되었습니다.');
    });

    document.getElementById('open-closing-modal-btn').addEventListener('click', function () {
      openModal(
        '🧾 영업 마감 정산 데이터 확인',
        `
        <div class="alert-box alert-info">
          현재 시각 기준 마감 정산 요약입니다. 미수령 또는 조리 중인 주문을 모두 완료한 뒤 마감을 확정해 주세요.
        </div>
        <ul style="line-height:1.8;">
          <li><strong>총 정상 결제 건수:</strong> ${validOrders.length}건 (${window.KioskStore.formatPrice(baseSales)})</li>
          <li><strong>취소/환불 건수:</strong> ${cancelledOrders.length}건 (${window.KioskStore.formatPrice(
            cancelledOrders.reduce((acc, o) => acc + o.finalAmount, 0)
          )})</li>
          <li><strong>순매출 합계:</strong> ${window.KioskStore.formatPrice(baseSales)}</li>
        </ul>
      `,
        [
          { label: '닫기', className: 'btn-secondary', onClick: closeModal },
          {
            label: '✅ 마감 정산 확인 완료',
            className: 'btn-primary',
            onClick: function () {
              closeModal();
              showToast('✅ 당일 마감 데이터 확인 이력이 기록되었습니다.');
            }
          }
        ]
      );
    });
  }

  /* ============================================================================
   * 7. 매장 설정 화면
   * ============================================================================ */

  function renderSettingsView(main) {
    const s = storeState.store;

    main.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">⚙️ 매장 설정</h1>
      </div>

      <form id="store-settings-form" class="panel-grid-2">
        <section class="panel" aria-labelledby="store-basic-heading">
          <div class="panel-header">
            <h2 id="store-basic-heading" class="panel-title">매장 기본 및 운영 시간 설정</h2>
          </div>
          <div class="form-group">
            <label for="set-store-name" class="form-label">매장명</label>
            <input type="text" id="set-store-name" class="form-input" value="${s.name}" required />
          </div>
          <div class="form-group">
            <label for="set-store-phone" class="form-label">매장 연락처</label>
            <input type="text" id="set-store-phone" class="form-input" value="${s.phone}" required />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div class="form-group">
              <label for="set-order-start" class="form-label">주문 가능 시작 시간</label>
              <input type="time" id="set-order-start" class="form-input" value="${s.orderStartTime}" />
            </div>
            <div class="form-group">
              <label for="set-order-end" class="form-label">주문 가능 종료 시간</label>
              <input type="time" id="set-order-end" class="form-input" value="${s.orderEndTime}" />
            </div>
          </div>
          <div class="form-group">
            <label for="set-prep-mins" class="form-label">예상 준비 시간 기본값 (분)</label>
            <input type="number" id="set-prep-mins" class="form-input" value="${s.estimatedPrepMinutes}" min="1" max="60" />
          </div>
          <div class="form-group">
            <span class="form-label">매장 식사 및 포장 제공 여부</span>
            <div style="display:flex; gap:16px; margin-top:6px;">
              <label style="display:flex; align-items:center; gap:6px; font-weight:700;">
                <input type="checkbox" id="set-allow-dinein" ${s.allowDineIn ? 'checked' : ''} />
                <span>🍽️ 매장 식사 허용</span>
              </label>
              <label style="display:flex; align-items:center; gap:6px; font-weight:700;">
                <input type="checkbox" id="set-allow-takeout" ${s.allowTakeout ? 'checked' : ''} />
                <span>🛍️ 포장 주문 허용</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label for="set-pause-msg" class="form-label">주문 접수 일시 중지 안내 문구</label>
            <textarea id="set-pause-msg" class="form-textarea" rows="2">${s.pauseMessage}</textarea>
          </div>
        </section>

        <section class="panel" aria-labelledby="store-pay-heading">
          <div class="panel-header">
            <h2 id="store-pay-heading" class="panel-title">결제 수단 · 영수증 · 관리자 알림 설정</h2>
          </div>
          <div class="form-group">
            <span class="form-label">모바일 지원 결제 수단 설정</span>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:6px;">
              <label><input type="checkbox" class="set-pay-chk" value="CARD" ${s.supportedPayments.includes('CARD') ? 'checked' : ''} /> 💳 신용·체크카드</label>
              <label><input type="checkbox" class="set-pay-chk" value="KAKAOPAY" ${s.supportedPayments.includes('KAKAOPAY') ? 'checked' : ''} /> 💛 카카오페이</label>
              <label><input type="checkbox" class="set-pay-chk" value="NAVERPAY" ${s.supportedPayments.includes('NAVERPAY') ? 'checked' : ''} /> 💚 네이버페이</label>
              <label><input type="checkbox" class="set-pay-chk" value="MOBILEPAY" ${s.supportedPayments.includes('MOBILEPAY') ? 'checked' : ''} /> 📱 애플·삼성페이</label>
            </div>
          </div>
          <div class="form-group">
            <label for="set-receipt-footer" class="form-label">영수증 하단 안내 문구</label>
            <input type="text" id="set-receipt-footer" class="form-input" value="${s.receiptFooter}" />
          </div>
          <div class="form-group">
            <span class="form-label">관리자 알림 및 자동 출력 설정</span>
            <div style="display:flex; flex-direction:column; gap:6px; margin-top:6px;">
              <label><input type="checkbox" id="set-alert-sound" ${s.alertSoundEnabled ? 'checked' : ''} /> 🔔 신규 주문 도착 시 알림음 재생</label>
              <label><input type="checkbox" id="set-auto-print" ${s.autoPrintReceipt ? 'checked' : ''} /> 🖨️ 주문 접수 시 영수증 자동 출력</label>
            </div>
          </div>
          <div class="form-group">
            <label for="set-delay-mins" class="form-label">조리 지연 경고 기준 시간 (분)</label>
            <input type="number" id="set-delay-mins" class="form-input" value="${s.delayThresholdMinutes || 15}" min="5" max="60" />
          </div>

          <div style="margin-top:20px; display:flex; justify-content:flex-end;">
            <button type="submit" class="btn btn-primary">💾 매장 설정 저장</button>
          </div>
        </section>
      </form>
    `;

    document.getElementById('store-settings-form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!hasPermission('STORE_SETTINGS')) {
        showToast('⚠️ 매장 설정 변경은 점장(관리자) 권한만 가능합니다.');
        return;
      }
      const payArr = [];
      main.querySelectorAll('.set-pay-chk:checked').forEach((c) => payArr.push(c.value));
      if (payArr.length === 0) {
        showToast('⚠️ 최소 1개 이상의 결제 수단을 활성화해야 합니다.');
        return;
      }
      const user = getCurrentUser();
      storeState = window.KioskStore.saveState(
        function (st) {
          st.store.name = document.getElementById('set-store-name').value.trim();
          st.store.phone = document.getElementById('set-store-phone').value.trim();
          st.store.orderStartTime = document.getElementById('set-order-start').value;
          st.store.orderEndTime = document.getElementById('set-order-end').value;
          st.store.estimatedPrepMinutes = Number(document.getElementById('set-prep-mins').value) || 10;
          st.store.allowDineIn = document.getElementById('set-allow-dinein').checked;
          st.store.allowTakeout = document.getElementById('set-allow-takeout').checked;
          st.store.pauseMessage = document.getElementById('set-pause-msg').value.trim();
          st.store.supportedPayments = payArr;
          st.store.receiptFooter = document.getElementById('set-receipt-footer').value.trim();
          st.store.alertSoundEnabled = document.getElementById('set-alert-sound').checked;
          st.store.autoPrintReceipt = document.getElementById('set-auto-print').checked;
          st.store.delayThresholdMinutes = Number(document.getElementById('set-delay-mins').value) || 15;
          return st;
        },
        {
          event: 'STORE_SETTINGS_UPDATED',
          audit: {
            category: '매장 설정',
            action: '매장 운영 시간 및 결제/알림 설정 업데이트',
            actor: user.name
          }
        }
      );
      showToast('✅ 매장 설정이 저장되어 고객 모바일 화면에 반영되었습니다.');
      render();
    });
  }

  /* ============================================================================
   * 8. 사용자 및 권한 화면 + 전체 변경 이력(Audit Log)
   * ============================================================================ */

  function renderUsersView(main) {
    const userRows = storeState.users
      .map(function (u) {
        return `
          <tr>
            <td><strong>${u.username}</strong></td>
            <td>${u.name}</td>
            <td><span class="role-badge">${u.roleName} (${u.role})</span></td>
            <td><small>${u.permissions.join(', ')}</small></td>
            <td>${window.KioskStore.formatDateTime(u.lastLoginAt)}</td>
            <td>${u.isLocked ? '<span class="badge status-cancelled">🔒 잠금됨</span>' : u.isActive ? '<span class="badge status-ready">활성</span>' : '<span class="badge status-pickedup">비활성</span>'}</td>
            <td>
              <button type="button" class="btn btn-outline btn-sm switch-account-btn" data-uid="${u.id}">이 계정으로 전환</button>
            </td>
          </tr>
        `;
      })
      .join('');

    const auditRows = (storeState.auditLogs || [])
      .slice(0, 25)
      .map(function (log) {
        return `
          <tr>
            <td>${window.KioskStore.formatDateTime(log.timestamp)}</td>
            <td><span class="badge status-accepted">${log.category}</span></td>
            <td>${log.action}</td>
            <td><strong>${log.actor}</strong></td>
          </tr>
        `;
      })
      .join('');

    main.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">👥 사용자 및 권한 · 변경 이력</h1>
      </div>

      <section class="panel" aria-labelledby="users-table-heading">
        <div class="panel-header">
          <h2 id="users-table-heading" class="panel-title">관리자 및 직원 계정 목록 (역할별 권한 체계)</h2>
        </div>
        <div class="alert-box alert-info">
          • <strong>직원(STAFF):</strong> 주문 조회 및 상태 변경 &nbsp;|&nbsp;
          <strong>매니저(MANAGER):</strong> 주문 취소, 품절 및 메뉴 수정 &nbsp;|&nbsp;
          <strong>관리자(ADMIN):</strong> 매장 설정, 계정 및 권한 관리
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <caption>관리자 및 직원 계정 목록 표</caption>
            <thead>
              <tr>
                <th scope="col">아이디</th>
                <th scope="col">이름</th>
                <th scope="col">역할</th>
                <th scope="col">부여된 접근 권한</th>
                <th scope="col">마지막 로그인</th>
                <th scope="col">상태</th>
                <th scope="col">빠른 전환</th>
              </tr>
            </thead>
            <tbody>${userRows}</tbody>
          </table>
        </div>
      </section>

      <section class="panel" aria-labelledby="audit-log-heading">
        <div class="panel-header">
          <h2 id="audit-log-heading" class="panel-title">📜 메뉴 · 주문 · 설정 변경 이력 (Audit Log)</h2>
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <caption>시스템 변경 이력 표</caption>
            <thead>
              <tr>
                <th scope="col">변경 시각</th>
                <th scope="col">구분</th>
                <th scope="col">변경 상세 내용</th>
                <th scope="col">처리자</th>
              </tr>
            </thead>
            <tbody>${auditRows}</tbody>
          </table>
        </div>
      </section>
    `;

    main.querySelectorAll('.switch-account-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        adminSession.currentUserId = btn.getAttribute('data-uid');
        saveAdminSession();
        const u = getCurrentUser();
        showToast(`👤 현재 계정이 [${u.name} - ${u.roleName}](으)로 전환되었습니다.`);
        render();
      });
    });
  }

  /* ============================================================================
   * 메인 렌더러 & 이벤트 초기화
   * ============================================================================ */

  function render() {
    storeState = window.KioskStore.loadState();
    updateShellChrome();
    if (!adminSession.isLoggedIn) return;

    const main = document.getElementById('admin-main');
    if (!main) return;

    switch (adminSession.currentView) {
      case 'DASHBOARD':
        renderDashboardView(main);
        break;
      case 'ORDERS':
        renderOrdersView(main);
        break;
      case 'MENUS':
        renderMenusView(main);
        break;
      case 'SOLDOUT':
        renderSoldOutView(main);
        break;
      case 'SALES':
        renderSalesView(main);
        break;
      case 'SETTINGS':
        renderSettingsView(main);
        break;
      case 'USERS':
        renderUsersView(main);
        break;
      default:
        adminSession.currentView = 'DASHBOARD';
        renderDashboardView(main);
    }
  }

  function initEvents() {
    // 1. 로그인 폼 처리 (실패 사유 안내 및 5회 이상 실패 시 계정 보호 잠금)
    const loginForm = document.getElementById('login-form');
    const loginAlert = document.getElementById('login-alert');
    if (loginForm) {
      loginForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        const uName = document.getElementById('login-username').value.trim();
        const uPass = document.getElementById('login-password').value;

        const targetUser = storeState.users.find((u) => u.username === uName);
        if (!targetUser) {
          loginAlert.hidden = false;
          loginAlert.textContent = '❌ 로그인 실패: 존재하지 않는 관리자 아이디입니다.';
          return;
        }
        if (targetUser.isLocked) {
          loginAlert.hidden = false;
          loginAlert.textContent =
            '🔒 계정 보호 안내: 비밀번호 5회 이상 오류로 계정이 잠금되었습니다. 관리자에게 문의하거나 하단의 [계정 보호 잠금 해제]를 눌러주세요.';
          return;
        }
        if (targetUser.password !== uPass) {
          storeState = window.KioskStore.saveState(function (st) {
            const u = st.users.find((x) => x.id === targetUser.id);
            if (u) {
              u.failedAttempts = (u.failedAttempts || 0) + 1;
              if (u.failedAttempts >= 5) u.isLocked = true;
            }
            return st;
          });
          const updated = storeState.users.find((x) => x.id === targetUser.id);
          loginAlert.hidden = false;
          loginAlert.textContent = updated.isLocked
            ? '🔒 비밀번호 5회 연속 실패로 계정 보호 잠금이 활성화되었습니다.'
            : `❌ 비밀번호가 일치하지 않습니다. (실패 횟수: ${updated.failedAttempts}/5회 — 5회 실패 시 계정이 보호 잠금됩니다)`;
          return;
        }

        // 로그인 성공
        storeState = window.KioskStore.saveState(function (st) {
          const u = st.users.find((x) => x.id === targetUser.id);
          if (u) {
            u.failedAttempts = 0;
            u.isLocked = false;
            u.lastLoginAt = new Date().toISOString();
          }
          return st;
        });

        adminSession.isLoggedIn = true;
        adminSession.currentUserId = targetUser.id;
        saveAdminSession();
        loginAlert.hidden = true;
        render();
      });
    }

    document.querySelectorAll('.quick-login-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const uName = btn.getAttribute('data-user');
        const target = storeState.users.find((u) => u.username === uName);
        if (target) {
          adminSession.isLoggedIn = true;
          adminSession.currentUserId = target.id;
          saveAdminSession();
          showToast(`👋 환영합니다! [${target.name}] 계정으로 로그인되었습니다.`);
          render();
        }
      });
    });

    const pwResetBtn = document.getElementById('open-pw-reset-btn');
    if (pwResetBtn) {
      pwResetBtn.addEventListener('click', function () {
        openModal(
          '🔐 관리자 비밀번호 재설정 안내',
          `
          <p>비밀번호를 분실한 경우 본사 시스템 관리자 또는 점장 계정에서 초기화를 진행할 수 있습니다.</p>
          <div class="form-group">
            <label for="reset-target-id" class="form-label">재설정할 아이디 입력</label>
            <input type="text" id="reset-target-id" class="form-input" value="admin" />
          </div>
        `,
          [
            { label: '닫기', className: 'btn-secondary', onClick: closeModal },
            {
              label: '기본 비밀번호(password123)로 초기화',
              className: 'btn-primary',
              onClick: function () {
                closeModal();
                if (loginAlert) {
                  loginAlert.hidden = false;
                  loginAlert.className = 'alert-box alert-info';
                  loginAlert.textContent = '✅ 임시 비밀번호(password123)로 초기화되었습니다.';
                }
              }
            }
          ]
        );
      });
    }

    const unlockBtn = document.getElementById('unlock-accounts-btn');
    if (unlockBtn) {
      unlockBtn.addEventListener('click', function () {
        storeState = window.KioskStore.saveState(function (st) {
          st.users.forEach((u) => {
            u.failedAttempts = 0;
            u.isLocked = false;
          });
          return st;
        });
        if (loginAlert) {
          loginAlert.hidden = false;
          loginAlert.className = 'alert-box alert-info';
          loginAlert.textContent = '🔓 모든 계정의 잠금 상태와 실패 횟수가 초기화되었습니다.';
        }
      });
    }

    // 좌측 네비게이션 전환
    document.querySelectorAll('.nav-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        adminSession.currentView = btn.getAttribute('data-view');
        saveAdminSession();
        render();
      });
    });

    // 상단 바 이벤트
    const togglePauseBtn = document.getElementById('topbar-toggle-pause-btn');
    if (togglePauseBtn) {
      togglePauseBtn.addEventListener('click', promptToggleOrderPause);
    }

    const logoutBtn = document.getElementById('topbar-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        adminSession.isLoggedIn = false;
        saveAdminSession();
        render();
      });
    }

    const offlineToggle = document.getElementById('admin-offline-toggle');
    if (offlineToggle) {
      offlineToggle.addEventListener('change', function () {
        adminSession.simOffline = offlineToggle.checked;
        saveAdminSession();
        render();
      });
    }

    const reconnectBtn = document.getElementById('admin-reconnect-btn');
    if (reconnectBtn) {
      reconnectBtn.addEventListener('click', function () {
        adminSession.simOffline = false;
        saveAdminSession();
        showToast('🟢 서버와 다시 연결되어 최신 주문 상태를 동기화했습니다.');
        render();
      });
    }

    const resetDataBtn = document.getElementById('reset-demo-data-btn');
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', function () {
        window.KioskStore.resetToDefault();
        showToast('🔄 모든 데모 데이터가 초기 상태로 복원되었습니다.');
        render();
      });
    }

    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    // 시계 업데이트
    setInterval(function () {
      const clockEl = document.getElementById('topbar-current-time');
      if (clockEl) {
        clockEl.textContent = window.KioskStore.formatTimeOnly(new Date().toISOString());
      }
    }, 1000);

    // 실시간 스토어 구독 (고객이 신규 주문을 넣으면 알림음 + 토스트 + 화면 즉시 갱신)
    window.KioskStore.subscribe(function (nextState, payload) {
      storeState = nextState;
      if (payload && payload.meta && payload.meta.event === 'NEW_ORDER_CREATED') {
        playAlertSound();
        const newest = nextState.orders[0];
        if (newest) {
          adminSession.selectedOrderId = newest.id;
          showToast(`🔔 [신규 주문 도착] 주문번호 ${newest.orderNumber} (${window.KioskStore.formatPrice(newest.finalAmount)}) 주문이 접수 대기 중입니다!`);
        }
      }
      render();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initEvents();
    render();
  });
})();

