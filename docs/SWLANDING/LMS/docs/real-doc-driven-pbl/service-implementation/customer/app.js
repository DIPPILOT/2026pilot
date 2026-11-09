/**
 * 고객 모바일 주문 서비스 애플리케이션 (Fresh Route 디자인 콘셉트 적용)
 * - Organic & Bold 미학, 컷 코너 카드, 4:3 음식 단면 비주얼, 2px 라인 아이콘 & 채워진 상태 아이콘
 * - 재료가 쌓이는 순서의 주문 진행 단계 시각화 및 직접적이고 친근한 한국어 문구 체계 적용
 */

(function () {
  'use strict';

  const SESSION_KEY = 'SANDWICH_CUSTOMER_SESSION_V1';
  const ORDER_API_URL =
    'https://script.google.com/macros/s/AKfycbwnBPBoFAOMYkNAATlV2jKi1dMhVTbpuevMiWkamOZGJvqZt5_PqCNPyNdn5ZYWtdVbmw/exec';

  const SCREEN_TITLES = {
    START: '주문 시작',
    MENU_LIST: '메뉴 선택',
    MENU_DETAIL: '옵션 선택',
    CART: '장바구니',
    ORDER_CONFIRM: '주문 확인',
    PAYMENT: '결제하기',
    ORDER_COMPLETE: '주문 완료',
    ORDER_STATUS: '주문 상태'
  };

  /* 9. 아이콘 체계: 2px 선 두께의 라인 아이콘 & 채워진 상태 아이콘 (장식용 이모지 미사용) */
  function getLineIcon(name) {
    const icons = {
      dineIn: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>`,
      takeout: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
      clock: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
      mapPin: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
      phone: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0122 16.92z"/></svg>`,
      card: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>`,
      wallet: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 00-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>`,
      smartphone: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>`,
      plus: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`
    };
    return icons[name] || '';
  }

  function getFilledStatusIcon(type) {
    const icons = {
      check: `<svg class="status-svg-icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
      checkMarkOnly: `<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"/></svg>`,
      warning: `<svg class="status-svg-icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
      error: `<svg class="status-svg-icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>`,
      info: `<svg class="status-svg-icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`,
      star: `<svg class="status-svg-icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
    };
    return icons[type] || '';
  }

  /**
   * 9. 음식 사진: 4:3 비율 통일, 밝은 자연광 크림색 배경, 샌드위치 단면과 재료 질감이 선명하게 보이는 SVG 푸드 그래픽
   * 모든 음식 이미지에 메뉴명 중심의 대체 텍스트(aria-label) 제공
   */
  function renderFoodVisualSvg(menu) {
    const id = menu ? menu.id : 'hero';
    const label = menu ? `${menu.name} 상품 이미지` : '신선한 수제 샌드위치 대표 이미지';

    // 메뉴별 고유 식재료 단면 컬러 구성
    const palettes = {
      'menu-sw-1': { bread: '#D99B52', lettuce: '#2E9E5B', filling1: '#86C96A', filling2: '#F3E5AB', tomato: '#E04F3E' }, // 바질 치킨 아보카도
      'menu-sw-2': { bread: '#D48C46', lettuce: '#288E50', filling1: '#C84B31', filling2: '#F4C542', tomato: '#D93829' }, // 이탈리안 비엠티 클럽
      'menu-sw-3': { bread: '#DF9A4F', lettuce: '#35A463', filling1: '#F4C542', filling2: '#A84432', tomato: '#FFF3B0' }, // 트러플 에그마요 베이컨
      'menu-sw-4': { bread: '#C67D3B', lettuce: '#257D47', filling1: '#7A3E3E', filling2: '#E8D8C8', tomato: '#D14836' }, // 로스트 비프
      'menu-sw-5': { bread: '#CFA063', lettuce: '#2E9E5B', filling1: '#F28C28', filling2: '#FAF6F0', tomato: '#8E5431' }, // 구운 단호박 & 리코타
      'menu-sw-6': { bread: '#D7A45E', lettuce: '#46A768', filling1: '#F3B8A2', filling2: '#FFF4C7', tomato: '#DDEB77' }, // 레몬 딜 쉬림프
      'menu-bev-1': { type: 'bev', liquid: '#3B2314', top: '#C89D66', garnish: '#6F4E37' }, // 아메리카노
      'menu-bev-2': { type: 'bev', liquid: '#D7B38C', top: '#FFFDF9', garnish: '#F4C542' }, // 바닐라 빈 라떼
      'menu-bev-3': { type: 'bev', liquid: '#F26B5B', top: '#FDE2DC', garnish: '#F28C28' }, // 자몽 에이드
      'menu-bev-4': { type: 'bev', liquid: '#E86F88', top: '#FFF5F7', garnish: '#C83D3D' }, // 생딸기 요거트 스무디
      'menu-bev-5': { type: 'bev', liquid: '#D9ED77', top: '#F7FEE7', garnish: '#63A94F' }  // 시트러스 민트 콤부차
    };

    const p = palettes[id] || (menu && menu.category === 'BEVERAGE' ? palettes['menu-bev-1'] : palettes['menu-sw-1']);

    if (p.type === 'bev') {
      return `
        <svg viewBox="0 0 320 240" role="img" aria-label="${label}">
          <rect width="320" height="240" fill="#FFF9ED" />
          <circle cx="160" cy="126" r="84" fill="#FFFFFF" stroke="#E6E1D5" stroke-width="2" />
          <!-- 컵 몸체 -->
          <path d="M116 78 h88 l-10 112 a12 12 0 0 1 -12 10 h-44 a12 12 0 0 1 -12 -10 z" fill="${p.liquid}" />
          <!-- 크림/거품 층 -->
          <path d="M114 78 q46 -18 92 0 v18 h-92 z" fill="${p.top}" />
          <!-- 얼음 큐브 질감 -->
          <rect x="130" y="102" width="22" height="20" rx="4" fill="#FFFFFF" fill-opacity="0.45" />
          <rect x="164" y="108" width="24" height="20" rx="4" fill="#FFFFFF" fill-opacity="0.4" />
          <rect x="145" y="134" width="22" height="20" rx="4" fill="#FFFFFF" fill-opacity="0.35" />
          <!-- 돔 리드 & 스트로우 -->
          <path d="M110 78 a50 34 0 0 1 100 0 z" fill="#FFFFFF" fill-opacity="0.55" stroke="#E6E1D5" stroke-width="2" />
          <path d="M168 32 l-12 72" stroke="#147D4E" stroke-width="7" stroke-linecap="round" />
          <circle cx="188" cy="76" r="10" fill="${p.garnish}" />
        </svg>
      `;
    }

    return `
      <svg viewBox="0 0 320 240" role="img" aria-label="${label}">
        <rect width="320" height="240" fill="#FFF9ED" />
        <!-- 자연광 플레이트 배경 도형 -->
        <ellipse cx="160" cy="176" rx="118" ry="26" fill="#FFFFFF" stroke="#E6E1D5" stroke-width="2" />
        <!-- 하단 브레드 베이스 -->
        <path d="M62 152 q98 22 196 0 l-8 20 q-90 18 -180 0 z" fill="${p.bread}" />
        <!-- 메인 속재료 층 (치즈/에그/치킨/아보카도) -->
        <rect x="68" y="134" width="184" height="18" rx="9" fill="${p.filling2}" />
        <rect x="74" y="118" width="172" height="18" rx="9" fill="${p.filling1}" />
        <!-- 슬라이스 토마토 -->
        <rect x="82" y="104" width="68" height="14" rx="7" fill="${p.tomato}" />
        <rect x="166" y="104" width="68" height="14" rx="7" fill="${p.tomato}" />
        <!-- 신선한 양상추 물결 층 -->
        <path d="M58 104 q16 -16 32 0 t32 0 t32 0 t32 0 t32 0 t32 0 l-6 12 h-180 z" fill="${p.lettuce}" />
        <!-- 상단 브리오슈/위트 브레드 & 참깨/귀리 씨앗 디테일 -->
        <path d="M60 98 C60 52, 260 52, 260 98 Z" fill="${p.bread}" />
        <ellipse cx="122" cy="72" rx="5" ry="2.5" fill="#FFF9ED" />
        <ellipse cx="156" cy="66" rx="5" ry="2.5" fill="#FFF9ED" />
        <ellipse cx="192" cy="73" rx="5" ry="2.5" fill="#FFF9ED" />
        <ellipse cx="140" cy="82" rx="4" ry="2" fill="#FFF9ED" />
        <ellipse cx="176" cy="81" rx="4" ry="2" fill="#FFF9ED" />
      </svg>
    `;
  }

  function loadSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      screen: 'START',
      historyStack: [],
      orderType: 'DINE_IN',
      selectedCategory: 'RECOMMENDED',
      activeMenuId: null,
      editingCartItemId: null,
      detailQuantity: 1,
      detailSelections: {},
      detailErrorGroupId: null,
      detailErrorMessage: '',
      cart: [],
      customerRequest: '',
      selectedPaymentMethod: 'KAKAOPAY',
      paymentState: 'IDLE',
      paymentFailReason: '',
      activeOrderId: 'ord-1001',
      myOrderIds: ['ord-1001', 'ord-1002', 'ord-1003'],
      simInvalidLink: false,
      simNetworkOffline: false,
      simPaymentBehavior: 'SUCCESS'
    };
  }

  let session = loadSession();
  let storeState = window.KioskStore.loadState();
  let isFinalizingOrder = false;

  function saveSession() {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {}
  }

  function showToast(msg) {
    const toast = document.getElementById('live-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.hidden = true;
    }, 4000);
  }

  function navigateTo(screen, pushHistory = true) {
    if (pushHistory && session.screen !== screen) {
      session.historyStack.push(session.screen);
    }
    session.screen = screen;
    saveSession();
    render();
    const mainEl = document.getElementById('main-content');
    if (mainEl) mainEl.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    if (session.screen === 'PAYMENT' && session.paymentState === 'PROCESSING') {
      showToast('결제 결과를 확인하고 있어요. 잠시만 기다려 주세요.');
      return;
    }
    if (session.historyStack.length > 0) {
      session.screen = session.historyStack.pop();
    } else {
      session.screen = 'START';
    }
    saveSession();
    render();
  }

  function getStoreAvailability() {
    if (session.simInvalidLink) {
      return {
        canOrder: false,
        code: 'INVALID_LINK',
        badgeText: '유효하지 않은 링크',
        badgeClass: 'badge-error',
        iconType: 'error',
        title: '매장 주문 링크가 올바르지 않습니다',
        reason: '접속하신 QR 코드나 주문 주소가 만료되었습니다. 매장에 비치된 QR 코드를 다시 스캔해 주세요.'
      };
    }
    if (session.simNetworkOffline) {
      return {
        canOrder: false,
        code: 'OFFLINE',
        badgeText: '네트워크 연결 확인 필요',
        badgeClass: 'badge-error',
        iconType: 'error',
        title: '네트워크 연결이 끊어졌습니다',
        reason: '선택하신 메뉴와 장바구니는 기기에 보관되어 있습니다. 와이파이 또는 모바일 데이터를 확인한 뒤 다시 시도해 주세요.'
      };
    }
    if (storeState.store.isForceClosed) {
      return {
        canOrder: false,
        code: 'CLOSED',
        badgeText: '영업시간 종료',
        badgeClass: 'badge-closed',
        iconType: 'error',
        title: '지금은 주문 가능 시간이 아닙니다',
        reason: `매장 주문 가능 시간은 ${storeState.store.orderStartTime} ~ ${storeState.store.orderEndTime}입니다. 운영 시간 내에 다시 방문해 주세요.`
      };
    }
    if (storeState.store.isOrderPaused) {
      return {
        canOrder: false,
        code: 'PAUSED',
        badgeText: '주문 일시 중지',
        badgeClass: 'badge-paused',
        iconType: 'warning',
        title: '잠시 모바일 주문을 멈추고 있어요',
        reason: storeState.store.pauseMessage || '매장 내 주문이 많아 잠시 후 다시 이용해 주세요.'
      };
    }
    return {
      canOrder: true,
      code: 'OPEN',
      badgeText: '주문 가능',
      badgeClass: 'badge-open',
      iconType: 'check',
      title: '바로 주문할 수 있어요',
      reason: ''
    };
  }

  function getCartTotalInfo() {
    const validation = window.KioskStore.validateCartItems(storeState, session.cart);
    let totalQty = 0;
    let totalAmount = 0;
    validation.items.forEach(function (item) {
      totalQty += item.quantity;
      totalAmount += item.totalPrice;
    });
    return {
      totalQty: totalQty,
      totalAmount: totalAmount,
      discountAmount: 0,
      finalAmount: totalAmount,
      validation: validation
    };
  }

  function openMenuDetail(menuId, editingCartItem) {
    const menu = storeState.menus.find((m) => m.id === menuId);
    if (!menu) return;
    if (menu.isSoldOut && !editingCartItem) {
      showToast('품절된 메뉴는 선택할 수 없습니다.');
      return;
    }

    session.activeMenuId = menuId;
    session.detailErrorGroupId = null;
    session.detailErrorMessage = '';

    const optionGroups = window.KioskStore.getMenuOptionGroups(storeState, menu);
    if (editingCartItem) {
      session.editingCartItemId = editingCartItem.cartItemId;
      session.detailQuantity = editingCartItem.quantity;
      const map = {};
      optionGroups.forEach((g) => {
        map[g.id] = [];
      });
      (editingCartItem.selectedOptions || []).forEach((sel) => {
        if (!map[sel.groupId]) map[sel.groupId] = [];
        const grp = optionGroups.find((g) => g.id === sel.groupId);
        const opt = grp ? grp.items.find((i) => i.id === sel.itemId) : null;
        if (opt && !opt.soldOut) {
          map[sel.groupId].push(sel.itemId);
        }
      });
      session.detailSelections = map;
    } else {
      session.editingCartItemId = null;
      session.detailQuantity = 1;
      const map = {};
      optionGroups.forEach((g) => {
        map[g.id] = [];
      });
      session.detailSelections = map;
    }
    navigateTo('MENU_DETAIL');
  }

  function calculateDetailPricing(menu) {
    if (!menu) return { unitPrice: 0, totalPrice: 0, missingGroups: [], soldOutSelected: [] };
    const optionGroups = window.KioskStore.getMenuOptionGroups(storeState, menu);
    let optionSum = 0;
    const missingGroups = [];
    const soldOutSelected = [];

    optionGroups.forEach(function (grp) {
      const selectedIds = session.detailSelections[grp.id] || [];
      const validSelectedIds = [];
      selectedIds.forEach(function (id) {
        const item = grp.items.find((i) => i.id === id);
        if (item) {
          if (item.soldOut) {
            soldOutSelected.push({ groupName: grp.name, itemName: item.name });
          } else {
            validSelectedIds.push(id);
            optionSum += item.price;
          }
        }
      });

      if (grp.required && validSelectedIds.length < (grp.minSelect || 1)) {
        missingGroups.push(grp);
      }
    });

    const unitPrice = menu.price + optionSum;
    return {
      unitPrice: unitPrice,
      totalPrice: unitPrice * session.detailQuantity,
      missingGroups: missingGroups,
      soldOutSelected: soldOutSelected
    };
  }

  /* ============================================================================
   * 공통 상단 헤더 & 하단 고정 바 업데이트 (Section 11 문구 스타일 준수)
   * ============================================================================ */

  function renderHeaderAndFooter() {
    const storeNameEl = document.getElementById('header-store-name');
    const screenTitleEl = document.getElementById('header-screen-title');
    const backBtn = document.getElementById('header-back-btn');
    const cartBtn = document.getElementById('header-cart-btn');
    const cartCountEl = document.getElementById('header-cart-count');
    const orderStatusBtn = document.getElementById('header-order-status-btn');
    const activeOrderLabel = document.getElementById('header-active-order-label');
    const offlineBanner = document.getElementById('offline-banner');

    if (storeNameEl) {
      storeNameEl.textContent = session.simInvalidLink ? '매장 확인 필요' : storeState.store.name;
    }
    if (screenTitleEl) {
      screenTitleEl.textContent = SCREEN_TITLES[session.screen] || '주문하기';
    }
    if (backBtn) {
      backBtn.hidden = session.screen === 'START';
    }
    if (offlineBanner) {
      offlineBanner.hidden = !session.simNetworkOffline;
    }

    const cartInfo = getCartTotalInfo();
    if (cartCountEl) {
      cartCountEl.textContent = String(cartInfo.totalQty);
    }
    if (cartBtn) {
      cartBtn.hidden = session.screen === 'PAYMENT' && session.paymentState === 'PROCESSING';
    }

    const activeOrder =
      storeState.orders.find((o) => o.id === session.activeOrderId) ||
      storeState.orders[0];
    if (orderStatusBtn && activeOrder) {
      orderStatusBtn.hidden = false;
      const stMeta = window.KioskStore.ORDER_STATUS[activeOrder.status] || { customerLabel: activeOrder.status };
      activeOrderLabel.textContent = `${activeOrder.orderNumber} · ${stMeta.customerLabel}`;
    }

    const footer = document.getElementById('app-footer');
    const reasonBox = document.getElementById('footer-reason-box');
    const reasonText = document.getElementById('footer-reason-text');
    const priceLabel = document.getElementById('footer-price-label');
    const priceValue = document.getElementById('footer-price-value');
    const actionsContainer = document.getElementById('footer-actions');

    if (!footer || !actionsContainer) return;

    const avail = getStoreAvailability();
    reasonBox.hidden = true;
    actionsContainer.innerHTML = '';

    if (session.screen === 'START') {
      priceLabel.textContent = '선택한 식사 방식';
      priceValue.textContent = session.orderType === 'DINE_IN' ? '매장 식사' : '포장 주문';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-primary btn-thumb';
      btn.textContent = '주문 시작';
      if (!avail.canOrder) {
        btn.disabled = true;
        btn.setAttribute('aria-describedby', 'footer-reason-text');
        reasonBox.hidden = false;
        reasonText.textContent = avail.title;
      }
      btn.addEventListener('click', function () {
        if (!avail.canOrder) return;
        navigateTo('MENU_LIST');
      });
      actionsContainer.appendChild(btn);
    } else if (session.screen === 'MENU_LIST') {
      priceLabel.textContent = `총 주문 금액 (${cartInfo.totalQty}개)`;
      priceValue.textContent = window.KioskStore.formatPrice(cartInfo.totalAmount);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-primary btn-thumb';
      btn.textContent = cartInfo.totalQty > 0 ? `장바구니 보기 (${cartInfo.totalQty})` : '장바구니 보기';
      if (cartInfo.totalQty === 0) {
        btn.disabled = true;
        btn.setAttribute('aria-describedby', 'footer-reason-text');
        reasonBox.hidden = false;
        reasonText.textContent = '원하는 메뉴를 선택해 장바구니에 담아 주세요.';
      }
      btn.addEventListener('click', function () {
        navigateTo('CART');
      });
      actionsContainer.appendChild(btn);
    } else if (session.screen === 'MENU_DETAIL') {
      const menu = storeState.menus.find((m) => m.id === session.activeMenuId);
      const pricing = calculateDetailPricing(menu);
      priceLabel.textContent = `상품 금액 (${session.detailQuantity}개)`;
      priceValue.textContent = window.KioskStore.formatPrice(pricing.totalPrice);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-primary btn-thumb';
      btn.textContent = session.editingCartItemId ? '옵션 변경 저장' : '장바구니 담기';

      if (!menu || menu.isSoldOut) {
        btn.disabled = true;
        btn.setAttribute('aria-describedby', 'footer-reason-text');
        reasonBox.hidden = false;
        reasonText.textContent = '품절된 메뉴입니다. 다른 메뉴를 선택해 주세요.';
      } else if (pricing.soldOutSelected.length > 0) {
        btn.disabled = true;
        btn.setAttribute('aria-describedby', 'footer-reason-text');
        reasonBox.hidden = false;
        reasonText.textContent = `${pricing.soldOutSelected.map((s) => s.itemName).join(', ')} 옵션이 품절되었어요. 다른 옵션을 선택해 주세요.`;
      } else if (pricing.missingGroups.length > 0) {
        btn.disabled = true;
        btn.setAttribute('aria-describedby', 'footer-reason-text');
        reasonBox.hidden = false;
        // 11. 문구 스타일 좋은 예: "빵 종류를 선택해 주세요."
        const firstMissing = pricing.missingGroups[0].name;
        reasonText.textContent =
          pricing.missingGroups.length === 1
            ? `${firstMissing}을(를) 선택해 주세요.`
            : `${pricing.missingGroups.map((g) => g.name).join(', ')}을(를) 선택해 주세요.`;
      }

      btn.addEventListener('click', function () {
        handleAddOrUpdateCart(menu, pricing);
      });
      actionsContainer.appendChild(btn);
    } else if (session.screen === 'CART') {
      priceLabel.textContent = '총 결제 예정 금액';
      priceValue.textContent = window.KioskStore.formatPrice(cartInfo.finalAmount);

      const addMoreBtn = document.createElement('button');
      addMoreBtn.type = 'button';
      addMoreBtn.className = 'btn-secondary';
      addMoreBtn.textContent = '메뉴 더 담기';
      addMoreBtn.addEventListener('click', function () {
        navigateTo('MENU_LIST');
      });

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'btn-primary';
      nextBtn.textContent = '주문 확인';

      const maxQty = storeState.store.maxOrderQty || 20;
      if (session.cart.length === 0) {
        nextBtn.disabled = true;
        reasonBox.hidden = false;
        reasonText.textContent = '장바구니가 비어 있어요. 메뉴를 먼저 담아 주세요.';
      } else if (!avail.canOrder) {
        nextBtn.disabled = true;
        reasonBox.hidden = false;
        reasonText.textContent = avail.title;
      } else if (cartInfo.validation.hasBlockingIssues) {
        nextBtn.disabled = true;
        reasonBox.hidden = false;
        reasonText.textContent = '품절된 상품이나 옵션이 있어요. 옵션을 바꾸거나 삭제해 주세요.';
      } else if (cartInfo.validation.hasPriceChanges) {
        nextBtn.disabled = true;
        reasonBox.hidden = false;
        reasonText.textContent = '가격이 변경된 메뉴가 있어요. 최신 금액 적용 버튼을 눌러 주세요.';
      } else if (cartInfo.totalQty > maxQty) {
        nextBtn.disabled = true;
        reasonBox.hidden = false;
        reasonText.textContent = `한 번에 최대 ${maxQty}개까지 주문할 수 있어요. 수량을 줄여 주세요.`;
      }

      nextBtn.addEventListener('click', function () {
        navigateTo('ORDER_CONFIRM');
      });

      actionsContainer.appendChild(addMoreBtn);
      actionsContainer.appendChild(nextBtn);
    } else if (session.screen === 'ORDER_CONFIRM') {
      priceLabel.textContent = '총 결제 금액';
      priceValue.textContent = window.KioskStore.formatPrice(cartInfo.finalAmount);

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn-secondary';
      editBtn.textContent = '주문 변경';
      editBtn.addEventListener('click', function () {
        navigateTo('CART');
      });

      const payBtn = document.createElement('button');
      payBtn.type = 'button';
      payBtn.className = 'btn-primary';
      payBtn.textContent = '결제하기';

      if (!avail.canOrder || cartInfo.validation.hasIssues || session.cart.length === 0) {
        payBtn.disabled = true;
        reasonBox.hidden = false;
        reasonText.textContent = !avail.canOrder ? avail.title : '장바구니 상품 상태를 먼저 확인해 주세요.';
      }

      payBtn.addEventListener('click', function () {
        session.paymentState = 'IDLE';
        session.paymentFailReason = '';
        navigateTo('PAYMENT');
      });

      actionsContainer.appendChild(editBtn);
      actionsContainer.appendChild(payBtn);
    } else if (session.screen === 'PAYMENT') {
      priceLabel.textContent = '총 결제 금액';
      priceValue.textContent = window.KioskStore.formatPrice(cartInfo.finalAmount);

      const execPayBtn = document.createElement('button');
      execPayBtn.type = 'button';
      execPayBtn.className = 'btn-primary btn-thumb';

      if (session.paymentState === 'PROCESSING') {
        // 7. 장바구니와 결제: 결제 처리 중에는 버튼 문구를 '결제 확인 중'으로 바꾸고 중복 입력을 막습니다.
        execPayBtn.disabled = true;
        execPayBtn.textContent = '결제 확인 중';
        reasonBox.hidden = false;
        reasonText.textContent = '결제 결과를 확인하고 있어요. 버튼을 다시 누르지 마세요.';
      } else if (session.paymentState === 'UNCERTAIN') {
        execPayBtn.disabled = true;
        execPayBtn.textContent = '결제 확인 중';
        reasonBox.hidden = false;
        reasonText.textContent = '결제 결과를 확인하고 있어요. 버튼을 다시 누르지 마세요.';
      } else if (!session.selectedPaymentMethod) {
        execPayBtn.disabled = true;
        execPayBtn.textContent = '결제하기';
        reasonBox.hidden = false;
        reasonText.textContent = '결제 수단을 선택해 주세요.';
      } else {
        execPayBtn.textContent = session.paymentState === 'FAILED' ? '다시 결제하기' : '결제하기';
      }

      execPayBtn.addEventListener('click', function () {
        executePayment();
      });
      actionsContainer.appendChild(execPayBtn);
    } else if (session.screen === 'ORDER_COMPLETE') {
      const ord = storeState.orders.find((o) => o.id === session.activeOrderId);
      priceLabel.textContent = '결제 금액';
      priceValue.textContent = ord ? window.KioskStore.formatPrice(ord.finalAmount) : '0원';

      const statusBtn = document.createElement('button');
      statusBtn.type = 'button';
      statusBtn.className = 'btn-primary btn-thumb';
      statusBtn.textContent = '주문 상태 확인';
      statusBtn.addEventListener('click', function () {
        navigateTo('ORDER_STATUS');
      });
      actionsContainer.appendChild(statusBtn);
    } else if (session.screen === 'ORDER_STATUS') {
      const ord = storeState.orders.find((o) => o.id === session.activeOrderId) || storeState.orders[0];
      priceLabel.textContent = ord ? `주문번호 ${ord.orderNumber}` : '주문 내역';
      priceValue.textContent = ord ? window.KioskStore.formatPrice(ord.finalAmount) : '0원';

      const newOrderBtn = document.createElement('button');
      newOrderBtn.type = 'button';
      newOrderBtn.className = 'btn-primary btn-thumb';
      newOrderBtn.textContent = '메뉴 더 주문하기';
      newOrderBtn.addEventListener('click', function () {
        navigateTo('MENU_LIST');
      });
      actionsContainer.appendChild(newOrderBtn);
    }
  }

  function handleAddOrUpdateCart(menu, pricing) {
    if (!menu || pricing.missingGroups.length > 0 || pricing.soldOutSelected.length > 0) return;

    const optionGroups = window.KioskStore.getMenuOptionGroups(storeState, menu);
    const selectedOptions = [];
    let optionPrice = 0;

    optionGroups.forEach(function (grp) {
      const ids = session.detailSelections[grp.id] || [];
      ids.forEach(function (itemId) {
        const opt = grp.items.find((i) => i.id === itemId);
        if (opt && !opt.soldOut) {
          selectedOptions.push({
            groupId: grp.id,
            groupName: grp.name,
            itemId: opt.id,
            itemName: opt.name,
            price: opt.price
          });
          optionPrice += opt.price;
        }
      });
    });

    const unitPrice = menu.price + optionPrice;
    const cartEntry = {
      cartItemId: session.editingCartItemId || 'ci-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      menuId: menu.id,
      menuName: menu.name,
      category: menu.category,
      basePrice: menu.price,
      optionPrice: optionPrice,
      unitPrice: unitPrice,
      quantity: session.detailQuantity,
      totalPrice: unitPrice * session.detailQuantity,
      selectedOptions: selectedOptions
    };

    if (session.editingCartItemId) {
      const idx = session.cart.findIndex((c) => c.cartItemId === session.editingCartItemId);
      if (idx >= 0) {
        session.cart[idx] = cartEntry;
      }
      session.editingCartItemId = null;
      showToast('옵션과 수량을 변경했어요.');
      navigateTo('CART');
    } else {
      session.cart.push(cartEntry);
      showToast(`${menu.name}을(를) 장바구니에 담았어요.`);
      navigateTo('MENU_LIST');
    }
  }

  function executePayment() {
    if (session.paymentState === 'PROCESSING' || session.paymentState === 'UNCERTAIN') return;
    const avail = getStoreAvailability();
    if (!avail.canOrder) {
      session.paymentState = 'FAILED';
      session.paymentFailReason = `${avail.title} (${avail.reason})`;
      render();
      return;
    }

    session.paymentState = 'PROCESSING';
    session.paymentFailReason = '';
    render();

    setTimeout(function () {
      if (session.simNetworkOffline) {
        session.paymentState = 'UNCERTAIN';
        saveSession();
        render();
        return;
      }

      if (session.simPaymentBehavior === 'FAIL') {
        session.paymentState = 'FAILED';
        session.paymentFailReason =
          '카드 한도 초과 또는 승인 거절로 결제가 완료되지 않았어요. 다른 결제 수단을 선택하거나 한도를 확인한 뒤 다시 시도해 주세요.';
        saveSession();
        render();
        return;
      }

      if (session.simPaymentBehavior === 'UNCERTAIN') {
        session.paymentState = 'UNCERTAIN';
        saveSession();
        render();
        return;
      }

      finalizeOrderCreation();
    }, 900);
  }

  async function saveOrderToSheet(orderSequence) {
    const response = await fetch(ORDER_API_URL, {
      method: 'POST',
      headers: {
        // text/plain을 사용하면 Apps Script 호출 시 CORS 사전 요청을 피할 수 있습니다.
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        order_number: orderSequence,
        bill_state: '결제완료',
        order_type: session.orderType === 'DINE_IN' ? '매장' : '포장',
        // 현재 화면에서 제공하는 결제 수단은 카드 및 카드 기반 간편결제입니다.
        bill_type: '카드'
      })
    });

    if (!response.ok) {
      throw new Error(`주문 API 응답 오류 (${response.status})`);
    }

    const result = await response.json();
    if (!result || !result.ok) {
      throw new Error((result && result.message) || '주문 저장에 실패했습니다.');
    }

    return result.data;
  }

  async function finalizeOrderCreation() {
    if (isFinalizingOrder) return;
    isFinalizingOrder = true;

    const cartInfo = getCartTotalInfo();
    let createdOrder = null;
    let orderSequence = null;
    let savedSheetOrder = null;

    session.paymentState = 'PROCESSING';
    session.paymentFailReason = '';
    saveSession();
    render();

    try {
      // 여러 탭에서 동시에 주문하더라도 고객 주문번호가 겹치지 않도록 먼저 번호를 예약합니다.
      storeState = window.KioskStore.saveState(function (state) {
        orderSequence = state.nextOrderSequence || 104;
        state.nextOrderSequence = orderSequence + 1;
        return state;
      });

      savedSheetOrder = await saveOrderToSheet(orderSequence);
    } catch (error) {
      session.paymentState = 'FAILED';
      session.paymentFailReason =
        '주문 데이터 저장에 실패했습니다. 네트워크 연결을 확인한 뒤 다시 시도해 주세요. (' +
        (error && error.message ? error.message : '알 수 없는 오류') +
        ')';
      saveSession();
      render();
      isFinalizingOrder = false;
      return;
    }

    storeState = window.KioskStore.saveState(
      function (state) {
        const orderNumber = 'A-' + orderSequence;

        const now = new Date().toISOString();
        const pmMeta = window.KioskStore.PAYMENT_METHODS[session.selectedPaymentMethod] || { name: '간편결제' };

        createdOrder = {
          id: 'ord-' + Date.now(),
          orderNumber: orderNumber,
          createdAt: now,
          paidAt: now,
          orderType: session.orderType,
          status: 'PAID',
          paymentStatus: 'PAID',
          paymentMethod: session.selectedPaymentMethod,
          sheetOrderIdx: savedSheetOrder && savedSheetOrder.idx,
          sheetSavedAt: savedSheetOrder && savedSheetOrder.order_date,
          customerRequest: (session.customerRequest || '').trim(),
          totalAmount: cartInfo.totalAmount,
          discountAmount: cartInfo.discountAmount,
          finalAmount: cartInfo.finalAmount,
          estimatedPrepMinutes: state.store.estimatedPrepMinutes || 10,
          cancelReason: '',
          refundStatus: '',
          items: cartInfo.validation.items.map(function (it, i) {
            return {
              id: 'ord-item-' + i + '-' + Date.now(),
              menuId: it.menuId,
              menuName: it.menuName,
              category: it.category,
              basePrice: it.latestBasePrice,
              optionPrice: it.latestOptionPrice,
              unitPrice: it.latestUnitPrice,
              quantity: it.quantity,
              totalPrice: it.latestTotalPrice,
              selectedOptions: it.selectedOptions
            };
          }),
          history: [
            {
              status: 'PAID',
              note: `고객 모바일 결제 완료 (${pmMeta.name})`,
              actor: '고객',
              timestamp: now
            }
          ]
        };

        state.orders.unshift(createdOrder);
        return state;
      },
      {
        event: 'NEW_ORDER_CREATED',
        audit: {
          category: '신규 주문',
          action: '모바일 신규 주문 접수 대기 등록',
          actor: '고객 모바일'
        }
      }
    );

    if (createdOrder) {
      session.activeOrderId = createdOrder.id;
      if (!session.myOrderIds.includes(createdOrder.id)) {
        session.myOrderIds.unshift(createdOrder.id);
      }
      session.cart = [];
      session.customerRequest = '';
      session.paymentState = 'SUCCESS';
      saveSession();
      navigateTo('ORDER_COMPLETE', false);
    }

    isFinalizingOrder = false;
  }

  /* ============================================================================
   * 1 ~ 8번 화면 렌더링 (Fresh Route 콘셉트)
   * ============================================================================ */

  function renderStartScreen(main) {
    const avail = getStoreAvailability();
    const store = storeState.store;
    const signatureMenu = storeState.menus[0];
    const activeOrders = storeState.orders.filter(
      (o) => session.myOrderIds.includes(o.id) && o.status !== 'PICKED_UP'
    );

    let activeOrderBannerHtml = '';
    if (activeOrders.length > 0) {
      const latest = activeOrders[0];
      const stMeta = window.KioskStore.ORDER_STATUS[latest.status] || { customerLabel: latest.status };
      activeOrderBannerHtml = `
        <section class="card" style="border-color: var(--color-info); background: var(--color-info-light);" aria-label="진행 중인 주문 안내">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
            <div>
              <span class="status-badge badge-info">${getFilledStatusIcon('info')} 진행 중인 주문</span>
              <p style="margin:6px 0 0; font-weight:700; font-size:var(--text-body);">
                주문번호 ${latest.orderNumber} · ${stMeta.customerLabel}
              </p>
            </div>
            <button type="button" id="start-goto-status-btn" class="btn-outline" style="min-height:44px; padding:8px 14px; font-size:var(--text-caption);">
              상태 보기
            </button>
          </div>
        </section>
      `;
    }

    let exceptionAlertHtml = '';
    if (!avail.canOrder) {
      exceptionAlertHtml = `
        <section class="card" style="border:2px solid var(--color-error); background:var(--color-error-light);" role="alert">
          <h2 class="section-title" style="color:var(--color-error); font-size:var(--text-card-title);">
            <span>${getFilledStatusIcon('error')} ${avail.title}</span>
          </h2>
          <p style="margin:0 0 8px; font-size:var(--text-body); color:var(--color-text);">
            ${avail.reason}
          </p>
          <div style="font-size:var(--text-caption); color:var(--color-text-muted); font-weight:600;">
            주문 가능 시간: ${store.orderStartTime} ~ ${store.orderEndTime} · 문의: ${store.phone}
          </div>
        </section>
      `;
    }

    // 7. 시작 화면: 전체 화면 광고 대신 매장명과 주문 가능 상태를 먼저 표시 + 상단 35~40% 대표 샌드위치 사진 + 식사 방식 큰 선택 카드
    main.innerHTML = `
      ${activeOrderBannerHtml}
      ${exceptionAlertHtml}

      <section class="start-store-header" aria-label="매장명 및 주문 가능 상태">
        <div class="start-store-top">
          <span class="status-badge ${avail.badgeClass}">
            ${getFilledStatusIcon(avail.iconType)}
            <span>${avail.badgeText}</span>
          </span>
          <span style="font-size:var(--text-caption); color:var(--color-text-muted);">
            예상 준비 약 ${store.estimatedPrepMinutes}분
          </span>
        </div>
        <h2 class="display-title">${session.simInvalidLink ? '매장 확인 필요' : store.name}</h2>
        <p style="margin:4px 0 0; font-size:var(--text-caption); color:var(--color-text-muted);">
          ${store.address} · ${store.phone}
        </p>
      </section>

      <section class="start-hero-card" aria-label="대표 메뉴 비주얼 및 운영 시간">
        <div class="start-hero-visual">
          ${renderFoodVisualSvg(signatureMenu)}
        </div>
        <div class="start-hero-meta">
          <div class="meta-item">
            <span class="meta-label">주문 가능 시간</span>
            <strong class="meta-value">${store.orderStartTime} ~ ${store.orderEndTime}</strong>
          </div>
          <div class="meta-item">
            <span class="meta-label">예상 준비 시간</span>
            <strong class="meta-value">약 ${store.estimatedPrepMinutes}분 내외</strong>
          </div>
        </div>
      </section>

      <section aria-labelledby="order-type-heading">
        <h2 id="order-type-heading" class="section-title">
          <span>식사 방식을 선택해 주세요</span>
          <span class="status-badge badge-required">필수</span>
        </h2>
        <div class="order-type-grid">
          <button
            type="button"
            class="order-type-btn"
            data-order-type="DINE_IN"
            aria-pressed="${session.orderType === 'DINE_IN'}"
            ${!store.allowDineIn || !avail.canOrder ? 'disabled' : ''}
          >
            <div class="order-type-top">
              ${getLineIcon('dineIn')}
              ${session.orderType === 'DINE_IN' ? getFilledStatusIcon('check') : ''}
            </div>
            <div>
              <strong class="order-type-title" style="display:block;">매장 식사</strong>
              <span class="order-type-sub">${store.allowDineIn ? '매장 트레이에 담아 제공' : '현재 선택 불가'}</span>
            </div>
          </button>

          <button
            type="button"
            class="order-type-btn"
            data-order-type="TAKEOUT"
            aria-pressed="${session.orderType === 'TAKEOUT'}"
            ${!store.allowTakeout || !avail.canOrder ? 'disabled' : ''}
          >
            <div class="order-type-top">
              ${getLineIcon('takeout')}
              ${session.orderType === 'TAKEOUT' ? getFilledStatusIcon('check') : ''}
            </div>
            <div>
              <strong class="order-type-title" style="display:block;">포장 주문</strong>
              <span class="order-type-sub">${store.allowTakeout ? '전용 포장 패키지로 제공' : '현재 선택 불가'}</span>
            </div>
          </button>
        </div>
      </section>
    `;

    const statusBtn = document.getElementById('start-goto-status-btn');
    if (statusBtn) {
      statusBtn.addEventListener('click', function () {
        navigateTo('ORDER_STATUS');
      });
    }

    main.querySelectorAll('.order-type-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        session.orderType = btn.getAttribute('data-order-type');
        saveSession();
        render();
      });
    });
  }

  function renderMenuListScreen(main) {
    const categories = [
      { id: 'RECOMMENDED', label: '추천 메뉴' },
      { id: 'SANDWICH', label: '샌드위치' },
      { id: 'BEVERAGE', label: '음료' }
    ];

    const sortedMenus = storeState.menus
      .filter(function (m) {
        if (!m.isSelling) return false;
        if (m.isSoldOut && !storeState.store.ShowSoldOutMenus) return false;
        if (session.selectedCategory === 'RECOMMENDED') return m.isRecommended;
        return m.category === session.selectedCategory;
      })
      .sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

    const tabsHtml = categories
      .map(function (c) {
        const selected = session.selectedCategory === c.id;
        return `
          <button
            type="button"
            role="tab"
            class="category-tab"
            data-cat="${c.id}"
            aria-selected="${selected}"
          >
            ${c.label}
          </button>
        `;
      })
      .join('');

    // 7. 메뉴 목록: 2열 카드, 사진(4:3) -> 이름(최대 두 줄) -> 가격 -> 배지 순서
    const cardsHtml = sortedMenus
      .map(function (menu) {
        const badges = [];
        if (menu.isRecommended || (menu.badge && menu.badge.includes('인기'))) {
          badges.push(`<span class="status-badge badge-recommend">${getFilledStatusIcon('star')} 추천</span>`);
        }
        if (menu.badge && menu.badge.includes('신메뉴')) {
          badges.push(`<span class="status-badge badge-new">신메뉴</span>`);
        } else if (menu.badge && !menu.badge.includes('인기')) {
          badges.push(`<span class="status-badge badge-optional">${menu.badge}</span>`);
        }
        if (menu.isSoldOut) {
          badges.push(`<span class="status-badge badge-soldout">품절</span>`);
        }

        return `
          <li class="menu-card ${menu.isSoldOut ? 'is-soldout' : ''}">
            <button
              type="button"
              class="menu-card-btn"
              data-menu-id="${menu.id}"
              ${menu.isSoldOut ? 'disabled aria-disabled="true"' : ''}
              aria-label="${menu.name}, ${window.KioskStore.formatPrice(menu.price)}${menu.isSoldOut ? ', 현재 품절' : ''}"
            >
              <div class="menu-photo-wrap">
                ${renderFoodVisualSvg(menu)}
                ${
                  menu.isSoldOut
                    ? `<span class="soldout-overlay-pill">
                        ${getFilledStatusIcon('error')}
                        <span>품절</span>
                      </span>`
                    : ''
                }
              </div>
              <div class="menu-card-body">
                <h3 class="menu-name">${menu.name}</h3>
                <strong class="menu-price">${window.KioskStore.formatPrice(menu.price)}</strong>
                <div class="menu-badges">${badges.join('')}</div>
              </div>
            </button>
          </li>
        `;
      })
      .join('');

    main.innerHTML = `
      <div class="category-tabs-sticky">
        <div class="category-tabs" role="tablist" aria-label="메뉴 카테고리">
          ${tabsHtml}
        </div>
      </div>

      <section aria-label="메뉴 목록">
        <ul class="menu-grid" role="list">
          ${cardsHtml || '<li class="card" style="grid-column: 1 / -1;">표시할 메뉴가 없습니다.</li>'}
        </ul>
      </section>
    `;

    main.querySelectorAll('.category-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        session.selectedCategory = tab.getAttribute('data-cat');
        saveSession();
        render();
      });
    });

    main.querySelectorAll('.menu-card-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const menuId = btn.getAttribute('data-menu-id');
        openMenuDetail(menuId, null);
      });
    });
  }

  function renderMenuDetailScreen(main) {
    const menu = storeState.menus.find((m) => m.id === session.activeMenuId);
    if (!menu) {
      main.innerHTML = `<div class="card"><p>메뉴 정보를 찾을 수 없습니다.</p></div>`;
      return;
    }

    const optionGroups = window.KioskStore.getMenuOptionGroups(storeState, menu);
    const tempSelections = session.detailSelections['opt-temp'] || [];
    const isHotBeverage = tempSelections.includes('temp-hot');

    // 7. 메뉴 상세와 옵션: 필수 옵션 제목에 '필수' 배지, 선택된 옵션은 연한 초록 배경과 체크 아이콘, 추가 금액은 오른쪽 정렬
    const groupsHtml = optionGroups
      .map(function (grp) {
        const selectedIds = session.detailSelections[grp.id] || [];
        const isSingle = grp.maxSelect === 1 && grp.required;
        const hasError = session.detailErrorGroupId === grp.id;

        const ruleDesc = grp.required
          ? `${grp.minSelect}개 필수 선택`
          : `최대 ${grp.maxSelect}개 선택 가능 (${selectedIds.length}/${grp.maxSelect})`;

        const itemsHtml = grp.items
          .map(function (item) {
            const isChecked = selectedIds.includes(item.id);
            const isSoldOut = Boolean(item.soldOut);
            const priceLabel = item.price > 0 ? `+${window.KioskStore.formatPrice(item.price)}` : '+0원';

            return `
              <label class="option-item-label ${isChecked ? 'is-checked' : ''} ${isSoldOut ? 'is-soldout' : ''}">
                <span class="option-item-left">
                  <input
                    type="${isSingle ? 'radio' : 'checkbox'}"
                    name="group-${grp.id}"
                    value="${item.id}"
                    data-group-id="${grp.id}"
                    data-item-id="${item.id}"
                    ${isChecked ? 'checked' : ''}
                    ${isSoldOut ? 'disabled' : ''}
                  />
                  <span class="option-check-indicator" aria-hidden="true">
                    ${getFilledStatusIcon('checkMarkOnly')}
                  </span>
                  <span>
                    <strong style="font-weight:600;">${item.name}</strong>
                    ${
                      isSoldOut
                        ? `<span class="status-badge badge-soldout" style="margin-left:6px;">품절</span>`
                        : ''
                    }
                  </span>
                </span>
                <span class="option-item-price">${priceLabel}</span>
              </label>
            `;
          })
          .join('');

        return `
          <section
            id="option-group-${grp.id}"
            class="option-group-card ${hasError ? 'has-error' : ''}"
            tabindex="-1"
            aria-labelledby="title-${grp.id}"
          >
            <div class="option-group-header">
              <h3 id="title-${grp.id}" class="option-group-title">${grp.name}</h3>
              <span class="status-badge ${grp.required ? 'badge-required' : 'badge-optional'}">
                ${grp.required ? '필수' : '선택'}
              </span>
            </div>
            <p class="option-rule-text">${ruleDesc}</p>
            ${
              grp.id === 'opt-ice' && isHotBeverage
                ? `<div class="option-error-msg" style="background:var(--color-info-light); color:var(--color-info); border-color:#B6D4EE;">
                    ${getFilledStatusIcon('info')}
                    <span>따뜻한 음료(HOT)는 얼음 없음이 기본으로 선택됩니다.</span>
                  </div>`
                : ''
            }
            ${
              hasError
                ? `<div class="option-error-msg" role="alert">
                    ${getFilledStatusIcon('error')}
                    <span>${session.detailErrorMessage}</span>
                  </div>`
                : ''
            }
            <div class="option-item-list">
              ${itemsHtml}
            </div>
          </section>
        `;
      })
      .join('');

    main.innerHTML = `
      <section class="detail-hero-card" aria-label="선택 메뉴 상세 정보">
        <div class="detail-photo-box">
          ${renderFoodVisualSvg(menu)}
        </div>
        <div class="detail-hero-content">
          <h2 class="screen-heading" style="margin-bottom:6px;">${menu.name}</h2>
          <p style="margin:0 0 12px; font-size:var(--text-body); color:var(--color-text-muted);">${menu.description}</p>
          <strong style="font-family:var(--font-mono); font-size:20px; color:var(--color-primary-dark);">
            기본 가격 ${window.KioskStore.formatPrice(menu.price)}
          </strong>

          <div class="allergen-box">
            <div><strong>알레르기 정보:</strong> ${menu.allergens || '매장 문의'}</div>
            <div style="margin-top:4px;"><strong>원산지 안내:</strong> ${menu.originInfo || '매장 내 별도 표기'}</div>
          </div>
        </div>
      </section>

      ${groupsHtml}

      <section class="qty-control-row" aria-label="주문 수량 선택">
        <div>
          <strong style="font-size:var(--text-card-title); font-weight:600;">수량</strong>
          <div style="font-size:var(--text-caption); color:var(--color-text-muted);">최대 ${storeState.store.maxOrderQty || 20}개까지 선택 가능</div>
        </div>
        <div class="qty-stepper">
          <button type="button" id="detail-qty-minus" class="qty-btn" aria-label="수량 1 감소" ${
            session.detailQuantity <= 1 ? 'disabled' : ''
          }>−</button>
          <span class="qty-value" aria-live="polite">${session.detailQuantity}</span>
          <button type="button" id="detail-qty-plus" class="qty-btn" aria-label="수량 1 증가" ${
            session.detailQuantity >= (storeState.store.maxOrderQty || 20) ? 'disabled' : ''
          }>+</button>
        </div>
      </section>
    `;

    main.querySelectorAll('input[data-group-id]').forEach(function (input) {
      input.addEventListener('change', function (ev) {
        const grpId = input.getAttribute('data-group-id');
        const itemId = input.getAttribute('data-item-id');
        const grp = optionGroups.find((g) => g.id === grpId);
        if (!grp) return;

        session.detailErrorGroupId = null;
        session.detailErrorMessage = '';

        const current = (session.detailSelections[grpId] || []).slice();
        if (grp.maxSelect === 1 && grp.required) {
          session.detailSelections[grpId] = [itemId];
          if (grpId === 'opt-temp' && itemId === 'temp-hot') {
            session.detailSelections['opt-ice'] = ['ice-none'];
          }
        } else {
          if (input.checked) {
            if (current.length >= grp.maxSelect) {
              ev.preventDefault();
              input.checked = false;
              session.detailErrorGroupId = grpId;
              session.detailErrorMessage = `${grp.name}은(는) 최대 ${grp.maxSelect}개까지 선택할 수 있어요. 선택한 항목을 하나 해제한 뒤 다시 선택해 주세요.`;
              saveSession();
              render();
              const grpEl = document.getElementById('option-group-' + grpId);
              if (grpEl) {
                grpEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                grpEl.focus({ preventScroll: true });
              }
              return;
            }
            current.push(itemId);
          } else {
            const idx = current.indexOf(itemId);
            if (idx >= 0) current.splice(idx, 1);
          }
          session.detailSelections[grpId] = current;
        }
        saveSession();
        render();
      });
    });

    const minusBtn = document.getElementById('detail-qty-minus');
    const plusBtn = document.getElementById('detail-qty-plus');
    if (minusBtn) {
      minusBtn.addEventListener('click', function () {
        if (session.detailQuantity > 1) {
          session.detailQuantity -= 1;
          saveSession();
          render();
        }
      });
    }
    if (plusBtn) {
      plusBtn.addEventListener('click', function () {
        const max = storeState.store.maxOrderQty || 20;
        if (session.detailQuantity < max) {
          session.detailQuantity += 1;
          saveSession();
          render();
        }
      });
    }
  }

  function renderCartScreen(main) {
    const cartInfo = getCartTotalInfo();
    const validation = cartInfo.validation;

    if (session.cart.length === 0) {
      main.innerHTML = `
        <section class="card card-cut" style="text-align:center; padding:36px 16px;">
          <h2 class="section-title" style="justify-content:center;">장바구니가 비어 있어요</h2>
          <p style="margin:0 0 20px; color:var(--color-text-muted); font-size:var(--text-body);">
            신선한 샌드위치와 음료를 먼저 담아 주세요.
          </p>
          <button type="button" id="empty-cart-go-menu" class="btn-primary">
            메뉴 보러 가기
          </button>
        </section>
      `;
      const goBtn = document.getElementById('empty-cart-go-menu');
      if (goBtn) {
        goBtn.addEventListener('click', function () {
          navigateTo('MENU_LIST');
        });
      }
      return;
    }

    let issueAlertHtml = '';
    if (validation.hasIssues) {
      issueAlertHtml = `
        <section class="card" style="border:2px solid var(--color-error); background:var(--color-error-light);" role="alert">
          <h2 class="section-title" style="color:var(--color-error); font-size:var(--text-card-title);">
            <span>${getFilledStatusIcon('error')} 담은 메뉴의 상태나 가격이 바뀌었어요</span>
          </h2>
          <ul style="margin:0 0 12px; padding-left:18px; font-size:var(--text-caption); color:var(--color-text);">
            ${validation.issues
              .map((iss) => `<li><strong>${iss.menuName}:</strong> ${iss.messages.join(' / ')}</li>`)
              .join('')}
          </ul>
          ${
            validation.hasPriceChanges
              ? `<button type="button" id="sync-cart-prices-btn" class="btn-primary" style="min-height:44px; padding:8px 16px; font-size:var(--text-caption);">
                  최신 금액 적용
                </button>`
              : ''
          }
        </section>
      `;
    }

    // 7. 장바구니: 세로 목록으로 표시하고 수정과 삭제를 분리, 총 금액은 가장 마지막에 큰 숫자로 강조
    const itemsHtml = validation.items
      .map(function (item) {
        const optsText =
          item.selectedOptions && item.selectedOptions.length > 0
            ? item.selectedOptions
                .map((o) => `<li>${o.groupName}: ${o.itemName}${o.price > 0 ? ` (+${window.KioskStore.formatPrice(o.price)})` : ''}</li>`)
                .join('')
            : '<li>기본 옵션</li>';

        return `
          <article class="cart-item-card ${item.hasIssue ? 'has-issue' : ''}">
            <div class="cart-item-top">
              <div>
                <h3 style="margin:0 0 4px; font-size:var(--text-card-title); font-weight:600;">
                  ${item.menuName}
                </h3>
                ${
                  item.hasIssue
                    ? `<div style="margin-bottom:6px;">
                        <span class="status-badge badge-error">${getFilledStatusIcon('error')} ${item.issueMessages.join(' · ')}</span>
                      </div>`
                    : ''
                }
              </div>
              <strong style="font-family:var(--font-mono); font-size:var(--text-card-title); color:var(--color-text);">
                ${window.KioskStore.formatPrice(item.totalPrice)}
              </strong>
            </div>

            <ul class="cart-item-options">
              ${optsText}
            </ul>

            <div class="cart-item-actions">
              <div class="qty-stepper">
                <button type="button" class="qty-btn cart-qty-minus" data-id="${item.cartItemId}" aria-label="${item.menuName} 수량 감소" ${
                  item.quantity <= 1 ? 'disabled' : ''
                }>−</button>
                <span class="qty-value">${item.quantity}</span>
                <button type="button" class="qty-btn cart-qty-plus" data-id="${item.cartItemId}" aria-label="${item.menuName} 수량 증가">+</button>
              </div>
              <div style="display:flex; gap:8px;">
                <button type="button" class="btn-secondary cart-edit-btn" data-id="${item.cartItemId}" style="min-height:44px; padding:8px 14px; font-size:var(--text-caption);">
                  옵션 수정
                </button>
                <button type="button" class="btn-danger cart-del-btn" data-id="${item.cartItemId}" style="min-height:44px; padding:8px 14px; font-size:var(--text-caption);">
                  삭제
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    main.innerHTML = `
      ${issueAlertHtml}
      <section aria-label="장바구니 상품 목록">
        ${itemsHtml}
      </section>

      <section class="card" aria-label="결제 예정 금액 요약">
        <h2 class="section-title">주문 금액</h2>
        <div class="summary-row">
          <span>상품 금액 합계 (${cartInfo.totalQty}개)</span>
          <strong>${window.KioskStore.formatPrice(cartInfo.totalAmount)}</strong>
        </div>
        <div class="summary-row">
          <span>할인 금액</span>
          <strong>-${window.KioskStore.formatPrice(cartInfo.discountAmount)}</strong>
        </div>
        <div class="summary-row total">
          <span>최종 결제 예정 금액</span>
          <strong>${window.KioskStore.formatPrice(cartInfo.finalAmount)}</strong>
        </div>
      </section>
    `;

    const syncPriceBtn = document.getElementById('sync-cart-prices-btn');
    if (syncPriceBtn) {
      syncPriceBtn.addEventListener('click', function () {
        session.cart = validation.items.map(function (it) {
          return {
            cartItemId: it.cartItemId,
            menuId: it.menuId,
            menuName: it.menuName,
            category: it.category,
            basePrice: it.latestBasePrice,
            optionPrice: it.latestOptionPrice,
            unitPrice: it.latestUnitPrice,
            quantity: it.quantity,
            totalPrice: it.latestTotalPrice,
            selectedOptions: it.selectedOptions
          };
        });
        saveSession();
        showToast('변경된 최신 가격을 적용했어요.');
        render();
      });
    }

    main.querySelectorAll('.cart-qty-minus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        const target = session.cart.find((c) => c.cartItemId === id);
        if (target && target.quantity > 1) {
          target.quantity -= 1;
          target.totalPrice = target.unitPrice * target.quantity;
          saveSession();
          render();
        }
      });
    });

    main.querySelectorAll('.cart-qty-plus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        const target = session.cart.find((c) => c.cartItemId === id);
        if (target) {
          target.quantity += 1;
          target.totalPrice = target.unitPrice * target.quantity;
          saveSession();
          render();
        }
      });
    });

    main.querySelectorAll('.cart-edit-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        const target = session.cart.find((c) => c.cartItemId === id);
        if (target) openMenuDetail(target.menuId, target);
      });
    });

    main.querySelectorAll('.cart-del-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        session.cart = session.cart.filter((c) => c.cartItemId !== id);
        saveSession();
        showToast('선택한 상품을 삭제했어요.');
        render();
      });
    });
  }

  function renderOrderConfirmScreen(main) {
    const cartInfo = getCartTotalInfo();
    const store = storeState.store;

    const itemsSummaryHtml = cartInfo.validation.items
      .map(function (it) {
        const opts = (it.selectedOptions || []).map((o) => o.itemName).join(', ') || '기본 옵션';
        return `
          <div style="padding:12px 0; border-bottom:1px solid var(--color-border);">
            <div style="display:flex; justify-content:space-between; font-weight:600;">
              <span>${it.menuName} × ${it.quantity}</span>
              <strong style="font-family:var(--font-mono);">${window.KioskStore.formatPrice(it.totalPrice)}</strong>
            </div>
            <div style="font-size:var(--text-caption); color:var(--color-text-muted); margin-top:4px;">
              ${opts}
            </div>
          </div>
        `;
      })
      .join('');

    main.innerHTML = `
      <section class="card card-cut" style="border:2px solid var(--color-primary); background:var(--color-primary-light);" aria-label="주문 매장 및 식사 방식 확인">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span class="status-badge badge-open">${getFilledStatusIcon('check')} 주문 매장 확인</span>
          <span class="status-badge badge-recommend">
            ${session.orderType === 'DINE_IN' ? '매장 식사' : '포장 주문'}
          </span>
        </div>
        <h2 class="section-title" style="margin-bottom:4px; color:var(--color-primary-dark);">
          ${store.name}
        </h2>
        <p style="margin:0; font-size:var(--text-caption); color:var(--color-text-muted);">
          ${store.address} · 주문할 매장이 맞는지 확인해 주세요.
        </p>
      </section>

      <section class="card" aria-label="전체 주문 상품">
        <h2 class="section-title">
          <span>주문 상품 (${cartInfo.totalQty}개)</span>
        </h2>
        ${itemsSummaryHtml}
        <div class="summary-row total">
          <span>총 결제 금액</span>
          <strong>${window.KioskStore.formatPrice(cartInfo.finalAmount)}</strong>
        </div>
      </section>

      <section class="card" aria-labelledby="req-label">
        <h2 id="req-label" class="section-title">요청사항</h2>
        <textarea
          id="customer-request-input"
          class="request-textarea"
          placeholder="예: 샌드위치를 반으로 잘라 주세요."
          maxlength="120"
        >${session.customerRequest || ''}</textarea>
        <div class="allergy-notice" role="note">
          모든 메뉴는 같은 조리 공간에서 준비되어 알레르기 교차 오염이 발생할 수 있으며, 요청사항 작성만으로는 알레르기 대응을 보장하지 않습니다. 알레르기가 있다면 주문 전 매장(${store.phone})으로 문의해 주세요.
        </div>
      </section>
    `;

    const reqInput = document.getElementById('customer-request-input');
    if (reqInput) {
      reqInput.addEventListener('input', function () {
        session.customerRequest = reqInput.value;
        saveSession();
      });
    }
  }

  function renderPaymentScreen(main) {
    const cartInfo = getCartTotalInfo();
    const supported = storeState.store.supportedPayments || ['CARD', 'KAKAOPAY', 'NAVERPAY', 'MOBILEPAY'];

    const methodsHtml = supported
      .map(function (code) {
        const meta = window.KioskStore.PAYMENT_METHODS[code] || { code: code, name: code };
        const selected = session.selectedPaymentMethod === code;
        const iconSvg = code === 'CARD' ? getLineIcon('card') : code === 'MOBILEPAY' ? getLineIcon('smartphone') : getLineIcon('wallet');
        return `
          <button
            type="button"
            class="payment-method-btn"
            data-pay-code="${code}"
            aria-pressed="${selected}"
            ${session.paymentState === 'PROCESSING' || session.paymentState === 'UNCERTAIN' ? 'disabled' : ''}
          >
            <div style="width:100%; display:flex; justify-content:space-between; align-items:center;">
              ${iconSvg}
              ${selected ? getFilledStatusIcon('check') : ''}
            </div>
            <span>${meta.name}</span>
          </button>
        `;
      })
      .join('');

    let statusPanelHtml = '';
    if (session.paymentState === 'IDLE') {
      statusPanelHtml = `
        <div class="card" style="background:var(--color-surface-subtle);">
          <span class="status-badge badge-info">${getFilledStatusIcon('info')} 결제 대기</span>
          <p style="margin:8px 0 0; font-size:var(--text-body); color:var(--color-text-muted);">
            결제 수단을 선택한 뒤 하단의 결제하기 버튼을 눌러 주세요.
          </p>
        </div>
      `;
    } else if (session.paymentState === 'PROCESSING') {
      statusPanelHtml = `
        <div class="card" style="border:2px solid var(--color-info); background:var(--color-info-light);" role="status" aria-live="assertive">
          <strong style="font-size:var(--text-card-title); color:var(--color-info);">결제 확인 중</strong>
          <p style="margin:6px 0 0; font-size:var(--text-body); color:var(--color-text);">
            결제 결과를 확인하고 있어요. 버튼을 다시 누르지 마세요.
          </p>
        </div>
      `;
    } else if (session.paymentState === 'FAILED') {
      statusPanelHtml = `
        <div class="card" style="border:2px solid var(--color-error); background:var(--color-error-light);" role="alert">
          <div style="display:flex; align-items:center; gap:6px; color:var(--color-error); margin-bottom:6px;">
            ${getFilledStatusIcon('error')}
            <strong style="font-size:var(--text-card-title);">결제에 실패했어요</strong>
          </div>
          <p style="margin:0 0 14px; font-size:var(--text-body); color:var(--color-text);">
            ${session.paymentFailReason}
          </p>
          <div style="display:flex; gap:8px;">
            <button type="button" id="retry-pay-now-btn" class="btn-primary" style="flex:1;">
              다시 결제하기
            </button>
            <button type="button" id="back-to-confirm-btn" class="btn-secondary" style="flex:1;">
              주문 확인으로 이동
            </button>
          </div>
        </div>
      `;
    } else if (session.paymentState === 'UNCERTAIN') {
      statusPanelHtml = `
        <div class="card" style="border:2px solid var(--color-warning); background:var(--color-warning-light);" role="alert">
          <div style="display:flex; align-items:center; gap:6px; color:#92400E; margin-bottom:6px;">
            ${getFilledStatusIcon('warning')}
            <strong style="font-size:var(--text-card-title);">결제 결과를 확인하고 있어요</strong>
          </div>
          <p style="margin:0 0 14px; font-size:var(--text-body); color:var(--color-text);">
            결제 결과를 확인하고 있어요. 버튼을 다시 누르지 마세요. 아래에서 승인 결과를 먼저 확인해 주세요.
          </p>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button type="button" id="verify-uncertain-success-btn" class="btn-primary">
              승인 완료 확인 (주문 완료로 이동)
            </button>
            <button type="button" id="verify-uncertain-fail-btn" class="btn-secondary">
              미승인 확인 (다시 결제하기)
            </button>
          </div>
        </div>
      `;
    }

    main.innerHTML = `
      <section class="card" aria-label="최종 결제 금액">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:600; color:var(--color-text-muted);">최종 결제 금액</span>
          <strong style="font-family:var(--font-mono); font-size:24px; color:var(--color-primary-dark);">
            ${window.KioskStore.formatPrice(cartInfo.finalAmount)}
          </strong>
        </div>
      </section>

      <section class="card" aria-labelledby="pay-method-title">
        <h2 id="pay-method-title" class="section-title">결제 수단</h2>
        <div class="payment-grid">
          ${methodsHtml}
        </div>
      </section>

      ${statusPanelHtml}
    `;

    main.querySelectorAll('.payment-method-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        session.selectedPaymentMethod = btn.getAttribute('data-pay-code');
        saveSession();
        render();
      });
    });

    const retryBtn = document.getElementById('retry-pay-now-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', executePayment);
    }

    const backConfirmBtn = document.getElementById('back-to-confirm-btn');
    if (backConfirmBtn) {
      backConfirmBtn.addEventListener('click', function () {
        session.paymentState = 'IDLE';
        navigateTo('ORDER_CONFIRM');
      });
    }

    const verifySuccessBtn = document.getElementById('verify-uncertain-success-btn');
    if (verifySuccessBtn) {
      verifySuccessBtn.addEventListener('click', function () {
        session.simNetworkOffline = false;
        const netCheck = document.getElementById('sim-network-offline');
        if (netCheck) netCheck.checked = false;
        finalizeOrderCreation();
      });
    }

    const verifyFailBtn = document.getElementById('verify-uncertain-fail-btn');
    if (verifyFailBtn) {
      verifyFailBtn.addEventListener('click', function () {
        session.paymentState = 'IDLE';
        saveSession();
        showToast('결제가 승인되지 않은 것을 확인했어요. 다시 결제를 진행해 주세요.');
        render();
      });
    }
  }

  function renderOrderCompleteScreen(main) {
    const order = storeState.orders.find((o) => o.id === session.activeOrderId) || storeState.orders[0];
    if (!order) {
      main.innerHTML = `<div class="card">주문 정보를 불러올 수 없습니다.</div>`;
      return;
    }

    const pmMeta = window.KioskStore.PAYMENT_METHODS[order.paymentMethod] || { name: order.paymentMethod };
    const itemsHtml = order.items
      .map((it) => `<li><strong>${it.menuName}</strong> × ${it.quantity} (${window.KioskStore.formatPrice(it.totalPrice)})</li>`)
      .join('');

    // 7. 완료 화면: 주문번호를 가장 크게 보여 주고 장식은 최소화합니다.
    main.innerHTML = `
      <section class="order-number-hero" aria-label="주문 완료 및 주문번호">
        <span class="status-badge badge-open" style="margin-bottom:8px;">
          ${getFilledStatusIcon('check')}
          <span>주문이 접수되었어요</span>
        </span>
        <span class="order-number-label">주문번호</span>
        <strong class="order-number-big">${order.orderNumber}</strong>
        <p style="margin:0; font-size:var(--text-caption); color:var(--color-text-muted);">
          예상 준비 시간: 약 ${order.estimatedPrepMinutes || 10}분
        </p>
      </section>

      <section class="card" aria-label="주문 요약">
        <h2 class="section-title">주문 요약</h2>
        <div class="summary-row">
          <span>매장명</span>
          <strong>${storeState.store.name}</strong>
        </div>
        <div class="summary-row">
          <span>주문 일시</span>
          <strong>${window.KioskStore.formatDateTime(order.createdAt)}</strong>
        </div>
        <div class="summary-row">
          <span>식사 방식</span>
          <strong>${order.orderType === 'DINE_IN' ? '매장 식사' : '포장 주문'}</strong>
        </div>
        <div class="summary-row">
          <span>결제 수단</span>
          <strong>${pmMeta.name}</strong>
        </div>
        <hr style="border:none; border-top:1px solid var(--color-border); margin:12px 0;" />
        <ul style="margin:0 0 12px; padding-left:18px; font-size:var(--text-body);">
          ${itemsHtml}
        </ul>
        <div class="summary-row total">
          <span>결제 금액</span>
          <strong>${window.KioskStore.formatPrice(order.finalAmount)}</strong>
        </div>
      </section>

      <section class="card" aria-label="매장 문의 안내">
        <h2 class="section-title">매장 문의</h2>
        <p style="margin:0; font-size:var(--text-caption); color:var(--color-text-muted);">
          주문 관련 문의는 주문번호(${order.orderNumber})와 함께 매장(${storeState.store.phone})으로 연락해 주세요.
        </p>
      </section>
    `;
  }

  /**
   * 3. 의도적인 차별화 & 8. 주문 상태 화면:
   * 고객 화면의 진행 단계를 '재료가 쌓이는 순서'처럼 시각화합니다.
   */
  function renderOrderStatusScreen(main) {
    const order = storeState.orders.find((o) => o.id === session.activeOrderId) || storeState.orders[0];
    if (!order) {
      main.innerHTML = `<div class="card">조회할 주문이 없습니다.</div>`;
      return;
    }

    const stMeta = window.KioskStore.ORDER_STATUS[order.status] || {
      customerLabel: order.status,
      step: 1
    };

    const ingredientLayers = [
      {
        code: 'PAID',
        step: 1,
        label: '1단계 · 결제 완료',
        desc: '따뜻한 브레드 베이스를 준비합니다',
        svg: `<svg class="layer-graphic" viewBox="0 0 48 28" aria-hidden="true"><path d="M4 18 q20 6 40 0 l-3 6 h-34 z" fill="#D99B52"/></svg>`
      },
      {
        code: 'ACCEPTED',
        step: 2,
        label: '2단계 · 주문 접수',
        desc: '매장에서 주문을 확인하고 신선 채소를 담습니다',
        svg: `<svg class="layer-graphic" viewBox="0 0 48 28" aria-hidden="true"><path d="M4 16 q6 -8 12 0 t12 0 t12 0 l-2 6 h-32 z" fill="#18864B"/></svg>`
      },
      {
        code: 'PREPARING',
        step: 3,
        label: '3단계 · 준비 중',
        desc: '선택하신 메인 토핑과 소스로 상품을 만들고 있어요',
        svg: `<svg class="layer-graphic" viewBox="0 0 48 28" aria-hidden="true"><rect x="6" y="10" width="36" height="8" rx="4" fill="#F4C542"/><rect x="10" y="16" width="28" height="6" rx="3" fill="#F28C28"/></svg>`
      },
      {
        code: 'READY',
        step: 4,
        label: '4단계 · 준비 완료',
        desc: '주문번호를 확인하고 픽업대에서 수령해 주세요',
        svg: `<svg class="layer-graphic" viewBox="0 0 48 28" aria-hidden="true"><path d="M6 18 C6 6, 42 6, 42 18 Z" fill="#D99B52"/><path d="M6 18 h36 v4 h-36 z" fill="#18864B"/></svg>`
      }
    ];

    const stackHtml = ingredientLayers
      .map(function (layer) {
        let cls = '';
        let badgeHtml = '';
        if (order.status !== 'CANCELLED') {
          if (stMeta.step > layer.step || order.status === 'PICKED_UP') {
            cls = 'is-done';
            badgeHtml = `<span class="status-badge badge-open">${getFilledStatusIcon('check')} 완료</span>`;
          } else if (stMeta.step === layer.step) {
            cls = 'is-current';
            badgeHtml = `<span class="status-badge badge-recommend">진행 중</span>`;
          }
        }
        return `
          <li class="ingredient-layer ${cls}" aria-current="${stMeta.step === layer.step ? 'step' : 'false'}">
            <div class="layer-left">
              ${layer.svg}
              <div>
                <span class="layer-title">${layer.label}</span>
                <span class="layer-sub">${layer.desc}</span>
              </div>
            </div>
            ${badgeHtml}
          </li>
        `;
      })
      .join('');

    let statusBannerHtml = '';
    if (order.status === 'CANCELLED') {
      statusBannerHtml = `
        <div class="card" style="border:2px solid var(--color-error); background:var(--color-error-light);" role="alert">
          <div style="display:flex; align-items:center; gap:6px; color:var(--color-error); margin-bottom:6px;">
            ${getFilledStatusIcon('error')}
            <strong>주문이 취소되었어요</strong>
          </div>
          <p style="margin:0 0 4px; font-size:var(--text-caption);"><strong>취소 사유:</strong> ${order.cancelReason || '매장 확인 취소'}</p>
          <p style="margin:0; font-size:var(--text-caption);"><strong>환불 상태:</strong> ${order.refundStatus || '승인 취소 완료'}</p>
        </div>
      `;
    }

    const otherOrdersHtml = storeState.orders
      .map(function (o) {
        const m = window.KioskStore.ORDER_STATUS[o.status] || { customerLabel: o.status };
        return `<option value="${o.id}" ${o.id === order.id ? 'selected' : ''}>${o.orderNumber} (${m.customerLabel} · ${window.KioskStore.formatPrice(o.finalAmount)})</option>`;
      })
      .join('');

    const itemsHtml = order.items
      .map(function (it) {
        const opts = (it.selectedOptions || []).map((o) => o.itemName).join(', ') || '기본 옵션';
        return `
          <li style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; font-weight:600;">
              <span>${it.menuName} × ${it.quantity}</span>
              <strong style="font-family:var(--font-mono);">${window.KioskStore.formatPrice(it.totalPrice)}</strong>
            </div>
            <div style="font-size:var(--text-caption); color:var(--color-text-muted);">${opts}</div>
          </li>
        `;
      })
      .join('');

    main.innerHTML = `
      <div class="card" style="padding:12px 16px; display:flex; align-items:center; justify-content:space-between; gap:8px;">
        <label for="switch-order-select" style="font-size:var(--text-caption); font-weight:600; color:var(--color-text-muted);">주문 선택</label>
        <select id="switch-order-select" style="flex:1; padding:8px; border-radius:var(--radius-sm); border:1px solid var(--color-border); font-weight:600;">
          ${otherOrdersHtml}
        </select>
      </div>

      <section class="order-number-hero" aria-label="주문번호 및 재료 준비 단계">
        <span class="order-number-label">주문번호</span>
        <strong class="order-number-big">${order.orderNumber}</strong>
        <span class="status-badge ${order.status === 'CANCELLED' ? 'badge-error' : 'badge-open'}">
          ${order.status === 'CANCELLED' ? getFilledStatusIcon('error') : getFilledStatusIcon('check')}
          <span>현재 상태: ${stMeta.customerLabel}</span>
        </span>

        <ol class="ingredient-stack-stepper" aria-label="주문 준비 단계">
          ${stackHtml}
        </ol>
      </section>

      ${statusBannerHtml}

      <section class="card" aria-label="주문 상품 요약">
        <h2 class="section-title">주문 상품</h2>
        <ul style="margin:0; padding-left:18px; font-size:var(--text-body);">
          ${itemsHtml}
        </ul>
        <div class="summary-row total">
          <span>결제 금액</span>
          <strong>${window.KioskStore.formatPrice(order.finalAmount)}</strong>
        </div>
      </section>

      <section class="card" aria-label="매장 문의 정보">
        <h2 class="section-title">매장 문의</h2>
        <div style="font-size:var(--text-caption); color:var(--color-text-muted);">
          <div>${storeState.store.name} · <a href="tel:${storeState.store.phone}" style="color:var(--color-primary-dark); font-weight:600;">${storeState.store.phone}</a></div>
          <div style="margin-top:2px;">${storeState.store.address}</div>
        </div>
      </section>
    `;

    const sel = document.getElementById('switch-order-select');
    if (sel) {
      sel.addEventListener('change', function () {
        session.activeOrderId = sel.value;
        saveSession();
        render();
      });
    }
  }

  function render() {
    storeState = window.KioskStore.loadState();
    renderHeaderAndFooter();

    const main = document.getElementById('main-content');
    if (!main) return;

    switch (session.screen) {
      case 'START':
        renderStartScreen(main);
        break;
      case 'MENU_LIST':
        renderMenuListScreen(main);
        break;
      case 'MENU_DETAIL':
        renderMenuDetailScreen(main);
        break;
      case 'CART':
        renderCartScreen(main);
        break;
      case 'ORDER_CONFIRM':
        renderOrderConfirmScreen(main);
        break;
      case 'PAYMENT':
        renderPaymentScreen(main);
        break;
      case 'ORDER_COMPLETE':
        renderOrderCompleteScreen(main);
        break;
      case 'ORDER_STATUS':
        renderOrderStatusScreen(main);
        break;
      default:
        session.screen = 'START';
        renderStartScreen(main);
    }

    syncSimulatorControls();
  }

  function syncSimulatorControls() {
    const chkInvalid = document.getElementById('sim-invalid-link');
    const chkClosed = document.getElementById('sim-closed-hours');
    const chkPaused = document.getElementById('sim-order-paused');
    const chkOffline = document.getElementById('sim-network-offline');
    const selPay = document.getElementById('sim-payment-behavior');

    if (chkInvalid) chkInvalid.checked = Boolean(session.simInvalidLink);
    if (chkClosed) chkClosed.checked = Boolean(storeState.store.isForceClosed);
    if (chkPaused) chkPaused.checked = Boolean(storeState.store.isOrderPaused);
    if (chkOffline) chkOffline.checked = Boolean(session.simNetworkOffline);
    if (selPay) selPay.value = session.simPaymentBehavior || 'SUCCESS';
  }

  function initEvents() {
    const backBtn = document.getElementById('header-back-btn');
    if (backBtn) backBtn.addEventListener('click', goBack);

    const cartBtn = document.getElementById('header-cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', function () {
        navigateTo('CART');
      });
    }

    const orderStatusBtn = document.getElementById('header-order-status-btn');
    if (orderStatusBtn) {
      orderStatusBtn.addEventListener('click', function () {
        navigateTo('ORDER_STATUS');
      });
    }

    const retryNetBtn = document.getElementById('retry-network-btn');
    if (retryNetBtn) {
      retryNetBtn.addEventListener('click', function () {
        session.simNetworkOffline = false;
        saveSession();
        showToast('네트워크 연결이 복구되었어요.');
        render();
      });
    }

    const toggleSimBtn = document.getElementById('toggle-sim-btn');
    const simPanel = document.getElementById('sim-panel');
    if (toggleSimBtn && simPanel) {
      toggleSimBtn.addEventListener('click', function () {
        const isHidden = simPanel.hidden;
        simPanel.hidden = !isHidden;
        toggleSimBtn.setAttribute('aria-expanded', String(isHidden));
        toggleSimBtn.textContent = isHidden ? '예외 상태 테스트 닫기' : '예외 상태 테스트 열기';
      });
    }

    const chkInvalid = document.getElementById('sim-invalid-link');
    if (chkInvalid) {
      chkInvalid.addEventListener('change', function () {
        session.simInvalidLink = chkInvalid.checked;
        saveSession();
        render();
      });
    }

    const chkClosed = document.getElementById('sim-closed-hours');
    if (chkClosed) {
      chkClosed.addEventListener('change', function () {
        window.KioskStore.saveState(function (st) {
          st.store.isForceClosed = chkClosed.checked;
          return st;
        });
      });
    }

    const chkPaused = document.getElementById('sim-order-paused');
    if (chkPaused) {
      chkPaused.addEventListener('change', function () {
        window.KioskStore.saveState(function (st) {
          st.store.isOrderPaused = chkPaused.checked;
          return st;
        });
      });
    }

    const chkOffline = document.getElementById('sim-network-offline');
    if (chkOffline) {
      chkOffline.addEventListener('change', function () {
        session.simNetworkOffline = chkOffline.checked;
        saveSession();
        render();
      });
    }

    const selPay = document.getElementById('sim-payment-behavior');
    if (selPay) {
      selPay.addEventListener('change', function () {
        session.simPaymentBehavior = selPay.value;
        saveSession();
      });
    }

    if (window.location.search.includes('store=invalid')) {
      session.simInvalidLink = true;
    }

    window.KioskStore.subscribe(function (nextState, payload) {
      storeState = nextState;
      if (payload && payload.meta && payload.meta.event === 'ORDER_STATUS_CHANGED') {
        const changedOrd = nextState.orders.find((o) => o.id === payload.meta.orderId);
        if (changedOrd) {
          const stMeta = window.KioskStore.ORDER_STATUS[changedOrd.status] || { customerLabel: changedOrd.status };
          showToast(`주문번호 ${changedOrd.orderNumber} 상태가 [${stMeta.customerLabel}](으)로 변경되었어요.`);
        }
      } else if (payload && payload.meta && payload.meta.event === 'SOLD_OUT_CHANGED') {
        showToast('매장 품절 상태가 업데이트되었어요.');
      }
      render();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initEvents();
    render();
  });
})();
