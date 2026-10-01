// Code.gs와 같은 프로젝트에 추가합니다. 기존 로그인/과제 배포 URL을 공유합니다.
function isPreLearningExcluded_(date) {
  var kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  var day = kst.getUTCDay();
  var minutes = kst.getUTCHours() * 60 + kst.getUTCMinutes();
  return (day === 5 && minutes >= 1080 && minutes < 1320) ||
    (day === 6 && minutes >= 540 && minutes < 1080);
}

function handlePreLearningClick_(e) {
  try {
    // 서버 수신 시각을 기준으로 검사합니다. 클라이언트 시각으로 우회할 수 없습니다.
    var receivedAt = new Date();
    if (isPreLearningExcluded_(receivedAt)) {
      return jsonResponse_({ ok: true, skipped: true, reason: "class_hours" });
    }
    var request = readHomeworkRequest_(e);
    var params = (e && e.parameter) || {};
    var day = Number(params.day);
    if (!Number.isInteger(day) || day < 1 || day > 10) throw new Error("유효하지 않은 학습 일차입니다.");
    if (!new RegExp("^DAY" + day + "-(TASK|SKILL|MISSION)[1-9][0-9]*$").test(request.missionId)) {
      throw new Error("유효하지 않은 미션 ID입니다.");
    }
    var student = findStudentById_(request.studentId);
    if (!student) throw new Error("등록되지 않은 학생 ID입니다.");
    var cache = CacheService.getScriptCache();
    var key = "lms-pre-learning:" + request.eventId;
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(LMS_CONFIG.lockTimeoutMs)) throw new Error("기록 요청이 많습니다. 잠시 후 다시 시도해 주세요.");
    try {
      if (cache.get(key)) return jsonResponse_({ ok: true, duplicate: true });
      var sheet = getSpreadsheet_().getSheetByName("LOG_Pre_Learning");
      if (!sheet) throw new Error("LOG_Pre_Learning 시트를 찾을 수 없습니다.");
      sheet.appendRow([
        receivedAt, safeCell_(student.studentId), safeCell_(student.name), safeCell_(student.team),
        "Day " + day, safeCell_(request.missionId), safeCell_(request.missionTitle),
        safeCell_(request.eventId), safeCell_(request.sessionId), safeCell_(request.clientTimestamp),
        safeCell_(request.pagePath), safeCell_(request.userAgent), "성공"
      ]);
      cache.put(key, "1", LMS_CONFIG.duplicateCacheSeconds);
    } finally {
      lock.releaseLock();
    }
    return jsonResponse_({ ok: true, missionId: request.missionId });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: String(error.message || error) });
  }
}
