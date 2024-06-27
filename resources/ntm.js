var Ntm = window.Ntm || {};

Ntm.Settings = {"tags":[{"type":"PLUGIN","id":"TAG-19076","name":"_tagType_checkbox","enabled":true,"operator":"AND","triggers":["TRG-28409"],"exceptions":[],"pluginType":"nlogger","logType":"EVENT","path":"","parameters":{},"cookies":{"checkboxName":"VAR-84899","tagType":"VAR-68754","domain":"VAR-85182","nth_time":"VAR-40968","_menuId":"VAR-98318","nth_platform":"VAR-98309","nth_lastModifeid":"VAR-98321","nth_uid":"VAR-63099","clickClass":"VAR-00010","clickId":"VAR-00009","clickTag":"VAR-00012","clickLabel":"VAR-84899"}},{"type":"PLUGIN","id":"TAG-77601","name":"_tagType_radio","enabled":true,"operator":"AND","triggers":["TRG-78870"],"exceptions":[],"pluginType":"nlogger","logType":"EVENT","path":"","parameters":{},"cookies":{"radioName":"VAR-84899","tagType":"VAR-19087","domain":"VAR-85182","nth_time":"VAR-40968","_menuId":"VAR-98318","nth_platform":"VAR-98309","nth_lastModifeid":"VAR-98321","nth_uid":"VAR-63099","clickClass":"VAR-00010","clickId":"VAR-00009","clickTag":"VAR-00012","clickLabel":"VAR-84899"}},{"type":"PLUGIN","id":"TAG-45422","name":"_tagType_scroll","enabled":true,"operator":"AND","triggers":["TRG-58804"],"exceptions":[],"pluginType":"nlogger","logType":"EVENT","path":"","parameters":{},"cookies":{"scrollRate":"VAR-73743","tagType":"VAR-79882","domain":"VAR-85182","nth_time":"VAR-40968","_menuId":"VAR-98318","nth_platform":"VAR-98309","nth_lastModifeid":"VAR-98321","nth_uid":"VAR-63099"}},{"type":"PLUGIN","id":"TAG-65362","name":"_tagType_atagClick","enabled":true,"operator":"OR","triggers":["TRG-99550"],"exceptions":[],"pluginType":"nlogger","logType":"EVENT","path":"","parameters":{},"cookies":{"atagclickName":"VAR-77979","tagType":"VAR-71164","domain":"VAR-85182","nth_time":"VAR-40968","_menuId":"VAR-98318","nth_platform":"VAR-98309","nth_lastModifeid":"VAR-98321","nth_uid":"VAR-63099","clickClass":"VAR-00010","clickId":"VAR-00009","clickTag":"VAR-00012","clickLabel":"VAR-84899"}},{"type":"PLUGIN","id":"TAG-72228","name":"_tagType_pageview","enabled":true,"operator":"OR","triggers":["TRG-30902","TRG-22572"],"exceptions":[],"pluginType":"nlogger","logType":"EVENT","path":"","parameters":{},"cookies":{"domain":"VAR-85182","tagType":"VAR-85816","nth_duration":"VAR-18466","nth_time":"VAR-40968","nth_referrer":"VAR-98294","nth_platform":"VAR-98309","_menuId":"VAR-98318","nth_lastModifeid":"VAR-98321","nth_uid":"VAR-63099"}},{"type":"PLUGIN","id":"TAG-94164","name":"_tagType_alert","enabled":true,"operator":"AND","triggers":["TRG-99552"],"exceptions":[],"pluginType":"nlogger","logType":"EVENT","path":"","parameters":{},"cookies":{"tagType":"VAR-98323","domain":"VAR-85182","nth_time":"VAR-40968","_menuId":"VAR-98318","nth_platform":"VAR-98309","nth_lastModifeid":"VAR-98321","nth_uid":"VAR-63099","nth_alert":"VAR-98322"}},{"type":"SCRIPT","id":"TAG-94163","name":"SS_alert(감지)","enabled":true,"operator":"AND","triggers":["TRG-22572"],"exceptions":[],"code":"function() {\n   //원래의 alert 함수를 저장\n  var originalAlert = window.alert;\n  \n  //alert 함수를 오버라이드\n  window.alert = function(message) {\n    Ntm.Event.fireUserDefined(\"alert\",{\"alertMessage\": message});\n    console.log(\"NTH>>EL_ALERT감지:\" + message);\n    \n    //원래의 alert 함수를 호출하여 기본 동작 유지\n    originalAlert(message);\n  };\n}","approval":"DONE","logs":[{"time":1711585843061,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"PLUGIN","id":"TAG-79730","name":"CE_loginSuccess(로그인완료)","enabled":true,"operator":"AND","triggers":["TRG-87950"],"exceptions":[],"pluginType":"nlogger","logType":"EVENT","path":"","parameters":{},"cookies":{"domain":"VAR-85182","tagType":"VAR-69112","nth_uid":"VAR-63099","nth_lastModifeid":"VAR-98321"}},{"type":"SCRIPT","id":"TAG-94161","name":"SS_loginSuccess(정보저장)","enabled":true,"operator":"AND","triggers":["TRG-87950"],"exceptions":[],"code":"function() {\nlocalStorage.setItem(\"nth_uid\", {{cd.nth_uid}}); \n}","approval":"DONE","logs":[{"time":1627957852443,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"TAG-39626","name":"LSN_scroll(스크롤감지)","enabled":true,"operator":"AND","triggers":["TRG-36500"],"exceptions":[],"code":"function() {\nvar maxScrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;\nvar percentagesArr = [10, 25, 50, 75, 100];\nconst showed = {};\nlet timeout;\nlet previousPercentage;\nwindow.addEventListener(\"scroll\", function(event) {\n    var scrollVal = this.scrollY;\n    var scrollPercentage = Math.round(scrollVal / maxScrollHeight * 100);\n    let currentPercentage = 0;\n    let i = 0;\n    while(percentagesArr[i] <= scrollPercentage) {\n        currentPercentage = percentagesArr[i++];\n    }\n    if (previousPercentage !== currentPercentage) {\n        clearTimeout(timeout);\n        timeout = currentPercentage !== 0 && !showed[currentPercentage]\n            ? setTimeout(() =>{\n                Ntm.Event.fireUserDefined(\"scroll\", {scrollDepth: currentPercentage});\n                showed[currentPercentage] = true;\n            }, 1000)\n            : null;\n            previousPercentage = currentPercentage;\n            \n    }\n    \n});\nwindow.addEventListener(\"resize\", () => {\n    maxScrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight; \n});\n\n}","approval":"DONE","logs":[{"time":1626930391808,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"TAG-18234","name":"SYSTEM_CONSOLE","enabled":false,"operator":"AND","triggers":["TRG-22572"],"exceptions":[],"code":"function() {\n   console.log('%c NTM>> OK', 'background: #222; color: yellow');\n  console.log('%c \"NTM>>' + Ntm.Settings.lastModified, 'background: #222; color: yellow');\n}","approval":"DONE","logs":[{"time":1626687508498,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"TAG-94162","name":"Nth_Build 이벤트 발동","enabled":true,"operator":"AND","triggers":["TRG-99551"],"exceptions":[],"code":"function() {\n  console.log('nth_build');\n  var event = new Event(\"nth_build\");\n  window.dispatchEvent(event);\n  \n  var txt = window.location.href;\n  sessionStorage.setItem(\"nth_referrer\", txt);\n}","approval":"DONE","logs":[{"time":1704162497891,"userId":"admin","action":"CONFIRM","comment":""}]}],"triggers":[{"type":"GENERAL","id":"TRG-22572","name":"DOM준비완료","event":"DOMREADY","desc":null,"conditions":[]},{"type":"GENERAL","id":"TRG-36500","name":"WL준비완료","event":"WINDOWLOADED","desc":null,"conditions":[]},{"type":"CUSTOM","id":"TRG-58804","name":"CE_scroll","event":"CUSTOM","desc":null,"conditions":[],"eventName":"scroll"},{"type":"ELEMENTCLICK","id":"TRG-78870","name":"CLK_radio","event":"ELEMENTCLICKED","desc":null,"conditions":[],"selector":"input[type=radio]"},{"type":"ELEMENTCLICK","id":"TRG-28409","name":"CLK_CheckboxToggle","event":"ELEMENTCLICKED","desc":null,"conditions":[],"selector":"input[type=checkbox]"},{"type":"CUSTOM","id":"TRG-87950","name":"CE_loginSuccess","event":"CUSTOM","desc":null,"conditions":[],"eventName":"loginSuccess"},{"type":"GENERAL","id":"TRG-30902","name":"URL주소변경","event":"URLCHANGED","desc":null,"conditions":[]},{"type":"ELEMENTCLICK","id":"TRG-99550","name":"CLK_buttonA","event":"ELEMENTCLICKED","desc":"","conditions":[],"selector":"a, button"},{"type":"GENERAL","id":"TRG-99551","name":"Nth_Build 이벤트 발동","event":"DOMREADY","desc":"","conditions":[]},{"type":"CUSTOM","id":"TRG-99552","name":"CE_alert","event":"CUSTOM","desc":"","conditions":[],"eventName":"alert"}],"variables":[{"type":"BUILTIN","id":"VAR-00001","name":"url","description":"페이지 전체 URL"},{"type":"BUILTIN","id":"VAR-00002","name":"host","description":"페이지 URL 호스트"},{"type":"BUILTIN","id":"VAR-00003","name":"path","description":"페이지 URL 경로"},{"type":"BUILTIN","id":"VAR-00004","name":"params","description":"페이지 URL 파라미터"},{"type":"BUILTIN","id":"VAR-00005","name":"paramDict","description":"페이지 URL 파라미터 (객체)"},{"type":"BUILTIN","id":"VAR-00006","name":"hash","description":"페이지 URL 해시"},{"type":"BUILTIN","id":"VAR-00007","name":"referrer","description":"이전 방문 페이지 주소"},{"type":"BUILTIN","id":"VAR-00008","name":"title","description":"페이지 제목"},{"type":"BUILTIN","id":"VAR-00009","name":"clickId","description":"클릭 항목 ID"},{"type":"BUILTIN","id":"VAR-00010","name":"clickClass","description":"클릭 항목 클래스명"},{"type":"BUILTIN","id":"VAR-00011","name":"clickText","description":"클릭 항목 텍스트"},{"type":"BUILTIN","id":"VAR-00012","name":"clickTag","description":"클릭 항목 태그명"},{"type":"BUILTIN","id":"VAR-00013","name":"customData","description":"커스텀 이벤트 변수"},{"type":"PLUGIN","id":"VAR-00014","name":"nlogger","description":"넷스루 로깅 모듈"},{"type":"STRING","id":"VAR-85816","name":"STR.pageview","description":null,"value":"pageview"},{"type":"STRING","id":"VAR-68754","name":"STR.checkbox","description":null,"value":"checkbox"},{"type":"STRING","id":"VAR-19087","name":"STR.radio","description":null,"value":"radio"},{"type":"STRING","id":"VAR-79882","name":"STR.scroll","description":null,"value":"scroll"},{"type":"STRING","id":"VAR-71164","name":"STR.atagClick","description":null,"value":"atagClick"},{"type":"SCRIPT","id":"VAR-73743","name":"cd.scrollDepth","description":null,"code":"function() {\n   var cd = {{customData}};\n\tvar t1 = cd.scrollDepth;\nreturn t1;\n}","approval":"DONE","logs":[{"time":1626930382925,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-85182","name":"CJS_domain","description":null,"code":"function() {\n  try {\n   var t1 = window.location.hostname;\n\t\t} catch(e) {\nvar str = e.toString();\nvar t1 = \"\";\n}\nreturn t1;\n}","approval":"DONE","logs":[{"time":1626681704766,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-84899","name":"CLK_radioToggleCheckboxLabel","description":null,"code":"function() {\n        try {\n      var el = Ntm.Variable.get(\"clickElement\");\n      var ob1 = el && el.closest('span');\n      var ob2 = ob1 && ob1.querySelector('label');\n      var txt = ob2 && ob2.innerText;\n      var rtn = txt && txt.replace(/(\\r\\n|\\n|\\r|\\t|\\s\\s+)/gm,\" \");\n      if (rtn.length > 27 ) {\n      rtn = rtn.substring(0, 27) + \"...\";\n      }\n          } catch(e) {\n            str = e.toString();\n            rtn = \"\";\n      }\n      return rtn;\n      }","approval":"DONE","logs":[{"time":1628058328526,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-44681","name":"CLK_outerHTML","description":null,"code":"function() {\n        try {\n      var el = Ntm.Variable.get(\"clickElement\");\n      var txt = el && el.outerHTML;\n      var rtn = txt && txt.replace(/(\\r\\n|\\n|\\r|\\t|\\s\\s+)/gm,\" \");\n      if (rtn.length > 200 ) {\n      rtn = rtn.substring(0, 200) + \"...\";\n      }\n          } catch(e) {\n            str = e.toString();\n            rtn = \"\";\n      }\n      return rtn;\n      }","approval":"DONE","logs":[{"time":1628058325758,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-49784","name":"CLK_sectionClassName","description":null,"code":"function() {\n        try {\n      var el = Ntm.Variable.get(\"clickElement\");\n      var ob1 = el && el.closest('section');\n      var txt = ob1 && ob1.className;\n      var rtn = txt && txt.replace(/(\\r\\n|\\n|\\r|\\t|\\s\\s+)/gm,\" \");\n      if (rtn.length > 27 ) {\n      rtn = rtn.substring(0, 27) + \"...\";\n      }\n          } catch(e) {\n            str = e.toString();\n            rtn = \"\";\n      }\n      return rtn;\n      }","approval":"DONE","logs":[{"time":1628058331061,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-85674","name":"nth_URL","description":null,"code":"function() {\n  try {\n   var t1 = window.document.URL;\n\t\t} catch(e) {\nvar str = e.toString();\nvar t1 = \"\";\n}\nreturn t1;\n}","approval":"DONE","logs":[{"time":1666057203157,"userId":"nethru","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-18466","name":"CM_nth_duration","description":null,"code":"function() {\n  var now_hms = Math.floor(new Date().getTime() / 1000);\n  var ncg_hms = sessionStorage.getItem('du_time');\n  var du = \"0\";\n\n  if (ncg_hms) {\n    du = now_hms - ncg_hms;\n    sessionStorage.setItem('du_time', now_hms);\n  } else {\n    sessionStorage.setItem('du_time', now_hms);\n  }\n\n  if (du > 1800) {\n    du = \"0\";\n  }\n\n  var txt = du;\n  return txt;\n}","approval":"DONE","logs":[{"time":1667263677657,"userId":"nethru","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-40968","name":"CM_nth_time","description":null,"code":"function() {\ntry {\n  function timestamp(){\n    function pad(n) { return n<10 ? \"0\"+n : n; }\n    d=new Date();\n    return d.getFullYear()+\"-\"+\n    pad(d.getMonth()+1)+\"-\"+\n    pad(d.getDate())+\"_\"+\n    pad(d.getHours())+\":\"+\n    pad(d.getMinutes())+\":\"+\n    pad(d.getSeconds())+\":\"+\n    pad(d.getMilliseconds());\n}\n    txt = timestamp();\n  txt = txt.replace(/\\n|\\t/g, \"\").trim();\n    console.log('%cNth >> ' + txt, 'background: teal; color: white; font-weight:bold');\nreturn txt;\n      } catch (err) {\n    }\n}","approval":"DONE","logs":[{"time":1667263680679,"userId":"nethru","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-94539","name":"cd.nth_uid","description":null,"code":"function() {\n  var cd = {{customData}};\n\tvar np = cd.nth_uid;\n    return np;\n}","approval":"DONE","logs":[{"time":1627957013105,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-63099","name":"tag_nth_uid","description":null,"code":"function() {\n  var np = \"\";\n  var np = localStorage.getItem(\"nth_uid\");\n  return np;\n\n}","approval":"DONE","logs":[{"time":1667265742035,"userId":"nethru","action":"CONFIRM","comment":""}]},{"type":"STRING","id":"VAR-69112","name":"STR.loginSuccess","description":null,"value":"loginSuccess"},{"type":"SCRIPT","id":"VAR-77979","name":"CLK_innerText","description":null,"code":"function () {\n  var el = Ntm.Variable.get(\"clickElement\");\n  var txt;\n\n  if (el.value) {\n    txt = el.value;\n  } else if (el.matches(\"img\") && el.alt) {\n    txt = el.alt;\n  } else if (el.innerText) {\n    txt = el.innerText;\n  } else if (el.querySelector(\"img\")) {\n    txt = el.querySelector(\"img\").alt;\n  }\n  txt = txt.replace(/\\s\\s+/g, \" \").replace(/\\n|\\t/g, \"\").trim();\n  if(txt && txt.length > 100){\n    txt = txt.substring(0, 100) + '...';\n  }\n      console.log(\"NTH >> 클릭정보_클릭텍스트_v1 : \" + txt);\n\n    return txt;\n}","approval":"DONE","logs":[{"time":1628058315541,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-70619","name":"00메모장","description":null,"code":"function() {\n  /*\n  \n  NTM의 최소 발동 단위: 클릭\n클릭이 아닌 다른 발동은 전부 DOM Listener 처리\n쿠키 이슈?\n세션 이슈?\n클릭>스와이프, 클릭>팝업 2건 카운트\n체크박스, 라디오 전송 타이밍 및 규격\n스크롤 타임아웃\ninputless Event와 DOM Change의 목록 (타이머 발동, 패턴 발동 등)\n\n할일 (박노진)\n  - ip 목록 획득\n  - url 목록 획득\n  - EL태그 발동\n  - 세션 처리 방식?\n  -쿠키?\n  -개발세션 바이패스 얻기\n\n요청\n- preview모드 작동불가\n\n\n  */\n  \n  /* AI PRD 찜하기\n  ('.sc-isRoRg.cmUfwX .bVchzM.ihlhHS .sc-kpDqfm.kCIEaq .sc-kRRyDe.gSxtOd')\n  */\n\n  \n  var str = \"\";\n   \n  return str;\n}","approval":"DONE","logs":[{"time":1626239915039,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-98292","name":"CLK_wish","description":null,"code":"function() {\n  var el = Ntm.Variable.get('clickElement');\n  var txt = \"\";\n\n  if(el.innerText == '위시'){\n      try {\n        if(el.closest(\".sc-ktJbId.sc-kMkxaj\")){\n              txt = window.location.pathname.split('/')[2];\n        }else{\n            txt = \"\";\n        }\n    }catch(error){}\n  }\n  \n  \n  if(txt != \"\"){\n  \tconsole.log('%cwish : ' + txt, 'background: violet; color: white; font-weight:bold');\n  }\n  return txt;\n}","approval":"DONE","logs":[{"time":1689917991469,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-98294","name":"nth_referrer","description":null,"code":"function() {\n  var txt = \"\";\n\n  if(sessionStorage.getItem(\"nth_referrer\")){\n    txt = sessionStorage.getItem(\"nth_referrer\");\n  } else {\n    txt = {{referrer}};\n}\ncURL = {{url}};\ncURL = decodeURIComponent(cURL);\nif(sessionStorage.getItem(\"nth_referrer\") != location.href){\n  sessionStorage.setItem(\"nth_referrer\", cURL);\n}\n\nif(txt != \"\"){\n  console.log('%cnth_referrer : ' + txt, 'background: white; color: black; font-weight:bold');\n}\n txt = decodeURIComponent(txt);\nreturn txt;\n}","approval":"DONE","logs":[{"time":1689923032609,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-98295","name":"R_Page","description":null,"code":"function() {\n  var txt = \"\";\n\n  var pre_page = sessionStorage.getItem(\"nth_referrer\");\n  if( (pre_page == 'https://ecfo.welstorymall.com/') ||\n    (pre_page == 'https://ecmo.welstorymall.com/') || \n    (pre_page == 'https://www.welstorymall.com/') ||\n     (pre_page == 'https://m.welstorymall.com/') ||\n     (pre_page == 'https://qafo.welstorymall.com/') ||\n     (pre_page == 'https://qamo.welstorymall.com/')\n    ){ txt = \"메인\"; }\n  if( pre_page.includes('/search')){txt = \"검색\";}\n  if( pre_page.includes('/exhibition')){ txt = \"기획전\"; }\n  if( pre_page.match(/\\exhibition\\/S.*/gi)){ txt = \"기획전 상세\"; }\n  if( pre_page.includes('/event')){ txt = \"이벤트\"; }\n  if( pre_page.match(/\\event\\/E.*/gi)){ txt = \"이벤트 상세\"; }\n  if( pre_page.includes('/best')){ txt = \"베스트\"; }\n  if( pre_page.includes('/category')){ txt = \"대카테고리\"; }\n  if( pre_page.match(/\\good\\/.*/gi)){ txt = \"상품상세\"; }\n  if( pre_page.includes('/new-good')){ txt = \"신상품\"; }\n\n\n  if(txt != \"\"){\n  \tconsole.log('%cR_Page : ' + txt, 'background: black; color: white; font-weight:bold');\n  }\n  return txt;\n}","approval":"DONE","logs":[{"time":1689925208567,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-98296","name":"sch_related_kwd","description":null,"code":"function() {\n  var el = Ntm.Variable.get('clickElement');\n  var txt = \"\";\n  if(el.closest(\".sc-aXZVg.jIBAPQ .sc-eldPxv.eKVkix\").matches(\".sc-aXZVg.jIBAPQ .sc-eldPxv.eKVkix\")){\n    txt = el.innerText;\n  }\n\n  if(txt != \"\"){\n    console.log('%c related_kwd : ' + txt, 'background: hotpink; color: white; font-weight:bold');\n  }\n  \n  return txt;\n}","approval":"DONE","logs":[{"time":1690250723012,"userId":"admin","action":"CONFIRM","comment":""},{"time":1690433231098,"userId":"admin","action":"RESET","comment":""},{"time":1690433515279,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-98297","name":"sch_recent_kwd","description":null,"code":"function() {\n  var el = Ntm.Variable.get('clickElement');\n  var txt = \"\";\n  \n  try{\n    var label = el.closest('[data-ds-label2]').getAttribute('data-ds-label2');\n    if(label == 'g_rece_search_list'){\n      if(document.querySelector('label.radio-checked').getAttribute('data-ds-label2').match('g_rece')){\n        txt = document.querySelector('label.radio-checked').innerText;\n      }\n    }\n  }catch(error){}\n  \n\n  if(txt != \"\"){\n    console.log('%c sch_recent_kwd : ' + txt, 'background: hotpink; color: white; font-weight:bold');\n  }\n  return txt;\n}","approval":"DONE","logs":[{"time":1690250725287,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-98298","name":"sch_realtime_kwd","description":null,"code":"function() {\n  var el = Ntm.Variable.get('clickElement');\n  var txt = \"\";\n\t\n  try{\n    var label = el.closest('[data-ds-label2]').getAttribute('data-ds-label2');\n    if(label == 'g_real_time_seach_list'){\n      if(document.querySelector('label.radio-checked').getAttribute('data-ds-label2').match('g_real_time')){\n        txt = document.querySelector('label.radio-checked').innerText;\n      }\n    }\n  }catch(error){}\n\n  if(txt != \"\"){\n    console.log('%c sch_realtime_kwd : ' + txt, 'background: hotpink; color: white; font-weight:bold');\n  }\n  return txt;\n}","approval":"DONE","logs":[{"time":1690250728805,"userId":"admin","action":"CONFIRM","comment":""},{"time":1690433228266,"userId":"admin","action":"RESET","comment":""},{"time":1690433761064,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-98299","name":"sch_offer_kwd","description":null,"code":"function() {\n  var el = Ntm.Variable.get('clickElement');\n  var txt = \"\";\n\t\n  if(el.closest('.sc-gEvEer.gHmUxW').matches('.sc-gEvEer.gHmUxW')){\n    txt = el.innerText;\n  }\n\n  if(txt != \"\"){\n    console.log('%c sch_offer_kwd : ' + txt, 'background: hotpink; color: white; font-weight:bold');\n  }\n}","approval":"DONE","logs":[{"time":1690250731156,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-98309","name":"nth_platform","description":null,"code":"function() {\n  var t1 = window.location.host.split('.')[0];\n  var txt = '';\n\n  if(  \n       (navigator.userAgent.includes('HRD-NET') ||navigator.userAgent.includes('MWorknet') || navigator.userAgent.includes('ei-mobile')|| navigator.userAgent.includes('epsApp') == true)\n    ){\n    txt = 'APP';\n    return txt;\n  }\n  if(\n    \t(t1 == 'm' && (navigator.userAgent.includes('HRD-NET') ||navigator.userAgent.includes('MWorknet') || navigator.userAgent.includes('ei-mobile')|| navigator.userAgent.includes('epsApp') == false))\n    ){\n    txt = 'MOBILE';\n    return txt;\n  }\n  if(t1 == 'www'){\n    txt = 'PC';\n    return txt;\n  }\n\n  if(txt != \"\"){\n    console.log('%cS_platform : ' + txt, 'background: salmon; color: white; font-weight:bold');\n  }\n  return txt; \n}","approval":"DONE","logs":[{"time":1690355759490,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-98310","name":"L_Page","description":null,"code":"function() {\n  var txt = \"\";\n  var now_page = window.location.href;\n  if( (now_page == 'https://www.welstorymall.com/') ||\n    (now_page == 'https://ecmo.welstorymall.com/') ||\n     (now_page == 'https://ecfo.welstorymall.com/') ||\n     (now_page == 'https://m.welstorymall.com/') ||\n     (now_page == 'https://qafo.welstorymall.com/') ||\n     (now_page == 'https://qamo.welstorymall.com/')\n    ){ txt = \"메인\"; }\n  if( now_page.includes('/search')){txt = \"검색\";}\n  if( now_page.includes('/exhibition')){ txt = \"기획전\"; }\n  if( now_page.match(/\\exhibition\\/S.*/gi)){ txt = \"기획전 상세\"; }\n  if( now_page.includes('/event')){ txt = \"이벤트\"; }\n  if( now_page.match(/\\event\\/E.*/gi)){ txt = \"이벤트 상세\"; }\n  if( now_page.includes('/best')){ txt = \"베스트\"; }\n  if( now_page.includes('/category')){ txt = \"대카테고리\"; }\n  if( now_page.match(/\\good\\/.*/gi)){ txt = \"상품상세\"; }\n  if( now_page.includes('/new-good')){ txt = \"신상품\"; }\n\n\n  if(txt != \"\"){\n  \tconsole.log('%cL_Page : ' + txt, 'background: black; color: white; font-weight:bold');\n  }\n  return txt;\n}","approval":"DONE","logs":[{"time":1691029386791,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-98316","name":"CLK_share","description":null,"code":"function() {\n  var el = Ntm.Variable.get('clickElement');\n  var txt = \"\";\n  // 모바일\n  if(location.host.split('.')[0].includes('m')){\n  \ttxt = OutputText(el);\n  }\n\n  function OutputText(el){\n    if(el.closest(\".sc-eqUAAy.hURXiD\")){\n      if(el.getAttribute('id') == null){ return \"URL 복사\";}\n      if(el.getAttribute('id').includes('kakao')){ return \"카카오톡\"; }\n    }\n    return \"\";\n  }\n  \n  if(txt != \"\" ){\n  \tconsole.log('%cShare : ' + txt, 'background: violet; color: white; font-weight:bold');\n  }\n  return txt;\n}","approval":"DONE","logs":[{"time":1691480593578,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-98317","name":"nth_CLK","description":null,"code":"function() {\n  var txt = \"\";\n  var pre_page = sessionStorage.getItem(\"nth_referrer\");\n  txt = pre_page;\n  \n  if(txt != \"\"){\n  \tconsole.log('%cnth_CLK : ' + txt, 'background: white; color: black; font-weight:bold');\n  }\n  \n  return txt;\n   \n}","approval":"DONE","logs":[{"time":1692155511386,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"VARIABLE","id":"VAR-98318","name":"_menuId","description":null,"value":"_menuId"},{"type":"SCRIPT","id":"VAR-98321","name":"A_로그정보_컨테이너수정일자","description":null,"code":"function () {\n  ///로그정보_컨테이너수정일자_v1\n\n  var txt;\n  txt = Ntm.Settings.lastModified;\n  if (txt) {\n    txt = txt.replace(/\\n|\\t/g, \"\").trim();\n    txt = txt.replace(/\\:/g, \"-\").trim();\n    txt = txt.replace(/ /g, \"--\").trim();\n  }\n    console.log(\"NTH >> 로그정보_컨테이너수정일자_v1 : \" + txt);\n  return txt;\n}","approval":"DONE","logs":[{"time":1709604483611,"userId":"admin","action":"CONFIRM","comment":""}]},{"type":"SCRIPT","id":"VAR-98322","name":"cd_alertMessage","description":null,"code":"function() {\n  var cd = {{customData}};\n\tvar np = cd.alertMessage;\n    return np;\n}","approval":"DONE","logs":[{"time":1711586269248,"userId":"admin","action":"CONFIRM","comment":"alert"}]},{"type":"STRING","id":"VAR-98323","name":"STR_alert","description":null,"value":"alert"},{"type":"SCRIPT","id":"VAR-98324","name":"E_사용자행동정보_클릭섹션명","description":null,"code":"function () {\n\nvar el = {{clickElement}};\n  var txt;\n  var cls = el && el.closest(\"section\");\n  var qs = cls && cls.querySelector(\"div.tit-section > em\");\n  txt = qs && qs.innerText;\n  \n    if(flag == 2 || flag ==3){\n      console.log(\"NTH >> E_사용자행동정보_클릭섹션명 : \" + txt);\n    }\n    return txt;\n  }","approval":"INITIAL","logs":[]}],"variableGroups":[{"id":"VRG-10001","name":"클릭조사","desc":"","values":{"clickClass":"VAR-00010","clickId":"VAR-00009","clickTag":"VAR-00012","clickLabel":"VAR-84899"}}],"lastModified":"2024-03-28 10:57:12","plugins":[{"type":"PLUGIN","id":"VAR-00014","name":"nlogger","description":"넷스루 로깅 모듈"}]};

Ntm.Console = function() {
    var _this = {};

    _this.log = function() {
        if(!Ntm.Preview.isPreviewMode()) return;
        console.log.apply(this, arguments);
    };

    return {
        log: _this.log
    }
}();

Ntm.Cookie = function() {
    var _this = {};

    _this.get = function(key, decode) {
        var map = _this.map(decode);
        var value = map[key];

        return value ? value : "";
    };

    _this.set = function(key, value, options) {
        if(!options) options = {};

        document.cookie = key + '=' + encodeURIComponent(value) + ';' +
            (options.expires ? 'expires=' + options.expires + ';' : '') +
            (options.path ? 'path=' + options.path + ';' : '') +
            (options.domain ? 'domain=' + options.domain : '');
    };

    _this.remove = function(key, options) {
        _this.set(key, "", Ntm.Helper.extend({
            expires: "Thu, 01-Jan-1970 00:00:01 GMT",
            path: "/"
        }, options));
    };

    _this.map = function(decode) {
        var cookies = document.cookie.split(';');
        var cookieMap = {};

        for (var index = 0; index < cookies.length; index++) {
            var cookie = cookies[index].trim();
            if(cookie.length === 0) continue;

            var token = cookie.split('=');
            var key = token.shift();
            var value = token.join("=");

            if(decode) value = decodeURIComponent(value);

            cookieMap[key] = value;
        }

        return cookieMap;
    };

    return {
        get: _this.get,
        set: _this.set,
        remove: _this.remove
    }
}();

Ntm.Variable = function() {
    var _this = {};

    _this.activeTag = null;
    _this.clickEvent = {};
    _this.customData = {};
    _this.addOnData = {
        param: {},
        cookie: {}
    };

    _this.setActiveTag = function(tag) {
        _this.activeTag = tag;
    };

    _this.getActiveTriggers = function() {
        if(!_this.activeTag) return [];

        return _this.activeTag.triggers.map(function(id) {
                return Ntm.Trigger.getById(id);
            }).filter(function(trigger) {
                return trigger.fired;
            });
    };

    _this.setClickEvent = function(event, target, noOverride) {
        if(noOverride && _this.clickEvent.target) return;

        _this.clickEvent = Ntm.Helper.extend(event, {
            target: target
        });
    };

    _this.setClickTarget = function(target) {
        _this.clickEvent = Ntm.Helper.extend(_this.clickEvent, {
            target: target
        });
    };

    _this.setCustomData = function(customData) {
        _this.customData = customData;
    };

    _this.clearClickEvent = function() {
        _this.clickEvent = {};
    };

    _this.clearCustomData = function() {
        _this.customData = {};
    };

    _this.getBuiltinVariable = function(name) {
        switch(name) {
            case "url":
                return window.location.href;

            case "host":
                return window.location.origin;

            case "path":
                return window.location.pathname;

            case "referrer":
                return _this.getReferer();

            case "params":
                return _this.getUrlParams();

            case "paramDict":
                return _this.getUrlParamsAsDict();

            case "title":
                return document.title;

            case "clickElement":
                return _this.getClickElement();

            case "clickId":
                return _this.getClickId();

            case "clickClass":
                return _this.getClickClass();

            case "clickText":
                return _this.getClickText();

            case "clickTag":
                return _this.getClickTag();

            case "hash":
                return window.location.hash;

            case "activeTag":
                return _this.activeTag;

            case "activeTriggers":
                return _this.getActiveTriggers();

            case "customData":
                return _this.customData;
        }

        return null;
    };

    _this.getReferer = function() {
        var ref = self.document.referrer;
        var parentHref = "";
        var parentRef = "";

        try {
            parentHref = top.document.location.href;
            parentRef = top.document.referrer;
        } catch (e) {
            return ref;
        }

        if(ref === parentHref) return parentRef;

        return ref;
    };

    _this.getPlugin = function(name) {
        return "Ntm.Plugin." + name;
    };

    _this.getUrlParams = function() {
        return decodeURI(window.location.search.substr(1));
    };

    _this.getUrlParamsAsDict = function() {
        var urlParams = _this.getUrlParams();
        return urlParams ? JSON.parse('{"' + decodeURI(urlParams).replace(/&/g, '","').replace(/=/g, '":"') + '"}') : ''
    };

    _this.getCookie = function(key, decode) {
        return Ntm.Cookie.get(key, decode);
    };

    _this.getClickElement = function() {
        return _this.clickEvent.target;
    };

    _this.getClickId = function() {
        if(_this.clickEvent.target) return _this.clickEvent.target.id || "";
        return "";
    };

    _this.getClickClass = function() {
        if(_this.clickEvent.target) return _this.clickEvent.target.className || "";
        return "";
    };

    _this.getClickText = function() {
        if(_this.clickEvent.target) return _this.clickEvent.target.innerText || "";
        return "";
    };

    _this.getClickTag = function() {
        if(_this.clickEvent.target) return _this.clickEvent.target.tagName || "";
        return "";
    };

    _this.getElementValue = function(variable) {
        var element;
        var clickTarget = _this.clickEvent.target;

        switch (variable.selector) {
            case "CLICK":
                element = clickTarget;
                break;

            case "ENTIRE":
                element = document.querySelector(variable.value);
                break;

            case "DESCENDANT":
                if(clickTarget) element = clickTarget.querySelector(variable.value);
                break;

            case "ASCENDANT":
                if(clickTarget) {
                    var tagName = variable.value.toUpperCase();
                    var target = clickTarget.parentElement;
                    var order = 0;

                    while(target) {
                        if(target.tagName.toUpperCase() === tagName) {
                            order++;

                            if(order == variable.order) {
                                element = target;
                                break;
                            }
                        }

                        target = target.parentElement;
                    }
                }
                break;
        }

        return element ? (variable.attribute ? element.getAttribute(variable.attribute) : element.innerText) : undefined;
    };

    _this.addOnParam = function(data) {
        _this.addOnData.param = Ntm.Helper.extend(_this.addOnData.param, data);
    };

    _this.addOnCookie = function(data) {
        _this.addOnData.cookie = Ntm.Helper.extend(_this.addOnData.cookie, data);
    };

    _this.getAddOnData = function() {
        return _this.addOnData;
    };

    _this.clearAddOnData = function() {
        _this.addOnData = {
            param: {},
            cookie: {}
        };
    };

    return {
        get: _this.getBuiltinVariable,
        getPlugin: _this.getPlugin,
        getCookie: _this.getCookie,
        getElementValue: _this.getElementValue,
        setActiveTag: _this.setActiveTag,
        setClickEvent: _this.setClickEvent,
        setClickTarget: _this.setClickTarget,
        setCustomData: _this.setCustomData,
        clearClickEvent: _this.clearClickEvent,
        clearCustomData: _this.clearCustomData,
        addOnParam: _this.addOnParam,
        addOnCookie: _this.addOnCookie,
        getAddOnData: _this.getAddOnData,
        clearAddOnData: _this.clearAddOnData
    }
}();

Ntm.Helper = function() {
    var _this = {};

    _this.stringify = function(obj) {
        return obj.toJSON ? obj.toJSON() : JSON.stringify(obj);
    };

    _this.find = function (values, key, match) {
        for (var index = 0; index < values.length; index++) {
            var value = values[index];
            if (value[key] === match) {
                return value;
            }
        }

        return undefined;
    };

    _this.getVariableById = function (id) {
        return _this.find(Ntm.Settings.variables, "id", id);
    };

    _this.getVariableByName = function(name) {
        return _this.find(Ntm.Settings.variables, "name", name);
    };

    _this.copy = function(obj) {
        if(obj === null || typeof obj !== 'object') return obj;

        const cloned = Array.isArray(obj) ? [] : {};

        for(var key in obj) {
            if(Object.prototype.hasOwnProperty.call(obj, key)) {
                cloned[key] = _this.copy(obj[key]);
            }
        }

        return cloned;
    };

    _this.extend = function() {
        var extended = {};

        for(var index = 0; index < arguments.length; index++) {
            var source = arguments[index];

            for(var prop in source) {
                if(Object.prototype.hasOwnProperty.call(source, prop))
                    extended[prop] = source[prop];
            }
        }

        return extended;
    };

    _this.length = function(obj) {
        var count = 0;

        for(key in obj) {
            count++;
        }

        return count;
    };

    _this.replaceAll = function(text, find, replace) {
        return text ? text.split(find).join(replace) : text;
    };

    _this.isValidSettings = function() {
        return Ntm.Settings.hasOwnProperty("tags") &&
            Ntm.Settings.hasOwnProperty("triggers") &&
            Ntm.Settings.hasOwnProperty("variables");
    };

    return {
        stringify: _this.stringify,
        extend: _this.extend,
        copy: _this.copy,
        length: _this.length,
        find: _this.find,
        replaceAll: _this.replaceAll,
        getVariableById: _this.getVariableById,
        getVariableByName: _this.getVariableByName,
        isValidSettings: _this.isValidSettings
    }
}();

Ntm.Evaluator = function() {
    var _this = {};

    _this.forbiddenChars = "";

    _this.evaluate = function(variable) {
        switch(variable.type) {
            case "BUILTIN":
                return Ntm.Variable.get(variable.name);

            case "PLUGIN":
                return Ntm.Variable.getPlugin(variable.name);

            case "STRING":
            case "NUMBER":
                return variable.value;

            case "COOKIE":
                return Ntm.Variable.getCookie(variable.key);

            case "ELEMENT":
                return Ntm.Variable.getElementValue(variable);

            case "SCRIPT": {
                var result = _this.runScript(_this.evaluateNested(variable.code));
                if(variable.approval && _this.forbiddenChars) {
                    result = result.replace(new RegExp(_this.forbiddenChars, "g"), "");
                }
                return result;
            }

            case "VARIABLE":
                return _this.runScript('function(){return ' + variable.value + '}');
        }

        return null;
    };

    _this.evaluateNested = function(script) {
        var variables = _this.gatherAllVariables(script);

        if(Ntm.Helper.length(variables) > 0) {
            script = _this.replaceVariables(script, variables);
        }

        return script;
    };

    _this.gatherAllVariables = function(script) {
        var regex = /{{([^{}]+)}}/g;
        var variables = {};

        while(true) {
            var match = regex.exec(script);
            if(!match) break;

            var expression = match[0];
            if(variables[expression]) continue;
            var name = match[1];

            variables[expression] = Ntm.Helper.getVariableByName(name) ? name : "";
        }

        return variables;
    };

    _this.replaceVariables = function(script, variables) {
        for(var key in variables) {
            var name = variables[key];
            var expression = name ? ("Ntm.Evaluator.evaluate(Ntm.Helper.getVariableByName('" + name + "'))") : "undefined";
            var variable = Ntm.Helper.getVariableByName(name);

            if(variable && variable.type == "PLUGIN") expression = Ntm.Evaluator.evaluate(variable);
            script = Ntm.Helper.replaceAll(script, key, expression);
        }

        return script;
    };

    _this.runScript = function(script) {
        try {
            return eval("(" + script + ")()");
        }
        catch(e) {
            Ntm.Console.log(e, script);
        }
    };

    return {
        evaluate: _this.evaluate,
        parse: _this.gatherAllVariables
    }
}();

Ntm.Matcher = function() {
    var _this = {};

    _this.matchAll = function(conditions) {
        return !conditions.some(function(condition) {
            var variable = Ntm.Helper.getVariableById(condition.variable);
            var operand1 = Ntm.Evaluator.evaluate(variable);
            var operand2 = condition.value;

            return !_this.match(condition.operator, operand1, operand2);
        });
    };

    _this.match = function(operator, operand1, operand2) {
        switch (operator) {
            case "EQUALS":
                return equals(operand1, operand2);

            case "NOTEQUALS":
                return !equals(operand1, operand2);

            case "CONTAINS":
                return contains(operand1, operand2);

            case "NOTCONTAINS":
                return !contains(operand1, operand2);

            case "STARTSWITH":
                return startsWith(operand1, operand2);

            case "NOTSTARTSWITH":
                return !startsWith(operand1, operand2);

            case "ENDSWITH":
                return endsWith(operand1, operand2);

            case "NOTENDSWITH":
                return !endsWith(operand1, operand2);

            case "MATCHES":
                return match(operand1, operand2);

            case "NOTMATCHES":
                return !match(operand1, operand2);

            case "LESSTHAN":
                return lessThan(operand1, operand2);

            case "LESSTHANOREQUALS":
                return lessThan(operand1, operand2) || equals(operand1, operand2);

            case "GREATERTHAN":
                return greaterThan(operand1, operand2);

            case "GREATERTHANOREQUALS":
                return greaterThan(operand1, operand2) || equals(operand1, operand2);

            case "VALID":
                return !isInvalid(operand1);

            case "INVALID":
                return isInvalid(operand1);

            default:
                return false;
        }

        function equals(operand1, operand2) {
            switch(typeof operand1) {
                case "number":
                    return isNumber(operand2) && operand1 === Number(operand2);

                case "string":
                    return isString(operand2) && operand1.toUpperCase() === operand2.toUpperCase();

                case "boolean":
                    return isBoolean(operand2) && operand1 === toBoolean(operand2);
            }

            return false;
        }

        function contains(operand1, operand2) {
            return isString(operand1) && isString(operand2) &&
                operand1.toUpperCase().indexOf(operand2.toUpperCase()) >= 0;
        }

        function startsWith(operand1, operand2) {
            return isString(operand1) && isString(operand2) &&
                operand1.toUpperCase().indexOf(operand2.toUpperCase()) == 0;
        }

        function endsWith(operand1, operand2) {
            return isString(operand1) && isString(operand2) &&
                operand1.toUpperCase().lastIndexOf(operand2.toUpperCase()) == operand1.length - operand2.length;
        }

        function match(operand1, operand2) {
            if(isNumber(operand1)) operand1 = operand1 + "";
            return isString(operand1) && isString(operand2) && operand1.match(operand2);
        }

        function lessThan(operand1, operand2) {
            return isNumber(operand1) && isNumber(operand2) && Number(operand1) < Number(operand2);
        }

        function greaterThan(operand1, operand2) {
            return isNumber(operand1) && isNumber(operand2) && Number(operand1) > Number(operand2);
        }

        function isNumber(operand) {
            return !isNaN(Number(operand));
        }

        function isString(operand) {
            return typeof operand === "string";
        }

        function isBoolean(operand) {
            return operand === "true" || operand === "false";
        }

        function toBoolean(operand) {
            return operand === "true";
        }

        function isInvalid(operand) {
            return operand === undefined || operand === null || operand.trim() === "";
        }
    };

    return {
        matchAll: _this.matchAll
    }
}();

Ntm.Tag = function() {
    var _this = {};

    _this.isExecutable = function(tag) {
        var triggersFired;

        if (tag.operator === "OR") {
            triggersFired = tag.triggers.some(function (id) {
                return Ntm.Trigger.getById(id).fired;
            });
        } else {
            triggersFired = tag.triggers.every(function (id) {
                return Ntm.Trigger.getById(id).fired;
            });
        }

        var allExceptionsNotFired = tag.exceptions.every(function(id) {
            return !Ntm.Trigger.getById(id).fired;
        });

        return triggersFired && allExceptionsNotFired;
    };

    _this.run = function(tag) {
        if(!tag.enabled || !_this.isExecutable(tag)) return;

        switch(tag.type) {
            case "PLUGIN":
                _this.runPlugin(tag);
                break;

            case "SCRIPT":
                Ntm.Variable.setActiveTag(tag);
                Ntm.Evaluator.evaluate({
                    type: "SCRIPT",
                    code: tag.code
                });
                Ntm.Variable.clearAddOnData();
                break;
        }
    };

    _this.runPlugin = function(t) {
        var tag = Ntm.Helper.copy(t);
        var addOnData = Ntm.Variable.getAddOnData();
        var parameters = variable(Ntm.Helper.extend(tag.parameters, addOnData.param));
        var cookies = variable(Ntm.Helper.extend(tag.cookies, addOnData.cookie));

        tag.type = "SCRIPT";
        tag.code = "function() { {{" + tag.pluginType + "}}.";

        switch(tag.logType) {
            case "EVENT":
                tag.code += "event(" + parameters + "," + cookies + ");";
                break;

            case "USER":
                tag.code += "user(" + parameters + ");";
                break;

            case "ORDER":
                tag.code += "order(" + parameters + ");";
                break;

            case "CANCEL":
                tag.code += "cancel(" + parameters + ");";
                break;

            case "CANCELALL":
                tag.code += "cancelAll(" + parameters + ");";
                break;

            case "CUSTOM":
                tag.code += "log('" + evaluate(tag.path) + "'," + parameters + "," + cookies + ");";
                break;
        }

        tag.code += "}";

        _this.run(tag);

        function variable(obj) {
            var result = '{';

            for(key in obj) {
                var v = Ntm.Helper.getVariableById(obj[key]);
                result += result.length > 1 ? ',' : '';
                result += '"' + key + '":';
                result += v ? ('{{' + v.name + '}}') : Ntm.Helper.stringify(obj[key]);
            }

            result += '}';

            return result;
        }

        function evaluate(script) {
            var variables = Ntm.Evaluator.parse(script);

            for(var key in variables) {
                var variable = Ntm.Helper.getVariableByName(variables[key]);

                if(variable) {
                    var expression = Ntm.Evaluator.evaluate(variable);
                    script = Ntm.Helper.replaceAll(script, key, expression);
                }
            }

            return script;
        }
    };

    _this.runAll = function() {
        Ntm.Settings.tags.forEach(function(tag) {
            _this.run(tag);
        });
    };

    _this.hasTriggerByType = function(tag, event) {
        return tag.triggers.some(function(id) {
            return Ntm.Trigger.getById(id).event === event;
        });
    };

    _this.hasTriggerByField = function(tag, key, value) {
        return tag.triggers.some(function(id) {
            var trigger = Ntm.Trigger.getById(id);
            return trigger[key] == value;
        });
    };

    _this.hasTriggerById = function(tag, id) {
        return tag.triggers.includes(id);
    };

    _this.getAllTriggerIds = function(tag) {
        var result = tag.exceptions ? tag.exceptions : [];
        return result.concat(tag.triggers);
    };

    return {
        run: _this.run,
        runAll: _this.runAll,
        hasTriggerByType: _this.hasTriggerByType,
        hasTriggerByField: _this.hasTriggerByField,
        hasTriggerById: _this.hasTriggerById,
        getAllTriggerIds: _this.getAllTriggerIds
    }
}();

Ntm.Trigger = function() {
    var _this = {};

    _this.settings = Ntm.Settings;

    _this.init = function(event) {
        _this.settings.triggers.forEach(function(trigger) {
            if(event && event !== trigger.event) return;
            trigger.fired = false;
        });
    };

    _this.getById = function(id) {
        return Ntm.Helper.find(_this.settings.triggers, "id", id);
    };

    _this.listByEvent = function(event) {
        var result = [];

        _this.settings.triggers.forEach(function(trigger) {
            if(trigger.event === event) result.push(trigger);
        });

        return result;
    };

    _this.listByReferedEvent = function(event) {
        var triggers = _this.listByEvent(event);

        return triggers.filter(function(trigger) {
            return _this.settings.tags
                .filter(function(tag) {
                    return tag.enabled;
                })
                .some(function(tag) {
                    return Ntm.Tag.hasTriggerById(tag, trigger.id);
                });
        });
    };

    return {
        init: _this.init,
        getById: _this.getById,
        listByEvent: _this.listByEvent,
        listByReferedEvent: _this.listByReferedEvent
    }
}();

Ntm.Event = function() {
    var _this = {};

    _this.NTM_READY = "NTMREADY";
    _this.PAGE_LOADED = "PAGELOADED";
    _this.WINDOW_LOADED = "WINDOWLOADED";
    _this.DOM_READY = "DOMREADY";
    _this.ELEMENT_CLICKED = "ELEMENTCLICKED";
    _this.CLICKED = "CLICKED";
    _this.URL_CHANGED = "URLCHANGED";
    _this.HASH_CHANGED = "HASHCHANGED";
    _this.CUSTOM = "CUSTOM";

    _this.CUSTOM_HANDLING_DELAY = 100;
    _this.clickHandlingDelay = 0;

    _this.eventBindings = [];
    _this.rebindTimer = null;
    _this.timoutId = null;

    _this.init = function() {
        _this.register();

        if(document.readyState === 'interactive' || document.readyState === 'complete') _this.onDomReady();
        else {
            document.addEventListener("DOMContentLoaded", function() {
                _this.onDomReady();
            });
        }

        window.addEventListener("load", function() {
            _this.onWindowLoaded();
        });

        window.addEventListener("unload", function() {
            _this.onWindowUnloaded();
        });

        window.addEventListener("hashchange", function(event) {
            _this.onHashChanged(event);
        });

        window.addEventListener("pushstate", function(event) {
            _this.onUrlChanged(event);
        });

        window.addEventListener("popstate", function(event) {
            _this.onUrlChanged(event);
        });
    };

    _this.register = function() {
        window.history.pushState = overrideHistoryState(window.history.pushState);
        window.history.replaceState = overrideHistoryState(window.history.replaceState);

        function overrideHistoryState(func) {
            var _func = func;

            return function(state, title, url) {
                var result = _func.apply(history, arguments);
                var event = new CustomEvent("pushstate", {
                    detail: {
                        state: state,
                        title: title,
                        url: url
                    }
                });

                window.dispatchEvent(event);
                return result;
            };
        }
    };

    _this.registerObserver = function() {
        var interval = 0;
        
        if(interval <= 0 && window.MutationObserver) {
            var observer = new MutationObserver(function(mutations) {
                clearTimeout(_this.rebindTimer);
                _this.rebindTimer = setTimeout(_this.rebind, 100);
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        else setInterval(_this.rebind, interval > 0 ? interval : 1000);
    };

    _this.bind = function() {
        document.addEventListener("click", function(event) {
            _this.handleForClick(event, event.target);
        });
    };

    _this.rebind = function() {
        _this.eventBindings.forEach(function(binding) {
            binding.handler(null, binding.target);
        });

        _this.eventBindings = [];

        var triggers = Ntm.Trigger.listByReferedEvent(_this.ELEMENT_CLICKED);

        triggers.forEach(function(trigger) {
            var elements = _this.querySelectorAll(trigger.selector);

            for (var i = 0; i < elements.length; i++) {
                var handler = function(event, target) {
                    if(target) target.removeEventListener("click", arguments.callee);
                    else _this.handleForElementClick(event, event.currentTarget, trigger);
                };

                elements[i].addEventListener("click", handler);

                _this.eventBindings.push({
                    "target": elements[i],
                    "handler": handler
                });
            }
        });

        //Ntm.Console.log("rebinded: " + _this.eventBindings.length);
    };

    _this.querySelectorAll = function(selector) {
        var elements = [];


        _this.querySelectorAllAsArray(document, selector).forEach(function(element) {
            elements.push(element);
        });

        _this.querySelectorAllAsArray(document, "iframe").forEach(function(iframe) {
            try {
                _this.querySelectorAllAsArray(iframe.contentWindow.document, selector).forEach(function (element) {
                    elements.push(element);
                });
            }
            catch(e) {
                Ntm.Console.log("cannot bind events because of CORS problems");
            }
        });

        return elements;
    };

    _this.querySelectorAllAsArray = function(documentBase, selector) {
        var elements = documentBase.querySelectorAll(selector);
        if(elements.forEach === undefined) elements = Array.prototype.slice.call(elements);
        return elements ? elements : [];
    };

    _this.onNtmReady = function() {
        Ntm.Console.log('%c EVENT >> NTMREADY ', 'background:#2196F3;color:white');
        window.dispatchEvent(new Event(_this.NTM_READY));
    };

    _this.onPageLoaded = function() {
        Ntm.Console.log('%c EVENT >> PAGELOADED ', 'background:#2196F3;color:white');
        _this.handle(_this.PAGE_LOADED);
    };

    _this.onDomReady = function() {
        Ntm.Console.log('%c EVENT >> DOMREADY ', 'background:#2196F3;color:white');
        _this.registerObserver();
        _this.bind();
        _this.rebind();
        _this.handle(_this.DOM_READY);
    };

    _this.onWindowLoaded = function() {
        Ntm.Console.log('%c EVENT >> WINDOWLOADED ', 'background:#2196F3;color:white');
        _this.handle(_this.WINDOW_LOADED);
    };

    _this.onWindowUnloaded = function() {
        Ntm.Console.log('%c EVENT >> WINDOWUNLOADED ', 'background:#2196F3;color:white');
        Ntm.Event.windowUnloaded = true;
    };

    _this.onUrlChanged = function() {
        Ntm.Console.log('%c EVENT >> URLCHANGED ', 'background:#2196F3;color:white');
        _this.handle(_this.URL_CHANGED);
    };

    _this.onHashChanged = function() {
        Ntm.Console.log('%c EVENT >> HASHCHANGED ', 'background:#2196F3;color:white');
        _this.handle(_this.HASH_CHANGED);
    };

    _this.handle = function(eventType, trigger) {
        var triggers = trigger ? [trigger] : Ntm.Trigger.listByEvent(eventType);

        triggers.forEach(function(trigger) {
            if(Ntm.Matcher.matchAll(trigger.conditions)) trigger.fired = true;
        });

        if(!trigger) {
            Ntm.Settings.tags.forEach(function(tag) {
                if(!Ntm.Tag.hasTriggerByType(tag, eventType)) return;
                Ntm.Tag.run(tag);
            });
        }
    };

    _this.handleForElementClick = function(event, target, trigger) {
        Ntm.Console.log('%c EVENT >> %s ', 'background:#2196F3;color:white', _this.ELEMENT_CLICKED, event.clientX, event.clientY, target);

        Ntm.Variable.setClickEvent(event, target);
        _this.handle(_this.ELEMENT_CLICKED, trigger);

        if(_this.clickHandlingDelay > 0) _this.timoutId = setTimeout(_this.runForClick, _this.clickHandlingDelay);
        else _this.runForClick();
    };

    _this.handleForClick = function(event, target) {
        Ntm.Console.log('%c EVENT >> %s ', 'background:#2196F3;color:white', _this.CLICKED, event.clientX, event.clientY, target);

        Ntm.Variable.setClickEvent(event, target, true);

        Ntm.Settings.tags.forEach(function(tag) {
            Ntm.Tag.getAllTriggerIds(tag).forEach(function(triggerId) {
                var trigger = Ntm.Trigger.getById(triggerId);

                if(!trigger.event || trigger.event !== _this.CLICKED) return;
                if(_this.match(trigger.target) && Ntm.Matcher.matchAll(trigger.conditions)) trigger.fired = true;
            });
        });

        _this.runForClick();
    };

    _this.runForClick = function() {
        if(_this.timoutId) {
            clearTimeout(_this.timoutId);
            _this.timoutId = null;
        }

        Ntm.Settings.tags.forEach(function(tag) {
            if(!Ntm.Tag.hasTriggerByType(tag, _this.CLICKED) && !Ntm.Tag.hasTriggerByType(tag, _this.ELEMENT_CLICKED)) return;
            Ntm.Tag.run(tag);
        });

        Ntm.Trigger.init(_this.CLICKED);
        Ntm.Trigger.init(_this.ELEMENT_CLICKED);
        Ntm.Variable.clearClickEvent();
    };

    _this.handleForUserDefined = function(name, data) {
        Ntm.Console.log('%c EVENT >> CUSTOM : ', 'background:#2196F3;color:white', name, data);

        Ntm.Trigger.init(_this.CUSTOM);
        Ntm.Variable.setCustomData(data);

        Ntm.Trigger.listByEvent(_this.CUSTOM).forEach(function(trigger) {
            if(trigger.eventName === name && Ntm.Matcher.matchAll(trigger.conditions)) trigger.fired = true;
        });

        Ntm.Settings.tags.forEach(function(tag) {
            if(!Ntm.Tag.hasTriggerByField(tag, "eventName", name)) return;
            Ntm.Tag.run(tag);
        });

        Ntm.Variable.clearCustomData();
    };

    _this.match = function(tagName) {
        if(tagName) {
            var target = Ntm.Variable.get("clickElement");

            while(target) {
                if(target.tagName.toUpperCase() === tagName.toUpperCase()) {
                    Ntm.Variable.setClickTarget(target);
                    return true;
                }

                target = target.parentElement;
            }

            return false;
        }

        return true;
    };

    return {
        init: _this.init,
        fireNtmReady: _this.onNtmReady,
        firePageLoaded: _this.onPageLoaded,
        fireClicked: function(event) {
            _this.handleForClick(event, event.target);
        },
        fireUserDefined: function(name, data) {
            setTimeout(function() {
                _this.handleForUserDefined(name, data);
            }, _this.CUSTOM_HANDLING_DELAY);
        }
    }
}();

Ntm.Preview = function() {
    var _this = {
        previewMode: false,
        containerId: ""
    };

    _this.init = function(preview, id) {
        if(!preview) Ntm.Cookie.remove(id);

        _this.previewMode = preview;
        _this.containerId = id;

        if(!preview) return;

        _this.showPreviewBanner();
    };

    _this.showPreviewBanner = function() {
        var frame = _this.makeFrame();

        var lastNode = document.body && document.body.lastChild || document.body || document.head;
        lastNode.parentNode.insertBefore(frame, lastNode);

        var frameDocument = frame.document;
        if (frame.contentDocument) frameDocument = frame.contentDocument;
        else if (frame.contentWindow) frameDocument = frame.contentWindow.document;

        if(frameDocument) {
            var html =
                '<p style="float:left; padding-left:20px; font-size:15px; font-weight: bold; margin-top:12px">미리보기 모드</p>' +
                '<p style="float:right; padding-right:20px; font-size:12px; margin-top:15px">최근 수정: ' + Ntm.Settings.lastModified + '</p>';

            frameDocument.open();
            frameDocument.writeln(html);
            frameDocument.close();
        }

        Ntm.Console.log('%c PREVIEW MODE ', 'background:#F44336;color:white');
    };

    _this.isPreviewMode = function() {
        return _this.previewMode;
    };

    _this.getContainerId = function() {
        return _this.containerId;
    };

    _this.makeFrame = function() {
        var iframe = document.createElement('iframe');
        iframe.src = 'about:blank';
        iframe.style.position = 'fixed';
        iframe.style.width = '100%';
        iframe.style.height = '60px';
        iframe.style.bottom = '0';
        iframe.style.borderTop = '1px solid #eee';
        iframe.style.borderRight = '0';
        iframe.style.borderLeft = '0';
        iframe.style.borderBottom = '0';
        iframe.style.margin = '0';
        iframe.style.padding = '0';
        iframe.style.visibility = 'visible';
        iframe.style.backgroundColor = '#fffacc';
        iframe.style.visible = '1';
        iframe.style.zIndex = '2147483647';
        return iframe;
    };

    return {
        init: _this.init,
        isPreviewMode: _this.isPreviewMode,
        getContainerId: _this.getContainerId
    }
}();

Ntm.Plugin = {};

Ntm.Plugin.nlogger = (function() {
    var _this = {};

    _this.serviceId = location.hostname;
    _this.baseUrlHttp = "https://tag.work.go.kr/nlog";
    _this.baseUrlHttps = "https://tag.work.go.kr/nlog";
    _this.previewServiceId = "wcpreview";
    _this.previewCotainerKey = "nth_cid";
    _this.previewTimeKey = "nth_time";
    _this.cookieKeys = [ {
  "cookie" : "PCID",
  "logging" : "nth_pcid",
  "removable" : false,
  "required" : true,
  "always" : false,
  "builtin" : false
}, {
  "cookie" : "UID",
  "logging" : "nth_uid",
  "removable" : false,
  "required" : false,
  "always" : false,
  "builtin" : false
}, {
  "cookie" : null,
  "logging" : "nth_sdk",
  "removable" : false,
  "required" : true,
  "always" : false,
  "builtin" : true
}, {
  "cookie" : null,
  "logging" : "nth_locale_lang",
  "removable" : false,
  "required" : true,
  "always" : false,
  "builtin" : true
}, {
  "cookie" : null,
  "logging" : "nth_locale_country",
  "removable" : false,
  "required" : true,
  "always" : false,
  "builtin" : true
}, {
  "cookie" : null,
  "logging" : "nth_resolution",
  "removable" : false,
  "required" : true,
  "always" : false,
  "builtin" : true
}, {
  "cookie" : null,
  "logging" : "nth_screen_id",
  "removable" : false,
  "required" : true,
  "always" : false,
  "builtin" : true
}, {
  "cookie" : null,
  "logging" : "nth_screen_title",
  "removable" : false,
  "required" : true,
  "always" : false,
  "builtin" : true
} ];
    _this.cookieDomain = location.hostname;

    _this.loggingByXhr = true;
    _this.withCredentials = false;
    _this.requestMethod = "get";
    _this.requestTimeout = 1000;
    _this.requestDelay = 20;
    _this.requestQueueSize = 10;
    _this.requestRetry = true;
    _this.sessionStorageKey = "__nlogger__";

    _this.log = function(path, params, cookies, options, serviceId) {
        _this.send(_this.makeUrl("/log/event", path, params, cookies, serviceId), options);
    };

    _this.event = function(params, cookies, serviceId) {
        _this.send(_this.makeUrl("/log/event", null, params, cookies, serviceId));
    };

    _this.user = function(params) {
        _this.send(_this.makeUrl("/user", null, params));
    };

    _this.order = function(params) {
        _this.send(_this.makeUrl("/order/request", null, params));
    };

    _this.cancel = function(params) {
        _this.send(_this.makeUrl("/order/cancel", null, params));
    };

    _this.cancelAll = function(params) {
        _this.send(_this.makeUrl("/order/cancel-all", null, params));
    };

    _this.send = function(url, options) {
        
        if(_this.loggingByXhr) _this.sendByXhr(url);
        else {
            options = _this.extend({
                async: true,
                onSuccess: null,
                onError: null,
                callBackTimeOutAsMillis: 400
            }, options);

            _this.sendByTag(url, options);
        }
    };

    _this.makeUrl = function(action, path, params, cookies, serviceId) {
        var preview = Ntm.Preview.isPreviewMode();
        var baseUrl = window.location.protocol === "https:" ? _this.baseUrlHttps : _this.baseUrlHttp;
        var query = _this.toQueryString(params, true);
        var url = window.location.protocol + "//" + _this.getDomainWithPort();
        var hash;

        if(path) url += "/" + path;
        else {
            url += window.location.pathname + window.location.search;

            if(window.location.hash) {
                if(!window.location.search || window.location.hash.indexOf("?") >=0) url = window.location.href;
                else hash = window.location.hash;
            }
        }

        if(query) {
            url += url.indexOf("?") < 0 ? "?" : "&";
            url += query;
        }

        if(hash) url += hash;

        cookies = _this.extend(cookies, _this.getCookies());

        addCookie('nth_sdk', 'WEB');
        addCookie('nth_locale_lang', _this.getLocaleLanguage());
        addCookie('nth_locale_country', _this.getLocaleCountry());
        addCookie('nth_resolution', _this.getResolution());
        addCookie('nth_screen_id', document.location.pathname);
        addCookie('nth_screen_title', document.title);

        

        if(preview) {
            addCookie(_this.previewCotainerKey, Ntm.Preview.getContainerId());
            addCookie(_this.previewTimeKey, new Date().getTime());
        }

        params = {
            s: preview ? _this.previewServiceId : (serviceId ? serviceId : _this.serviceId),
            u: url,
            r: _this.getReferer(),
            a: navigator.userAgent.replace(/\"/gi, ""),
            c: _this.toCookieString(cookies, true),
            v: _this.cacheBuster()
        };

        return baseUrl + action + "?" + _this.toQueryString(params, true);

        function addCookie(key, value) {
            if(!isReserved(key) && !isRequired(key)) return;

            var cookie = {};
            cookie[key] = value;

            cookies = _this.extend(cookie, cookies);
        }

        function isReserved(loggingKey) {
            return loggingKey === _this.previewCotainerKey || loggingKey === _this.previewTimeKey;
        }

        function isRequired(loggingKey) {
            for (var index = 0; index < _this.cookieKeys.length; index++) {
                var cookieKey = _this.cookieKeys[index];
                if (cookieKey.logging === loggingKey) return cookieKey.required;
            }

            return false;
        }
    };

    _this.getReferer = function() {
        var ref = self.document.referrer;
        var parentHref = "";
        var parentRef = "";

        try {
            parentHref = top.document.location.href;
            parentRef = top.document.referrer;
        } catch (e) {
            return ref;
        }

        if(ref === parentHref) return parentRef;

        return ref;
    };

    _this.getDomainWithPort = function() {
        var port = location.port;
        if (port === undefined || port === "" || port === "0" || port === 0) return document.domain;
        return document.domain + ":" + port;
    };

    _this.getDomain = function() {
        var domain = document.domain;
        if(_this.isIpType(domain)) return domain;

        var tokens = domain.split('.');
        var length = tokens.length;
        if(length !== 4 && length !== 3) return domain;

        var dm = tokens[length - 2] + '.' + tokens[length - 1];
        return tokens[length - 1].length === 2 ? tokens[length - 3] + '.' + dm : dm;
    };

    _this.isIpType = function(domain) {
        var ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(domain);
    };

    _this.getResolution = function() {
        var screenSize = "";
        var screen = window.screen;

        if(screen != null && typeof screen === "object") {
            screenSize = screen.width + "x" + screen.height;
        }

        return screenSize;
    };

    _this.getLocaleLanguage = function() {
        var tokens = _this.getLanguage().split("-");
        return tokens.length > 0 ? tokens[0] : "";
    };

    _this.getLocaleCountry = function() {
        var tokens = _this.getLanguage().split("-");
        return tokens.length > 1 ? tokens[1] : "";
    };

    _this.getLanguage = function() {
        var language = "-";
        var navigator = window.navigator;

        if(navigator.language) language = navigator.language.toLowerCase();
        else if(navigator.userLanguage) language = navigator.userLanguage.toLowerCase();

        return language;
    };

    _this.getCookies = function() {
        var result = {};

        for(var index = 0; index < _this.cookieKeys.length; index++) {
            var keyPair = _this.cookieKeys[index];

            if(keyPair.builtin) continue;

            var value = _this.getCookie(keyPair.cookie);

            if(!value) {
                if(!keyPair.required) continue;
                value = _this.generateUuid();
                setUuid(keyPair.cookie, value);
                if(!keyPair.always) continue;
            }

            if(keyPair.required) setUuid(keyPair.cookie, value);

            result[keyPair.logging] = value;
        }

        return result;

        function setUuid(key, value) {
            var date = new Date();
            var options = {
                path: "/",
                expires: date
            };

            if(!_this.cookieDomain) options.domain = _this.getDomain();
            else if(_this.cookieDomain !== "default") options.domain = _this.cookieDomain;

            date.setFullYear(date.getFullYear() + 10);
            _this.setCookie(key, value, options);
        }
    };

    _this.getCookie = function(key) {
        var result = new RegExp('(?:^|; )' + key + '=([^;]*)').exec(document.cookie);
        return (result != null) ? decodeURIComponent(result[1]) : null;
    };

    _this.setCookie = function(key, value, options) {
        if(!options) options = {};

        var expires = options.expires;
        var path = options.path;
        var domain = options.domain;

        document.cookie = key + '=' + encodeURIComponent(value) + ';' +
            (expires ? 'expires=' + expires.toUTCString() + ';' : '') +
            (path ? 'path=' + path + ';' : '') +
            (domain ? 'domain=' + domain : '');
    };

    _this.deleteCookie = function(key) {
        document.cookie = key + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
    };

    _this.generateUuid = function() {
        var result = "";

        if(typeof window.crypto != 'undefined' && typeof window.crypto.getRandomValues != 'undefined') {
            var buf = new Uint16Array(8);
            window.crypto.getRandomValues(buf);
            var S4 = function (num) {
                var ret = num.toString(16);
                while (ret.length < 4) {
                    ret = "0" + ret;
                }
                return ret;
            };

            result = (S4(buf[0]) + S4(buf[1]) + "-" + S4(buf[2]) + "-"
            + S4(buf[3]) + "-" + S4(buf[4]) + "-" + S4(buf[5])
            + S4(buf[6]) + S4(buf[7]));
        }
        else {
            result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r
                        : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
        }

        return result + '-' + new Date().getTime();
    };

    _this.sendByTag = function(url, options) {
        var element = _this.createScriptElement(url, options);
        _this.appendElement(element);
        _this.removeElement(element);
    };

    _this.sendByXhr = function(url) {
        try {
            _this.addRequest(url);
            _this.sendAllRequests();
        } catch(e) {
            console.log("send error", e);
        }
    };

    _this.createScriptElement = function(src, options) {
        var element = document.createElement('script');
        element.type = 'text/javascript';
        element.src = src;
        element.async = options.async;
        element.charset = 'UTF-8';

        if(options.onSuccess) {
            if(typeof element.onreadystatechange !== 'undefined') {
                element.onreadystatechange = function() {
                    if(this.readyState === 'complete' || this.readyState === 'loaded')
                        setTimeout(options.onSuccess, options.callBackTimeOutAsMillis);
                };
            }
            else {
                element.onload = function() {
                    setTimeout(options.onSuccess, options.callBackTimeOutAsMillis);
                };
            }
        }

        if(options.onError) {
            element.onerror = function() {
                setTimeout(options.onError, options.callBackTimeOutAsMillis);
            };
        }

        return element;
    };

    _this.appendElement = function(element) {
        var ssc = document.getElementsByTagName('script')[0];
        ssc.parentNode.insertBefore(element, ssc);
    };

    _this.removeElement = function(element) {
        if(typeof element.remove === 'function') element.remove();
        else element.parentNode.removeChild(element);   // For IE
    };

    _this.sendAllRequests = function() {
        setTimeout(function() {
            if(Ntm.Event.windowUnloaded) return;

            while(true) {
                var request = _this.takeRequest();
                if(!request) break;
                _this.sendRequest(request);
            }
        }, _this.requestDelay);
    };

    _this.sendRequest = function(url) {
        var xhr = _this.createXmlHttpRequest();
        if (!xhr) return false;

        xhr.withCredentials = _this.withCredentials;

        var timer = setTimeout(function() {
            xhr.abort();
        }, _this.requestTimeout);

        if(_this.requestMethod.trim().toLowerCase() === "post") {
            var parts = url.split("?");
            xhr.open("POST", parts[0], true);
            if(xhr.setRequestHeader) xhr.setRequestHeader("Content-type", "text/plain");
            xhr.send(parts[1]);
        }
        else {
            xhr.open("GET", url, true);
            xhr.send(null);
        }

        xhr.onload = function () {
            clearTimeout(timer);
        };

        xhr.onerror = xhr.onabort = function () {
            clearTimeout(timer);
            if(_this.requestRetry) _this.addRequest(url);
        };
    };

    _this.createXmlHttpRequest = function() {
        var xhr;
        var xhrs = [
            function() {return new XDomainRequest()},
            function() {return new XMLHttpRequest()},
            function() {return new ActiveXObject("Msxml2.XMLHTTP")},
            function() {return new ActiveXObject("Msxml3.XMLHTTP")},
            function() {return new ActiveXObject("Microsoft.XMLHTTP")}
        ];

        for (var i = 0; i < xhrs.length; i++) {
            try {
                xhr = xhrs[i]();
            }
            catch (e) {
                continue;
            }
            break;
        }

        return xhr;
    };

    _this.addRequest = function(url) {
        var requests = _this.getRequests();
        if(requests instanceof Array === false || requests.length >= _this.requestQueueSize) return;
        requests.push(url);
        _this.setRequests(requests);
    };

    _this.takeRequest = function() {
        var requests = _this.getRequests();
        var request = (requests instanceof Array && requests.length > 0) ? requests.shift() : undefined;
        _this.setRequests(requests);
        return request;
    }

    _this.clearRequests = function() {
        _this.setRequests([]);
    };

    _this.getRequests = function() {
        var data = sessionStorage.getItem(_this.sessionStorageKey);
        return JSON.parse(data ? data : "[]");
    };

    _this.setRequests = function(requests) {
        sessionStorage.setItem(_this.sessionStorageKey, Ntm.Helper.stringify(requests));
    };

    _this.cacheBuster = function() {
        return Math.round(Math.random() * 1999083012);
    };

    _this.extend = function() {
        var extended = {};

        for(var index = 0; index < arguments.length; index++) {
            var source = arguments[index];

            for(var prop in source) {
                if(Object.prototype.hasOwnProperty.call(source, prop))
                    extended[prop] = source[prop];
            }
        }

        return extended;
    };

    _this.toQueryString = function(obj, skipNull) {
        return _this.objectToString(obj, "&", skipNull);
    };

    _this.toCookieString = function(obj, skipNull) {
        return _this.objectToString(obj, "; ", skipNull);
    };

    _this.objectToString = function(obj, delimeter, skipNull) {
        var result = "";

        for(var prop in obj) {
            if(Object.prototype.hasOwnProperty.call(obj, prop)) {
                if(skipNull && !obj[prop]) continue;

                if(result.length > 0) result += delimeter;
                result += prop + "=" + encodeURIComponent(obj[prop]);
            }
        }

        return result;
    };

    return {
        
        log: _this.log,
        event: _this.event,
        user: _this.user,
        order: _this.order,
        cancel: _this.cancel,
        cancelAll: _this.cancelAll,
        generateUuid: _this.generateUuid
    };
})();



Ntm.Main = function() {
    var disabled = false;
    var preview = false;
    var id = 00002;

    if(disabled) return;
    if(!Ntm.Helper.isValidSettings()) return;

    Ntm.Preview.init(preview, id);
    Ntm.Event.fireNtmReady();
    Ntm.Event.firePageLoaded();
    Ntm.Event.init();
}();