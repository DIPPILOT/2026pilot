(function () {
  "use strict";

  var dayMatch = window.location.pathname.match(/day(10|[1-9])/i);
  var day = dayMatch ? Number(dayMatch[1]) : 0;
  var curriculum = window.LMS_CURRICULUM && window.LMS_CURRICULUM[day];
  if (!curriculum) return;

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char];
    });
  }

  function labHref(type, id) {
    return "../shared/learning-lab.html?day=" + day + "&type=" + type + "&id=" + id;
  }

  function removeOldExtendedCards(root) {
    root.querySelectorAll("article").forEach(function (card) {
      var thumb = card.querySelector(".task-card-thumb, .card-thumb, .course-thumb");
      var label = thumb ? thumb.textContent.trim().toUpperCase() : "";
      if (label.indexOf("SKILL") === 0 || label.indexOf("MISSION") === 0) card.remove();
    });
  }

  function mainCard(type, item, index) {
    var isSkill = type === "skill";
    var label = isSkill ? "SKILL " + index : "MISSION " + index;
    var hue = isSkill ? [45, 135, 225][index - 1] : [270, 320, 140, 180][index - 1];
    var badge = isSkill ? "Developer Skill " + index : "Planner × Developer Mission " + index;
    var badgeStyle = isSkill
      ? "background:rgba(6,182,212,.15);color:#67e8f9;border-color:rgba(6,182,212,.3);"
      : "background:rgba(139,92,246,.15);color:#d8b4fe;border-color:rgba(139,92,246,.28);";
    var buttonStyle = isSkill
      ? "background:linear-gradient(135deg,#06b6d4,#3b82f6);"
      : "background:linear-gradient(135deg,#8b5cf6,#d946ef);";
    var cardText = item.pbl ? item.pbl.brief + " 학생 수행: " + item.pbl.work[0] : item.card;
    return '<article class="task-card" data-curriculum-role="' + type + '" data-curriculum-id="' + index + '">' +
      '<div class="task-card-thumb" style="background-image:url(\'../img/day2_dataflow.png\');filter:hue-rotate(' + hue + 'deg);color:#fff;">' + label + '</div>' +
      '<div class="task-card-content">' +
        '<span class="task-card-badge" style="' + badgeStyle + '">' + badge + '</span>' +
        '<h4 class="task-card-title">' + escapeHtml(item.title) + '</h4>' +
        '<p class="task-card-desc">' + escapeHtml(cardText) + '</p>' +
        '<a href="' + labHref(type, index) + '" class="task-card-btn" style="' + buttonStyle + '">' + (isSkill ? "스킬 실습실 입장" : "협업 미션 입장") + '</a>' +
      '</div>' +
    '</article>';
  }

  function modernDetailCard(type, item, index) {
    var isSkill = type === "skill";
    var label = isSkill ? "SKILL " + index : "MISSION " + index;
    var hue = isSkill ? [45, 135, 225][index - 1] : [270, 320, 140, 180][index - 1];
    var artifact = isSkill ? item.artifact : item.artifact;
    var cardText = item.pbl ? item.pbl.brief + " 시작 자료: " + item.pbl.inputs.join(", ") : item.card;
    return '<article class="task-card" data-curriculum-role="' + type + '" data-curriculum-id="' + index + '" style="border-color:' + (isSkill ? "rgba(6,182,212,.3)" : "rgba(139,92,246,.25)") + ';">' +
      '<div class="card-thumb" style="background-image:url(\'../img/day2_dataflow.png\');filter:hue-rotate(' + hue + 'deg);">' + label + '</div>' +
      '<div class="card-content">' +
        '<div class="card-meta"><span class="card-badge' + (isSkill ? "" : " mission") + '">' + (isSkill ? "Developer Skill" : "Planner × Developer") + '</span><span class="card-step">' + label + '</span></div>' +
        '<h3 class="card-title">' + escapeHtml(item.title) + '</h3>' +
        '<p class="card-desc">' + escapeHtml(cardText) + '</p>' +
        '<div class="card-outcomes"><h4 class="outcomes-title">예상 산출물</h4><ul class="outcome-list"><li class="outcome-item"><code>' + escapeHtml(artifact) + '</code></li><li class="outcome-item">' + (isSkill ? "개발자 학습·검증 기록" : "기획–개발 공동 의사결정 기록") + '</li></ul></div>' +
        '<a href="' + labHref(type, index) + '" class="enter-btn">' + (isSkill ? "스킬 실습실 입장" : "협업 미션 입장") + ' →</a>' +
      '</div>' +
    '</article>';
  }

  function legacyDetailCard(type, item, index) {
    var isSkill = type === "skill";
    var label = isSkill ? "SKILL " + index : "MISSION " + index;
    var hue = isSkill ? [45, 135, 225][index - 1] : [270, 320, 140, 180][index - 1];
    var cardText = item.pbl ? item.pbl.brief + " 학생 수행: " + item.pbl.work.join(" → ") : item.card;
    return '<article class="course-card' + (isSkill ? "" : " mission-card") + '" data-curriculum-role="' + type + '" data-curriculum-id="' + index + '">' +
      '<div class="course-thumb" style="background-image:url(\'../img/day2_dataflow.png\');filter:hue-rotate(' + hue + 'deg);background-size:cover;background-position:center;">' + label + '</div>' +
      '<div class="course-content">' +
        '<span class="day-label">' + (isSkill ? "Developer Skill " : "Collaboration Mission ") + index + '</span>' +
        '<h3 class="course-title">' + escapeHtml(item.title) + '</h3>' +
        '<p class="course-subtitle">' + (isSkill ? "개발자가 AI를 학습·검증 도구로 활용하는 직접 실습" : "기획자와 개발자가 AI Agent 이슈를 함께 해결하는 미션") + '</p>' +
        '<p class="course-desc">' + escapeHtml(cardText) + '</p>' +
        '<div class="meta-grid"><div class="meta-item"><strong>학습 주체</strong>' + (isSkill ? "Developer" : "Planner × Developer") + '</div><div class="meta-item"><strong>AI 역할</strong>' + (isSkill ? "Tutor / Reviewer" : "Issue Simulator / Reviewer") + '</div><div class="meta-item"><strong>산출물</strong><code>' + escapeHtml(item.artifact) + '</code></div></div>' +
        '<div class="time-list"><div class="time-row"><strong>1단계</strong> 사람이 먼저 초안·판단 근거 작성</div><div class="time-row"><strong>2단계</strong> AI 결과를 검증하고 직접 수정·합의</div></div>' +
        '<div class="tag-list"><span class="tag">' + (isSkill ? "Direct Learning" : "AI Agent Issue") + '</span><span class="tag">Evidence</span><span class="tag">Human Decision</span></div>' +
        '<a href="' + labHref(type, index) + '" class="ai-class-btn"' + (isSkill ? "" : ' style="background:linear-gradient(135deg,#8b5cf6,#d946ef);"') + '>' + (isSkill ? "스킬 실습실 입장" : "협업 미션 입장") + '</a>' +
      '</div>' +
    '</article>';
  }

  var mainGrid = document.querySelector(".tasks-grid");
  if (mainGrid) {
    removeOldExtendedCards(mainGrid);
    curriculum.skills.forEach(function (item, i) { mainGrid.insertAdjacentHTML("beforeend", mainCard("skill", item, i + 1)); });
    curriculum.missions.forEach(function (item, i) { mainGrid.insertAdjacentHTML("beforeend", mainCard("mission", item, i + 1)); });
  }

  var modernGrid = document.querySelector(".task-grid");
  if (modernGrid) {
    removeOldExtendedCards(modernGrid);
    curriculum.skills.forEach(function (item, i) { modernGrid.insertAdjacentHTML("beforeend", modernDetailCard("skill", item, i + 1)); });
    curriculum.missions.forEach(function (item, i) { modernGrid.insertAdjacentHTML("beforeend", modernDetailCard("mission", item, i + 1)); });
  }

  var legacyGrids = Array.prototype.slice.call(document.querySelectorAll(".curriculum-grid"));
  if (legacyGrids.length) {
    legacyGrids.forEach(removeOldExtendedCards);
    var skillGrid = legacyGrids[0];
    var missionGrid = legacyGrids[legacyGrids.length - 1];
    curriculum.skills.forEach(function (item, i) { skillGrid.insertAdjacentHTML("beforeend", legacyDetailCard("skill", item, i + 1)); });
    curriculum.missions.forEach(function (item, i) { missionGrid.insertAdjacentHTML("beforeend", legacyDetailCard("mission", item, i + 1)); });
  }
})();
