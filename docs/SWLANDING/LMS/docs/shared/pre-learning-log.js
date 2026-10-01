(function () {
  "use strict";
  var API_URL = "https://script.google.com/macros/s/AKfycbx4kGWSG4D41ZpElazYgGKkY4V7AbnkBRir8uKRhYNGneAM6xxJKxpJJPdbU2GfDtwz/exec";
  var pathname = window.location.pathname;
  var day1 = /\/day1\/day1-ai-codex\.html$/.test(pathname);
  var lab = /\/shared\/learning-lab\.html$/.test(pathname);
  var match = pathname.match(/\/day(10|[2-9])\/day\1-ai-codex-(mission)?([1-9][0-9]*)\.html$/);
  if (!day1 && !lab && !match) return;
  var lastView = "";

  function currentPage() {
    var query = new URLSearchParams(window.location.search);
    if (lab) {
      var day = Number(query.get("day") || 1);
      var type = query.get("type") === "mission" ? "mission" : "skill";
      var id = Number(query.get("id") || 1);
      var data = window.LMS_CURRICULUM && window.LMS_CURRICULUM[day];
      var item = data && (type === "mission" ? data.missions : data.skills)[id - 1];
      if (!item || !Number.isInteger(day) || day < 1 || day > 10 || !Number.isInteger(id) || id < 1) return null;
      return { day: day, type: type.toUpperCase(), number: id, title: item.title };
    }
    if (day1) {
      var card = document.querySelector('.step-card.active');
      var step = card && Number(card.getAttribute('data-step'));
      var title = card && card.querySelector('h3');
      if (!title || !Number.isInteger(step) || step < 0 || step > 5) return null;
      return { day: 1, type: 'TASK', number: step + 1, title: title.textContent.trim() };
    }
    return { day: Number(match[1]), type: match[2] ? 'MISSION' : 'TASK', number: Number(match[3]), title: document.title.split('|')[0].trim() };
  }

  function excluded(date) {
    var kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    var weekday = kst.getUTCDay();
    var minutes = kst.getUTCHours() * 60 + kst.getUTCMinutes();
    return (weekday === 5 && minutes >= 1080 && minutes < 1320) ||
      (weekday === 6 && minutes >= 540 && minutes < 1080);
  }

  function sessionUser() {
    try {
      var session = JSON.parse(localStorage.getItem("currentUserSession"));
      if (!session || !Number.isFinite(Number(session.expiresAt)) || Number(session.expiresAt) <= Date.now()) return null;
      var user = JSON.parse(session.value);
      var id = user && String(user.studentId || user.id || "").trim();
      return id || null;
    } catch (error) { return null; }
  }

  function eventId(prefix) {
    return prefix + (window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() :
      Date.now().toString(36) + "_" + Math.random().toString(36).slice(2));
  }

  function recordPage() {
    var page = currentPage();
    if (!page) return;
    var id = 'DAY' + page.day + '-' + page.type + page.number;
    if (lastView === id) return;
    lastView = id;
    var studentId = sessionUser();
    if (!studentId) {
      document.cookie = "currentUser=; Path=/; Max-Age=0; SameSite=Lax";
      try {
        localStorage.removeItem("currentUserSession");
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("lmsLoginSessionId");
      } catch (error) { /* Storage may be disabled. Still require login. */ }
      window.location.replace("../login/login.html");
      return;
    }
    var now = new Date();
    if (excluded(now)) return;
    var sessionId = "";
    try {
      sessionId = sessionStorage.getItem("lmsLoginSessionId") || eventId("session_");
      sessionStorage.setItem("lmsLoginSessionId", sessionId);
    } catch (error) { /* Logging must not block navigation if sessionStorage fails. */ }
    fetch(API_URL, {
      method: "POST", redirect: "follow", keepalive: true,
      body: new URLSearchParams({
        action: "preLearningClick", studentId: studentId, day: String(page.day),
        missionId: id, missionTitle: page.title,
        eventId: eventId("pre_learning_"), sessionId: sessionId,
        clientTimestamp: now.toISOString(), pagePath: pathname + window.location.search + (day1 ? '#task=' + page.number : ''), userAgent: navigator.userAgent
      })
    }).then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    }).then(function (result) {
      if (!result.ok) throw new Error(result.error || "사전 학습 기록 실패");
    }).catch(function (error) { console.error("사전 학습 페이지 로그 전송 실패:", error); });
  }

  function init() {
    recordPage();
    // Day 1은 한 문서 안에서 Task 화면을 전환합니다. 버튼이 아니라 활성 화면 변경을 관찰합니다.
    if (day1) {
      var slider = document.querySelector('.step-slider');
      if (slider) new MutationObserver(recordPage).observe(slider, {subtree: true, attributes: true, attributeFilter: ['class']});
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) { lastView = ''; recordPage(); }
  });
})();
