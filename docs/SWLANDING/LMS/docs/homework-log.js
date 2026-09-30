(function () {
  "use strict";

  var APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx4kGWSG4D41ZpElazYgGKkY4V7AbnkBRir8uKRhYNGneAM6xxJKxpJJPdbU2GfDtwz/exec";
  var PAGE_NAMES = {
    "homework_week1.html": "1주차 개인 과제",
    "homework_week2.html": "2주차 개인 과제",
    "homework_codex_field.html": "코덱스 협업 과제"
  };
  var isRedirectingToLogin = false;

  function parseUser(raw) {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error("과제 로그 사용자 정보 해석 실패:", error);
      return null;
    }
  }

  function getValidSessionUser() {
    var sessionRaw = localStorage.getItem("currentUserSession");
    if (!sessionRaw) return null;

    try {
      var session = JSON.parse(sessionRaw);
      var expiresAt = Number(session.expiresAt || 0);
      if (!Number.isFinite(expiresAt) || Date.now() >= expiresAt) return null;

      var user = parseUser(session.value);
      var studentId = user && String(user.studentId || user.id || "").trim();
      return studentId ? user : null;
    } catch (error) {
      console.error("과제 로그 세션 정보 해석 실패:", error);
      return null;
    }
  }

  function clearLoginSession() {
    document.cookie = "currentUser=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";
    localStorage.removeItem("currentUserSession");
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("lmsLoginSessionId");
  }

  function requireValidLoginSession() {
    var user = getValidSessionUser();
    if (user) return user;

    clearLoginSession();
    if (!isRedirectingToLogin) {
      isRedirectingToLogin = true;
      window.location.replace("login/login.html");
    }
    return null;
  }

  function makeEventId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return "homework_" + window.crypto.randomUUID();
    }
    return "homework_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 12);
  }

  function getSessionId() {
    var key = "lmsLoginSessionId";
    var sessionId = sessionStorage.getItem(key);
    if (!sessionId) {
      sessionId = "session_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 12);
      sessionStorage.setItem(key, sessionId);
    }
    return sessionId;
  }

  function getMission(card) {
    var idNode = card.querySelector(".mission-id, .course-thumb span");
    var titleNode = card.querySelector(".course-title, h3");
    var missionId = idNode ? idNode.textContent.trim() : "";
    var missionTitle = titleNode ? titleNode.textContent.trim() : "";

    if (missionTitle.indexOf(missionId + ".") === 0) {
      missionTitle = missionTitle.substring(missionId.length + 1).trim();
    }

    return { id: missionId, title: missionTitle };
  }

  function pageName() {
    var fileName = window.location.pathname.split("/").pop();
    return PAGE_NAMES[fileName] || document.title;
  }

  function logHomeworkClick(card) {
    var user = requireValidLoginSession();
    if (!user) return;

    var studentId = user && String(user.studentId || user.id || "").trim();

    var mission = getMission(card);
    if (!mission.id || !mission.title) {
      console.warn("과제 ID 또는 제목을 찾지 못해 로그를 전송하지 않았습니다.");
      return;
    }

    var body = new URLSearchParams({
      action: "homeworkClick",
      studentId: studentId,
      homeworkPage: pageName(),
      missionId: mission.id,
      missionTitle: mission.title,
      eventId: makeEventId(),
      sessionId: getSessionId(),
      clientTimestamp: new Date().toISOString(),
      pagePath: window.location.pathname,
      userAgent: navigator.userAgent
    });

    fetch(APP_SCRIPT_URL, {
      method: "POST",
      body: body,
      redirect: "follow",
      keepalive: true
    }).then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    }).then(function (result) {
      if (!result.ok) throw new Error(result.error || "과제 클릭 기록 실패");
    }).catch(function (error) {
      console.error("과제 클릭 로그 전송 실패:", error);
    });
  }

  document.addEventListener("click", function (event) {
    var card = event.target.closest(".course-card, .mission-card");
    if (card) logHomeworkClick(card);
  });
})();
