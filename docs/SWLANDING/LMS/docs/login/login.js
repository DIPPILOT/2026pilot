(function () {
  "use strict";

  var APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx4kGWSG4D41ZpElazYgGKkY4V7AbnkBRir8uKRhYNGneAM6xxJKxpJJPdbU2GfDtwz/exec";
  var SESSION_HOURS = 10;
  var students = [
    { studentId: "STU001", name: "이윤지", team: "팀미정", avatar: "👩🏻‍💻" },
    { studentId: "STU002", name: "최윤", team: "팀미정", avatar: "👨🏻‍💻" },
    { studentId: "STU003", name: "이지민", team: "팀미정", avatar: "👩🏻‍🔬" },
    { studentId: "STU004", name: "하정무", team: "팀미정", avatar: "👨🏻‍🔬" },
    { studentId: "STU005", name: "서상호", team: "팀미정", avatar: "👨🏻‍🎓" },
    { studentId: "STU006", name: "강모세", team: "팀미정", avatar: "🧑🏻‍💻" },
    { studentId: "STU007", name: "장예린", team: "팀미정", avatar: "👩🏻‍💻" },
    { studentId: "STU008", name: "권태주", team: "팀미정", avatar: "👨🏻‍💻" },
    { studentId: "STU009", name: "이진녕", team: "팀미정", avatar: "🧑🏻‍🔬" },
    { studentId: "STU010", name: "석지윤", team: "팀미정", avatar: "👩🏻‍🎓" },
    { studentId: "STU011", name: "허동후", team: "팀미정", avatar: "👨🏻‍🎓" },
    { studentId: "STU012", name: "손영준", team: "팀미정", avatar: "👨🏻‍💻" },
    { studentId: "STU013", name: "김예원", team: "팀미정", avatar: "👩🏻‍💻" },
    { studentId: "STU014", name: "김예찬", team: "팀미정", avatar: "🧑🏻‍💻" },
    { studentId: "STU015", name: "김고원", team: "팀미정", avatar: "👨🏻‍🔬" },
    { studentId: "STU016", name: "최영찬", team: "팀미정", avatar: "👨🏻‍💻" },
    { studentId: "STU017", name: "김나연", team: "팀미정", avatar: "👩🏻‍🔬" },
    { studentId: "STU018", name: "이루다", team: "팀미정", avatar: "👩🏻‍💻" },
    { studentId: "STU019", name: "정리나", team: "팀미정", avatar: "👩🏻‍🎓" },
    { studentId: "STU020", name: "유승혁", team: "팀미정", avatar: "👨🏻‍💻" },
    { studentId: "STU021", name: "류승지", team: "팀미정", avatar: "🧑🏻‍💻" },
    { studentId: "STU022", name: "김지훈", team: "팀미정", avatar: "👨🏻‍🔬" },
    { studentId: "STU023", name: "은대영", team: "팀미정", avatar: "👨🏻‍🎓" }
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
    teamBadge.className = "track-badge" + (teamNum ? " team-" + teamNum : " team-none");
    teamBadge.textContent = student.team || "팀미정";

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
      var verifiedStudent = null;
      try {
        verifiedStudent = await requestLogin(student);
      } catch (reqError) {
        console.warn("서버 로그인 기록 실패 또는 미등록 ID (로컬 세션으로 진행):", reqError);
        verifiedStudent = student;
      }

      var sessionStudent = {
        studentId: String((verifiedStudent && verifiedStudent.studentId) || student.studentId),
        name: String((verifiedStudent && verifiedStudent.name) || student.name),
        team: String((verifiedStudent && verifiedStudent.team) || student.team || ""),
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
