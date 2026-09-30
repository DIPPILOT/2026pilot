(function () {
  "use strict";
  // QR코드관리!B8:H17 snapshot, 2026-09-30. All ten rows share this URL.
  const checkInUrl = "https://script.google.com/macros/s/AKfycbwQMnJ5neDDl2_ttRaLTP1EMZOgsaHxMKm6-E01teHuwoSargeG5KAYqgyHHtuZJJYs/exec";
  const dates = [
    ["2026-09-29","2026-09-30"], ["2026-10-05","2026-10-06"],
    ["2026-10-12","2026-10-13"], ["2026-10-19","2026-10-20"],
    ["2026-10-26","2026-10-27"], ["2026-11-02","2026-11-03"],
    ["2026-11-09","2026-11-10"], ["2026-11-16","2026-11-17"],
    ["2026-11-23","2026-11-24"], ["2026-11-30","2026-12-01"]
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
