(function () {
  "use strict";
  // QR코드관리!B8:H11 snapshot, 2026-10-01. All four rows share this URL.
  const checkInUrl = "https://script.google.com/macros/s/AKfycbwQMnJ5neDDl2_ttRaLTP1EMZOgsaHxMKm6-E01teHuwoSargeG5KAYqgyHHtuZJJYs/exec";
  const dates = [
    ["2026-10-23", "2026-10-24"],
    ["2026-10-30", "2026-10-31"],
    ["2026-11-06", "2026-11-07"],
    ["2026-11-13", "2026-11-14"]
  ];
  const today = new Intl.DateTimeFormat("sv-SE",{timeZone:"Asia/Seoul",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=" + encodeURIComponent(checkInUrl);
  const dialog = document.getElementById("zoom");
  function zoom(week) {
    document.getElementById("zoom-title").textContent = week + "주차 출석 QR";
    document.getElementById("zoom-image").src = qrUrl;
    dialog.showModal();
  }
  dates.forEach(function (days,index) {
    const week = index+1;
    const card = document.createElement("article");
    const status = today < days[0] ? "예정" : today > days[1] ? "일정 종료" : "진행 중";
    card.innerHTML = '<span class="status">' + status + '</span><h2>' + week + '주차 출석</h2><div class="details"><button class="qr" type="button" aria-label="' + week + '주차 QR 크게 보기"><img alt="' + week + '주차 출석 QR" width="150" height="150"></button><div><p>1일차 · ' + days[0] + '<br><strong>18:00 기준</strong></p><p>2일차 · ' + days[1] + '<br><strong>09:00 기준</strong></p></div></div><div class="actions"><button type="button">QR 크게 보기</button><a target="_blank" rel="noopener noreferrer">출석 페이지 열기 ↗</a></div>';
    const img = card.querySelector("img");
    img.src = qrUrl;
    img.addEventListener("error",function () { img.alt="QR 이미지를 불러오지 못했습니다. 출석 페이지 열기를 이용하세요."; });
    card.querySelector("a").href = checkInUrl;
    card.querySelectorAll("button").forEach(function (button) { button.addEventListener("click",function () { zoom(week); }); });
    document.getElementById("weeks").appendChild(card);
  });
  document.getElementById("close").addEventListener("click",function () { dialog.close(); });
  dialog.addEventListener("click",function (event) { if (event.target === dialog) dialog.close(); });
})();
