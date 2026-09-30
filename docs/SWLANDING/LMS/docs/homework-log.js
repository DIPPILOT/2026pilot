(function () {
  "use strict";

  var APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx4kGWSG4D41ZpElazYgGKkY4V7AbnkBRir8uKRhYNGneAM6xxJKxpJJPdbU2GfDtwz/exec";
  var PAGE_NAMES = {
    "homework_week1.html": "1주차 개인 과제",
    "homework_week2.html": "2주차 개인 과제",
    "homework_codex_field.html": "코덱스 협업 과제"
  };

  function getCookie(name) {
    var prefix = name + "=";
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i += 1) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf(prefix) === 0) {
        return decodeURIComponent(cookie.substring(prefix.length));
      }
    }
    return null;
  }

  function parseUser(raw) {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error("과제 로그 사용자 정보 해석 실패:", error);
      return null;
    }
  }

  function getCurrentUser() {
    var user = parseUser(getCookie("currentUser"));
    if (user) return user;

    var sessionRaw = localStorage.getItem("currentUserSession");
    if (!sessionRaw) return null;

    try {
      var session = JSON.parse(sessionRaw);
      if (Date.now() >= Number(session.expiresAt || 0)) return null;
      return parseUser(session.value);
    } catch (error) {
      console.error("과제 로그 세션 정보 해석 실패:", error);
      return null;
    }
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
    var user = getCurrentUser();
    var studentId = user && String(user.studentId || user.id || "").trim();
    if (!studentId) {
      console.warn("학생 ID가 없어 과제 클릭 로그를 전송하지 않았습니다.");
      return;
    }

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
