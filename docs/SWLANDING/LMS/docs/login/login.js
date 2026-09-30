(function () {
  "use strict";

  var APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx4kGWSG4D41ZpElazYgGKkY4V7AbnkBRir8uKRhYNGneAM6xxJKxpJJPdbU2GfDtwz/exec";
  var SESSION_HOURS = 10;
  var students = [
    { studentId: "STU001", name: "김민수", team: "1팀", avatar: "👨🏻‍💻" },
    { studentId: "STU002", name: "이서연", team: "1팀", avatar: "👩🏻‍💻" },
    { studentId: "STU003", name: "박도현", team: "2팀", avatar: "👨🏻‍🔬" },
    { studentId: "STU004", name: "정예은", team: "2팀", avatar: "👩🏻‍🔬" },
    { studentId: "STU005", name: "최지훈", team: "3팀", avatar: "👨🏻‍🎓" },
    { studentId: "STU006", name: "강하늘", team: "3팀", avatar: "👩🏻‍🎓" },
    { studentId: "STU007", name: "윤서준", team: "4팀", avatar: "🧑🏻‍💻" },
    { studentId: "STU008", name: "한지우", team: "4팀", avatar: "👩🏻‍💻" },
    { studentId: "STU009", name: "임재원", team: "5팀", avatar: "👨🏻‍💻" },
    { studentId: "STU010", name: "송채원", team: "5팀", avatar: "👩🏻‍🎓" },
    { studentId: "STU011", name: "이호준", team: "5팀", avatar: "👨🏻‍🔬" }
  ];
  var isAuthenticating = false;
  var activeRequestController = null;

  var cardsGrid = document.getElementById("cardsGrid");
  var searchBar = document.getElementById("searchBar");
  var authOverlay = document.getElementById("authOverlay");
  var authTitle = document.getElementById("authTitle");
  var authStatus = document.getElementById("authStatus");

  function makeId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return prefix + "_" + window.crypto.randomUUID();
    }
    return prefix + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 12);
  }

  function getSessionId() {
    var key = "lmsLoginSessionId";
    var sessionId = sessionStorage.getItem(key);
    if (!sessionId) {
      sessionId = makeId("session");
      sessionStorage.setItem(key, sessionId);
    }
    return sessionId;
  }

  function showGridMessage(title, description) {
    cardsGrid.replaceChildren();

    var panel = document.createElement("div");
    panel.style.cssText = "grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-desc);";

    var heading = document.createElement("h4");
    heading.textContent = title;
    panel.appendChild(heading);

    if (description) {
      var copy = document.createElement("p");
      copy.textContent = description;
      copy.style.marginTop = "8px";
      panel.appendChild(copy);
    }

    cardsGrid.appendChild(panel);
  }

  function createProfileCard(student) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "profile-card";
    card.setAttribute("aria-label", student.name + " (" + student.studentId + ") 로그인");
    card.addEventListener("click", function () { startAuth(student); });

    var scanLine = document.createElement("span");
    scanLine.className = "scan-line";

    var teamNum = (student.team || "").replace(/[^0-9]/g, "");
    var teamBadge = document.createElement("span");
    teamBadge.className = "track-badge" + (teamNum ? " team-" + teamNum : "");
    teamBadge.textContent = student.team || "소속팀 미지정";

    var avatarWrapper = document.createElement("span");
    avatarWrapper.className = "avatar-wrapper";
    var avatar = document.createElement("span");
    avatar.textContent = student.avatar;
    avatarWrapper.appendChild(avatar);

    var name = document.createElement("span");
    name.className = "founder-name";
    name.textContent = student.name;

    var studentId = document.createElement("span");
    studentId.className = "student-id-badge startup-name";
    studentId.innerHTML = '<span class="id-label">학번</span><span class="id-value">' + student.studentId + '</span>';

    var actionHint = document.createElement("span");
    actionHint.className = "login-action-hint email-label";
    actionHint.innerHTML = '로그인하기 <span class="arrow-icon">→</span>';

    card.append(scanLine, teamBadge, avatarWrapper, name, studentId, actionHint);
    return card;
  }

  function renderCards(filterQuery) {
    var query = String(filterQuery || "").trim().toLowerCase();
    var filtered = students.filter(function (student) {
      return student.name.toLowerCase().includes(query) ||
        student.studentId.toLowerCase().includes(query) ||
        student.team.toLowerCase().includes(query);
    });

    cardsGrid.replaceChildren();
    if (!filtered.length) {
      showGridMessage("검색 결과가 없습니다.", "이름, 학생 ID 또는 소속팀을 다시 확인해 주세요.");
      return;
    }

    filtered.forEach(function (student) {
      cardsGrid.appendChild(createProfileCard(student));
    });
  }

  async function requestLogin(student) {
    activeRequestController = new AbortController();
    var timeoutId = window.setTimeout(function () {
      activeRequestController.abort();
    }, 12000);

    var body = new URLSearchParams({
      studentId: student.studentId,
      eventId: makeId("login"),
      sessionId: getSessionId(),
      clientTimestamp: new Date().toISOString(),
      pagePath: window.location.pathname,
      userAgent: navigator.userAgent
    });

    try {
      var response = await fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: body,
        redirect: "follow",
        signal: activeRequestController.signal
      });
      if (!response.ok) throw new Error("HTTP " + response.status);

      var result = await response.json();
      if (!result.ok) throw new Error(result.error || "로그인 기록에 실패했습니다.");
      return result.student;
    } finally {
      window.clearTimeout(timeoutId);
      activeRequestController = null;
    }
  }

  function saveUserSession(student) {
    var userData = JSON.stringify({
      id: student.studentId,
      studentId: student.studentId,
      name: student.name,
      team: student.team,
      avatar: student.avatar
    });

    var expiresAt = Date.now() + (SESSION_HOURS * 60 * 60 * 1000);
    document.cookie = "currentUser=" + encodeURIComponent(userData) +
      "; expires=" + new Date(expiresAt).toUTCString() + "; path=/; SameSite=Lax";
    localStorage.setItem("currentUserSession", JSON.stringify({
      value: userData,
      expiresAt: expiresAt
    }));
  }

  async function startAuth(student) {
    if (isAuthenticating) return;
    isAuthenticating = true;
    authOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
    authTitle.textContent = "로그인 기록 중...";
    authStatus.textContent = student.name + " · " + student.studentId;

    try {
      var verifiedStudent = await requestLogin(student);
      var sessionStudent = {
        studentId: String(verifiedStudent.studentId),
        name: String(verifiedStudent.name),
        team: String(verifiedStudent.team || ""),
        avatar: student.avatar
      };
      saveUserSession(sessionStudent);

      authTitle.textContent = "로그인되었습니다.";
      authStatus.textContent = sessionStudent.name + "님, 환영합니다.";
      window.setTimeout(function () {
        window.location.href = "../index.html";
      }, 700);
    } catch (error) {
      if (error.name === "AbortError") {
        authTitle.textContent = "요청 시간이 초과되었습니다.";
      } else {
        authTitle.textContent = "로그인 기록에 실패했습니다.";
      }
      authStatus.textContent = "인증 취소 후 다시 시도해 주세요.";
      console.error("로그인 실패:", error);
      isAuthenticating = false;
    }
  }

  function cancelAuth() {
    if (activeRequestController) activeRequestController.abort();
    isAuthenticating = false;
    authOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  searchBar.addEventListener("input", function (event) {
    renderCards(event.target.value);
  });

  window.cancelAuth = cancelAuth;
  renderCards();
})();
