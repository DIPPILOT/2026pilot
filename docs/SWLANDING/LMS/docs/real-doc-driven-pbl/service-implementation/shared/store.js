/**
 * 샌드위치·음료 키오스크 서비스 공통 데이터 스토어 및 실시간 동기화 엔진
 * - 고객 모바일 주문 화면과 PC 관리자 화면 간 LocalStorage + BroadcastChannel 양방향 실시간 연동
 * - 메뉴, 옵션/재료 품절, 주문 상태(7단계), 매장 설정, 사용자/권한, 변경 이력(Audit Log) 관리
 */

(function (global) {
  'use strict';

  const STORAGE_KEY = 'SANDWICH_KIOSK_STATE_V2';
  const CHANNEL_NAME = 'SANDWICH_KIOSK_SYNC_CHANNEL';

  const ORDER_STATUS = {
    PAYMENT_PENDING: { code: 'PAYMENT_PENDING', label: '결제 대기', customerLabel: '결제 대기', step: 0, icon: '⏳', badgeClass: 'status-pending' },
    PAID: { code: 'PAID', label: '결제 완료 (신규)', customerLabel: '결제 완료', step: 1, icon: '💳', badgeClass: 'status-paid' },
    ACCEPTED: { code: 'ACCEPTED', label: '접수', customerLabel: '접수', step: 2, icon: '📋', badgeClass: 'status-accepted' },
    PREPARING: { code: 'PREPARING', label: '준비 중', customerLabel: '준비 중', step: 3, icon: '🥪', badgeClass: 'status-preparing' },
    READY: { code: 'READY', label: '준비 완료', customerLabel: '준비 완료', step: 4, icon: '🔔', badgeClass: 'status-ready' },
    PICKED_UP: { code: 'PICKED_UP', label: '수령 완료', customerLabel: '수령 완료', step: 5, icon: '✅', badgeClass: 'status-pickedup' },
    CANCELLED: { code: 'CANCELLED', label: '취소', customerLabel: '취소', step: -1, icon: '🚫', badgeClass: 'status-cancelled' }
  };

  const PAYMENT_METHODS = {
    CARD: { code: 'CARD', name: '신용·체크카드', icon: '💳' },
    KAKAOPAY: { code: 'KAKAOPAY', name: '카카오페이', icon: '💛' },
    NAVERPAY: { code: 'NAVERPAY', name: '네이버페이', icon: '💚' },
    MOBILEPAY: { code: 'MOBILEPAY', name: '애플·삼성페이', icon: '📱' }
  };

  function getNowISO() {
    return new Date().toISOString();
  }

  function minutesAgoISO(mins) {
    return new Date(Date.now() - mins * 60 * 1000).toISOString();
  }

  function createInitialState() {
    const state = {
      version: 2,
      lastUpdatedAt: getNowISO(),
      store: {
        id: 'store-gangnam-01',
        name: '프레시샌드 강남역점',
        phone: '02-555-0192',
        address: '서울특별시 강남구 테헤란로 123 1층',
        imageCaption: '매일 아침 직접 굽는 유기농 베이커리 & 수제 샌드위치',
        openTime: '08:00',
        closeTime: '21:00',
        orderStartTime: '08:00',
        orderEndTime: '20:30',
        isForceClosed: false, // 영업시간 강제 종료 시뮬레이션용
        isOrderPaused: false, // 모바일 주문 접수 일시 중지
        pauseMessage: '현재 매장 내 주문이 많아 모바일 주문 접수를 일시 중지하고 있습니다. 잠시 후 다시 이용해 주세요.',
        allowDineIn: true,
        allowTakeout: true,
        estimatedPrepMinutes: 10,
        ShowSoldOutMenus: true, // 품절 메뉴 고객 화면 노출 방식 (true: 품절 배지 표시 후 비활성, false: 목록에서 숨김)
        minOrderQty: 1,
        maxOrderQty: 20,
        supportedPayments: ['CARD', 'KAKAOPAY', 'NAVERPAY', 'MOBILEPAY'],
        receiptFooter: '교환 및 환불은 영수증 지참 시 구매 당일 매장에서 가능합니다.',
        autoPrintReceipt: true,
        alertSoundEnabled: true,
        delayThresholdMinutes: 15
      },
      optionTemplates: {
        SANDWICH: [
          {
            id: 'opt-bread',
            name: '빵 종류',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'bread-wheat', name: '위트 (통밀)', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'bread-honeyoat', name: '허니오트', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'bread-flat', name: '플랫브레드', price: 500, soldOut: false, soldOutReason: '' },
              { id: 'bread-brioche', name: '브리오슈', price: 700, soldOut: false, soldOutReason: '' }
            ]
          },
          {
            id: 'opt-size-sw',
            name: '사이즈',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'sw-15cm', name: '레귤러 (15cm)', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'sw-30cm', name: '점보 (30cm)', price: 4200, soldOut: false, soldOutReason: '' }
            ]
          },
          {
            id: 'opt-set',
            name: '세트 선택',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'set-single', name: '단품', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'set-cookie', name: '쿠키 + 아메리카노 세트', price: 2900, soldOut: false, soldOutReason: '' },
              { id: 'set-wedge', name: '웨지감자 + 탄산음료 세트', price: 3400, soldOut: false, soldOutReason: '' }
            ]
          },
          {
            id: 'opt-extra',
            name: '추가 재료 (최대 3개)',
            required: false,
            minSelect: 0,
            maxSelect: 3,
            items: [
              { id: 'extra-egg', name: '에그마요 스쿱', price: 1500, soldOut: false, soldOutReason: '' },
              { id: 'extra-bacon', name: '크리스피 베이컨 2장', price: 1800, soldOut: false, soldOutReason: '' },
              { id: 'extra-avocado', name: '생 아보카도 슬라이스', price: 2000, soldOut: false, soldOutReason: '' },
              { id: 'extra-cheese', name: '더블 모짜렐라 치즈', price: 1200, soldOut: false, soldOutReason: '' },
              { id: 'extra-jalapeno', name: '할라피뇨 추가', price: 500, soldOut: false, soldOutReason: '' }
            ]
          },
          {
            id: 'opt-exclude',
            name: '제외 재료 (빼고 싶은 야채 선택)',
            required: false,
            minSelect: 0,
            maxSelect: 5,
            items: [
              { id: 'excl-onion', name: '생양파 제외', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'excl-pickle', name: '피클 제외', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'excl-tomato', name: '토마토 제외', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'excl-cucumber', name: '오이 제외', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'excl-olive', name: '블랙올리브 제외', price: 0, soldOut: false, soldOutReason: '' }
            ]
          }
        ],
        BEVERAGE: [
          {
            id: 'opt-size-bev',
            name: '사이즈',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'bev-regular', name: 'Regular (355ml)', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'bev-large', name: 'Large (473ml)', price: 800, soldOut: false, soldOutReason: '' }
            ]
          },
          {
            id: 'opt-temp',
            name: '온도',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'temp-ice', name: 'ICE (차가운 음료)', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'temp-hot', name: 'HOT (따뜻한 음료)', price: 0, soldOut: false, soldOutReason: '' }
            ]
          },
          {
            id: 'opt-ice',
            name: '얼음 양',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'ice-less', name: '얼음 적게', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'ice-normal', name: '얼음 보통', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'ice-more', name: '얼음 많이', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'ice-none', name: '얼음 없음 (HOT 선택 시 기본)', price: 0, soldOut: false, soldOutReason: '' }
            ]
          },
          {
            id: 'opt-sweet',
            name: '당도',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'sweet-0', name: '무가당 (0%)', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'sweet-50', name: '덜 달게 (50%)', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'sweet-100', name: '기본 당도 (100%)', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'sweet-120', name: '달콤하게 (120%)', price: 300, soldOut: false, soldOutReason: '' }
            ]
          }
        ]
      },
      menus: [
        {
          id: 'menu-sw-1',
          name: '바질 치킨 아보카도 샌드위치',
          category: 'SANDWICH',
          isRecommended: true,
          badge: '인기 BEST',
          price: 7400,
          description: '수비드 닭가슴살과 신선한 생 아보카도, 수제 바질 페스토가 어우러진 시그니처 샌드위치',
          emoji: '🥑',
          bgColor: '#ecfdf5',
          allergens: '밀, 대두, 우유, 닭고기, 잣 함유',
          originInfo: '닭가슴살(국내산), 아보카도(페루산), 베이컨(외국산)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 1,
          updatedBy: '점장 김민준',
          updatedAt: minutesAgoISO(120)
        },
        {
          id: 'menu-sw-2',
          name: '이탈리안 비엠티 클럽 샌드위치',
          category: 'SANDWICH',
          isRecommended: true,
          badge: '인기',
          price: 6900,
          description: '페퍼로니, 살라미, 본레스 햄과 고소한 체다 치즈가 듬뿍 들어간 정통 클럽 샌드위치',
          emoji: '🥪',
          bgColor: '#fff7ed',
          allergens: '밀, 돼지고기, 소고기, 우유, 대두 함유',
          originInfo: '돼지고기(국내산 및 미국산), 치즈(뉴질랜드산)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 2,
          updatedBy: '점장 김민준',
          updatedAt: minutesAgoISO(180)
        },
        {
          id: 'menu-sw-3',
          name: '트러플 에그마요 베이컨 샌드위치',
          category: 'SANDWICH',
          isRecommended: true,
          badge: '신메뉴',
          price: 6400,
          description: '부드러운 에그마요에 화이트 트러플 오일과 바삭한 베이컨을 더한 풍미 가득 샌드위치',
          emoji: '🥚',
          bgColor: '#fefce8',
          allergens: '계란, 밀, 대두, 돼지고기, 우유 함유',
          originInfo: '계란(국내산 무항생제), 베이컨(미국산)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 3,
          updatedBy: '매니저 이서연',
          updatedAt: minutesAgoISO(90)
        },
        {
          id: 'menu-sw-4',
          name: '로스트 비프 & 홀스래디쉬 샌드위치',
          category: 'SANDWICH',
          isRecommended: false,
          badge: '',
          price: 8200,
          description: '두툼하게 슬라이스한 오븐 로스트 비프와 알싸한 홀스래디쉬 크림 소스의 조화',
          emoji: '🥩',
          bgColor: '#fef2f2',
          allergens: '소고기, 밀, 우유, 계란, 대두 함유',
          originInfo: '소고기(호주산)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: true,
          soldOutAt: minutesAgoISO(40),
          soldOutBy: '매니저 이서연',
          soldOutReason: '당일 로스트 비프 원육 소진',
          resumeAt: '16:00',
          displayOrder: 4,
          updatedBy: '매니저 이서연',
          updatedAt: minutesAgoISO(40)
        },
        {
          id: 'menu-sw-5',
          name: '구운 단호박 & 리코타 샐러드 샌드위치',
          category: 'SANDWICH',
          isRecommended: false,
          badge: '건강식',
          price: 6800,
          description: '달콤한 오븐 구이 단호박과 수제 리코타 치즈, 발사믹 글레이즈로 완성한 웰빙 샌드위치',
          emoji: '🎃',
          bgColor: '#f0fdf4',
          allergens: '밀, 우유, 호두 함유',
          originInfo: '단호박(국내산 해남), 리코타치즈(국내산 원유)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 5,
          updatedBy: '점장 김민준',
          updatedAt: minutesAgoISO(240)
        },
        {
          id: 'menu-bev-1',
          name: '시그니처 스페셜티 아메리카노',
          category: 'BEVERAGE',
          isRecommended: true,
          badge: '인기',
          price: 3500,
          description: '다크 초콜릿과 구운 헤이즐넛 아로마가 돋보이는 100% 아라비카 블렌드 커피',
          emoji: '☕',
          bgColor: '#f5f5f4',
          allergens: '해당 없음 (고카페인 함유 150mg)',
          originInfo: '원두(콜롬비아 60%, 브라질 40%)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 6,
          updatedBy: '점장 김민준',
          updatedAt: minutesAgoISO(300)
        },
        {
          id: 'menu-bev-2',
          name: '바닐라 빈 크림 라떼',
          category: 'BEVERAGE',
          isRecommended: true,
          badge: '신메뉴',
          price: 4600,
          description: '마다가스카르산 천연 바닐라 빈 시럽과 고소한 우유, 에스프레소가 어우러진 라떼',
          emoji: '🥛',
          bgColor: '#fffbeb',
          allergens: '우유 함유 (고카페인 함유 150mg)',
          originInfo: '원유(국내산 1등급), 원두(콜롬비아·브라질)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 7,
          updatedBy: '점장 김민준',
          updatedAt: minutesAgoISO(300)
        },
        {
          id: 'menu-bev-3',
          name: '자몽 허니 스파클링 에이드',
          category: 'BEVERAGE',
          isRecommended: false,
          badge: '인기',
          price: 4800,
          description: '직접 착즙한 루비 자몽과 아카시아 꿀을 넣어 상큼하고 청량한 수제 에이드',
          emoji: '🍹',
          bgColor: '#fff1f2',
          allergens: '해당 없음',
          originInfo: '자몽(미국산), 사양벌꿀(국내산)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 8,
          updatedBy: '매니저 이서연',
          updatedAt: minutesAgoISO(200)
        },
        {
          id: 'menu-bev-4',
          name: '생딸기 요거트 스무디',
          category: 'BEVERAGE',
          isRecommended: false,
          badge: '',
          price: 5200,
          description: '국내산 설향 딸기와 플레인 그릭 요거트를 함께 갈아 만든 진한 스무디',
          emoji: '🍓',
          bgColor: '#fdf2f8',
          allergens: '우유 함유',
          originInfo: '딸기(국내산 논산), 요거트(국내산 원유)',
          saleHours: '10:00 ~ 20:00',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 9,
          updatedBy: '점장 김민준',
          updatedAt: minutesAgoISO(220)
        }
      ],
      orders: [
        {
          id: 'ord-1001',
          orderNumber: 'A-101',
          createdAt: minutesAgoISO(19),
          paidAt: minutesAgoISO(19),
          orderType: 'DINE_IN', // DINE_IN | TAKEOUT
          status: 'PAID',
          paymentStatus: 'PAID', // PAID | VERIFYING | REFUNDED | FAILED
          paymentMethod: 'KAKAOPAY',
          customerRequest: '양파는 최대한 얇게 썰어주시고 냅킨 넉넉히 부탁드려요.',
          totalAmount: 13800,
          discountAmount: 0,
          finalAmount: 13800,
          estimatedPrepMinutes: 10,
          cancelReason: '',
          refundStatus: '',
          items: [
            {
              id: 'item-1',
              menuId: 'menu-sw-1',
              menuName: '바질 치킨 아보카도 샌드위치',
              category: 'SANDWICH',
              basePrice: 7400,
              optionPrice: 2900,
              unitPrice: 10300,
              quantity: 1,
              totalPrice: 10300,
              selectedOptions: [
                { groupId: 'opt-bread', groupName: '빵 종류', itemId: 'bread-honeyoat', itemName: '허니오트', price: 0 },
                { groupId: 'opt-size-sw', groupName: '사이즈', itemId: 'sw-15cm', itemName: '레귤러 (15cm)', price: 0 },
                { groupId: 'opt-set', groupName: '세트 선택', itemId: 'set-cookie', itemName: '쿠키 + 아메리카노 세트', price: 2900 },
                { groupId: 'opt-exclude', groupName: '제외 재료', itemId: 'excl-pickle', itemName: '피클 제외', price: 0 }
              ]
            },
            {
              id: 'item-2',
              menuId: 'menu-bev-1',
              menuName: '시그니처 스페셜티 아메리카노',
              category: 'BEVERAGE',
              basePrice: 3500,
              optionPrice: 0,
              unitPrice: 3500,
              quantity: 1,
              totalPrice: 3500,
              selectedOptions: [
                { groupId: 'opt-size-bev', groupName: '사이즈', itemId: 'bev-regular', itemName: 'Regular (355ml)', price: 0 },
                { groupId: 'opt-temp', groupName: '온도', itemId: 'temp-ice', itemName: 'ICE (차가운 음료)', price: 0 },
                { groupId: 'opt-ice', groupName: '얼음 양', itemId: 'ice-normal', itemName: '얼음 보통', price: 0 },
                { groupId: 'opt-sweet', groupName: '당도', itemId: 'sweet-0', itemName: '무가당 (0%)', price: 0 }
              ]
            }
          ],
          history: [
            { status: 'PAID', note: '고객 모바일 결제 완료 (카카오페이)', actor: '고객', timestamp: minutesAgoISO(19) }
          ]
        },
        {
          id: 'ord-1002',
          orderNumber: 'A-102',
          createdAt: minutesAgoISO(12),
          paidAt: minutesAgoISO(12),
          orderType: 'TAKEOUT',
          status: 'PREPARING',
          paymentStatus: 'PAID',
          paymentMethod: 'CARD',
          customerRequest: '',
          totalAmount: 15100,
          discountAmount: 0,
          finalAmount: 15100,
          estimatedPrepMinutes: 10,
          cancelReason: '',
          refundStatus: '',
          items: [
            {
              id: 'item-3',
              menuId: 'menu-sw-2',
              menuName: '이탈리안 비엠티 클럽 샌드위치',
              category: 'SANDWICH',
              basePrice: 6900,
              optionPrice: 3400,
              unitPrice: 10300,
              quantity: 1,
              totalPrice: 10300,
              selectedOptions: [
                { groupId: 'opt-bread', groupName: '빵 종류', itemId: 'bread-flat', itemName: '플랫브레드', price: 500 },
                { groupId: 'opt-size-sw', groupName: '사이즈', itemId: 'sw-15cm', itemName: '레귤러 (15cm)', price: 0 },
                { groupId: 'opt-set', groupName: '세트 선택', itemId: 'set-single', itemName: '단품', price: 0 },
                { groupId: 'opt-extra', groupName: '추가 재료', itemId: 'extra-bacon', itemName: '크리스피 베이컨 2장', price: 1800 },
                { groupId: 'opt-extra', groupName: '추가 재료', itemId: 'extra-cheese', itemName: '더블 모짜렐라 치즈', price: 1100 }
              ]
            },
            {
              id: 'item-4',
              menuId: 'menu-bev-3',
              menuName: '자몽 허니 스파클링 에이드',
              category: 'BEVERAGE',
              basePrice: 4800,
              optionPrice: 0,
              unitPrice: 4800,
              quantity: 1,
              totalPrice: 4800,
              selectedOptions: [
                { groupId: 'opt-size-bev', groupName: '사이즈', itemId: 'bev-regular', itemName: 'Regular (355ml)', price: 0 },
                { groupId: 'opt-temp', groupName: '온도', itemId: 'temp-ice', itemName: 'ICE (차가운 음료)', price: 0 },
                { groupId: 'opt-ice', groupName: '얼음 양', itemId: 'ice-less', itemName: '얼음 적게', price: 0 },
                { groupId: 'opt-sweet', groupName: '당도', itemId: 'sweet-100', itemName: '기본 당도 (100%)', price: 0 }
              ]
            }
          ],
          history: [
            { status: 'PAID', note: '고객 모바일 결제 완료 (신용·체크카드)', actor: '고객', timestamp: minutesAgoISO(12) },
            { status: 'ACCEPTED', note: '주문 확인 및 접수 처리', actor: '직원 박지훈', timestamp: minutesAgoISO(10) },
            { status: 'PREPARING', note: '조리 시작', actor: '직원 박지훈', timestamp: minutesAgoISO(8) }
          ]
        },
        {
          id: 'ord-1003',
          orderNumber: 'A-103',
          createdAt: minutesAgoISO(6),
          paidAt: minutesAgoISO(6),
          orderType: 'DINE_IN',
          status: 'READY',
          paymentStatus: 'PAID',
          paymentMethod: 'NAVERPAY',
          customerRequest: '음료 얼음 많이 넣어주세요!',
          totalAmount: 11000,
          discountAmount: 0,
          finalAmount: 11000,
          estimatedPrepMinutes: 10,
          cancelReason: '',
          refundStatus: '',
          items: [
            {
              id: 'item-5',
              menuId: 'menu-sw-3',
              menuName: '트러플 에그마요 베이컨 샌드위치',
              category: 'SANDWICH',
              basePrice: 6400,
              optionPrice: 0,
              unitPrice: 6400,
              quantity: 1,
              totalPrice: 6400,
              selectedOptions: [
                { groupId: 'opt-bread', groupName: '빵 종류', itemId: 'bread-wheat', itemName: '위트 (통밀)', price: 0 },
                { groupId: 'opt-size-sw', groupName: '사이즈', itemId: 'sw-15cm', itemName: '레귤러 (15cm)', price: 0 },
                { groupId: 'opt-set', groupName: '세트 선택', itemId: 'set-single', itemName: '단품', price: 0 }
              ]
            },
            {
              id: 'item-6',
              menuId: 'menu-bev-2',
              menuName: '바닐라 빈 크림 라떼',
              category: 'BEVERAGE',
              basePrice: 4600,
              optionPrice: 0,
              unitPrice: 4600,
              quantity: 1,
              totalPrice: 4600,
              selectedOptions: [
                { groupId: 'opt-size-bev', groupName: '사이즈', itemId: 'bev-regular', itemName: 'Regular (355ml)', price: 0 },
                { groupId: 'opt-temp', groupName: '온도', itemId: 'temp-ice', itemName: 'ICE (차가운 음료)', price: 0 },
                { groupId: 'opt-ice', groupName: '얼음 양', itemId: 'ice-more', itemName: '얼음 많이', price: 0 },
                { groupId: 'opt-sweet', groupName: '당도', itemId: 'sweet-100', itemName: '기본 당도 (100%)', price: 0 }
              ]
            }
          ],
          history: [
            { status: 'PAID', note: '고객 모바일 결제 완료 (네이버페이)', actor: '고객', timestamp: minutesAgoISO(6) },
            { status: 'ACCEPTED', note: '주문 접수', actor: '매니저 이서연', timestamp: minutesAgoISO(5) },
            { status: 'PREPARING', note: '조리 중', actor: '매니저 이서연', timestamp: minutesAgoISO(4) },
            { status: 'READY', note: '픽업대 준비 완료 알림 발송', actor: '매니저 이서연', timestamp: minutesAgoISO(1) }
          ]
        },
        {
          id: 'ord-1000',
          orderNumber: 'A-100',
          createdAt: minutesAgoISO(45),
          paidAt: minutesAgoISO(45),
          orderType: 'TAKEOUT',
          status: 'CANCELLED',
          paymentStatus: 'REFUNDED',
          paymentMethod: 'CARD',
          customerRequest: '',
          totalAmount: 8200,
          discountAmount: 0,
          finalAmount: 8200,
          estimatedPrepMinutes: 10,
          cancelReason: '로스트 비프 재료 소진으로 인한 고객 안내 후 전체 취소',
          refundStatus: '카드 승인 취소 완료',
          items: [
            {
              id: 'item-0',
              menuId: 'menu-sw-4',
              menuName: '로스트 비프 & 홀스래디쉬 샌드위치',
              category: 'SANDWICH',
              basePrice: 8200,
              optionPrice: 0,
              unitPrice: 8200,
              quantity: 1,
              totalPrice: 8200,
              selectedOptions: [
                { groupId: 'opt-bread', groupName: '빵 종류', itemId: 'bread-wheat', itemName: '위트 (통밀)', price: 0 },
                { groupId: 'opt-size-sw', groupName: '사이즈', itemId: 'sw-15cm', itemName: '레귤러 (15cm)', price: 0 },
                { groupId: 'opt-set', groupName: '세트 선택', itemId: 'set-single', itemName: '단품', price: 0 }
              ]
            }
          ],
          history: [
            { status: 'PAID', note: '고객 모바일 결제 완료', actor: '고객', timestamp: minutesAgoISO(45) },
            { status: 'CANCELLED', note: '취소 처리 (사유: 로스트 비프 재료 소진으로 인한 고객 안내 후 전체 취소)', actor: '매니저 이서연', timestamp: minutesAgoISO(41) }
          ]
        },
        {
          id: 'ord-0999',
          orderNumber: 'A-099',
          createdAt: minutesAgoISO(75),
          paidAt: minutesAgoISO(75),
          orderType: 'DINE_IN',
          status: 'PICKED_UP',
          paymentStatus: 'PAID',
          paymentMethod: 'MOBILEPAY',
          customerRequest: '',
          totalAmount: 19600,
          discountAmount: 0,
          finalAmount: 19600,
          estimatedPrepMinutes: 10,
          cancelReason: '',
          refundStatus: '',
          items: [
            {
              id: 'item-99-1',
              menuId: 'menu-sw-1',
              menuName: '바질 치킨 아보카도 샌드위치',
              category: 'SANDWICH',
              basePrice: 7400,
              optionPrice: 2400,
              unitPrice: 9800,
              quantity: 2,
              totalPrice: 19600,
              selectedOptions: [
                { groupId: 'opt-bread', groupName: '빵 종류', itemId: 'bread-brioche', itemName: '브리오슈', price: 700 },
                { groupId: 'opt-size-sw', groupName: '사이즈', itemId: 'sw-15cm', itemName: '레귤러 (15cm)', price: 0 },
                { groupId: 'opt-set', groupName: '세트 선택', itemId: 'set-single', itemName: '단품', price: 0 },
                { groupId: 'opt-extra', groupName: '추가 재료', itemId: 'extra-egg', itemName: '에그마요 스쿱', price: 1700 }
              ]
            }
          ],
          history: [
            { status: 'PAID', note: '고객 모바일 결제 완료', actor: '고객', timestamp: minutesAgoISO(75) },
            { status: 'ACCEPTED', note: '주문 접수', actor: '점장 김민준', timestamp: minutesAgoISO(74) },
            { status: 'PREPARING', note: '조리 시작', actor: '점장 김민준', timestamp: minutesAgoISO(72) },
            { status: 'READY', note: '준비 완료', actor: '점장 김민준', timestamp: minutesAgoISO(66) },
            { status: 'PICKED_UP', note: '고객 수령 완료', actor: '직원 박지훈', timestamp: minutesAgoISO(64) }
          ]
        }
      ],
      nextOrderSequence: 104,
      users: [
        {
          id: 'usr-admin',
          username: 'admin',
          password: 'password123',
          name: '김민준 (점장)',
          role: 'ADMIN', // ADMIN | MANAGER | STAFF
          roleName: '관리자',
          permissions: ['ORDER_MANAGE', 'ORDER_CANCEL', 'SOLD_OUT_MANAGE', 'MENU_MANAGE', 'SALES_VIEW', 'STORE_SETTINGS', 'USER_MANAGE'],
          lastLoginAt: minutesAgoISO(15),
          isActive: true,
          failedAttempts: 0,
          isLocked: false
        },
        {
          id: 'usr-manager',
          username: 'manager',
          password: 'password123',
          name: '이서연 (매니저)',
          role: 'MANAGER',
          roleName: '매니저',
          permissions: ['ORDER_MANAGE', 'ORDER_CANCEL', 'SOLD_OUT_MANAGE', 'MENU_MANAGE', 'SALES_VIEW'],
          lastLoginAt: minutesAgoISO(50),
          isActive: true,
          failedAttempts: 0,
          isLocked: false
        },
        {
          id: 'usr-staff',
          username: 'staff',
          password: 'password123',
          name: '박지훈 (크루)',
          role: 'STAFF',
          roleName: '직원',
          permissions: ['ORDER_MANAGE'],
          lastLoginAt: minutesAgoISO(110),
          isActive: true,
          failedAttempts: 0,
          isLocked: false
        }
      ],
      auditLogs: [
        {
          id: 'log-1',
          category: '품절 관리',
          action: '로스트 비프 & 홀스래디쉬 샌드위치 품절 처리 (사유: 당일 로스트 비프 원육 소진, 재개 예정: 16:00)',
          actor: '매니저 이서연',
          timestamp: minutesAgoISO(40)
        },
        {
          id: 'log-2',
          category: '주문 관리',
          action: '주문 A-100 취소 및 카드 승인 취소 처리',
          actor: '매니저 이서연',
          timestamp: minutesAgoISO(41)
        },
        {
          id: 'log-3',
          category: '메뉴 관리',
          action: '트러플 에그마요 베이컨 샌드위치 신메뉴 배지 설정',
          actor: '매니저 이서연',
          timestamp: minutesAgoISO(90)
        }
      ]
    };

    if (Array.isArray(global.SHEET_MENU_DATA) && global.SHEET_MENU_DATA.length > 0) {
      state.menus = global.SHEET_MENU_DATA.map(function (menu) {
        return Object.assign(
          {
            soldOutAt: null,
            soldOutBy: null,
            soldOutReason: '',
            resumeAt: null,
            updatedBy: 'Google Sheets 동기화',
            updatedAt: getNowISO()
          },
          JSON.parse(JSON.stringify(menu)),
          menu.isSoldOut
            ? {
                soldOutAt: getNowISO(),
                soldOutBy: 'Google Sheets 동기화',
                soldOutReason: '시트에서 품절로 설정됨'
              }
            : {}
        );
      });
    }

    return state;
  }

  let channel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(CHANNEL_NAME);
    }
  } catch (e) {
    // Fallback to storage event only
  }

  const listeners = new Set();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = createInitialState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
      return createInitialState();
    }
  }

  function saveState(updater, meta) {
    const current = loadState();
    const next = typeof updater === 'function' ? updater(current) : updater;
    next.lastUpdatedAt = getNowISO();
    if (meta && meta.audit) {
      next.auditLogs = next.auditLogs || [];
      next.auditLogs.unshift({
        id: 'log-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        category: meta.audit.category || '시스템',
        action: meta.audit.action,
        actor: meta.audit.actor || '관리자',
        timestamp: next.lastUpdatedAt
      });
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
    const payload = { type: 'STATE_UPDATED', meta: meta || {}, timestamp: next.lastUpdatedAt };
    if (channel) {
      try {
        channel.postMessage(payload);
      } catch (e) {}
    }
    notifyListeners(next, payload);
    return next;
  }

  function resetToDefault() {
    const initial = createInitialState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    const payload = { type: 'STATE_RESET', timestamp: initial.lastUpdatedAt };
    if (channel) {
      try {
        channel.postMessage(payload);
      } catch (e) {}
    }
    notifyListeners(initial, payload);
    return initial;
  }

  function notifyListeners(state, payload) {
    listeners.forEach(function (fn) {
      try {
        fn(state, payload);
      } catch (err) {
        console.error('Store listener error:', err);
      }
    });
  }

  if (channel) {
    channel.onmessage = function (ev) {
      const state = loadState();
      notifyListeners(state, ev.data || { type: 'EXTERNAL_UPDATE' });
    };
  }

  window.addEventListener('storage', function (ev) {
    if (ev.key === STORAGE_KEY) {
      const state = loadState();
      notifyListeners(state, { type: 'STORAGE_EVENT' });
    }
  });

  function subscribe(callback) {
    listeners.add(callback);
    return function unsubscribe() {
      listeners.delete(callback);
    };
  }

  function formatPrice(num) {
    const n = Number(num) || 0;
    return n.toLocaleString('ko-KR') + '원';
  }

  function formatDateTime(isoStr) {
    if (!isoStr) return '-';
    const d = new Date(isoStr);
    const pad = (v) => String(v).padStart(2, '0');
    return (
      d.getFullYear() +
      '-' +
      pad(d.getMonth() + 1) +
      '-' +
      pad(d.getDate()) +
      ' ' +
      pad(d.getHours()) +
      ':' +
      pad(d.getMinutes())
    );
  }

  function formatTimeOnly(isoStr) {
    if (!isoStr) return '-';
    const d = new Date(isoStr);
    const pad = (v) => String(v).padStart(2, '0');
    return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function getElapsedMinutes(isoStr) {
    if (!isoStr) return 0;
    const diff = Date.now() - new Date(isoStr).getTime();
    return Math.max(0, Math.floor(diff / 60000));
  }

  /**
   * 메뉴에 해당하는 옵션 그룹 목록 반환 (템플릿 + 메뉴 커스텀 옵션 병합)
   */
  function getMenuOptionGroups(state, menu) {
    if (!menu) return [];
    if (menu.customOptionGroups && Array.isArray(menu.customOptionGroups)) {
      return menu.customOptionGroups;
    }
    const tpl = state.optionTemplates[menu.category] || [];
    return JSON.parse(JSON.stringify(tpl));
  }

  /**
   * 장바구니에 담긴 항목들이 현재 스토어 상태에서 유효한지 검증
   * - 품절된 메뉴인지
   * - 품절된 옵션이 포함되어 있는지
   * - 기본 가격이나 옵션 가격이 변경되었는지
   */
  function validateCartItems(state, cartItems) {
    const issues = [];
    const validatedItems = cartItems.map(function (item) {
      const menu = state.menus.find((m) => m.id === item.menuId);
      const itemIssues = [];
      let currentBasePrice = item.basePrice;
      let currentOptionPrice = 0;
      let isUnavailable = false;

      if (!menu || !menu.isSelling) {
        itemIssues.push('현재 판매가 중단된 메뉴입니다.');
        isUnavailable = true;
      } else if (menu.isSoldOut) {
        itemIssues.push('담은 뒤 매진(품절)된 메뉴입니다.');
        isUnavailable = true;
      } else {
        currentBasePrice = menu.price;
        if (currentBasePrice !== item.basePrice) {
          itemIssues.push(
            '메뉴 기본 가격이 ' + formatPrice(item.basePrice) + '에서 ' + formatPrice(currentBasePrice) + '으로 변경되었습니다.'
          );
        }
      }

      const optionGroups = menu ? getMenuOptionGroups(state, menu) : [];
      (item.selectedOptions || []).forEach(function (sel) {
        const grp = optionGroups.find((g) => g.id === sel.groupId);
        const optItem = grp ? grp.items.find((i) => i.id === sel.itemId) : null;
        if (!optItem || optItem.soldOut) {
          itemIssues.push('선택 옵션 [' + sel.itemName + ']이(가) 품절되었습니다.');
          isUnavailable = true;
        } else {
          currentOptionPrice += optItem.price;
          if (optItem.price !== sel.price) {
            itemIssues.push(
              '옵션 [' + sel.itemName + '] 가격이 ' + formatPrice(sel.price) + '에서 ' + formatPrice(optItem.price) + '으로 변경되었습니다.'
            );
          }
        }
      });

      const newUnitPrice = currentBasePrice + currentOptionPrice;
      const priceChanged = newUnitPrice !== item.unitPrice;
      if (itemIssues.length > 0) {
        issues.push({
          cartItemId: item.cartItemId,
          menuName: item.menuName,
          messages: itemIssues,
          isUnavailable: isUnavailable,
          priceChanged: priceChanged,
          newUnitPrice: newUnitPrice
        });
      }

      return Object.assign({}, item, {
        hasIssue: itemIssues.length > 0,
        isUnavailable: isUnavailable,
        priceChanged: priceChanged,
        issueMessages: itemIssues,
        latestBasePrice: currentBasePrice,
        latestOptionPrice: currentOptionPrice,
        latestUnitPrice: newUnitPrice,
        latestTotalPrice: newUnitPrice * item.quantity
      });
    });

    return {
      hasIssues: issues.length > 0,
      hasBlockingIssues: issues.some((i) => i.isUnavailable),
      hasPriceChanges: issues.some((i) => i.priceChanged),
      issues: issues,
      items: validatedItems
    };
  }

  global.KioskStore = {
    STORAGE_KEY: STORAGE_KEY,
    ORDER_STATUS: ORDER_STATUS,
    PAYMENT_METHODS: PAYMENT_METHODS,
    loadState: loadState,
    saveState: saveState,
    resetToDefault: resetToDefault,
    subscribe: subscribe,
    formatPrice: formatPrice,
    formatDateTime: formatDateTime,
    formatTimeOnly: formatTimeOnly,
    getElapsedMinutes: getElapsedMinutes,
    getMenuOptionGroups: getMenuOptionGroups,
    validateCartItems: validateCartItems
  };
})(window);

