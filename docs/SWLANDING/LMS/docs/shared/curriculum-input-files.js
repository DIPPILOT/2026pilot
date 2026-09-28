(function () {
  "use strict";

  function ctx(day, type, id, item) {
    return { day: day, type: type, id: id, title: item.title, artifact: item.artifact, brief: item.pbl.brief, persona: item.pbl.scenario.persona, situation: item.pbl.scenario.situation, work: item.pbl.work, done: item.pbl.done, issue: item.issue || "" };
  }
  function bullets(values, prefix) { return values.map(function (v) { return (prefix || "- ") + v; }).join("\n"); }
  function csvCell(value) { var s = String(value == null ? "" : value); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  function toCsv(rows) { return rows.map(function (row) { return row.map(csvCell).join(","); }).join("\n") + "\n"; }

  function exact(name) {
    if (name === "ai-api-spec.yaml") return [
      "openapi: 3.0.3", "info:", "  title: Streamly AI Generated API", "  version: 0.1.0-draft", "paths:",
      "  /videos:", "    post:", "      summary: 영상 등록", "      requestBody:", "        required: true", "        content:", "          application/json:",
      "            schema:", "              type: object", "              required: [title, sourceUrl]", "              properties:", "                title: { type: string }", "                sourceUrl: { type: string }",
      "      responses:", "        '200': { description: 등록 성공 }", "        '400': { description: 모든 실패를 잘못된 요청으로 처리 }",
      "  /payments/{paymentId}:", "    get:", "      summary: 결제 조회", "      responses:", "        '200': { description: 결제 완료 }",
      "# 검증 과제: 취소, 중복 요청, 권한 오류, Pending, Idempotency 계약이 누락되어 있습니다."
    ].join("\n") + "\n";
    if (name === "user-flow-cases.md") return [
      "# 사용자 Flow 사례 — API 추적용", "",
      "| Case | Actor | 행동 | 기대 상태 | 실패 후 행동 |", "|---|---|---|---|---|",
      "| UF-01 | Creator | 영상 등록 | DRAFT 생성 | Validation 표시와 입력 보존 |",
      "| UF-02 | Creator | 업로드 취소 | Session 폐기 | 중복 취소는 동일 결과 반환 |",
      "| UF-03 | Creator | 등록 버튼 2회 클릭 | 영상 1건 생성 | Idempotency Key 결과 반환 |",
      "| UF-04 | Viewer | 유료 영상 재생 | 로그인 후 원래 영상 복귀 | 구매 필요 안내 |",
      "| UF-05 | Viewer | 재생 URL 요청 | 만료 URL 발급 | 권한 없으면 구매 내역 확인 |",
      "| UF-06 | Advertiser | 예산 변경 | 새 예산과 버전 반환 | 충돌 시 최신 값 표시 |",
      "| UF-07 | Admin | 영상 차단 | BLOCKED와 감사 Log | 권한 부족이면 금지 |",
      "| UF-08 | Viewer | PG 응답 지연 | PENDING 표시 | 조회·취소만 허용, 재승인 금지 |", "",
      "각 Flow를 지원하는 Endpoint·오류·상태·Test가 ai-api-spec.yaml에 존재하는지 확인하세요."
    ].join("\n") + "\n";
    return null;
  }

  function markdown(name, c) {
    var ai = /^ai[-_]/i.test(name);
    return [
      "# " + name, "", "> Day " + c.day + " · " + c.title + " · " + (ai ? "검증 전 AI 초안" : "교육용 시작 자료"), "",
      "## Persona 상황", "", c.situation, "", "## 해결할 문제", "", c.brief, "",
      "## 현재 자료", "", "- 확인된 사실: 역할마다 목표와 데이터 책임이 다르다.", "- 검토 필요 정책: 실패 후 복구 행동과 운영 책임",
      ai ? "- AI 가정: 정상 흐름이면 충분하므로 예외 처리는 생략한다." : "- 미결정: 수치 경계와 승인 담당자", "",
      "## 학생 작업", "", bullets(c.work), "", "## 완료 기준", "", bullets(c.done, "- [ ] "), "",
      "## 근거 기록표", "", "| ID | 사실/가정/질문 | 내용 | 근거 | 판정 |", "|---|---|---|---|---|", "| E-01 | 사실 |  |  |  |", "| E-02 | AI 가정 |  |  |  |"
    ].join("\n") + "\n";
  }

  function csvContent(name) {
    if (/feature/i.test(name)) return toCsv([["feature_id","feature","actor","responsibility","owner_domain"],["F-01","영상 업로드","Creator","원본 영상 등록",""],["F-02","광고 예산 변경","Advertiser","예산 관리",""],["F-03","결제 승인","Viewer","금액 승인",""]]);
    if (/persona|evidence/i.test(name)) return toCsv([["persona","source_quote","goal","behavior","data","status"],["Creator","창작자는 영상을 업로드한다","영상 공개","업로드·수정","videoId;status","CONFIRMED"],["Advertiser","","광고 집행","예산 설정","campaignId;budget","HYPOTHESIS"]]);
    if (/permission|role-resource/i.test(name)) return toCsv([["role","resource","action","ownership","tenant","expected"],["CREATOR","Video","UPDATE","owner","same","ALLOW"],["CREATOR","Video","UPDATE","other","same","DENY"],["ADVERTISER","Campaign","READ","owner","other","DENY"]]);
    if (/term/i.test(name)) return toCsv([["korean","english","code","meaning","allowed_transition"],["승인","Approved","APPROVED","정책 책임자가 허용함",""],["확정","Confirmed","CONFIRMED","변경 불가 상태",""],["완료","Completed","COMPLETED","처리 종료",""]]);
    if (/consumer|dependency|usage|inventory/i.test(name)) return toCsv([["consumer","owner","contract","usage","risk","migration"],["Web Checkout","Frontend","price","금액 표시","HIGH",""],["Settlement Batch","Finance","paymentStatus","정산 필터","HIGH",""],["Ops Report","Operations","userId","운영 지표","MEDIUM",""]]);
    if (/metric|event|refund/i.test(name)) return toCsv([["event_id","user_id","event_type","occurred_at","amount","status","duplicate_of"],["evt-001","viewer-1","checkout_started","2026-09-28T01:00:00Z","15000","VALID",""],["evt-002","viewer-1","payment_completed","2026-09-28T01:01:00Z","15000","VALID",""],["evt-003","viewer-1","payment_completed","2026-09-28T01:01:01Z","15000","DUPLICATE","evt-002"]]);
    return toCsv([["id","category","input","expected","actual","evidence","decision"],["CASE-01","normal","sample-a","정상 처리","","",""],["CASE-02","boundary","sample-b","경계 검증","","",""],["CASE-03","failure","sample-c","복구 행동","","",""]]);
  }

  function jsonContent(name, c) {
    var value;
    if (/impression|campaign/i.test(name)) value = { campaignId:"cam-101", viewerId:"viewer-21", occurredAt:"2026-09-28T01:02:03Z", exposuresLast24h:3, remainingBudget:1000, impressionCost:100, expected:"BLOCK" };
    else if (/failure|duplicate|pg-event/i.test(name)) value = { traceId:"trace-001", paymentId:"pay-101", events:[{id:"evt-1",type:"PAYMENT_REQUESTED"},{id:"evt-2",type:"PG_TIMEOUT"},{id:"evt-2-copy",type:"PAYMENT_RETRY_REQUESTED",warning:"duplicate charge risk"}] };
    else if (/slo-dashboard/i.test(name)) value = { service:"streamly", release:"rc-10", thresholds:{errorRate:0.01,p95LatencyMs:800,paymentFailureRate:0.03}, observed:null };
    else value = { day:c.day, title:c.title, records:[{id:"sample-1",status:"CONFIRMED",value:"정상 사례"},{id:"sample-2",status:"UNVERIFIED",value:"AI 가정"},{id:"sample-3",status:"FAILED",value:"복구 필요"}], todo:c.work };
    return JSON.stringify(value, null, 2) + "\n";
  }

  function yamlContent(name, c) {
    return exact(name) || ["openapi: 3.0.3","info:","  title: Day " + c.day + " " + c.title,"  version: 0.1.0","paths:","  /resources/{resourceId}:","    get:","      responses:","        '200': { description: Success }","        '404': { description: Not found }","# TODO: 권한, Validation, Conflict, Idempotency, Error Schema"].join("\n") + "\n";
  }
  function mermaid(name) {
    if (/sequence|payment|iot|sync/i.test(name)) return ["sequenceDiagram","  actor User","  participant Client","  participant API","  participant Domain","  participant DB","  User->>Client: 작업 요청","  Client->>API: POST /resource","  API->>Domain: command","  Domain->>DB: save","  DB-->>Domain: result","  Domain-->>Client: response","  %% TODO: Timeout, Retry, 권한 실패, 보상 흐름"].join("\n") + "\n";
    return ["flowchart LR","  User --> Client","  Client --> DomainA","  DomainA -->|Event| DomainB","  DomainB --> Store[(Data Store)]","  DomainA -. ownership conflict .-> Store","  %% TODO: Owner, Consumer, 복구 책임"].join("\n") + "\n";
  }
  function javascript(name, c) {
    if (/frequency-cap/i.test(name)) return "export function canExpose(history, now) {\n  // TODO: 최근 24시간 3회 미만인지 판정하고 동시 요청을 차단하세요.\n  throw new Error('NOT_IMPLEMENTED');\n}\n";
    if (/selector/i.test(name)) return "export function selectCampaign(campaigns, context) {\n  // TODO: ACTIVE → Budget → Target → Frequency 순서로 결정적으로 선택하세요.\n  return null;\n}\n";
    return "// Day " + c.day + " starter: " + c.title + "\nexport async function run(input, dependencies) {\n  if (!input) throw new Error('INPUT_REQUIRED');\n  // TODO: 정상·경계·실패 흐름과 복구 결과를 구현하세요.\n  return { status: 'NOT_IMPLEMENTED' };\n}\n";
  }
  function html(name, c) {
    return "<!doctype html>\n<html lang=\"ko\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width\"><title>" + c.title + " Starter</title><style>body{font-family:sans-serif;max-width:720px;margin:40px auto}label{display:block;margin:12px 0}input,button{padding:10px;width:100%}.error{color:#b91c1c}</style></head><body><main><h1>" + c.title + "</h1><p>" + c.brief + "</p><form><label>이메일<input type=\"email\"></label><button>계속</button><p class=\"error\" role=\"alert\"></p></form><!-- TODO: Loading, Empty, Error, Disabled, Success와 복구 화면 --></main></body></html>\n";
  }
  function logText() {
    return "2026-09-28T01:00:00.100Z INFO trace=tr-101 request_started\n2026-09-28T01:00:30.212Z WARN trace=tr-101 retry attempt=1 reason=UPSTREAM_TIMEOUT\n2026-09-28T01:00:30.220Z ERROR trace=tr-101 duplicate_side_effect resource=res-77\n2026-09-28T01:01:00.050Z ERROR trace=tr-102 access_denied user=user-b owner=user-a\n# TODO: 재현 조건, 근본 원인, 사용자 영향, 수정 증거\n";
  }
  function content(name, c) {
    var special = exact(name); if (special) return special;
    var ext = (name.split(".").pop() || "").toLowerCase();
    if (ext === "md") return markdown(name, c);
    if (ext === "csv") return csvContent(name);
    if (ext === "json") return jsonContent(name, c);
    if (ext === "yaml" || ext === "yml") return yamlContent(name, c);
    if (ext === "mmd") return mermaid(name);
    if (ext === "js") return javascript(name, c);
    if (ext === "html") return html(name, c);
    if (ext === "sql") return "-- AI 주문 Schema\nCREATE TABLE products(product_id BIGINT PRIMARY KEY,current_price DECIMAL(12,2));\nCREATE TABLE order_items(order_id BIGINT,product_id BIGINT,quantity INT);\n-- 문제: 주문 시점 가격 Snapshot이 없습니다. Migration과 검증 Query를 작성하세요.\n";
    if (ext === "diff") return "diff --git a/contract.json b/contract.json\n--- a/contract.json\n+++ b/contract.json\n-  \"price\": 15000,\n+  \"price\": \"15000\",\n-  \"status\": \"PENDING\"\n+  \"state\": \"WAITING\"\n# TODO: Consumer, Migration, 하위 호환, Rollback 영향\n";
    if (ext === "har") return JSON.stringify({log:{version:"1.2",creator:{name:"DIP PBL",version:"1.0"},entries:[{time:30005,request:{method:"GET",url:"https://example.local/api/videos"},response:{status:504,statusText:"Gateway Timeout"}}]}}, null, 2) + "\n";
    if (ext === "log" || ext === "txt") return logText();
    return markdown(name + ".md", c);
  }

  function folder(name, c) {
    var root = name.replace(/\/$/, "");
    return [
      { name:root + "/README.md", content:markdown("README.md", c) },
      { name:root + "/package.json", content:JSON.stringify({name:root.replace(/[^a-z0-9-]/gi,"-").toLowerCase(),private:true,type:"module",scripts:{test:"node --test"}},null,2)+"\n" },
      { name:root + "/src/index.js", content:javascript(root + ".js", c) },
      { name:root + "/test/starter.test.js", content:"import test from 'node:test';\nimport assert from 'node:assert/strict';\ntest('정상·경계·실패 조건',()=>{ assert.equal(true,false,'테스트를 완성하세요'); });\n" }
    ];
  }
  function resolve(day, type, id, name, item) { var c = ctx(day,type,id,item); return /\/$/.test(name) ? folder(name,c) : [{name:name,content:content(name,c)}]; }
  function describe(name) {
    if (/\/$/.test(name)) return "README·Source·Test가 포함된 ZIP Starter Pack";
    if (/^ai[-_]/i.test(name)) return "오류·누락·가정이 포함된 검증 전 AI 초안";
    var ext=(name.split(".").pop()||"").toUpperCase();
    return ({MD:"정책·사례·작성 템플릿",CSV:"분석용 표본 데이터",JSON:"실행·검증용 구조화 데이터",YAML:"API Contract 초안",MMD:"Mermaid 다이어그램 초안",JS:"미완성 구현 Starter",HTML:"실습용 화면 Prototype",SQL:"재현용 Database Schema",DIFF:"변경 영향 분석용 Diff",HAR:"브라우저 Network 기록",LOG:"장애 재현 Log",TXT:"환경·설정 기록"})[ext] || ext + " 시작 자료";
  }

  window.LMS_INPUT_FILES_CORE = { resolve:resolve, describe:describe };
})();

(function () {
  "use strict";
  var core = window.LMS_INPUT_FILES_CORE;
  if (!core) return;

  var crcTable = (function () {
    var table = [];
    for (var n = 0; n < 256; n += 1) {
      var c = n;
      for (var k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
    return table;
  })();
  function crc32(bytes) {
    var crc = 0xffffffff;
    for (var i = 0; i < bytes.length; i += 1) crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }
  function u16(view, offset, value) { view.setUint16(offset, value, true); }
  function u32(view, offset, value) { view.setUint32(offset, value >>> 0, true); }
  function zip(entries) {
    var encoder = new TextEncoder();
    var files = entries.map(function (entry) {
      var fileName = encoder.encode(entry.name);
      var data = encoder.encode(entry.content);
      return { name:fileName, data:data, crc:crc32(data) };
    });
    var localSize = files.reduce(function (sum, file) { return sum + 30 + file.name.length + file.data.length; }, 0);
    var centralSize = files.reduce(function (sum, file) { return sum + 46 + file.name.length; }, 0);
    var output = new Uint8Array(localSize + centralSize + 22);
    var view = new DataView(output.buffer);
    var offset = 0;
    var records = [];
    files.forEach(function (file) {
      var start = offset;
      u32(view,offset,0x04034b50); u16(view,offset+4,20); u16(view,offset+6,0x0800); u16(view,offset+8,0);
      u16(view,offset+10,0); u16(view,offset+12,0); u32(view,offset+14,file.crc); u32(view,offset+18,file.data.length);
      u32(view,offset+22,file.data.length); u16(view,offset+26,file.name.length); u16(view,offset+28,0);
      output.set(file.name,offset+30); output.set(file.data,offset+30+file.name.length);
      offset += 30 + file.name.length + file.data.length;
      records.push({file:file,start:start});
    });
    var centralStart = offset;
    records.forEach(function (record) {
      var file = record.file;
      u32(view,offset,0x02014b50); u16(view,offset+4,20); u16(view,offset+6,20); u16(view,offset+8,0x0800); u16(view,offset+10,0);
      u16(view,offset+12,0); u16(view,offset+14,0); u32(view,offset+16,file.crc); u32(view,offset+20,file.data.length); u32(view,offset+24,file.data.length);
      u16(view,offset+28,file.name.length); u16(view,offset+30,0); u16(view,offset+32,0); u16(view,offset+34,0); u16(view,offset+36,0);
      u32(view,offset+38,0); u32(view,offset+42,record.start); output.set(file.name,offset+46); offset += 46 + file.name.length;
    });
    u32(view,offset,0x06054b50); u16(view,offset+4,0); u16(view,offset+6,0); u16(view,offset+8,files.length); u16(view,offset+10,files.length);
    u32(view,offset+12,offset-centralStart); u32(view,offset+16,centralStart); u16(view,offset+20,0);
    return output;
  }
  function save(blob, name) {
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.href = url; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function download(day,type,id,name,item) {
    var entries = core.resolve(day,type,id,name,item);
    if (/\/$/.test(name)) save(new Blob([zip(entries)],{type:"application/zip"}),name.replace(/\/$/,"")+".zip");
    else save(new Blob([entries[0].content],{type:"text/plain;charset=utf-8"}),name.split("/").pop());
  }
  function downloadAll(day,type,id,item) {
    var manifest = [
      "# START HERE — Day " + day + " " + item.title,
      "",
      "## Persona 상황",
      "",
      item.pbl.scenario.situation,
      "",
      "## 제공 자료",
      "",
      item.pbl.inputs.map(function (name) { return "- " + name + " — " + core.describe(name); }).join("\n"),
      "",
      "## 수행 순서",
      "",
      item.pbl.work.map(function (work,index) { return (index+1) + ". " + work; }).join("\n"),
      "",
      "## 주의",
      "",
      "- ai- 또는 ai_로 시작하는 자료는 검증 전 AI 초안입니다.",
      "- 빈칸을 임의로 확정하지 말고 사실·가정·질문으로 구분하세요.",
      "- 원본 파일은 보존하고 수정본과 Diff를 함께 제출하세요."
    ].join("\n");
    var entries = [{name:"START_HERE.md",content:manifest+"\n"}];
    item.pbl.inputs.forEach(function (name) { entries = entries.concat(core.resolve(day,type,id,name,item)); });
    save(new Blob([zip(entries)],{type:"application/zip"}),"day"+day+"-"+type+id+"-starter-files.zip");
  }
  function render(day,type,id,item,escapeHtml) {
    return '<div class="input-download-head"><p>파일을 내려받아 같은 작업 폴더에 저장하세요. AI 초안은 정답이 아니라 오류와 누락을 찾기 위한 검토 대상입니다.</p><button type="button" class="button primary input-download-all">전체 자료 ZIP 다운로드</button></div>' +
      '<div class="input-download-list">' + item.pbl.inputs.map(function (name,index) {
        return '<div class="input-download-row"><div><code>'+escapeHtml(name)+'</code><span>'+escapeHtml(core.describe(name))+'</span></div><button type="button" class="button input-download-one" data-input-index="'+index+'">'+(/\/$/.test(name)?"ZIP 다운로드":"파일 다운로드")+'</button></div>';
      }).join("") + '</div>';
  }
  function bind(root,day,type,id,item) {
    root.querySelector(".input-download-all").addEventListener("click",function(){downloadAll(day,type,id,item);});
    root.querySelectorAll(".input-download-one").forEach(function(button){
      button.addEventListener("click",function(){download(day,type,id,item.pbl.inputs[Number(button.dataset.inputIndex)],item);});
    });
  }
  window.LMS_INPUT_FILES = { resolve:core.resolve, describe:core.describe, zip:zip, render:render, bind:bind };
})();
