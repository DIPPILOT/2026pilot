var LMS_CONFIG = Object.freeze({
  spreadsheetId: "1FQT1yoAGmUUc8jJDA__sLhBVOb1Qw9LmC3VkP37MGks",
  rosterSheetName: "출석부",
  loginLogSheetName: "LOG_LMS_Login",
  homeworkLogSheetName: "LOG_Homework_Mission",
  rosterStartRow: 8,
  duplicateCacheSeconds: 21600,
  lockTimeoutMs: 10000
});

function doGet(e) {
  var action = String((e && e.parameter && e.parameter.action) || "");
  if (action !== "students") {
    return jsonResponse_({ ok: true, service: "DIP LMS Login API" });
  }

  try {
    return jsonResponse_({ ok: true, students: getStudents_() });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: "학생 명부를 불러오지 못했습니다." });
  }
}

function doPost(e) {
  var action = String((e && e.parameter && e.parameter.action) || "login");
  if (action === "homeworkClick") return handleHomeworkClick_(e);
  if (action === "preLearningClick") return handlePreLearningClick_(e);
  return handleLogin_(e);
}

function handleLogin_(e) {
  try {
    var request = readLoginRequest_(e);
    var student = findStudentById_(request.studentId);
    if (!student) throw new Error("등록되지 않은 학생 ID입니다.");

    var cache = CacheService.getScriptCache();
    var cacheKey = "lms-login:" + request.eventId;
    if (cache.get(cacheKey)) {
      return jsonResponse_({ ok: true, duplicate: true, student: student });
    }

    var lock = LockService.getScriptLock();
    if (!lock.tryLock(LMS_CONFIG.lockTimeoutMs)) {
      throw new Error("로그인 요청이 많습니다. 잠시 후 다시 시도해 주세요.");
    }

    try {
      if (!cache.get(cacheKey)) {
        appendLoginLog_(student, request);
        cache.put(cacheKey, "1", LMS_CONFIG.duplicateCacheSeconds);
      }
    } finally {
      lock.releaseLock();
    }

    return jsonResponse_({ ok: true, student: student });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: String(error.message || error) });
  }
}

function handleHomeworkClick_(e) {
  try {
    var request = readHomeworkRequest_(e);
    var student = findStudentById_(request.studentId);
    if (!student) throw new Error("등록되지 않은 학생 ID입니다.");

    var cache = CacheService.getScriptCache();
    var cacheKey = "lms-homework:" + request.eventId;
    if (cache.get(cacheKey)) {
      return jsonResponse_({
        ok: true,
        duplicate: true,
        student: student,
        missionId: request.missionId
      });
    }

    var lock = LockService.getScriptLock();
    if (!lock.tryLock(LMS_CONFIG.lockTimeoutMs)) {
      throw new Error("과제 기록 요청이 많습니다. 잠시 후 다시 시도해 주세요.");
    }

    try {
      if (!cache.get(cacheKey)) {
        appendHomeworkLog_(student, request);
        cache.put(cacheKey, "1", LMS_CONFIG.duplicateCacheSeconds);
      }
    } finally {
      lock.releaseLock();
    }

    return jsonResponse_({
      ok: true,
      student: student,
      missionId: request.missionId
    });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: String(error.message || error) });
  }
}

function getStudents_() {
  var sheet = getSpreadsheet_().getSheetByName(LMS_CONFIG.rosterSheetName);
  if (!sheet) throw new Error("출석부 시트를 찾을 수 없습니다.");

  var rowCount = Math.max(sheet.getLastRow() - LMS_CONFIG.rosterStartRow + 1, 0);
  if (!rowCount) return [];

  return sheet.getRange(LMS_CONFIG.rosterStartRow, 2, rowCount, 3)
    .getDisplayValues()
    .filter(function (row) { return String(row[0]).trim() !== ""; })
    .map(function (row) {
      return {
        studentId: safeText_(row[0], 60),
        name: safeText_(row[1], 80),
        team: safeText_(row[2], 80)
      };
    })
    .sort(function (a, b) { return a.studentId.localeCompare(b.studentId); });
}

function findStudentById_(studentId) {
  var normalizedId = safeText_(studentId, 60);
  var students = getStudents_();
  for (var i = 0; i < students.length; i += 1) {
    if (students[i].studentId === normalizedId) return students[i];
  }
  return null;
}

function readLoginRequest_(e) {
  var params = (e && e.parameter) || {};
  var studentId = safeText_(params.studentId, 60);
  var eventId = safeText_(params.eventId, 120);

  if (!studentId) throw new Error("학생 ID가 없습니다.");
  if (!eventId) throw new Error("이벤트 ID가 없습니다.");

  return {
    studentId: studentId,
    eventId: eventId,
    sessionId: safeText_(params.sessionId, 120),
    clientTimestamp: safeText_(params.clientTimestamp, 60),
    pagePath: safeText_(params.pagePath, 300),
    userAgent: safeText_(params.userAgent, 500)
  };
}

function readHomeworkRequest_(e) {
  var params = (e && e.parameter) || {};
  var studentId = safeText_(params.studentId, 60);
  var eventId = safeText_(params.eventId, 120);
  var missionId = safeText_(params.missionId, 120);
  var missionTitle = safeText_(params.missionTitle, 300);

  if (!studentId) throw new Error("학생 ID가 없습니다.");
  if (!eventId) throw new Error("이벤트 ID가 없습니다.");
  if (!missionId) throw new Error("과제 ID가 없습니다.");
  if (!missionTitle) throw new Error("과제 제목이 없습니다.");

  return {
    studentId: studentId,
    eventId: eventId,
    missionId: missionId,
    missionTitle: missionTitle,
    homeworkPage: safeText_(params.homeworkPage, 120),
    sessionId: safeText_(params.sessionId, 120),
    clientTimestamp: safeText_(params.clientTimestamp, 60),
    pagePath: safeText_(params.pagePath, 300),
    userAgent: safeText_(params.userAgent, 500)
  };
}

function appendLoginLog_(student, request) {
  var sheet = getSpreadsheet_().getSheetByName(LMS_CONFIG.loginLogSheetName);
  if (!sheet) throw new Error("LOG_LMS_Login 시트를 찾을 수 없습니다.");

  sheet.appendRow([
    new Date(),
    safeCell_(student.studentId),
    safeCell_(student.name),
    safeCell_(student.team),
    safeCell_(request.eventId),
    safeCell_(request.sessionId),
    safeCell_(request.clientTimestamp),
    safeCell_(request.pagePath),
    safeCell_(request.userAgent),
    "성공"
  ]);
}

function appendHomeworkLog_(student, request) {
  var sheet = getSpreadsheet_().getSheetByName(LMS_CONFIG.homeworkLogSheetName);
  if (!sheet) throw new Error("LOG_Homework_Mission 시트를 찾을 수 없습니다.");

  sheet.appendRow([
    new Date(),
    safeCell_(student.studentId),
    safeCell_(student.name),
    safeCell_(student.team),
    safeCell_(request.homeworkPage),
    safeCell_(request.missionId),
    safeCell_(request.missionTitle),
    safeCell_(request.eventId),
    safeCell_(request.sessionId),
    safeCell_(request.clientTimestamp),
    safeCell_(request.pagePath),
    safeCell_(request.userAgent),
    "성공"
  ]);
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(LMS_CONFIG.spreadsheetId);
}

function safeText_(value, maxLength) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, maxLength);
}

function safeCell_(value) {
  var text = String(value == null ? "" : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function testGetStudents() {
  console.log(JSON.stringify(getStudents_()));
}
