/*
함수목록
====================================================================================================
    함수명                  / 설명
====================================================================================================
ComLib.submit             / submit 함수
ComLib.submit             / ajax 요청 (url, 보낼obj데이터, isAsync)
JsonLib.parse             / JSON Object로 변환해서 반환한다.
JsonLib.stringify         / JSON Object를 문자열로 변환해서 반환한다.
ComLib.commify            / 콤마 찍기 - 3자리마다
DateLib.setDatePicker     / 달력 설정
DateLib.setHpDatePicker   / 달력 설정 form 전송시 - 제거
DateLib.setRstrRangeCal   / 달력 범위 valdation 설정
DateLib.getToday          / 오늘 날짜 처리
DateLib.getDay            / 날짜 패턴 적용
DateLib.getDay            / 날짜 더하기
DateLib.addDay            / 일 더하기
DateLib.addMonth          / 월 더하기
DateLib.addYear           / 년 더하기
DateLib.addDay            / 일 차이
DateLib.diffMonth         / 월 차이
DateLib.diffYear          / 년 차이
DateLib.compareDate       / 시작일, 종료일 비교
ValidLib.setValidate      / 폼에 대한 유효성 검사를 수행
ValidLib.fn_addRules      / 유효성 규칙 추가 함수
ValidLib.fn_removeRules   / 유효성 규칙 제거 함수
PopLib.openPup            / 윈도우 get 방식 팝업
PopLib.openPostPup        / 윈도우 post 방식 팝업
ComFnLib.retrieveAddres   / 우편번호 팝업창 열기 함수
ComFnLib.withMe           /    객체재활용
ComFnLib.recursive        / 객체재귀
gfn_pagination            / 번호 페이징
gfn_print                 / 프린트 함수 ex) gfn_print($("#addrpopup"));
gfn_downloadAttFile       / 다운로드 함수
gfn_shortUrl              / 단축URL 호출 ex) gfn_shortUrl('twiter','cm','프로그램아이디','타이틀명')
TelLib.setHpTelViewer     / 전화번호 tel2 tel3 분리 8자리 숫자만 입력 By SJR
PwdLib.validationPwdChk	  / 비밀번호 검증 로직
ComfnLib.writeWebEditCont / 웹에디터에서 받아오는 내용 표시
StrLib.trimSpecialChar    / 특수문자를 제외시킴
StrLib.isNull			  / 해당 변수가 null인지 체크해줌(String전용)
*/


//document.oncontextmenu=function(){if(location.origin.indexOf("work24.go.kr") > 0){return false;}}

var spin =  new Spinner();
$(document).ready(function(){

	spin.spin($("#spin")[0]);

    $(document).ajaxStart(function(){
		spin.spin($("#spin")[0]);
        ComLib.blockUI();
    });
    $(document).ajaxStop(function(){
		spin.stop();
        ComLib.unblockUI();
    });

    $(document).bind('keydown',function(e){
        if(e.keyCode == 123){ //F12방지
	        if(location.origin.indexOf("https://www.work24.go.kr") > 0 || location.origin.indexOf("https://work24.go.kr") > 0){
				e.preventDefault();
	            e.returnValue = false;
			}
        }
    });

    $.ajaxSetup({
		"timeout": 100000
        , "beforeSend": function(request){
            var token = $("meta[name='_csrf']").attr("content");
            var header = $("meta[name='_csrf_header']").attr("content");
            if(token != null && header != null){
                request.setRequestHeader(header, token);
            }
        }
    });

    $("button[type='reset']").on("click", function(e) {
        e.preventDefault();
        var ret = $(this).prev("input[type='text']").val("");
        $(this).prev("input[type='text']").focus();
    });

    setLimit30minute();   // 대기시간 30분 초과 시 로그아웃

    //화면 확대 축소 반영
    var data = localStorage.getItem("nowZoom");
    if(data != null && data != "" && data != "100"){
        nowZoom = Number(data);
        zoomControl.zooms(false);
    }else{
        nowZoom = 100;
    }

    //클립보드 자동복사
    $(".btn_copy").on("click", function(e) {
        e.preventDefault();
        var ret = $(this).prev("span").text();
        gfn_copyToClipboard(ret);
        alert("복사되었습니다.");
    });

    //TOP
    $(".btn_quick_top").on("click", function() {
        $('html, body').animate({ scrollTop : 0},400);
        return false;
    });

    spin.stop();
});

input_limit_string = function(ta,limit,point){

    var fn = function(){
        var t = ta.value.limit_string(limit,point);
        if(t != ta.value){
            ta.value=t;
        }
    };

    ta.onclick = fn;
    ta.onblur = fn;
    ta.onkeydown = fn;
    ta.onkeyup = fn;
    ta.onchange = fn;
    ta.onmouseover = fn;
    ta.onmousemove = fn;
    ta.onfocus = null;
    ta.onfocus = fn;

};

var ComLib = {};

ComLib.env = "";
if (window && window.ReactNativeWebView) {//모바일app 환경
	ComLib.env = "app";
	window.ReactNativeWebView.postMessage(JSON.stringify({ "type": "GET_DEVICE_ID", "data": {} }));
	window.ReactNativeWebView.postMessage(JSON.stringify({"type":"GET_FCM_TOKEN"}));

} else {//web 환경
	ComLib.env = "web";
}

ComLib.deviceInfo = {};
function DeviceInfoFromNative(dInfo) {
    ComLib.deviceInfo = {
        "version" : dInfo.version,
        "DeviceId" : dInfo.DeviceId,
        "UniqueId" : dInfo.UniqueId,
        "width"  : dInfo.width,
        "height" : dInfo.height,
	};
};

ComLib.fcmToken = "";
function FcmTokenFromNative(fcm) {
 ComLib.fcmToken = fcm.token;
}

ComLib.blockUI = function() {
    $.blockUI({message:  ' '});
    $(".blockMsg").css("border", "0");
};

ComLib.unblockUI = function() {
    $.unblockUI({message:  ''});
};

ComLib.submit = function(formName, option){
	spin.spin($("#spin")[0]);
    if(option){
        if(option.isNetfunnel){ //넷퍼넬 적용여부
            try{
                NetFunnel_Action({"action_id":option.actionId},function(ev,ret){
                    ComLib._submit(formName);
                });
            }catch(e){
                console.dir(e);
                ComLib._submit(formName);
            }
        }
    }else{
        ComLib._submit(formName);
    }
    spin.stop();
}
ComLib._submit = function(formName){
    ComLib.blockUI();
    if ($("#"+formName).prop("enctype") == "multipart/form-data") {
        $("#"+formName).prop("action", $("#"+formName).prop("action") + "?_csrf="+$("meta[name=_csrf]").prop("content"));
    }
    //프로그램아이디넣어준다
    if(typeof _menuId != 'undefined'){
        if(_menuId != null && _menuId != ""){
            var form = new FormLib.Form();
            form.setForm("#"+formName);
            form.setHidden("programMenuIdentification", _menuId);
        }
    }
    $("#"+formName).submit();
    ComLib.unblockUI();
}

/*
 * ajax 요청 (url, 보낼obj데이터, isAsync)
 * */
ComLib.ajaxReqObj = function(url, objData, isAsync){
    //프로그램아이디넣어준다
    if(typeof objData == "object"){
        if(typeof _menuId != 'undefined'){
            if(_menuId != null && _menuId != ""){
                objData["programIdentification"] = _menuId;
            }
        }
    }else if(typeof objData == "string"){
        if(typeof _menuId != 'undefined'){
            if(_menuId != null && _menuId != ""){
                var form = new FormLib.Form();
                form.setForm("#" + objData);
                form.setHidden("programIdentification", _menuId);
            }
        }
    }
    var sendData;
    if(typeof objData == "object"){
        sendData = objData;
    }else if(typeof objData == "string"){
        sendData = $("#" + objData).serializeArray();
    }

	setLimit30minute();

	var request = ComLib.ajaxReq(url, sendData, isAsync);
    request.fail(function (xhr, statusText, errorThrown) {//실패는 공통으로 처리
        spin.stop();
        try {
            if(xhr.responseJSON["redirectUrl"] != null && xhr.responseJSON["redirectUrl"] != ""){//redirectUrl이 있을경우
                location.href = xhr.responseJSON.redirectUrl;
            }
        } catch(e) {
            console.log(xhr.responseText);
            alert("고용24는 현재 시범 운영 중으로, 일부 오류나 이용에 불안정한 부분이 있을 수 있습니다.\n고용24 이용에 불편이 있으신 경우, 기존에 사용하시던 홈페이지를 방문하시기 바랍니다.");
        }
    });
    return request;
};

/*
 * 실제  ajax 요청 처리 내부 함수
 * */
ComLib.ajaxReq = function(url, reqData, isAsync){
    var request = $.ajax({
        url : url,
        type : "post",
        contentType : "application/x-www-form-urlencoded",
        data : reqData,
        //contentType : "application/json",
        //data : JsonLib.stringify(reqData),
        async : isAsync,
        success : function(a,b,c){
            //console.log(a);
            //console.log(b);
            //console.log(c);
        },
        error: function(data, status, error){
            spin.stop();
            //console.log(data);
            //console.log(status);
            //console.log(error);
            if ("timeout" == status) {
                alert("서버 응답이 느립니다.");
                return;
            }
            if ("error" == status) {
                if (data.responseJSON) {
                    if (data.responseJSON.errorMsg) {
                        alert(data.responseJSON.errorMsg);
                        if(!typeof data.responseJSON.redirectUrl === 'undefined'){
							if("" != data.responseJSON.redirectUrl){
                                location.href=data.responseJSON.redirectUrl;
                            }
						}
                        return;
                    }
                    if(!typeof data.responseJSON.userMsg === 'undefined'){
                        alert(data.responseJSON.userMsg);
                        if (data.responseJSON.redirectUrl) {
                            if("" != data.responseJSON.redirectUrl){
                                location.href=data.responseJSON.redirectUrl;
                            }
                        }
                        return;
                    }
                    if(!typeof data.responseJSON.redirectUrl === 'undefined'){
                        if("" != data.responseJSON.redirectUrl){
                            location.href=data.responseJSON.redirectUrl;
                        }
                    }
                }
            }
        }
    });
    return request;
};

ComLib.getFormToObj = function(formId) {
    var searchParam = $("#" + formId).serializeArray();
    var ret = {};// 리턴
    $.each(searchParam, function(i, field) {
        if(ret[field.name] == null){
            ret[field.name] = field.value;
        }else{
            var tmp = ret[field.name];
            if(typeof tmp  == "string"){
                var tmpAry = new Array();
                tmpAry.push(tmp);
                tmpAry.push(field.value);
                ret[field.name] = tmpAry;
            }else if(tmp instanceof Array){
                tmp.push(field.value);
            }else{
                console.dir(tmp);
            }
        }

    });
    return ret;
};

/**
 * 화면 필수값 유효성 체크
 * 사용방법 : if(fn_checkValidation("entrSecd", "radio", "기업구분을 선택하시기 바랍니다.") === false) return false;
 * id 파라미터에 id,name 값 가능
 */
ComLib.checkValidation = function(id, type, msg) {

    var obj = "";

    /** INPUT */
    if(type == "input") {
        obj = $("#"+id);
        if($.trim(obj.val()) == "") {
            alert(msg);
            obj.val("");
            obj.focus();
            return false;
        }
    }
    /** 복수 INPUT */
    if(type == "multiInput") {
        var isEmpty = false;
        $("input[name='" + id + "']").each(function(idx) {
            if($.trim($(this).val()) == "") {
                isEmpty = true;
                if(obj == "") obj = $(this);
            }
        });

        if(isEmpty === true) {
            alert(msg);
            obj.val("");
            obj.focus();
            return false;
        }
    }

    /** SELECT */
    if(type == "select") {
        obj = $("#"+id);
        if(obj.val() == "") {
            alert(msg);
            obj.focus();
            return false;
        }
    }
    /** 복수 SELECT */
    if(type == "multiSelect") {
        var isEmpty = false;
        $("select[name='" + id + "']").each(function(idx) {
            if($(this).val() == "") {
                isEmpty = true;
                if(obj == "") obj = $(this);
            }
        });

        if(isEmpty === true) {
            alert(msg);
            obj.focus();
            return false;
        }
    }

    /** TEXTAREA */
    if(type == "textarea") {
        obj = $("#"+id);
        if($.trim(obj.val()) == "") {
            alert(msg);
            obj.val("");
            obj.focus();
            return false;
        }
    }
    /** 복수 TEXTAREA */
    if(type == "multiTextarea") {
        var isEmpty = false;
        $("textarea[name='" + id + "']").each(function(idx) {
            if($.trim($(this).val()) == "") {
                isEmpty = true;
                if(obj == "") obj = $(this);
            }
        });

        if(isEmpty === true) {
            alert(msg);
            obj.val("");
            obj.focus();
            return false;
        }
    }

    /** CHECKBOX */
    if(type == "checkbox") {
        obj = $("input:checkbox[name='" + id + "']:checked");
        if(obj.length < 1){
            alert(msg);
            $("input:checkbox[name='" + id + "']").eq(0).focus();
            return false;
        }
    }

    /** RADIO */
    if(type == "radio") {
        obj = $("input:radio[name='" + id + "']:checked");
        if(obj.length < 1){
            alert(msg);
            $("input:radio[name='" + id + "']").eq(0).focus();
            return false;
        }
    }

    return true;
};

//멀티val체크
ComLib.checkMultiValidation = function(id, idx, msg) {
    var obj = $("[name='" + id + "']").eq(idx);
    var chk = true;
    var objTyp = obj.attr("type");

    if(obj.is("select")) {
        /** SELECTBOX */
        if(obj.val() == "") chk = false;
    }
    else if(obj.is("input") && (objTyp == "text" || objTyp == "hidden")) {
        /** INPUT */
        if(obj.val() == "")  chk = false;
    }
    else if(obj.is("input") && objTyp == "radio") {
        /** RADIO */
        if(obj.is(":checked") === false) chk = false;
    }
    else if(obj.is("input") && objTyp == "checkbox") {
        /** CHECKBOX */
        if(obj.is(":checked") === false)  chk = false;
    }
    else if(obj.is("textarea")) {
        /** TEXTAREA */
        if(obj.val() == "")  chk = false;
    }

    if(chk === false) {
        alert(msg);
        obj.focus();
    }

    return chk;
};

/**
 * F: 입력항목의 값이 비어있는지 여부를 확인한다.
 * @param {Object, String} obj 검사할객체
 * @return {Boolean} <b>null, undefined, ""</b> 인 경우 true를 반환
 */
ComLib.isEmpty = function( obj ) {
    return ( obj == null || obj == "" || obj == undefined || obj === 'undefined' || obj === 'null' ) ? true : false;
}

ComLib.appendComma = function(NumV) {
      Num = NumV.toString();

      var count = 0;
      var temp = "";
      var resultWon = "";
      var oneChar = "";

      for(var ch=Num.length-1; ch>=0; ch--) {
        oneChar = Num.charAt(ch);
        if(count==3){
            temp+=",";
            temp += oneChar;
            count = 1;

            continue;
        }else{
            temp+=oneChar;
            count++;
        }
      }

      for (var ch=temp.length-1; ch>=0; ch--){
        oneChar = temp.charAt(ch);
        resultWon += oneChar;
       }

     return resultWon;
}
ComLib.removeChar = function(s1, s2)
{
    if ( s1 == null || s2 == null ) return s1;

    var temp = "";
    for (var i=0; i<s1.length; i++)
    {
        var remFlag = true;
        for (var k=0; k<s2.length; k++)
        {
            if ( s1.charAt(i) == s2.charAt(k) )
            {
                remFlag = false;
                break;
            }
        }
        if (remFlag)
            temp += s1.charAt(i);
    }

    return temp;
}
/**
* O: komafUi 공통상수
* @author jungHwasu, 2011.03.09
*/
ComLib.c = {

  /** 도메인 */
  ROOT_PATH : "www.work24.go.kr",

  /** 프레임워크 버전 */
  VERSION : "0.5",

  /** CONTEXT ROOT */
  ROOT_PATH : "",

  /** 화면명 */
  JSP_NAME : "",

  /** 세션만료체크 (종료시 몇 초 전) */
  SESSION_CHK : 5 * 60,

  /** 에러페이지 URL 경로 (세션중단) */
  PATH_ERR_NOSESSION : "",

  /** 토큰값 */
  TOKEN  : "",

  /** 웹페이지 기본 인코딩셋 */
  CHAR_SET : "UTF-8"     // 웹페이지 기본 인코딩셋

};

// 정규식처리 관련 공통상수 (번역 대상에 포함되지 않음)
ComLib.c.REG_PTN = {

  TRIM : /(^ *)|( *$)/g,
  LTRIM : /(^ *)/g,
  RTRIM : /( *$)/g,
  INNER_TRIM : / +/g,
  INNER_SPACE : / /g,
  NUM : /[0-9]/g,
  NOT_NUM : /[^0-9]/g,
  NOT_NUM_PARSE : /[^0-9\.-]/g,
  ENG : /[a-zA-Z]/g,
  NOT_ENG : /[^a-zA-Z]/g,
  KOR : /[ㄱ-ㅎㅏ-ㅣ가-힣]/g,
  NOT_KOR : /[^ㄱ-ㅎㅏ-ㅣ가-힣]/g,
  NOT_NUM_OR_ENG : /[^0-9a-zA-Z]/g,
  MONEY : /(\d)(?=(?:\d{3})+(?!\d))/g,

  HAS_HTML : /<\/?[a-zA-Z][a-zA-Z0-9]*[^<>]*>/,
  IS_NUM : /^[0-9]+$/,
  IS_NOT_NUM : /^[^0-9]+$/,
  IS_ENG : /^[a-zA-Z]+$/,
  IS_NUM_ENG : /^[0-9a-zA-Z]+$/,
  IS_KOR : /^[ㄱ-ㅎㅏ-ㅣ가-힣]+$/,
  IS_NUM_KOR : /^[0-9ㄱ-ㅎㅏ-ㅣ가-힣]+$/,
  IS_RRN : /^(\d{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])(|\D)[1-4](\d{6})$/,
  IS_FGN : /^(\d{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])(|\D)[5-8](\d{6})$/,
  IS_EMAIL : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  IS_HOME_PHONE : /^(0[2-8][0-5]?)(|\D)([1-9]{1}[0-9]{2,3})(|\D)([0-9]{4})$/,
  IS_CELL_PHONE1 : /^(01[1346-9])(|\D)([1-9]{1}[0-9]{2,3})(|\D)([0-9]{4})$/,
  IS_CELL_PHONE2 : /^(010)(|\D)([2-9]{1}[0-9]{3})(|\D)([0-9]{4})$/,
  IS_JUMIN : /^[0-9]{13}$/,
  IS_UPPERCASE : /^[A-Z]+$/,
  IS_LOWERCASE : /^[a-z]+$/,

  UNMASK : [ "X", "9", "*" ],

  MASK_CHR : /[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]/,
  MASK_NUM : /[0-9]/,
  MASK_ALL : /./,

  HAN_1ST : ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ' ],
  HAN_2ND : ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'],
  HAN_3RD : ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],

  HAN_JOSA : ['은','는','이','가','을','를'],

  HAN_JOSA_MERGE_1 : /(은\W는\W|는\W은\W)/,
  HAN_JOSA_MERGE_2 : /(이\W가\W|가\W이\W)/,
  HAN_JOSA_MERGE_3 : /(을\W를\W|를\W을\W)/

}
/**
 * F: 정규식을 테스트한다.
 * <pre>
 * alert( ComLib.isReg( "aaaab a", /.*b/ ) );
 * </pre>
 * @param {String} string   패턴검사를 수행할 문자열
 * @param {Object} pattern  정규식패턴 (또는 문자열)
 * @return {Boolean} 테스트 성공여부
 */
ComLib.isReg = function( string, pattern ) {
    if( ComLib.isEmpty(string) ) return false;

    var regExp = pattern;
    return regExp.test( ComLib.str(string).val() );
}

/**
* F: 문자열 처리함수<br>
* <pre>
* alert( ComLib.str("M123erong").getNum().val() ); -> "123"  출력
* </pre>
* @classDescription 문자열 관련 유틸리티
* @return {ComLib.str}
* @author 통합1팀 응용아키텍트 2011.07.14
*/
ComLib.str = function( string ) {

  var z_self = arguments.callee;

  if(!(this instanceof z_self)) return new z_self(string);

  this.val( string );

}

ComLib.str.prototype = {

  /**
  * F: 처리된 문자열을 가져온다.<br>
  * 처리에 필요한 문자열을 세팅할 수도 있다.
  * <pre>
  * alert( ComLib.str("Merong").val() ); -> "Merong"  출력
  * alert( ComLib.str("Merong).val(A).val() ); -> "A" 출력
  * </pre>
  * @param {Object|String} value 세팅할 문자열 (또는 오브젝트)
  * @return {String,ComLib.str}
  */
  val : function( value ) {

        if( arguments.length == 0 ) return this.z_val;

        if( ComLib.isEmpty(value) ) {
          this.z_val = "";
        } else if( ComLib.isTypStr(value) ) {
          this.z_val = value;
        } else if( value instanceof ComLib.str ) {
          this.z_val = value.val();
        } else if( ComLib.isTypObj(value) ) {
          this.z_val = "" + $(value).val();
        } else {
          this.z_val = "" + value;
        }

        return this;
    }
}

/**
 * F: String 타입 여부를 확인한다.
 * @param {Object} string 검사할 개체
 * @return {Boolean} 타입이 문자일 경우 true 반환
 */
ComLib.isTypStr = function( string ) {
    return typeof string == "string";
}

/**
 * F: Object 타입 여부를 확인한다.
 * @param {Object} obj 검사할 개체
 * @return {Boolean}
 */
ComLib.isTypObj = function( obj ) {
    return typeof obj == "object";
}

/**
 * F: string1이 null 이면 string2를 반환한다.
 * @param {Object} string1 검사할 개체
 * @param {Object} string2 null 시 대체할 개체
 * @return {Object} 반환 개체
 */
ComLib.nvl = function( string1 ,string2) {
    if( ComLib.isEmpty(string1) ) return string2;
    return string1;
}

/**
 * F: 핸드폰 전화번호 형식 여부를 확인한다.
 * @param {String} string 검사할 개체
 * @return {Boolean} 검사결과
 */
ComLib.isCellPhone = function( val ) {

    var p = val.substr(0,3);

    return ComLib.isReg( val, ( p == "010" ) ? ComLib.c.REG_PTN.IS_CELL_PHONE2 : ComLib.c.REG_PTN.IS_CELL_PHONE1 );
}

/**
 * F: 이메일 여부를 확인한다.
 * @param {Object|String} obj 검사할 개체
 * @return {Boolean} 검사결과
 */
ComLib.isEmail = function( obj ) {
    return ComLib.isReg( obj, ComLib.c.REG_PTN.IS_EMAIL );
}

ComLib.validationPwdChk2 = function (targetId) {
    var value = $("#"+targetId).val();
    var msg = '';
    var noneAsciiChar;

    if (!/[a-z]+/i.test(value)) msg = '영문이 포함되지 않았습니다';
    else if (!/[0-9]+/.test(value)) msg = '숫자가 포함되지 않았습니다';
    else if (!/[^a-z0-9]+/i.test(value)) msg = '특수문자가 포함되지 않았습니다';
    else if (noneAsciiChar = ComLib.getNoneAsciiChar(value)) msg = noneAsciiChar + '은(는) 사용할 수 없습니다.';
    else if (/(\^|_|\\|`|\[|\]|'|-|<|>)/.test(value)) msg = '사용할 수 없는 특수문자가 포함되었습니다';
    else if ((matchLst = value.match(/(script|eval|%2e%2f)/i))) msg = '"'+matchLst[0]+'"은(는) 사용할 수 없는 문자열 입니다';
    else if (!/^[^\n]{8,16}$/.test(value)) msg = '현재 '+value.length+'자 입력되었습니다. (비밀번호는 8~24자로만 입력 가능)';

    // msg == '' 이면 통과
    return msg;
}

    //비밀번호체크
ComLib.validationPwdChk = function (targetId,chkCnt) {
    var flag = true;
    var cnt = 0 ;
    var targetValue = $("#"+targetId).val();

    var regExp1 = /[a-zA-Z]/;
    var regExp2 = /[0-9]/;
    //var regExp3 = /[`~!@#$%\^&*\(\)\-\_\+\=\|\\{\}\[\]\;\:\'\",\<\.\>\/\?]/;
    var regExp3 = /[~!@#$%&*\(\)\+\=\|{\}\;\:\",\<\.\>\/\?]/;

    if(regExp1.test(targetValue))cnt++;
    if(regExp2.test(targetValue))cnt++;
    if(regExp3.test(targetValue))cnt++;

    if(cnt < chkCnt)
    {
        flag = false;
    }
    return flag;
}

//특수문자 참조 function
ComLib.getNoneAsciiChar = function (s,i,c) {
    for (i=0;c=s.charCodeAt(i);i++) {
            if(c>>11||c>>7) {
            return s.charAt(i);
        }
    }

    return false;
}

//textarea 글자 제한 이벤트(Byte 표시 객체를 받지 않고 textarea 기준으로 next em 엘리먼트에 표시, 청년디지털일자리 사업에서 사용)
ComLib.checkLimitChar = function(text_name, limitByte, displayByte) {

    var text_spans = $("."+displayByte);

    var textValue = $(text_name).val();
    var length = ComLib.calCharLen(textValue);

    $("."+displayByte).html(length);

    if (length > limitByte) {
        $(text_name).val(ComLib.assertMsglen(textValue, text_spans, limitByte));
        $(text_name).focus();
    }
}

// textarea 글자 바이트 계산
ComLib.calCharLen = function (message) {
   var nbytes = 0;

   for (i=0; i<message.length; i++) {

       var ch = message.charAt(i);

       if (ch == '\n') {
           nbytes += 2;
       } else if (ch == '<' || ch == '>' || ch == '≠' || ch == '≤' || ch == '≥' || ch == 'μ') {
           nbytes += 4;
       } else if (ch == '®') {
           nbytes += 5;
       } else if (ch == '\'' || ch == '"' || ch == '•' || ch == '⇒' || ch == '⇔' || ch == '§' || ch == '→' || ch == '←' || ch == '↑' || ch == '↓' || ch == '↔' || ch == '¶') {
           nbytes += 6;
       } else if (ch == '×' || ch == '√' || ch == '´' || ch == '♣' || ch == '‘' || ch == '’'  || ch == '“' || ch == '”'  || ch == '′'  || ch == '″') {
           nbytes += 7;
       } else if (ch == '·' || ch == '±' || ch == '÷' || ch == '…' || ch == '♠'  || ch == '♥' || ch == '†'  || ch == '†') {
           nbytes += 8;
       } else if(escape(ch).length > 4) {
           nbytes += 3;
       } else {
           nbytes += 1;
       }
   }
   return nbytes;
}
//textarea 문자 바이트 계산 후 초과 시 메시지 표시(Byte 표시 객체를 받지 않고 textarea 기준으로 next em 엘리먼트에 표시, 청년디지털일자리 사업에서 사용)
ComLib.assertMsglen = function (message, text_spans, maximum)
{
   var nbytes = 0;
   var nChBytes = 0;
   var msg = "";
   var msglen = message.length;

   for (i=0; i<msglen; i++) {

       var ch = message.charAt(i);

       if (ch == '\n') {
           nChBytes = 2;
       } else if (ch == '<' || ch == '>' || ch == '≠' || ch == '≤' || ch == '≥' || ch == 'μ') {
           nChBytes = 4;
       } else if (ch == '®') {
           nChBytes = 5;
       } else if (ch == '\'' || ch == '"' || ch == '•' || ch == '⇒' || ch == '⇔' || ch == '§' || ch == '→' || ch == '←' || ch == '↑' || ch == '↓' || ch == '↔' || ch == '¶') {
           nChBytes = 6;
       } else if (ch == '×' || ch == '√' || ch == '´' || ch == '♣' || ch == '‘' || ch == '’'  || ch == '“' || ch == '”'  || ch == '′'  || ch == '″') {
           nChBytes = 7;
       } else if (ch == '·' || ch == '±' || ch == '÷' || ch == '…' || ch == '♠'  || ch == '♥' || ch == '†'  || ch == '†') {
           nChBytes = 8;
       } else if(escape(ch).length > 4) {
           nChBytes = 3;
       } else {
           nChBytes = 1;
       }

       if (nbytes + nChBytes > maximum) {
           //최대 입력가능 ' + maximum + ' Byte를 초과하여 이후 글자수는 자동 삭제됩니다.uap.i.b.0012
           alert("최대 입력가능 " + maximum + " Byte를 초과하여 이후 글자수는 자동 삭제됩니다.");
           break;
       }

       nbytes += nChBytes;
       msg += ch;
   }

   $(text_spans).html(nbytes);

   return msg;
}

ComLib.commify = function (n) {
    var reg = /(^[+-]?\d+)(\d{3})/;
    n += '';
    while (reg.test(n)) {
        n = n.replace(reg, '$1' + ',' + '$2');
    }
    return n;
}

/**
 * 엔터키 이벤트 부여
 * @param {Array} arrObjId 부여 할 오브젝트 배열
 * @return {Array} func 오브젝트 배열에 이벤트 부여 할 함수 명
 *  ex : ComLib.setEnterKeyEvent(["searchKeyword"], "fn_Search(1)");
 */
ComLib.setEnterKeyEvent = function (arrObjId,func) {
    for (var i = 0; i < arrObjId.length; i ++){
        $("#" + arrObjId[i]).on("keypress", function(e){
            if (e.which == 13) eval(func);
        });
    }
};

/**
 * @class mobile 여부 반환
 * @param null
 * @return boolean
 */
ComLib.mobileDeviceYn = function(){
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};


/**
 * @class 외부(AS-IS) 링크이동시 토큰적용하여 다시 return한다.
 * @param siteSe		 :  대상 시스템
 *							HRD : 직업능력
 *							WK : 워크넷
 *							UA : 국민취업지원
 *						    EPS : 외국인고용
 *						    WKT : 장애인고용
 * @param redirectUr : 링크 이동 경로
 * @return boolean
 */
ComLib.getSsoLink = function (siteSe, redirectUrl){
	if(siteSe == null || siteSe == ""){
		alert("인자가 올바르지 않습니다.");
		return false;
	}
	if(siteSe == null || siteSe == ""){
		alert("인자가 올바르지 않습니다.");
		return false;
	}

	var request = ComLib.ajaxReqObj("/cm/common/getSsoLink.do", {"siteSe" : siteSe ,"redirectUrl" : redirectUrl } ,false);
	var rtnLink="";
	request.done(function (data) {
		//console.log("getSsoLink data",data);
		rtnLink= data.rtnSsoLink;
	});
	return rtnLink;
}


/**
 * @class 외부(AS-IS) 링크이동시 토큰적용하여 팝업 열어줌.
 * @param siteSe		 : 대상 시스템
 *							HRD : 직업능력
 *							WK : 워크넷
 *							UA : 국민취업지원
 *						    EPS : 외국인고용
 *						    WKT : 장애인고용
		, redirectUrl	 : 링크 이동 경로
 * @return boolean
 */
ComLib.goSsoLink = function (siteSe, redirectUrl){
	if(siteSe == null || siteSe == ""){
		alert("이동대상 시스템 정보가 없습니다.");
		return false;
	}
	if(redirectUrl == null || redirectUrl == ""){
		alert("이동대상 경로 정보가 없습니다.");
		return false;
	}
	var ssoLink = ComLib.getSsoLink(siteSe,redirectUrl);
	window.open(ssoLink,"_blank");
}

/**
 * @class 외부(AS-IS) 링크이동시 토큰적용하여 다시 return한다.
 * @param siteSe		 :  대상 시스템
 *							HRD : 직업능력
 *							WK : 워크넷
 *							UA : 국민취업지원
 *						    EPS : 외국인고용
 *						    WKT : 장애인고용
 * @param redirectUr : 링크 이동 경로
 * @return boolean
 */
ComLib.getSsoToken = function (siteSe, redirectUrl){
	if(siteSe == null || siteSe == ""){
		alert("인자가 올바르지 않습니다.");
		return false;
	}
	if(siteSe == null || siteSe == ""){
		alert("인자가 올바르지 않습니다.");
		return false;
	}

var request = ComLib.ajaxReqObj("/cm/common/getSsoLink.do", {"siteSe" : siteSe ,"redirectUrl" : null } ,false);
	var rtnLink="";
	request.done(function (data) {
		console.log("getSsoLink data",data);
		rtnLink= data.rtnSsoLink;
	});
	window.open(redirectUrl+""+rtnLink,"_blank");
}

/*======================================================
input_limit_string(ta,limit,poin);
지정된 input 객체에 입력값을 제한하도록 한다.
ta : 적용한 input(textarea 등) 대상
limit : 제한 정규식을 생성 인자
point : 구분자(기본값 : , )

추천 limit
'/kor,/symbol,/s':한글+특수기호+빈칸
'/eng,/d' : 영어+숫자 : 아이디용
'/number' : 숫자와 -,+,. 만
'/d' : 숫자만
ex>
<input type="text" name="textfield" onfocus="input_limit_string(this,'/eng,/n,/s');"/>
========================================================*/


String.prototype.limit_string = function(limit,point){
    if(point==null){point=',';}
    var inv = limit.split(point);
    var inc = inv.length;
    var regexp=null
    var reg_str = '';
    for(var i = 0;i<inc;i++){
        switch(inv[i]){
            case '':;
            case null:;
            case false:;
            case undefined:break;
            //----------- 알파벳처리
            case '/H':reg_str+='1-3';break;
            case '/e':reg_str+='a-z';break; //알파벳 소문자
            case '/E':reg_str+='A-Z';break; //알파벳 대문자
            case '/eE':reg_str+='a-zA-Z';break; //모든 알파벳
            //----------- 숫자처리
            case '/d':reg_str+='\\d';break; //숫자인것
            case '/!d':reg_str+='\\D';break; //숫자가 아닌 것
            //----------- 숫자형 처리(정확하게 구분하는 것이 아닌, 숫자와 -,+,. 만 구분함)
            case '/number':reg_str+='\\-\\+\\.\\d';break; //숫자가 아닌 것
            case '/time':reg_str+='\\:\\d';break; //숫자가 아닌 것
            case '/phone_num':reg_str+='-';break; //숫자가 아닌 것
            case '/float':reg_str+='\\.\\d';break; //소수점 숫자인 것
            //----------- 공백처리
            case '/s':reg_str+='\\s';break; //빈칸인것
            case '/!s':reg_str+='\\S';break;    //빈칸이 아닌것
            //----------- 아스키코드(특수문자 허용)
            case '/ascii':reg_str+='!-~';break;
            case '/ascii2':reg_str+='';break;
            //-----------기호만처리
            case '/symbol':reg_str+='~!@#$%&*()=+{}|;:",./?';break;
            case '/symbol2':reg_str+='&()\\-_';break;
            case '/symbol3':reg_str+='~';break;
            case '/symbol4':reg_str+=':';break;
            case '/symbol5':reg_str+='-';break;
            //----------- 영어글자처리
            case '/eng':reg_str+='a-zA-Z';break;
            //----------- 한글글자처리
            case '/kor':reg_str+=
            String.fromCharCode(0x1100)+'-'+String.fromCharCode(0x11FF)
            +String.fromCharCode(0x3130)+'-'+String.fromCharCode(0x318F)
            +String.fromCharCode(0xAC00)+'-'+String.fromCharCode(0xD7AF);break; //모든 한글(반각,전각 자모는 제외)
            case '/kor_jamo':reg_str+=String.fromCharCode(0x1100)+'-'+String.fromCharCode(0x11FF)
            default :
                    reg_str+=inv[i];
                break;
        }
    }
    regexp=new RegExp('[^'+reg_str+']','g');
    return this.toString().replace(regexp,'');
}



var JsonLib = {};
/**
 * JSON Object로 변환해서 반환한다.
 */
JsonLib.parse = function(str) {
    if (typeof str !== "string") {
        alert("jsonLib.parse : No json String");
        return null;
    }
    try {
        return JSON.parse(str);
    } catch(e) {
        alert("jsonLib.parse : " + e);
        return null;
    }
};

/**
 * JSON Object를 문자열로 변환해서 반환한다.
 */
JsonLib.stringify = function(jsonObj) {
    try {
        if (typeof jsonObj !== "object") {
            alert("jsonLib.stringify : No json Object");
            return null;
        }
        return JSON.stringify(jsonObj);
    } catch(e) {
        alert("jsonLib.stringify : " + e);
        return null;
    }
};

/****************************************************************************************************************/
/** inputmask 랑 DATEPICKER 유틸
/****************************************************************************************************************/
// 달력 위젯 옵션
var DATEPICKER_OPTIONS = {
    dateFormat: "yy-mm-dd",
    showOtherMonths: true,
    selectOtherMonths: true,
    showButtonPanel: true,
    changeMonth: true,
    changeYear: true,
    yearSuffix: "",
    showOn: "button",
    buttonImage: "",
    buttonImageOnly: false,
    buttonText: "날짜 선택",
    yearRange: "c-30:c+30", // Range of years to display in drop-down
    shortYearCutoff: "+30", // Short year values < this are in the current century,
    onClose: function() {
        $(this).focus();
    }

};

/*
 * jquery datepicker와 inputmask를 동시에 적용할 때 datepicker의 dateFormat과 inputmask의 masking 형식이 일치하지 않으면 datepicker가 원하는 동작을 수행하지 않는다.
 * 그러므로 datepicker의 dateFormat은 로케일을 고려하여 "yy-mm-dd"로 설정하였으며 inputmask의 masking 형식은 "yyyy-mm-dd"로 설정하여 사용해야 한다.
 * 그런데 위와 같이 설정을 하게 되면 서버로 폼 전송시 yyyy-mm-dd 형태의 문자열로 전송이 되므로 서버에서 처리시 yyyymmdd의 형태로 처리해야 한다면
 * 다음과 같은 hpdatepicker확장 플러그인을 사용한다.
 */
$.fn.extend({
    hpdatepicker: function (options, callback) {
        $(this).each(function(){
            var input = $(this);
            var hiddenInput = $("<input>");
            hiddenInput.attr("name", $(this).attr("name"));
            hiddenInput.attr("type", "hidden");
            hiddenInput.attr("data-type", "datepicker");
            if (input.val() && input.val().length > 0) {
                hiddenInput.val(input.val().replace(/_/g, "").split("-").join("")); // inputmask가 적용된경우 입력된 값을 지우면 공백이 _ 로 표현되므로 .replace(/_/g, "")를 추가함.
            }
            input.after(hiddenInput);
			if($(this).attr("name").indexOf("]") > -1){
				input.attr("name", "_datepicker_"+$(this).attr("name")+"");
			}else{
				input.attr("name", $(this).attr("name")+"_datepicker");
			}
            var oldValue = null;

            input.focus(function () {
                oldValue = input.val().replace(/_/g, "").split("-").join("");
            });

            input.focusout(function () {
                if ($(this).val().length == 10) {
                    hiddenInput.val(input.val().replace(/_/g, "").split("-").join(""));
                    if (callback && oldValue != hiddenInput.val()) callback(hiddenInput.val(), oldValue, input);
                } else if ($(this).val().length == 0) {
                    hiddenInput.val("");
                }
                if(typeof $(hiddenInput).valid != 'undefined'){
					$(hiddenInput).valid();
				}
            });

            var defaultOptions = {
                onSelect: function () {
                    hiddenInput.val(input.val().replace(/_/g, "").split("-").join(""));
                    if (callback) callback(hiddenInput.val(), oldValue, input);
                }
            };
            $.extend(true, defaultOptions, options);
            input.datepicker(defaultOptions);
            return input;
        });
    }
});

var DateLib = {};

//DateLib.setDatePicker(셀렉터, 추가 혹은 변경 옵션)
DateLib.setHpDatePicker = function(textSelector, option, callback) {
    var opt = $.extend({}, DATEPICKER_OPTIONS, option);
    $(textSelector).hpdatepicker(opt, callback);
    $(textSelector).parent().find(".ui-datepicker-trigger>img").removeAttr("title");
    /*
    .filter(":text").each(function(i, v) {
        //$(v).prop("tabindex", -1).after($('<label for="' + v.id + '"></label>').append($(v).next("button")));
    });
    */

    $("body").off("keydown", ".ui-datepicker-prev,.ui-datepicker-close")
    .on("keydown", ".ui-datepicker-prev", function(e) {
        if (e.which == 9 && e.shiftKey) {
            e.preventDefault()
        }
    })
    .on("keydown", ".ui-datepicker-close", function(e) {
        if (e.which == 9 && !e.shiftKey) {
            e.preventDefault()
        }
    });
    return $(textSelector);
};


DateLib.setPickerValue = function(textSelector, value){
    $(textSelector).each(function(){
        $(this).val(value);
        $(this).siblings("[name="+$(this).attr("id")+"]").val(value);
    });
}

/*from to 비교 하여 처리
********사용법**********
DateLib.setHpDatePicker("#fromdatepicker").inputmask("datetime", {
    inputFormat: "yyyy-mm-dd"
    , min: "2000-01-01"
});
DateLib.setHpDatePicker("#todatepicker").inputmask("datetime", {
    inputFormat: "yyyy-mm-dd"
    , min: "2000-01-01"
});
//2개 달력 범위 설정 한다.
DateLib.setRstrRangeCal($("#fromdatepicker"),  $("#todatepicker") );
*/
DateLib.setRstrRangeCal = function(from, to) {
    from.inputmask("option", {postValidation: ifn_strtPostValidationCallback});
    to.inputmask("option", {postValidation: ifn_toPostValidationCallback});

    function ifn_strtPostValidationCallback(args, opts) {
        var inputVal = args.join("").replace(/[^0-9]/g, "");
        var calToVal = to.val().replace(/[^0-9]/g, "");
        if (calToVal) {
            var toVal = calToVal.substr(0, inputVal.length);
            if (inputVal > toVal){
                //alert("종료일보다 클 수 없습니다.");
                return false;
            }
        }
        return true;
    }

    function ifn_toPostValidationCallback(args, opts) {
        var inputVal = args.join("").replace(/[^0-9]/g, "");
        var calStrtVal = from.val().replace(/[^0-9]/g, "");
        if (calStrtVal) {
            var strtVal = calStrtVal.substr(0, inputVal.length);
            if (inputVal < strtVal){
                //alert("시작일보다 작을 수 없습니다.");
                return false;
            }
        }
        return true;
    }
};

/**
날짜의 유효성을 검사한다.
 */
DateLib.setValideDate = function(obj) {

    if(!ComLib.isEmpty(obj.val())) {

		var format = /^(19[7-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

		if(!format.test(obj.val())) {
			alert('올바른 날짜 형식으로 지정해주세요');
			return false;
		}

	}

    return true;
}

DateLib.chkRangeCal = function(from, to) {

	//날짜형식 유효성 검사
	if (DateLib.setValideDate(from) == false){
		return false;
	}

	if (DateLib.setValideDate(to) == false){
		return false;
	}

	var startDe = from.val().replace(/[^0-9]/g, "");
    var endDe = to.val().replace(/[^0-9]/g, "");

	if (endDe) {

		if( (startDe - endDe ) > 0 ) {
			alert('시작일자가 종료일보다 큽니다.');
			return false;
		} else {
			var minDe = from.inputmask("option", "min").mask;

			if(minDe) {
				var limitDe = minDe.replace(/[^0-9]/g, "");

				if( (limitDe - startDe ) > 0 ) {
					alert('시작일자가 최소일자인('+minDe+') 보다 큽니다.');
					return false
				}
			}
		}
    }

	if (startDe) {

		if( (startDe - endDe ) > 0 ) {
			alert('시작일자가 종료일보다 큽니다.');
			return false
		} else {
			var minDe2 = to.inputmask("option", "min").mask;

			if(minDe2) {
				var limitDe2 = minDe2.replace(/[^0-9]/g, "");

				if( (limitDe2 - endDe ) > 0 ) {
					alert('종료일자가 최소일자인('+minDe2+') 보다 큽니다.');
					return false
				}
			}
		}
    }

	return true;
}

DateLib.destroyDatePicker = function(textSelector) {
    $(textSelector).filter(".hasDatepicker").datepicker("destroy")
    .each(function(i, v) {
        $(v).next("label").remove();
    });
};

//달력초기화및재설정
DateLib.initDatePicker = function(obj) {

    obj.find(".ui-datepicker-trigger").remove();

    obj.find(".calendar input").removeClass("hasDatepicker").datepicker(DATEPICKER_OPTIONS)
    obj.find(".calendar input").parent().find(".ui-datepicker-trigger>img").removeAttr("title");

    $("body").off("keydown", ".ui-datepicker-prev,.ui-datepicker-close")
    .on("keydown", ".ui-datepicker-prev", function(e) {
        if (e.which == 9 && e.shiftKey) {
            e.preventDefault()
        }
    })
    .on("keydown", ".ui-datepicker-close", function(e) {
        if (e.which == 9 && !e.shiftKey) {
            e.preventDefault()
        }
    });
}

//오늘 날짜 처리
/*
DateLib.getToday(); -> 20230508
DateLib.getToday("YYYYMMDD"); ->20230508
DateLib.getToday("YYYY-MM-DD"); -> 2023-05-08
DateLib.getToday("YYYY.MM.DD"); -> 2023.05.08
DateLib.getToday("YYYY-MM"); -> 2023-05
DateLib.getToday("YYYY"); -> 2023
DateLib.getToday("MM"); -> 05
DateLib.getToday("DD"); -> 08
*/
DateLib.getToday = function (pattern) {
    var _pattern = pattern;
    var toDay= DateLib._getToday();
    var now = moment(toDay);
    if(_pattern == null || _pattern == ""){
        _pattern = "YYYYMMDD";
    }
    return now.format(_pattern);
};

/*
DateLib.getDay("20230630", "YYYY년 MM월 DD일"); -> 2023년 06월 30일
*/
DateLib.getDay = function (day, pattern) {
	if(day == null || day == 'undefined'){
		return '';
	}
	//console.log('day', day);
    var _pattern = pattern;
    var now = moment(day);
	//console.log('now', now);
    if(_pattern == null || _pattern == ""){
        _pattern = "YYYYMMDD";
    }
    return now.format(_pattern);
};

//날짜 더하기
/*
today is '2023-05-08'
DateLib.addDay(1,null,"YYYY-MM-DD") -> '2023-05-09'
DateLib.addDay(-1,null,"YYYY-MM-DD") -> '2023-05-07'
DateLib.addDay(1,"20230531","YYYY-MM-DD") -> '2023-06-01'
DateLib.addDay(1,"2023-05-31","YYYY-MM-DD") -> '2023-06-01'
DateLib.addDay(1,"2023-05-31","YYYY-MM") -> '2023-06'
DateLib.addDay(1,"2023-05-31","YYYY.MM") -> '2023.06'
DateLib.addDay(-11,"2023-05-31","YYYY-MM-DD") -> '2023-05-30'
*/
DateLib.addDay = function(dd, sDate, pattern) {
    var now;
    if(sDate) {
        now = moment(sDate);
    }else{
        now = moment(DateLib._getToday());
    }
    var _pattern = pattern;
    if(_pattern == null || _pattern == ""){
        _pattern = "YYYYMMDD";
    }
    return now.add(dd, "d").format(_pattern);
};
//월 더하기
/*
today is '2023-05-08'
DateLib.addMonth(1,null,"YYYY-MM-DD") -> '2023-06-08'
DateLib.addMonth(-1,null,"YYYY-MM-DD") -> '2023-04-08'
DateLib.addMonth(1,"20230531","YYYY-MM-DD") -> '2023-06-30'
DateLib.addMonth(1,"2023-05-31","YYYY-MM-DD") -> '2023-06-30'
DateLib.addMonth(1,"2023-05-31","YYYY-MM") -> '2023-06'
DateLib.addMonth(1,"2023-05","YYYY-MM") -> '2023-06'
DateLib.addMonth(1,"202305","YYYY-MM") -> '2023-06'
DateLib.addMonth(1,"2023-05-31","YYYY.MM") -> '2023.06'
DateLib.addMonth(-1,"2023-05-31","YYYY-MM-DD") -> '2023-04-30'
*/
DateLib.addMonth = function(mm, sDate, pattern){
     var now;
    if(sDate) {
        now = moment(sDate);
    }else{
        now = moment(DateLib._getToday());
    }
    var _pattern = pattern;
    if(_pattern == null || _pattern == ""){
        _pattern = "YYYYMMDD";
    }
    return now.add(mm, "M").format(_pattern);
}
//년 더하기
DateLib.addYear = function(mm, sDate, pattern){
     var now;
    if(sDate) {
        now = moment(sDate);
    }else{
        now = moment(DateLib._getToday());
    }
    var _pattern = pattern;
    if(_pattern == null || _pattern == ""){
        _pattern = "YYYYMMDD";
    }
    return now.add(mm, "y").format(_pattern);
}

//날짜 차이
/*
DateLib.diffDay("20230401","20230501");  -> 30
DateLib.diffDay("20230401","20230201");  -> -59
DateLib.diffDay("2023-04-01","20230201"); -> -59
DateLib.diffDay("2023-04-01","2023.02.01"); -> -59
*/
DateLib.diffDay = function(_date1, _date2) {
    var valFromDate = $("#"+ _date1).val();
    var valToDate =$ ("#"+ _date2).val();
    if(valFromDate == null){
        valFromDate = _date1;
    }
    if(valToDate  == null){
        valToDate = _date2;
    }
    var date1 = moment(valFromDate);
    var date2 = moment(valToDate);
    return date2.diff(date1, "days");
};
//월 차이
DateLib.diffMonth = function(_date1, _date2) {
    var valFromDate = $("#"+ _date1).val();
    var valToDate =$ ("#"+ _date2).val();
    if(valFromDate == null){
        valFromDate = _date1;
    }
    if(valToDate  == null){
        valToDate = _date2;
    }
    var date1 = moment(valFromDate);
    var date2 = moment(valToDate);
    return date2.diff(date1, "months");
};
//년 차이
DateLib.diffYear = function(_date1, _date2) {
    var valFromDate = $("#"+ _date1).val();
    var valToDate =$ ("#"+ _date2).val();
    if(valFromDate == null){
        valFromDate = _date1;
    }
    if(valToDate  == null){
        valToDate = _date2;
    }
    var date1 = moment(valFromDate);
    var date2 = moment(valToDate);
    return date2.diff(date1, "years");
};

/**
 * 시작일, 종료일 비교
 * 사용방법 : compareDate(this)
 * */
DateLib.compareDate = function(start,end){

    var todayDt = DateLib._getToday();
    var startDt = moment(start).format("YYYYMMDD");
    var endDt = moment(end).format("YYYYMMDD");

    if(startDt != "" && endDt == ""){
        alert("종료일을 입력하세요.");
        $("#endDt").focus();
        return false;
    } else if(startDt == "" && endDt != ""){
        alert("시작일을 입력하세요.");
        $("#startDt").focus();
        return false;
    } else if( startDt != "" && startDt > todayDt){
        alert("시작일은 금일보다 이전으로 설정가능합니다.");
        $("#startDt").val("");
        $("#startDt").focus();
        return false;
    } else if( endDt != "" && endDt > todayDt){
        alert("종료일은 금일보다 이전으로 설정가능합니다.");
        $("#endDt").val("");
        $("#endDt").focus();
        return false;
    } else if (startDt != "" &&  endDt != "" &&  startDt > endDt){
        alert("종료일은 시작일보다 이후로 설정가능합니다.");
        $("#endDt").val("");
        $("#endDt").focus();
        return false;
    }
    return true;
}

//서버에서 오늘 날짜 가지고 오는 내부 함수
DateLib._getToday = function () {
    var contextPath = "";
    if(typeof _contextPath === 'undefined' || _contextPath === ''){
        var url = location.href;
        var pathArray = url.split('/');
        contextPath = "/"+pathArray[3];
    }else{
        contextPath = _contextPath;
    }
    var toDay="";
    var _request = ComLib.ajaxReqObj(contextPath+"/cmm/getToday.do", {}, false);
    _request.done(function(responseObj, statusText, xhr) {
        toDay = responseObj.today;
    });
    return toDay;
}

DateLib._getTodayTime = function () {
    var contextPath = "";
    if(typeof _contextPath === 'undefined' || _contextPath === ''){
        var url = location.href;
        var pathArray = url.split('/');
        contextPath = "/"+pathArray[3];
    }else{
        contextPath = _contextPath;
    }
    var toDayTime="";
    var _request = ComLib.ajaxReqObj(contextPath+"/cmm/getTodayTime.do", {}, false);
    _request.done(function(responseObj, statusText, xhr) {
        toDayTime = responseObj.todayTime;
    });
    return toDayTime;
}


var SetTime;
var mm, ss;
function setLimit30minute() {   // 대기시간  30분 초과시 로그아웃
    SetTime = 1800; //30분 초
    if (!window.timeout) {
        window.timeout = [];
    }
    if (!window.interval) {
        window.interval = [];
    }
    while (window.timeout.length) {
        clearTimeout(window.timeout.pop());
    }
    while (window.interval.length) {
        clearInterval(window.interval.pop());
    }
    var logout$ = $("a[href*='/cm/z/b/0210/lgut.do']");
    if (logout$.length <= 0) {
        return;
    }
    var startTime = Date.now();
    window.interval.push(setInterval(function() {
        //지난시간 구하는 로직을 1씩 빼는것이 아닌 시간 비교방식으로 정정
        var remainTime = SetTime - Math.floor((Date.now()-startTime)/1000);

        mm = Math.floor(remainTime / 60); //분
        ss = Math.floor(remainTime % 60); //초
        if(mm < 10) mm = "0" + mm;
        if(ss < 10) ss = "0" + ss;
        // SetTime --;
        if (mm == 4 && ss == 59) {
            if(confirm("로그인 시간이 얼마 남지않았습니다. 로그인을 연장하시겠습니까?")){
                gfn_nowTimeAdd()
            }
        }
        var nowTime = mm+"분"+ss+"초";
        $("#timeOut").html(nowTime);
    }, 1000));
    window.timeout.push(setTimeout(function() {
        while (window.interval.length) {
            clearInterval(window.interval.pop());
        }
        while (window.timeout.length) {
            clearTimeout(window.timeout.pop());
        }
        //alert("대기시간 30분이 초과되어 로그아웃되었습니다.");
        location.href = logout$.prop("href");
        console.log("timeout");
    }, 1000 * 60 * 30));
}

function gfn_nowTimeAdd() {
    if(SetTime > 1800){
        alert("최대연장 시간입니다.")
    }else{
        var request = ComLib.ajaxReqObj("/cm/z/b/0210/loginTimeAdd.do", {} );
        request.done(function (res, statusText, xhr) {
            setLimit30minute();
        });
    }
}


/****************************************************************************************************************/
/** validation
/****************************************************************************************************************/
// 유효성 규칙
var RULES = {};
// 유효성 메시지
var MESSAGES = {};
//유효성 그룹
var GROUPS = {};

var ValidLib = {};

/*
 * 유효성 규칙 추가 함수
 * rules::Object >> 추가하고자 하는 유효성 규칙을 정의한 객체
 */
ValidLib.fn_addRules=function(rules, gbn) {
    if(gbn="name"){
        for (var rule in rules){
            $("[name="+rule+"]").rules("add", rules[rule]);
        }
        return;
    }else{
        for (var rule in rules){
            $("#"+rule).rules("add", rules[rule]);
        }
    }
}

/*
 * 유효성 규칙 제거 함수
 * rules::Object >> 제거하고자 하는 유효성 규칙을 정의한 객체
 */
ValidLib.fn_removeRules=function(rules, gbn) {
    if(gbn="name"){
        for (var rule in rules){
            $("[name="+rule+"]").rules("remove");
        }
        return;
    }else{
        for (var rule in rules){
            $("#"+rule).rules("remove");
        }
    }
}

//달력초기화및재설정
ValidLib.setValidate = function(form, isOnSubmit, isEnableEvent, _rules, _messages, _groups, _options) {
    $.extend(_rules, RULES);
    $.extend(_messages, MESSAGES);
    $.extend(_groups, GROUPS);

    function setErrorClass(element){
        //error클래스 지운다.
        ComFnLib.recursive($(element), function(FN,item){
            if(!item.hasClass("error")){
                if(item.parent() != null){
                    FN(item.parent());
                }
            }else{
                item.removeClass("error")
            }
        }, 5);
        if($(element).attr("aria-invalid") == "true"){//에러면 error클래스 넣는다
            var tarObj = [];
            ComFnLib.recursive($(element), function(FN,item){
                if(item.parent() != null){
                    FN(item.parent());
                }
                tarObj.push(item);
            }, 4);
            ComFnLib.withMe({}, function(){
                if($(tarObj[0]).hasClass("errorDsp")){
                    $(tarObj[0]).addClass("error")
                }else if($(tarObj[1]).hasClass("errorDsp")){
                    $(tarObj[1]).addClass("error")
                }else if($(tarObj[2]).hasClass("errorDsp")){
                    $(tarObj[2]).addClass("error")
                }else if($(tarObj[3]).hasClass("errorDsp")){
                    $(tarObj[3]).addClass("error")
                }else{
                    $(tarObj[1]).addClass("error")
                }
            });
        }
    }

    var OPTIONS = {
        isEnableEvents: isEnableEvent,
        onsubmit: isOnSubmit,
        onfocusout: function( element ) {
            if (!this.settings.isEnableEvents){
                return false;
            }
            if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
                this.element( element );
            }
            //error인경우 error클래스 다시 넣는다
            setErrorClass(element);
        },
        onkeyup: function( element, event ) {
            if (!this.settings.isEnableEvents) return false;
            if ( event.which === 9 && this.elementValue( element ) === "" ) {
                return;
            } else if ( element.name in this.submitted || element === this.lastElement ) {
                this.element( element );
            }
            setErrorClass(element);
        },
        onclick: function( element ) {
            if (!this.settings.isEnableEvents) return false;
            if ( element.name in this.submitted ) {
                this.element( element );
            } else if ( element.parentNode.name in this.submitted ) {
                this.element( element.parentNode );
            }
        },
        ignore: [],
        ignoreTitle: true,
        errorElement: "p",
        errorClass: "ipt_txt_error",
        errorPlacement: function (error, element) {
            $("#"+$(error).attr("id")).remove();
            var tarObj = [];
            ComFnLib.recursive(element, function(FN,item){
                if(item.parent() != null){
                    FN(item.parent());
                }
                tarObj.push(item);
            }, 4);
            ComFnLib.withMe(error, function(){
                if($(tarObj[0]).hasClass("errorDsp")){
                    this.appendTo(tarObj[0]);
                    $(tarObj[0]).addClass("error")
                }else if($(tarObj[1]).hasClass("errorDsp")){
                    this.appendTo(tarObj[1]);
                    $(tarObj[1]).addClass("error")
                }else if($(tarObj[2]).hasClass("errorDsp")){
                    this.appendTo(tarObj[2]);
                    $(tarObj[2]).addClass("error")
                }else if($(tarObj[3]).hasClass("errorDsp")){
                    this.appendTo(tarObj[3]);
                    $(tarObj[3]).addClass("error")
                }else{
                    this.appendTo(tarObj[2]);
                    $(tarObj[1]).addClass("error")
                }
            });
        },
        rules: _rules || {},
        messages: _messages || {},
        groups: _groups || {},
        invalidHandler: function(event, validator) {
            var errors = validator.numberOfInvalids();
            if(errors){
                var firstName_ = validator.errorList[0].element.name;
                $('[name="'+firstName_+'"]').focus();
                if($('[name="'+firstName_+'"]').data("type") != null && $('[name="'+firstName_+'"]').data("type") == "datepicker"){
					$('[name="'+firstName_+'_datepicker"]').focus();
				}
            }
        }
    };

    $.extend(OPTIONS, _options);

    var validator = form.validate(OPTIONS);

    // 값을 비교하여 해당 값이 비교값보다 큰지 검증
    $.validator.addMethod("greaterThan", function(value, element, param){
        var startDate = $("[name="+$(param).attr("id")+"]").val();
        if(value && startDate){

            return value > startDate;
        }else if(value == "" && startDate == ""){
            return true;
        }
        return false;
    });

    // 특정 조건에 해당 값이 들어있는경우 필수를 체크한다.
    $.validator.addMethod("requiredIf", function(value, element, param){
        var selector = param[0];
        var targetList = param[1];

        var selectorValue

        if($(selector).is(":checkbox")){
            selectorValue = $(selector).is(":checked");
        }else if($(selector).is(":radio")){
            selectorValue = $(selector + ':checked').val();
        }else{
            selectorValue = $(selector).val()
        }

        if(targetList.indexOf(selectorValue) > -1){
            if($.trim(value) == ""){
                return false;
            }
        }
        return true;
    });

    return validator;
}

ValidLib.setValidateM = function(form, isOnSubmit, isEnableEvent, _rules, _messages, _groups, _options) {
    $.extend(_rules, RULES);
    $.extend(_messages, MESSAGES);
    $.extend(_groups, GROUPS);

    function setErrorClass(element){
        //error클래스 지운다.
        ComFnLib.recursive($(element), function(FN,item){
            if(!item.hasClass("error")){
                if(item.parent() != null){
                    FN(item.parent());
                }
            }else{
                item.removeClass("error")
            }
        }, 3);

        if($(element).attr("aria-invalid") == "true"){//에러면 error클래스 넣는다
            var tarObj = [];
            ComFnLib.recursive($(element), function(FN,item){
                if(item.parent() != null){
                    FN(item.parent());
                }
                tarObj.push(item);
            }, 4);
            //$(tarObj[0]).addClass("error")

			ComFnLib.withMe({}, function(){
				if($(tarObj[0]).hasClass("errorDsp")){
					$(tarObj[0]).addClass("error")
				}else if($(tarObj[1]).hasClass("errorDsp")){
					$(tarObj[1]).addClass("error")
				}else if($(tarObj[2]).hasClass("errorDsp")){
					$(tarObj[2]).addClass("error")
				}else if($(tarObj[3]).hasClass("errorDsp")){
					$(tarObj[3]).addClass("error")
				}else{
					$(tarObj[1]).addClass("error")
				}
			});

        }
    }

    var OPTIONS = {
        isEnableEvents: isEnableEvent,
        onsubmit: isOnSubmit,
        onfocusout: function( element ) {
            if (!this.settings.isEnableEvents){
                return false;
            }
            if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
                this.element( element );
            }
            //error인경우 error클래스 다시 넣는다
            //setErrorClass(element);
        },
        onkeyup: function( element, event ) {
            if (!this.settings.isEnableEvents) return false;
            if ( event.which === 9 && this.elementValue( element ) === "" ) {
                return;
            } else if ( element.name in this.submitted || element === this.lastElement ) {
                this.element( element );
            }
            //setErrorClass(element);
        },
        onclick: function( element ) {
            if (!this.settings.isEnableEvents) return false;
            if ( element.name in this.submitted ) {
                this.element( element );
            } else if ( element.parentNode.name in this.submitted ) {
                this.element( element.parentNode );
            }
        },
        ignore: [],
        ignoreTitle: true,
        errorElement: "p",
        errorClass: "error_message",
        errorPlacement: function (error, element) {
			$("#"+$(error).attr("id")).remove();
            var tarObj = [];
            ComFnLib.recursive(element, function(FN,item){
                if(item.parent() != null){
                    FN(item.parent());
                }
                tarObj.push(item);

            }, 4);
            ComFnLib.withMe(error, function(){
				if($(tarObj[0]).hasClass("errorDsp")){
					this.appendTo(tarObj[0]);
					$(tarObj[0]).addClass("error")
				}else if($(tarObj[1]).hasClass("errorDsp")){
					this.appendTo(tarObj[1]);
					$(tarObj[1]).addClass("error")
				}else if($(tarObj[2]).hasClass("errorDsp")){
					this.appendTo(tarObj[2]);
					$(tarObj[2]).addClass("error")
				}else if($(tarObj[3]).hasClass("errorDsp")){
					this.appendTo(tarObj[3]);
					$(tarObj[3]).addClass("error")
				}else{
					this.appendTo(tarObj[2]);
					$(tarObj[1]).addClass("error")
				}
			});
        },
        rules: _rules || {},
        messages: _messages || {},
        groups: _groups || {},
        invalidHandler: function(event, validator) {
            var errors = validator.numberOfInvalids();
            if(errors){
                var firstName_ = validator.errorList[0].element.name;
                $('[name="'+firstName_+'"]').focus();
            }
        }
    };

    $.extend(OPTIONS, _options);

    var validator = form.validate(OPTIONS);

    // 값을 비교하여 해당 값이 비교값보다 큰지 검증
    $.validator.addMethod("greaterThan", function(value, element, param){
        var startDate = $("[name="+$(param).attr("id")+"]").val();
        if(value && startDate){

            return value > startDate;
        }else if(value == "" && startDate == ""){
            return true;
        }
        return false;
    });

    // 특정 조건에 해당 값이 들어있는경우 필수를 체크한다.
    $.validator.addMethod("requiredIf", function(value, element, param){
        var selector = param[0];
        var targetList = param[1];

        var selectorValue

        if($(selector).is(":checkbox")){
            selectorValue = $(selector).is(":checked");
        }else if($(selector).is(":radio")){
            selectorValue = $(selector + ':checked').val();
        }else{
            selectorValue = $(selector).val()
        }

        if(targetList.indexOf(selectorValue) > -1){
            if($.trim(value) == ""){
                return false;
            }
        }
        return true;
    });

    return validator;
}


/****************************************************************************************************************/
/** popup-팝업
/****************************************************************************************************************/
var PopLib = {};

/*
 * 팝업창 열기 함수
 * url::String >> 팝업창에 표시하고자 하는 화면의 url
 * name::String >> 팝업창 이름
 * height::Number >> 팝업창 높이
 * width::Number >> 팝업창 너비
 * scroll::String >> 스크롤 사용여부 (기본값 : no)
 */
PopLib.openPup = function(url, name, height, width, scroll) {
    var positionTop = window.screenY || window.screenTop || 0;
    var positionLeft = window.screenX || window.screenLeft || 0;
    var top = positionTop + (screen.height - height)/2;
    var left = positionLeft + (screen.width - width)/2;
    var sScroll = "no";
    if (scroll != null )  sScroll = "yes";
    var formalSpecs = "menubar=no, status=no, scrollbars="+sScroll+", resizable=no";
    var specs = formalSpecs + ", top=" + top + ", left=" + left + ", height=" + height + ", width=" + width;
    /*
    specs - 속성명=값 형태이며 ,를 구분자로 사용
    height=pixel: 윈도우 높이
    left=pixel: 윈도우의 좌측 위치
    menubar=yes|no|1|0: 메뉴바 표시 여부
    status=yes|no|1|0: 상태바 표시 여부
    titlebar=yes|no|1|0: 타이틀바 표시 여부
    top=pixel: 윈도우의 상단 위치
    width=pixel: 윈도우의 너비
    */
    return window.open(url, name, specs, null);
}

PopLib.openPostPup = function(form, name, height, width, scroll) {
    var positionTop = window.screenY || window.screenTop || 0;
    var positionLeft = window.screenX || window.screenLeft || 0;
    var top = positionTop + (screen.height - height)/2;
    var left = positionLeft + (screen.width - width)/2;
    var sScroll = "no";
    if (scroll != null )  sScroll = "yes";
    var formalSpecs = "menubar=no, status=no, scrollbars="+sScroll+", resizable=no";
    var specs = formalSpecs + ", top=" + top + ", left=" + left + ", height=" + height + ", width=" + width;
    /*
    specs - 속성명=값 형태이며 ,를 구분자로 사용
    height=pixel: 윈도우 높이
    left=pixel: 윈도우의 좌측 위치
    menubar=yes|no|1|0: 메뉴바 표시 여부
    status=yes|no|1|0: 상태바 표시 여부
    titlebar=yes|no|1|0: 타이틀바 표시 여부
    top=pixel: 윈도우의 상단 위치
    width=pixel: 윈도우의 너비
    */
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "_csrf");
    hiddenField.setAttribute("value", $("meta[name='_csrf']").attr("content"));

    form.append(hiddenField);

    var preTarget_ = form.prop("target");
    form.prop("target", name);
    var post_popup = window.open("", name, specs, null);
    form.submit();
    form.prop("target", preTarget_);
    return post_popup;
}

/****************************************************************************************************************/
/** 공통 기능 합수
/****************************************************************************************************************/
var ComFnLib = {};


ComFnLib.withMe = function(obj, func) {
    if(func!=null){
        obj["_with_"] = func;
        obj["_with_"]();
        delete obj["_with_"];
    }
    return obj;
}
//var sum = ComFnLib.recursive(10, function(FN,cnt){return cnt+(cnt>1 ? FN(cnt-1) : 0 ); });
ComFnLib.recursive = function(params, func, lim) {
    function recursive1(){
        var p = [recursive1];
        for(var i=0; i<arguments.length;i++){
                p.push(arguments[i]);
        }
        if(lim != null && lim >= 1){
            lim--;
            return func.apply(null,p);
        }else if(lim == null){
            return func.apply(null,p);
        }else{
            return null;
        }
    };
    return func.apply(null,[recursive1].concat(params));
};

ComFnLib.fn_openLayerPopup = function(sPopDivId, sUrl, oData, oCallbackFunc, cPass) {
	//이정훈 주석추가
	var _currentFocus;
	_currentFocus = $(document.activeElement);

	/* 비밀번호 재확인 */
	var pass = true;
	var bDimShowFlag = false;

	if(cPass == null || cPass == ""){

		if($("#pwdCfrmForm000")[0] != null){
			$("#pwdCfrmForm000")[0].reset();
		}

		/*
		var sTmp = sUrl.split('?');
		var sReqTmp = sUrl.split('?');
		var queryString ="";

		if(sTmp.length > 1) {
			console.log("sTmp===>", sTmp[1]);
			sReqTmp = sTmp[1];

			console.log("decodeURI(sReqTmp)===>", decodeURI(sReqTmp));
			const result = {};
			var serchObj = JsonLib.parse('{"'+decodeURI(sReqTmp).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')+'"}');

		}
		*/

		var tmpData = { };

		if(!ComLib.isEmpty(oData)) {
			tmpData = oData;
			tmpData.menuUrl = sUrl;
		} else {
			tmpData.menuUrl = sUrl;
		}

		var request = ComLib.ajaxReqObj("/cm/z/b/0220/countChkPwdCfrmYn.do", tmpData, false);
		request.done(function (responseObj, statusText, xhr) {


			if(!ComLib.isEmpty(responseObj.auth)){
				if(responseObj.auth != "ok" ){
					if(responseObj.authMsg != null && responseObj.authMsg != ""){
						alert(responseObj.authMsg);
					}

					if(responseObj.authRedirect != null && responseObj.authRedirect != ""){
						location.href=responseObj.authRedirect;
					}
					return false;
				}
			}

			if(responseObj.ret == null){
				pass = true;
			}else if(responseObj.ret.cnt == "0"){
				//로그인등록 화면
				ui.dimShow();
				$("#chkPwdCfrmYnAdd").show();
				pass = false;
			}else if(responseObj.ret.cnt > 0){
				$("#chkPwdCfrmYn_sPopDivId").val(sPopDivId);
				$("#chkPwdCfrmYn_sUrl").val(sUrl);
				$("#chkPwdCfrmYn_oData").val(JsonLib.stringify(oData));
				$("#chkPwdCfrmYn_oCallbackFunc").val(oCallbackFunc);
				//로그인 확인화면
				ui.dimShow();
				$("#chkPwdCfrmYn").show();
				pass = false;
			}

			bDimShowFlag = true;
	    });
	} else {
        bDimShowFlag = true;
    }

	if(!pass){
		return false;
	}

	if(bDimShowFlag) {
		if($("#layer_dialog").length > 0){
	        $("#layer_dialog").remove();
	    }

		console.log(" dialog.load dialog.load dialog.load dialog.load");
	    var dialog = $('<div id="layer_dialog" class="box_btn_wrap"></div>');

	    $(document.body).append(dialog);
	    $.extend(oData, {"callBackFunc": oCallbackFunc});

	    dialog.load(sUrl, oData, function(responseText, textStatus, jqXHR) {
	        if ("error" == textStatus) {
	            var ret = JsonLib.parse(responseText);
	            if (ret.errorMsg) {
	                alert(ret.errorMsg);
	                if (ret.redirectUrl) {
	                    if("" != ret.redirectUrl){
	                        location.href=ret.redirectUrl;
	                    }
	                }
	                return;
	            }
	            if (ret.userMsg) {
	                alert(ret.userMsg);
	                if (ret.redirectUrl) {
	                    if("" != ret.redirectUrl){
	                        location.href=ret.redirectUrl;
	                    }
	                }
	                return;
	            }
	            if (ret.redirectUrl) {
	                if("" != ret.redirectUrl){
	                    location.href=ret.redirectUrl;
	                }
	            }
	        }

			ui.fullLayerPopup(_currentFocus);
	        ui.dimShow();

	        if(sPopDivId == "anneLayer"){
	            $(this).children("section").fadeIn(150).addClass("on");
				$(this).children("section").focus();
	        }else{
	            $("#"+sPopDivId).fadeIn(150).addClass("on");
				$("#"+sPopDivId).focus();
	        }
	    });
	}

    return;
};

ComFnLib.fn_m_openLayerPopup = function(sPopDiv, sUrl, oData, oCallbackFunc) {
    var _me = this;
    $.extend(oData, {"callBackFunc": oCallbackFunc});

    this._popDiv = sPopDiv;
    this._url = sUrl;
    this._data = oData;
    this._callbackFunc = oCallbackFunc;

    this.refresh = function(){
        // reload시 화면이 사라졌다 다시 나타나는 현상으로 인하여 주석처리함. -- 성범
        //_me._popDiv.empty();
        _me._popDiv.load(sUrl, oData, function(responseText, textStatus, jqXHR) {
            if ("error" == textStatus) {
                var ret = JsonLib.parse(responseText);
                if (ret.errorMsg) {
                    alert(ret.errorMsg);
                    if (ret.redirectUrl) {
                        if("" != ret.redirectUrl){
                            location.href=ret.redirectUrl;
                        }
                    }
                    return;
                }
                if (ret.userMsg) {
                    alert(ret.userMsg);
                    if (ret.redirectUrl) {
                        if("" != ret.redirectUrl){
                            location.href=ret.redirectUrl;
                        }
                    }
                    return;
                }
                if (ret.redirectUrl) {
                    if("" != ret.redirectUrl){
                        location.href=ret.redirectUrl;
                    }
                }
            }
            _me._popDiv.find('.popup_full:not(.abc)').show().focus();
            _me._popDiv.find('.popup_close').off('click').on('click', function() {
                _me.hide();
            });
            _me.show();
        });
        return _me;
    };

    this.setUrl = function(url){
        _me._url = url;
        return _me;
    };
    this.setData = function(data){
        _me._data = data;
        return _me;
    };
    this.setCallbackFunc = function(callbackFunc){
        _me._callbackFunc = callbackFunc;
        return _me;
    };
    this.hide = function(){
        _me._popDiv.hide();
        return _me;
    };
    this.show = function(){
        _me._popDiv.show();
        return _me;
    };
    this.clear = function(){
        _me._popDiv.empty();
        return _me;
    };

    return _me;
};


ComFnLib.fn_reloadLayerPopup = function(spLayerId, sPopDivId, sUrl, oData, oCallbackFunc) {

    var request = ComLib.ajaxReqObj(sUrl, oData, false);

    request.done(function (data, statusText, xhr) {
        $("#"+spLayerId).html(data);
        $("#"+sPopDivId).css("display", "block");

        // z-index 관련
        var getMaxZ = Math.max.apply(null, $("section, section header, section a.closed:not('.btn')").map(function(){
            var z;
            return isNaN(z = parseInt($(this).css("z-index"), 10)) ? 0 : z;
        }));

        $("#"+sPopDivId).css("z-index", ++getMaxZ);
        $("#"+sPopDivId).find("header").css("z-index", ++getMaxZ);
        $("#"+sPopDivId).find("a.closed:not('.btn')").css("z-index", ++getMaxZ);

        $("#"+sPopDivId).addClass("on");
        $closeBtn = $(".full_pop .closed");
        $.extend(oData, {"callBackFunc": oCallbackFunc});
        $closeBtn.on("click", function() { /* 닫기 */
            var target= $(this).closest(".full_pop");
            target.fadeOut(150).removeClass("on");
            ui.dimHide();
        });
    });


    return;
};

ComFnLib.fn_openChildLayerPopup = function(pForm, sParnetDivId, sPopDivId, sUrl, oData, oCallbackFunc) {


    if($("#"+pForm).find("#"+sPopDivId+"_dialog")){
        $("#"+sPopDivId+"_dialog").remove();
    }

    $("#"+sParnetDivId).addClass("layer_dim");
    var dialog = $('<div id="'+sPopDivId+'_dialog" class="box_btn_wrap"></div>');

    $("#"+pForm).append(dialog);
    $.extend(oData, {"callBackFunc": oCallbackFunc});

    dialog.load(sUrl, oData, function(responseText, textStatus, jqXHR) {

        if ("error" == textStatus) {
            var ret = JsonLib.parse(responseText);
            if (ret.errorMsg) {
                alert(ret.errorMsg);
                if (ret.redirectUrl) {
                    if("" != ret.redirectUrl){
                        location.href=ret.redirectUrl;
                    }
                }
                return;
            }
            if (ret.userMsg) {
                alert(ret.userMsg);
                if (ret.redirectUrl) {
                    if("" != ret.redirectUrl){
                        location.href=ret.redirectUrl;
                    }
                }
                return;
            }
            if (ret.redirectUrl) {
                if("" != ret.redirectUrl){
                    location.href=ret.redirectUrl;
                }
            }
        }

        // z-index 관련
        var getMaxZ = Math.max.apply(null, $("section, section header, section a.closed:not('.btn')").map(function(){
            var z;
            return isNaN(z = parseInt($(this).css("z-index"), 10)) ? 0 : z;
        }));

        $("#"+sPopDivId).css("z-index", ++getMaxZ);
        $("#"+sPopDivId).find("header").css("z-index", ++getMaxZ);
        $("#"+sPopDivId).find("a.closed:not('.btn')").css("z-index", ++getMaxZ);

        var $closeBtn = $("#"+sPopDivId+"_dialog .full_pop .closed");

        $closeBtn.on("click", function() { /* 닫기 */
            var target= $(this).closest("#"+sPopDivId+"_dialog .full_pop");
            target.fadeOut(150).removeClass("on");
            //ui.dimHide();
            $("#"+sParnetDivId).removeClass("layer_dim");
        });

        ui.dimShow();

        $("#"+sPopDivId).fadeIn(150).addClass("on");
    });
    return;
};


/*
 * 우편번호 팝업창 열기 함수
 * callBackFunc::String >> 결과 리턴받을 함수명
 * callBackId::String >> 결과 리턴받을 함수에서 사용할 sId
 * 사용법
 * ComFnLib.retrieveAddres(callBackFunc, callBackId);
 */
ComFnLib.retrieveAddres = function(data,callBackFunc, callBackId) {

	if($("#dialog").length > 0){
        $("#dialog").remove();
    }

	var _currentFocus;
	_currentFocus = $(document.activeElement);

    var dialog = $('<div id="dialog" class="box_btn_wrap"></div>');
    $(document.body).append(dialog);
	$.extend(data, {"callBackFunc": callBackFunc, "callBackId": callBackId});
    dialog.load("/cm/z/z/0900/retrieveAddressListPost.do", data, function(responseText, textStatus, jqXHR) {
        if ("error" == textStatus) {
            var ret = JsonLib.parse(responseText);
            if (ret.errorMsg) {
                alert(ret.errorMsg);
                if (ret.redirectUrl) {
                    if("" != ret.redirectUrl){
                        location.href=ret.redirectUrl;
                    }
                }
                return;
            }
            if (ret.userMsg) {
                alert(ret.userMsg);
                if (ret.redirectUrl) {
                    if("" != ret.redirectUrl){
                        location.href=ret.redirectUrl;
                    }
                }
                return;
            }
            if (ret.redirectUrl) {
                if("" != ret.redirectUrl){
                    location.href=ret.redirectUrl;
                }
            }
        }

		ui.fullLayerPopup(_currentFocus);
        ui.dimShow();

        $("#addrpopup").fadeIn(150).addClass("on");
        $("#addrpopup").focus();


    });
    return;
};

var layerAddresM;
ComFnLib.retrieveAddresM = function( data,callBackFunc, callBackId) {

    if($("div[id^=_layerAddres]").length == 0){
     var dialog = $('<div id="_layerAddres'+callBackId+'"></div>');
        $(document.body).append(dialog);
    } else {
        if(layerAddresM._data.callBackId != callBackId) {
			$("div[id^=_layerAddres]").remove();
			 var dialog = $('<div id="_layerAddres'+callBackId+'"></div>');
			$(document.body).append(dialog);

			layerAddresM = null;
        }
    }

    var data = {};
    $.extend(data, {"callBackFunc": callBackFunc, "callBackId": callBackId});

    if(layerAddresM == null){
        layerAddresM = new ComFnLib.fn_m_openLayerPopup($("#_layerAddres"+callBackId), "/cm/z/z/0900/retrieveAddressListPost.do", data , callBackFunc).refresh();
    } else {
        layerAddresM.show();
    }
    return;
};

/*
 * 공통코드 조회 함수
 * callBackFunc::String >> 결과 리턴받을 함수명
 * sId::String >> 결과 리턴 시 사용 할 Id
 * cmmnCdGrupId::String >> 공통그룹코드
 * cmmnCdIdArr::String[] >> 공통코드
 * 사용법
 * ComFnLib.retrieveCmmCode(callBackFunc, sId, cmmnCdGrupId, cmmnCdIdArr);
 */
ComFnLib.retrieveCmmCode = function(callBackFunc, sId, cmmnCdGrupId, cmmnCdIdArr) {

    var form = document.createElement("form");
    form.setAttribute("action", "");
    form.setAttribute("method", "POST");
    form.setAttribute("id", "_cmRetrieveCmmCd");
    form.setAttribute("name", "_cmRetrieveCmmCd");
    form.setAttribute("target", "");

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "cmmnCdGrupId");
    hiddenField.setAttribute("value", cmmnCdGrupId);

    form.appendChild(hiddenField);
    if(cmmnCdIdArr){
        hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", "cmmnCdIdArr");
        hiddenField.setAttribute("value", cmmnCdIdArr);

        form.appendChild(hiddenField);
    }

    hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "_csrf");
    hiddenField.setAttribute("value", $("meta[name='_csrf']").attr("content"));

    form.appendChild(hiddenField);

    document.body.appendChild(form);

    var contextPath = "";
    if(typeof _contextPath === 'undefined'){
        var url = location.href;
        var pathArray = url.split('/');
        contextPath = "/"+pathArray[3];
    }else{
        contextPath = _contextPath;
    }

    var _request = ComLib.ajaxReqObj(contextPath+"/common/getCommonCode.do", "_cmRetrieveCmmCd", false);
    document.body.removeChild(form);
    _request.done(function(responseObj, statusText, xhr) {

        if(responseObj.rtnList == undefined ){
             alert("해당 코드가 없습니다.");
             return false;
        }
        new Function("sId","obj", callBackFunc + "(sId,obj);")(sId,responseObj.rtnList);
    });
};

/*
 * 첨부구비서류 제출 선택
 * gubun::String >> 사업구분 모성보호 : 2, 실업급여 : 3 .... etc
 * type::String >> 회원구분 타입 개인 : PE, 기업 : BP
 * callBackFunc::String >> 결과 리턴받을 함수명
 * 사용법
 * ComFnLib.chkAtchFiles("2", "PE", callBackFunc);
 */
ComFnLib.chkAtchFiles = function( gubun,type,callBackFunc) {

	var _currentFocus;
	_currentFocus = $(document.activeElement);

    if($("#dialog").length > 0){
        $("#dialog").remove();
    }
    var dialog = $('<div id="dialog" class="box_btn_wrap"></div>');
    $(document.body).append(dialog);
    var data = {};
    $.extend(data, {"callBackFunc": callBackFunc, "gubun":gubun,"type":type});
    dialog.load("/cm/z/z/0900/chkAtchFilesPost.do", data, function(responseText, textStatus, jqXHR) {
        if ("error" == textStatus) {
            var ret = JsonLib.parse(responseText);
            if (ret.errorMsg) {
                alert(ret.errorMsg);
                if (ret.redirectUrl) {
                    if("" != ret.redirectUrl){
                        location.href=ret.redirectUrl;
                    }
                }
                return;
            }
            if (ret.userMsg) {
                alert(ret.userMsg);
                if (ret.redirectUrl) {
                    if("" != ret.redirectUrl){
                        location.href=ret.redirectUrl;
                    }
                }
                return;
            }
            if (ret.redirectUrl) {
                if("" != ret.redirectUrl){
                    location.href=ret.redirectUrl;
                }
            }
        }
        ui.fullLayerPopup(_currentFocus);
        ui.dimShow();

        $("#_cmChkAtchFilesPopup").fadeIn(150).addClass("on");
		$("#_cmChkAtchFilesPopup").focus();
    });
    return;
};
var layerChkAtchFilesM;
ComFnLib.chkAtchFilesM = function( gubun,type,callBackFunc) {

    if($("#_layerChkAtchFiles"+gubun).length == 0){
        var dialog = $('<div id="_layerChkAtchFiles'+gubun+'"></div>');
        $(document.body).append(dialog);
    } else {
        if(layerChkAtchFilesM._data.gubun != gubun) {
            layerChkAtchFilesM = null;
        }
    }

    var data = {};
    $.extend(data, {"callBackFunc": callBackFunc, "gubun":gubun,"type":type});

    if(layerChkAtchFilesM == null){
        layerChkAtchFilesM = new ComFnLib.fn_m_openLayerPopup($("#_layerChkAtchFiles"+gubun), "/cm/z/z/0900/chkAtchFilesPost.do", data , callBackFunc).refresh();
    } else {
        layerChkAtchFilesM.show();
    }
    return;
};

/*
 * 첨부파일 삭제 함수
 * callBackFunc::String >> 결과 리턴받을 함수명
 * sId::String >> 결과 리턴 시 사용 할 Id
 * sysGbn::String >> 시스템구분 EI / HR / WK / UA / EP
 * cvplRqutRcno::String >> 고용24민원접수번호
 * ncmnNo::String >> 문서관리번호
 * 사용법
 * ComFnLib.deleteFile(callBackFunc, sId, sysGbn, cvplRqutRcno, ncmnNo);
 */
ComFnLib.deleteFile = function(callBackFunc, sId, sysGbn, cvplRqutRcno, ncmnNo, elctProfDocPckgId, elctCrtfPstnYn) {

    var form = document.createElement("form");
    form.setAttribute("action", "");
    form.setAttribute("method", "POST");
    form.setAttribute("id", "_cmDeleteFile");
    form.setAttribute("name", "_cmDeleteFile");
    form.setAttribute("target", "");

    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "sysGbn");
    hiddenField.setAttribute("value", sysGbn);

    form.appendChild(hiddenField);

    var hiddenField2 = document.createElement("input");
    hiddenField2.setAttribute("type", "hidden");
    hiddenField2.setAttribute("name", "cvplRqutRcno");
    hiddenField2.setAttribute("value", cvplRqutRcno);

    form.appendChild(hiddenField2);

    var hiddenField3 = document.createElement("input");
    hiddenField3.setAttribute("type", "hidden");
    hiddenField3.setAttribute("name", "ncmnNo");
    hiddenField3.setAttribute("value", ncmnNo);

    form.appendChild(hiddenField3);

    var hiddenField4 = document.createElement("input");
    hiddenField4.setAttribute("type", "hidden");
    hiddenField4.setAttribute("name", "_csrf");
    hiddenField4.setAttribute("value", $("meta[name='_csrf']").attr("content"));

    form.appendChild(hiddenField4);

    var hiddenField5 = document.createElement("input");
    hiddenField5.setAttribute("type", "hidden");
    hiddenField5.setAttribute("name", "elctProfDocPckgId");
    hiddenField5.setAttribute("value", elctProfDocPckgId);

    form.appendChild(hiddenField5);

    var hiddenField6 = document.createElement("input");
    hiddenField6.setAttribute("type", "hidden");
    hiddenField6.setAttribute("name", "elctCrtfPstnYn");
    hiddenField6.setAttribute("value", elctCrtfPstnYn);

    form.appendChild(hiddenField6);

    document.body.appendChild(form);

    var _request = ComLib.ajaxReqObj("/cm/z/z/9992/deleteFile.do", "_cmDeleteFile", false);
    document.body.removeChild(form);
    _request.done(function(responseObj, statusText, xhr) {
        if(callBackFunc != ""){
            new Function("sId","obj", callBackFunc + "(sId,obj);")(sId,responseObj.rtnMap);
        }
    });
};


/*
* params : id = 삽입하고자 content가 들어갈 div의 id
*          content = 서버에서 받아온 웹에디터로 작성된 내용
* usage : ComFnLib.writeWebEditCont('webcontentDiv','<h1>내용입니다.</h1>')
*/


ComFnLib.writeWebEditCont = function(id,contents) {
	$("#"+id).append('<object id="'+id+'Div" frameborder="0" width="100%" height="100%" type="text/html"></object>');
	var objectContent =
		'<!DOCTYPE html>'
		+ '<html lang="en">'
		+ '<head>'
		+ '<meta charset="UTF-8">'
		+ '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
		+ '</head>'
		+ '<body>'
		+ '<div>'
		+ contents
		+ '</div>'
		+ '</body>'
		+ '</html>';
		$("#"+id+"Div").ready(function(){
			var body = $("#"+id+"Div").contents().find("body");
			body.append(objectContent);
		});
		if(contents.length > 0){
			$("#"+id).css("height","25rem");
		}
};



function gfn_delCurrentRow(t,f,u,j){
    window[f].fn_delCurrentRow(t,u,j);
}
function gfn_delCurrent(t,f,u){
    window[f].fn_delCurrent(t,u);
}
function gfn_addEtc(t,f){
    window[f].fn_addEtc(t);
}
function gfn_delFildDiv(obj) {
    if($(obj).closest('[id^="fileGroup"]').find('[id^="fileContainer"]').children().length <= 1) {
        $(obj).closest('[id^="fileGroup"]').find('[id^="fileContainer"]').removeClass("box_filelist_wrap");
    }
}
function log(o,t){
    if(t != null){
        console.dir("---"+t+"---");
    }
    console.dir(o);
}
/*
 * 서식코드로 파일 업로드 셋팅
 */
ComFnLib.cvplFomtFile = function(o) {
	var _me = this;

    var pathArray = location.href.split('/');
    this.cmUrl = pathArray[0]+"//"+pathArray[2]+"/cm";

	this.base;
	this.callback = "Y";

	this.cvplRqutRcno =o["cvplRqutRcno"];
	this.systemId = o["systemId"];
	this.cvplFomtCd = o["cvplFomtCd"];
	this.fieldName = o["fieldName"];
	this.filepolicy = o["filepolicy"];
	this.prgmId = o["prgmId"];
	this.athflMdulId =o["athflMdulId"];
	this._el;
	this._upperForm;
	this._checkEtc = {"currentCnt":0};
	this.delFn = o["delFn"];
	this.uploadFn = o["uploadFn"];
	this.mobileYn = o["mobileYn"];
	this.viewMode = o["viewMode"];
	this.encAthflSeq = o["encAthflSeq"];
	this.otpbScpeSecd = (o["otpbScpeSecd"] == null || o["otpbScpeSecd"] == "") ? 'ERU02' : o["otpbScpeSecd"];
	this._retUpload;
	this.uploadCnt = 0;
	this.uploadTmpCnt = 0;
	this.retAthflSeq = "";
	this.uploadComplate = "N";
	this.useEcid = "Y";
	this.addEcidLayer;
	this.ecidListLayer;
	this.fileGroupCnt=0;

	this.deviceId;
	this.delImmediate = o["delImmediate"];
	this.auth = o["auth"];
	this.delAttachList = new Array();
	this.valid = (o["valid"] == null || o["valid"] == "") ? 'Y' : o["valid"];
	this._fileInfo;
	this.loadComplateFn = o["loadComplateFn"];
	this.ncmnNos = o["ncmnNos"];

	this.getDeviceId = function(){
		var ret = "";

		if(ComLib.env == "app"){
			//log(ComLib.deviceInfo);
			ret = ComLib.deviceInfo.DeviceId;
		}else{
			alert("고용24 어플리케이션에서만 사용 할 수 있는 기능입니다. 스토어에서 고용24 어플을 설치 해주세요");
			return
		}

		//var ret = "c2f0920a-6783-4b5d-997a-c174ed3916ff";
		//var ret = "a2f0920a-1783-4b5d-997a-c174ed3916fa";
		return ret;
	};
	this.getFileGroupCnt = function(){
		return _me.fileGroupCnt;
	};
	this.clear = function(o){
		if(o !=null && o != ""){
			$('[id^=fileupload_dummy_'+o+']').remove();
			$('[data-prgmid='+o+']').remove();
		}else if(_me.athflMdulId != null && _me.athflMdulId != ""){
			$('[id^=fileupload_dummy_'+_me.athflMdulId+']').remove();
		}
		$("#cvplFomtFileLayout_"+_me._el.prop("id")).empty();
		return _me;
	};
	this.setEl = function(el){
        this._el = el;
        this._upperForm = el.closest('form');
        $(document).on('drop dragover',function(e){
			e.preventDefault();
		});
		this.base = "#"+_me._el.prop("id")+" ";
		_me._el.append($("#cvplFomtFile_layout").render({"useEcid":_me.useEcid, "id":_me._el.prop("id")}));
        return _me;
    }
    this.refresh = function(){
		_me._retUpload = [];
		_me._fileInfo = [];
		var retUrl = "/cm/z/z/9992/selectUploadForm.do";
		if(_me.auth == "any"){
			retUrl = "/cm/z/z/9992/selectUploadFormNx.do";
		}else if(_me.auth == "ep"){
			retUrl = "/cm/z/z/9992/selectUploadFormEp.do";
		}
		var request = ComLib.ajaxReqObj(retUrl, {"athflMdulId":this.athflMdulId, "cvplRqutRcno":this.cvplRqutRcno, "systemId":this.systemId, "cvplFomtCd":this.cvplFomtCd, "prgmId":this.prgmId,"encAthflSeq":this.encAthflSeq,"ncmnNos":this.ncmnNos}, false);
        request.done(function(responseObj, statusText, xhr) {
			//prgmId cvplFomtCd
			_me.prgmId = responseObj.HPCMZZ9992VO.prgmId;
			_me.cvplFomtCd = responseObj.HPCMZZ9992VO.cvplFomtCd;

			var retList = JsonLib.parse(responseObj.HPCMZZ9992VO.retCvplFomtList);
			var retFileList = JsonLib.parse(responseObj.HPCMZZ9992VO.cvplRqutRcnoUploadForm);
			_me.fileGroupCnt = retList.length;

			$(retList).each(function(idx,data){
				var ret = retList[idx];
				ret["idx"] = idx+1;
				ret["fieldName"] = _me.fieldName;
				ret["fileContainer"] = "fileContainer_"+ret["athflMdulId"]+"_"+ret["atchPaprId"];

				_me._fileInfo.push(ret);
				var tempId=ret["athflMdulId"]+"_"+ret["atchPaprId"];

				if(ret["etc"] != "Y"){
					$.extend(_me._checkEtc, ret);
					$.extend(ret, {"useEcid":_me.useEcid});
					if(_me.viewMode == 'view'){
						$("#cvplFomtFileLayout_"+_me._el.prop("id")).append($("#fileBody_template_view").render(ret));
					}else{
						$("#cvplFomtFileLayout_"+_me._el.prop("id")).append($("#fileBody_template").render(ret));
					}
				}else{
					$.extend(_me._checkEtc, ret);
					$.extend(ret, {"useEcid":_me.useEcid});
					ret["currentCnt"] = _me._checkEtc.currentCnt;
					$("#cvplFomtFileLayout_"+_me._el.prop("id")).append($("#fileBody_template_etc_subject").render(ret));
					if(_me.viewMode == 'view'){
						$("#cvplFomtFileLayout_"+_me._el.prop("id")).append($("#fileBody_template_etc_view").render(ret));
					}else{
						$("#cvplFomtFileLayout_"+_me._el.prop("id")).append($("#fileBody_template_etc").render(ret));
					}
					tempId = tempId+"_etc_"+ret["currentCnt"];
				}
				_me.makeFileUploadTemplate(tempId, ret);

				if(_me.viewMode == 'view'){
					var w = $("#btn_"+tempId).text();
					//log(w);
					if(w=="파일찾기"){
						$(_me.base+"#btn_"+tempId).hide();
					}else{
						$(_me.base+"#btn_"+tempId).show();
					}
				}else{
					if(idx==0){
						$("#layoutInfo_"+_me._el.prop("id")).append($("#cvplFomtFile_info").render(retList[idx]));
					}
				}
			});


			var fileEx = true;
			for(var o in retFileList){
				_me.retAthflSeq = retFileList[o][0]["encAthflSeq"];
				var ret = {};
				var cnt = retFileList[o].length;
				var etcYn = retFileList[o][0]["etc"];
				var tempId = retFileList[o][0]["athflMdulId"]+"_"+o;
				if(cnt > 0 && etcYn != 'Y'){
					ret.files = retFileList[o];
					ret["fieldName"] = _me.fieldName;
					if(retFileList[o][0].elctCrtfPstnYn != "Y"){
						var result = tmpl('cvplFomt-template-download', ret);
						if(_me.viewMode == 'view'){
							result = tmpl('cvplFomt-template-download-view', ret);
						}
						$(_me.base+"#"+"fileContainer_"+tempId).append(result);
						$(_me.base+"#"+"fileContainer_"+tempId).addClass("box_filelist_wrap");
					}else{
						var temp0001 = _me.retAthflSeq+"-"+retFileList[o][0].atchFsno+"-"+retFileList[o][0].elctProfDocPckgId;
						if(_me.useEcid =="Y" && _me.mobileYn == "Y" && retFileList[o][0].elctProfDocPckgId != null && retFileList[o][0].elctProfDocPckgId != ""){
							$(_me.base+"#btn_"+tempId).off('click').text("전자증명서 제출 완료");
							$(_me.base+"#btn_reqEcid_"+retFileList[o][0].elctProfDocKndCd).off('click').text("전자증명서 삭제");
						}else if( _me.mobileYn != "Y" && retFileList[o][0].elctProfDocPckgId != null && retFileList[o][0].elctProfDocPckgId != ""){
							$(_me.base+"#chkEcid_"+tempId).attr("checked",true);
							$(_me.base+"#chkEcid_"+tempId).attr("disabled",true);
							$(_me.base+"#ecidArea_"+tempId).show();
							$(_me.base+"#btn_reqEcid_"+retFileList[o][0].elctProfDocKndCd).show();
							$(_me.base+"#"+"dropZone_"+tempId).hide();
						}else if( _me.mobileYn != "Y" && (retFileList[o][0].elctProfDocPckgId == null || retFileList[o][0].elctProfDocPckgId == "")){
							$(_me.base+"#chkEcid_"+tempId).attr("disabled",false);
							$(_me.base+"#chkEcid_"+tempId).attr("checked",false);
							$(_me.base+"#"+"dropZone_"+tempId).hide();
							$(_me.base+"#btn_reqEcid_"+retFileList[o][0].elctProfDocKndCd).hide();
							if(_me.viewMode == 'view'){
								$(_me.base+"#chkEcid_"+tempId).attr("disabled",true);
							}
						}else if( _me.mobileYn == "Y" && (retFileList[o][0].elctProfDocPckgId == null || retFileList[o][0].elctProfDocPckgId == "")){
							$(_me.base+"#btn_"+tempId).off('click').text("전자증명서 제출 예정");
						}
						if(retFileList[o][0].elctCrtfPstnYn == "Y"){
							$(_me.base+"#btn_reqEcid_"+retFileList[o][0].elctProfDocKndCd).attr("data-seq",temp0001);
							$(_me.base+"#chkEcid_"+tempId).attr("checked",true);
							$(_me.base+"#chkEcid_"+tempId).attr("data-seq",temp0001);
						}
					}
				}else if(cnt > 0 && etcYn == 'Y'){
					$(retFileList[o]).each(function(idx,data){
						var ret = {};
						ret.files = [data];
						ret["fieldName"] = _me.fieldName;
						if(idx!=0){
							_me.fn_addEtc(data);
						}
						var result = tmpl('cvplFomt-template-download', ret);
						if(_me.viewMode == 'view'){
							result = tmpl('cvplFomt-template-download-view', ret);
						}
						var tempId2 = tempId+"_etc_"+_me._checkEtc.currentCnt;
						$(_me.base+"#fileTxt_"+tempId2).val((data.atchPaprCn==null||data.atchPaprCn=="")?"":data.atchPaprCn);
						$(_me.base+"#"+"fileContainer_"+tempId2).append(result);
						$(_me.base+"#"+"fileContainer_"+tempId2).addClass("box_filelist_wrap");
					});
				}
				fileEx = false;
				if(_me.viewMode == 'view'){
					var w = $("#btn_"+tempId).text();
					log(w);
					if(w=="파일찾기"){
						$(_me.base+"#btn_"+tempId).hide();
					}else{
						$(_me.base+"#btn_"+tempId).show();
					}
				}
			}
			if(_me.viewMode == 'view' && fileEx){
                _me._el.empty();
            }

			if(_me.loadComplateFn && _me.loadComplateFn != null && _me.loadComplateFn != ""){
				_me.loadComplateFn(responseObj.HPCMZZ9992VO);
			}
        });

        _me.addEventLayer();

        return _me;
	}
	this.addEventLayer = function(o){
		var _btnAddEcid;
		$(_me.base+"[name^=addEcid_]").click(function(e) {
			e.preventDefault();
			_btnAddEcid = this;
			var request = ComLib.ajaxReqObj("/cm/z/z/9992/verifyIndiECDW.do?deviceId="+_me.getDeviceId(), "searchForm", false);
			request.done(function (responseObj, statusText, xhr) {
				if(responseObj.verifyIndiECDW.ecdwTyCode == "1"){
					var id= $(_btnAddEcid).data("value");
					_me.addEcidLayer = new ComFnLib.fn_m_openLayerPopup($("#addEcidLayer"), "/cm/z/z/9992/req"+id+"Layer.do?deviceId="+_me.getDeviceId(), {"fieldName":_me.fieldName} , "").refresh();
				}else if(responseObj.verifyIndiECDW.ecdwTyCode == "5"){
					log(responseObj.verifyIndiECDW);
					log(responseObj.inquireIndiStipAgree);
					if(responseObj.inquireIndiStipAgree.agrmnts != null){
						//전자지갑 약관
						$("#pop_inquireAgree1").append(responseObj.inquireIndiStipAgree.agrmnts[0].agrmntCn);
						//통합_이용약관
						$("#pop_inquireAgree2").append(responseObj.inquireIndiStipAgree.agrmnts[1].agrmntCn);
						$("#pop_inquireIndiStipAgree").show();
					}
				}else if(responseObj.verifyIndiECDW.ecdwTyCode == "2"){
					if(confirm("전자지갑을 생성 하시겠습니까?")){
						_me.addEcidLayer = new ComFnLib.fn_m_openLayerPopup($("#addEcidLayer"), "/cm/z/z/9992/req00000000000Layer.do?deviceId="+_me.getDeviceId(), {"fieldName":_me.fieldName, "inquireIndiStipAgree1" :responseObj.inquireIndiStipAgree.agrmnts[0].agrmntCn, "inquireIndiStipAgree2" :responseObj.inquireIndiStipAgree.agrmnts[1].agrmntCn} , "").refresh();
					}
				}
			});
		});

		$(_me.base+"[id^=btn_reqEcid_]").click(function(e) {
			e.preventDefault();
			var _btn_reqEcid = this;
			if($(this).text() =="전자증명서 삭제"){
				if(!confirm("전자증명서를 삭제 하세겠습니까?")){
					return false;
				}
				_me.fn_delEcidData(_btn_reqEcid);
				return;
			}
			_me.fn_ecidListLayer(_btn_reqEcid);
		});

		$(_me.base+"[id^=chkEcid_]").click(function(e) {
			var _chkEcid = this;
			if(!$(this).prop("checked")){
				_me.fn_delEcidCheckData(_chkEcid);
				$("#"+"dropZone_"+$(_chkEcid).data("id")).show();
			}else{
				if($("#fileupload_dummy_"+$(_chkEcid).data("id") ).data() != null){
					var fileCnt = $("#fileupload_dummy_"+$(_chkEcid).data("id") ).data().blueimpFileupload.options.getNumberOfFiles();
					if(fileCnt > 0){
						alert("첨부파일이 존재 합니다.\n전자증명으로 제출하기 위해서는 \n파일을 삭제 후 진행 하시기 바랍니다.");
						$(this).prop("checked",false);
						return;
					}
				}
				$("#"+"dropZone_"+$(_chkEcid).data("id")).hide();
			}
		});

		$(_me.base+"[name^=btn_smplAthflDownloadUrl]").click(function(e) {
			e.preventDefault();
			var url = $(this).data("smplathfldownloadurl");
			gfn_downloadAttFile(url);
		});
	};
	this.fn_ecidListLayer = function(_btn){
		var fileCnt = $("#fileupload_dummy_"+$(_btn).data("id") ).data().blueimpFileupload.options.getNumberOfFiles();
		if(fileCnt > 0){
			alert("첨부파일이 존재 합니다.\n전자증명으로 제출하기 위해서는 \n파일을 삭제 후 진행 하시기 바랍니다.");
			return;
		}
		var request = ComLib.ajaxReqObj("/cm/z/z/9992/verifyIndiECDW.do?deviceId="+_me.getDeviceId(), "searchForm", false);
		request.done(function (responseObj, statusText, xhr) {
			_me.ecidListLayer = new ComFnLib.fn_m_openLayerPopup($("#ecidListLayer"), "/cm/z/z/9992/eCDApplyListInquireLayer.do", {"deviceId":_me.getDeviceId(),"fieldName":_me.fieldName, "docKndCode":$(_btn).data("value").split('-')[0],"utlNo":$(_btn).data("value")} , "").refresh();
		});
	};
	this.fn_delEcidCheckData = function(d){
		var spData = $(d).data("seq");
		var tempId = $(d).data("id");
		if(spData != null && spData != ""){
			var sp = $(d).data("seq").split('-');
			if(sp[1] != null && sp[1] != ""){
				var delInfo = {"athflSeq":sp[0], "atchFsno":sp[1],"ecidData.docPackageId":sp[2]};
				var request = ComLib.ajaxReqObj("/cm/z/z/9992/deleteCheckEcidForm.do", delInfo, false);
			}
		}
	};
	this.fn_delEcidData = function(d){
		var spData = $(d).data("seq");
		var tempId = $(d).data("id");
		if(spData != null && spData != ""){
			var sp = $(d).data("seq").split('-');
			if(sp[1] != null && sp[1] != ""){
				var delInfo = {"athflSeq":sp[0], "atchFsno":sp[1],"ecidData.docPackageId":sp[2]};
				var request = ComLib.ajaxReqObj("/cm/z/z/9992/deleteFileEcidForm.do", delInfo, false);
				request.done(function(responseObj, statusText, xhr) {
                    if(_me.cvplRqutRcno != '' && _me.cvplRqutRcno != null){
                        ComFnLib.deleteFile("", '', _me.systemId, _me.cvplRqutRcno, '', sp[2]);
                    }
    				alert("전자증명서가 삭제되었습니다.");
				});
			}
		}
		if(_me.mobileYn == "Y"){
			$(_me.base+"#"+"btn_"+tempId).text("파일찾기");
			$(d).text("전자증명제출");
			$(_me.base+"#"+"btn_"+tempId).click(function() {
				$("input[name="+"files_dummy_"+tempId+"]").click();
			});
		}else{
			var elctProfDocKndCd = $(d).data("elctprofdockndcd");
			$(_me.base+"#"+"ecidArea_"+tempId).hide();
			$(_me.base+"#"+"dropZone_"+tempId).show();
			$(_me.base+"#chkEcid_"+tempId).attr("disabled",false);
			$(_me.base+"#chkEcid_"+tempId).attr("checked",false);
			$(_me.base+"#"+"btn_reqEcid_"+elctProfDocKndCd).hide();
		}
	};
	this.fn_delCurrentRow = function(o,u,j){
		var chkFile = "Y";
		var	retId = $(o).closest('[id^="fileGroup"]').attr("id");
		var fileContainerId = retId.replace("fileGroup_","fileContainer_");
		var filesId = retId.replace("fileGroup_","files_dummy_");
		var txtId = retId.replace("fileGroup_","txt_");
		var	fObj = $(o).closest('.template-upload');
		if(fObj.find("[id^=file-ncmnNo]").val() == null || (fObj.find("[id^=file-cvplRqutRcno]").val() == "" && fObj.find("[id^=file-athflSeq]").val() == "") ){
			if(u!=null && u=="etc"){
				var gid = $(o).parent().parent().parent().attr("id");
				var gid=gid.replace("fileGroup_","fileContainer_");
				var delList = $("#"+gid).find(".ico16_file.del");
				delList.each(function(idx,data01){
				//	$(data01).click();
				});
			}
			chkFile = 'N';
		}

		if(j.includes('etc_0')) {
			alert("첫 기타 행은 삭제할 수 없습니다.");
			event.stopPropagation();
			return false;
		}

		if(!confirm("기타 행 삭제 시 기 등록된 기타 첨부파일도 삭제됩니다. 해당 기타 첨부파일을 삭제 하시겠습니까?")){
			event.stopPropagation();
			return false;
		}

		if(chkFile == 'N') {
			$('#'+j).remove();
		} else {

			var delInfo = {"ncmnNo":fObj.find("[id^=file-ncmnNo]").val(), "cvplRqutRcno":fObj.find("[id^=file-cvplRqutRcno]").val(), "athflSeq":fObj.find("[id^=file-athflSeq]").val(), "atchFsno":fObj.find("[id^=file-atchFsno]").val()};
			if(_me.delImmediate == "N"){
				_me.delAttachList.push(delInfo);
				gfn_delFildDiv(o);
				$(o).closest('ul').remove();
				return;
			}
			var request;
			if(_me.auth == "any"){
				request = ComLib.ajaxReqObj("/cm/z/z/9992/deleteFileFormNxLn.do", delInfo, false);
			}else{
				request = ComLib.ajaxReqObj("/cm/z/z/9992/deleteFileForm.do", delInfo, false);
			}
			request.done(function(responseObj, statusText, xhr) {
	            if(_me.cvplRqutRcno != '' && _me.cvplRqutRcno != null){
	                ComFnLib.deleteFile("", '', _me.systemId, fObj.find("[id^=file-cvplRqutRcno]").val(), fObj.find("[id^=file-ncmnNo]").val());
	            }
	            alert("삭제 하였습니다.");
				if(u!=null && u=="etc"){
					$(_me.base+"#"+fileContainerId).empty();
					gfn_delFildDiv(o);
					$(_me.base+"#"+filesId).val("");
					$(_me.base+"#"+txtId).val("");
				}else{
					gfn_delFildDiv(o);
					$(o).closest('ul').remove();
					if(_me.delFn && _me.delFn != null && _me.delFn != ""){
						_me.delFn(delInfo);
					}
				}

				$('#'+j).remove();
			});

		}
	};
	this.fn_delCurrent = function(o,u){

		var	retId = $(o).closest('[id^="fileGroup"]').attr("id");
		var fileContainerId = retId.replace("fileGroup_","fileContainer_");
		var filesId = retId.replace("fileGroup_","files_dummy_");
		var txtId = retId.replace("fileGroup_","txt_");
		var	fObj = $(o).closest('.template-upload');
		if(fObj.find("[id^=file-ncmnNo]").val() == null || (fObj.find("[id^=file-cvplRqutRcno]").val() == "" && fObj.find("[id^=file-athflSeq]").val() == "") ){
			if(u!=null && u=="etc"){
				var gid = $(o).parent().parent().attr("id");
				var gid=gid.replace("fileGroup_","fileContainer_");
				var delList = $("#"+gid).find(".ico16_file.del");
				delList.each(function(idx,data01){
					$(data01).click();
				});
			}
			return false;
		}
		if(!confirm("파일을 삭제 하시겠습니까?")){
			event.stopPropagation();
			return false;
		}
		var delInfo = {"ncmnNo":fObj.find("[id^=file-ncmnNo]").val(), "cvplRqutRcno":fObj.find("[id^=file-cvplRqutRcno]").val(), "athflSeq":fObj.find("[id^=file-athflSeq]").val(), "atchFsno":fObj.find("[id^=file-atchFsno]").val()};
		if(_me.delImmediate == "N"){
			_me.delAttachList.push(delInfo);
			gfn_delFildDiv(o);
			$(o).closest('ul').remove();
			return;
		}
		var request;
		if(_me.auth == "any"){
			request = ComLib.ajaxReqObj("/cm/z/z/9992/deleteFileFormNxLn.do", delInfo, false);
		}else{
			request = ComLib.ajaxReqObj("/cm/z/z/9992/deleteFileForm.do", delInfo, false);
		}
		request.done(function(responseObj, statusText, xhr) {
            if(_me.cvplRqutRcno != '' && _me.cvplRqutRcno != null){
                ComFnLib.deleteFile("", '', _me.systemId, fObj.find("[id^=file-cvplRqutRcno]").val(), fObj.find("[id^=file-ncmnNo]").val());
            }
            alert("파일을 삭제 하였습니다.");
			if(u!=null && u=="etc"){
				$(_me.base+"#"+fileContainerId).empty();
				gfn_delFildDiv(o);
				$(_me.base+"#"+filesId).val("");
				$(_me.base+"#"+txtId).val("");
			}else{
				gfn_delFildDiv(o);
				$(o).closest('ul').remove();
				if(_me.delFn && _me.delFn != null && _me.delFn != ""){
					_me.delFn(delInfo);
				}
			}
		});
	};
	this.fn_addEtc = function(o){
		if(_me._checkEtc.currentCnt+1 >= _me._checkEtc.maxEtcCnt){
			return false;
		}
		_me._checkEtc.currentCnt = _me._checkEtc.currentCnt+1;
		if(_me.viewMode == 'view'){
			$("#cvplFomtFileLayout_"+_me._el.prop("id")).append($("#fileBody_template_etc_view").render(_me._checkEtc));
		}else{
			$("#cvplFomtFileLayout_"+_me._el.prop("id")).append($("#fileBody_template_etc").render(_me._checkEtc));
		}
		var tempId = _me._checkEtc["athflMdulId"]+"_"+_me._checkEtc["atchPaprId"]+"_etc_"+_me._checkEtc["currentCnt"];
		_me.makeFileUploadTemplate(tempId, _me._checkEtc);
	};
	this.fn_delFileInfo = function(o){

		if(_me.delImmediate == "N"){
			return _me.delAttachList;
		}else{
			alert("delImmediate 가 'N' 인경우만 지원합니다");
			return null;
		}
	};
	this.fn_insertFileInfo = function(o){
		//실제 저장 할 물리파일 정보 리턴
		var ret = [];
		$(_me.base+'[id^="fileContainer"]').each(function(idx,data01){
			const dataTransfer = new DataTransfer();
			$("#"+data01.id+"> ul").each(function(idx,data){
				if($(data).data('data') != null){
					var files = $(data).data('data')["files"];
					$(files).each(function(idx,data){
						if(data["error"] == null){
							ret.push(data);
						}
					});
				}
			});
		});
		return ret;
	};
	this.fn_selectFileInfo = function(o){
		var ret = [];
		$(_me.base+'[id^="fileContainer"]').each(function(idx,data01){
			const dataTransfer = new DataTransfer();
			$("#"+data01.id+"> ul").each(function(idx,data){
				if($(data).data('data') != null){
					var files = $(data).data('data')["files"];
					$(files).each(function(idx,data){
						if(data["error"] == null){
							ret.push(idx);
						}
					});
				} else if($(data).find(':input[id^=file-ncmnNo]').val() != '') {
					ret.push(idx);
				}
			});
		});
		return ret;
	};
	this.fn_getCvplFomtCd = function(o){
		if(!ComLib.isEmpty(_me.cvplFomtCd)){
			return _me.cvplFomtCd;
		}else if(!ComLib.isEmpty(_me.prgmId)){
			return _me.prgmId;
		}else{
			return _me.athflMdulId;
		}
	};
	this.makeFileUploadTemplate = function(tempId, ret){
		var inFileCnt = Number(ret["inFileCnt"]);
		//log(inFileCnt,"inFileCnt");
		if(inFileCnt <= 0 ){
			return;
		}
		if(_me.viewMode != 'view'){
			var tmp_fileupload_dummy = new FormLib.Form().createForm("fileupload_dummy_"+tempId, "", "POST", "multipart/form-data", null).addHiddenFile("files_dummy_"+tempId, inFileCnt<=1?"":"multiple").addBody();
			$(tmp_fileupload_dummy.form).attr("data-prgmid",_me.prgmId);
			new FormLib.Form().setFormId(_me._upperForm.attr("id")).addHiddenFile("files_"+tempId).setHidden("systemId",_me.systemId).setHidden("filepolicy",_me.filepolicy).setHidden("filePath",_me.systemId+"/HP/"+_me.fn_getCvplFomtCd());
			$(_me.base+"#"+"btn_"+tempId).click(function() {
				$("input[name="+"files_dummy_"+tempId+"]").click();
			});

			var defaultAcceptFileTypes = /(\.|\/)(zip|hwp|doc|docx|ppt|pptx|xls|xlsx|txt|jpg|jpeg|bmp|gif|png|pdf)$/i;
			if(ret.athflFnen != null && ret.athflFnen != ""){
				defaultAcceptFileTypes = ret.athflFnen;
			}

			var retUrl = "/cm/z/z/9992/fileuploadForAjax.do";
			if(_me.auth == "any"){
				retUrl = "/cm/z/z/9992/fileuploadForAjaxNx.do";
			}
			$("#"+"fileupload_dummy_"+tempId).fileupload({
				maxNumberOfFiles : inFileCnt
				, acceptFileTypes: defaultAcceptFileTypes
				, maxFileSize : ret.atchFlsz
				, filesContainer : $("#"+"fileContainer_"+tempId)
				, dropZone : $("#"+"dropZone_"+tempId)
				, downloadTemplateId : "cvplFomt-template-download2"
				, uploadTemplateId: 'template-upload2'
				, url: retUrl+'?_csrf='+$("meta[name=_csrf]").prop("content")
				, essYn : ret.essYn
			})
			.on('fileuploaddragover', function(e){
				var target = e.delegatedEvent.delegateTarget;
				$(target).attr("style","border:3px dotted black");
			})
			.on('fileuploaddrop', function(e){
				var target = e.delegatedEvent.delegateTarget;
				$(target).attr("style","");
			})
			.on('fileuploaddragleave', function(e){
				var target = e.delegatedEvent.delegateTarget;
				$(target).attr("style","");
			});

			$("#"+"fileupload_dummy_"+tempId).bind('fileuploadsubmit', function (e, data) {
				var sp = tempId.split('_');
				data.async = false;
				data.formData = {
								"systemId":_me.systemId
								, "filepolicy":_me.filepolicy
								, "filePath":_me.systemId+"/HP/"+_me.fn_getCvplFomtCd()
								, "fieldName" : _me.fieldName
								, "cvplRqutRcno":_me.cvplRqutRcno
								, "id":tempId
								, "txtData":_me.getEtcData(tempId)
								, "athflSeq":_me.retAthflSeq
								, "athflMdulId":sp[0]
								, "atchPaprId":sp[1]
								, "currentCnt":sp[3]
								, "otpbScpeSecd" : _me.otpbScpeSecd
							  }
		    });
			$("#"+"fileupload_dummy_"+tempId).bind('fileuploaddone', function (e, data) {
		    	log(data,"fileuploaddone");
		    	if(data.textStatus == "success"){
					$("#"+"fileContainer_"+tempId).find(".progress-bar-success").attr("style","width: 100%;");
					_me._retUpload.push(data.result.files[0]);
                    _me._retUpload["fieldName"] = _me.fieldName;
					_me._retUpload["athflSeq"] = _me.retAthflSeq;
			    	_me.uploadTmpCnt++;
			    	if(_me.uploadCnt == _me.uploadTmpCnt){
						_me.uploadComplate = "Y";
						if(_me.callback === "Y"){
							_me.uploadFn(_me._retUpload);
						}
					}
				}
		    });

		    $("#"+"fileupload_dummy_"+tempId).bind('fileuploadfail', function (e, data) {
		    	log(data,"fileuploadfail");
		    	if(!typeof data.response === 'undefined'){
					if(data.response()["jqXHR"] != null)
			    	if(typeof data.response().jqXHR === 'undefined'){
					}else{
						alert(data.response().jqXHR.responseJSON.errorMsg);
						return false;
					}
				}
		    });
	    }
	};
	this.getEtcData = function(id){
		return $("#fileTxt_"+id).val() == null?"":$("#fileTxt_"+id).val();
	};
	this.getEcidData = function(id){
		var ret = {};
		var docPackageId = $("#docPackageId_"+id).val() == null?"":$("#docPackageId_"+id).val()
		var pinCode = $("#pinCode_"+id).val() == null?"":$("#pinCode_"+id).val()
		var instPresentnUrl = $("#instPresentnUrl_"+id).val() == null?"":$("#instPresentnUrl_"+id).val()
		var validDt = $("#validDt_"+id).val() == null?"":$("#validDt_"+id).val()
		var docKndCode = $("#docKndCode_"+id).val() == null?"":$("#docKndCode_"+id).val()
		var docId = $("#docId_"+id).val() == null?"":$("#docId_"+id).val()

		ret["ecidData.docPackageId"] = docPackageId; //전자증명문서묶음ID
		ret["ecidData.pinCode"] = pinCode; //전자증명문서열람번호
		ret["ecidData.instPresentnUrl"] = instPresentnUrl;
		ret["ecidData.validDt"] = validDt;
		ret["ecidData.docKndCode"] = docKndCode; //전자증명문서종류코드
		ret["ecidData.docId"] = docId; //ELCT_PROF_DOC_NO
		return ret;
	};
	this._validFileArea = function(){
		var b = true;
		var fileName = "";
		var ret = {};
		$('[id^="fileContainer"]').each(function(idx,data01){
			const dataTransfer = new DataTransfer();
			$("#"+data01.id+"> ul").each(function(idx,data){
				if($(data).data('data') != null){
					var files = $(data).data('data')["files"];
					$(files).each(function(idx,data){
						if(data["error"] != null){
							b = false;
						}
					});
				}
			});
		});

		//첨부파일 필수여부 체크
		if(b){
			$('[id^="fileupload_dummy_"]').each(function(idx,data01){
				if($(data01).data().blueimpFileupload != null){
					var fileCnt = $(data01).data().blueimpFileupload.options.getNumberOfFiles();
					var essYn = $(data01).data().blueimpFileupload.options.essYn;
					if(essYn == "Y" && fileCnt <= 0 && b){

						b = false;
						fileName = $(data01).data().blueimpFileupload.options.filesContainer[0].id
						return;
					}
				}
			});
		}

		ret.b = b;
		ret.fileName = fileName;
		return ret;
	};

	this.fn_fileValidation = function(){

		if(_me.valid =="Y"){
			var ret = _me._validFileArea();
			if(!ret.b){

				//alert("첨부파일을 확인 하세요.!");
				return false;
			}
		}else{
			return true;
		}
		return true;
	};

	this.fn_fileChkAtchFiles = function(){
        var request = ComLib.ajaxReqObj("/cm/z/z/9992/getAthflSeq.do", {"cvplRqutRcno":_me.cvplRqutRcno,"athflMdulId":_me.athflMdulId,"prgmId":_me.prgmId}, false);
        var retAthflSeq = "";
        request.done(function(responseObj, statusText, xhr) {
            retAthflSeq = ComLib.nvl(responseObj.retAthflSeq,"");
        });
        return retAthflSeq;
    };
	this.fn_copyFileTemplate = function(){
		var ret = _me._validFileArea();
		if(!ret.b){
			alert("첨부파일을 확인 하세요.!");
			return false;
		}
		$(_me.base+'[id^="fileContainer"]').each(function(idx,data01){
			const dataTransfer = new DataTransfer();
			$("#"+data01.id+"> ul").each(function(idx,data){
				if($(data).data('data') != null){
					var files = $(data).data('data')["files"];
					$(files).each(function(idx,data){
						if(data["error"] == null){
							dataTransfer.items.add(data);
						}
					});
				}
			});
			var targetFileId = data01.id.replace("fileContainer_","files_");
			$("[name="+targetFileId+"]")[0].files = dataTransfer.files;
		});
		return true;
	};
	this.fn_checkAthflSeq = function(gbn){
		if(gbn=="check"){
			if( (_me.retAthflSeq == null || _me.retAthflSeq == "" || _me.retAthflSeq == "0" )){
				_me.fn_selectAthflSeq();
			}
		}else if(gbn=="make"){
			if( (_me.retAthflSeq == null || _me.retAthflSeq == "" || _me.retAthflSeq == "0" )){
				_me.fn_selectAthflSeq();
			}
		}
	};
	this.fn_selectAtchPaprIdCnt = function(atchPaprId){
		var ret = $(_me.base+'[id^="fileContainer_"][id$="_'+atchPaprId+'"] > ul').length;
		return ret;
	};
	this.fn_selectAthflSeq = function(){
		var retUrl = "/cm/z/z/9992/checkAthflSeq.do";
		if(_me.auth == "any"){
			retUrl = "/cm/z/z/9992/checkAthflSeqNx.do";
		}
		var request = ComLib.ajaxReqObj(retUrl, {"cvplRqutRcno":_me.cvplRqutRcno}, false);
		request.done(function(responseObj, statusText, xhr) {
			log(responseObj, "checkAthflSeq");
			if(responseObj.retAthflSeq == null){
				alert("첨부파일 채번 중 오류입니다.");
				return false;
			}
			_me.retAthflSeq = responseObj.retAthflSeq;
		});
	};

	this.fn_copyFileUpload = function(opt){
		if(_me.valid =="Y"){

			var ret = _me._validFileArea();
			if(!ret.b){

				var fileName = "";
				$(_me._fileInfo).each(function(idx, data01){

					if(ret.fileName == data01.fileContainer) {
						fileName = data01.atchPaprCn;
					}

				});

				if(!ComLib.isEmpty(fileName)) {
					alert(fileName+" 증빙서류는 필수입니다. 첨부화일을 등록해주세요.!");
				} else {
					alert("첨부파일을 확인 하세요.!");
				}


				return false;
			}
		}
		if(_me.delImmediate == "N" && _me.delAttachList.length > 0){
			for(var i=0;i<_me.delAttachList.length;i++){
				var delInfo = _me.delAttachList[i];
				var request = ComLib.ajaxReqObj("/cm/z/z/9992/deleteFileForm.do", delInfo, false);
				request.done(function(responseObj, statusText, xhr) {
				});
			}
		}
		_me.delAttachList = [];
		_me.uploadCnt = 0;
		$(_me.base+'[id^="fileContainer"]').each(function(idx,data01){
			$(_me.base+"#"+data01.id+"> ul").each(function(idx,data){
				var data = $(data).data('data')
				if (data && data.submit) {
					if(data["files"]["error"] == null){
						_me.uploadCnt++;
					}
			    }
			});
		});

		if(opt != null && opt.iAthflSeq != null && opt.iAthflSeq != "0" && opt.iAthflSeq != ""){
			_me.retAthflSeq = opt.iAthflSeq;
		}
		if(opt != null && opt.callback === "N"){
			_me.callback = "N";
		}

		if(_me.retAthflSeq == null || _me.retAthflSeq == "" || _me.retAthflSeq=="0" || _me.retAthflSeq==0){
			if(_me.encAthflSeq != null){
				_me.retAthflSeq = _me.encAthflSeq;
			}
		}
		if(_me.uploadCnt > 0){
			_me.fn_checkAthflSeq("check");
		}
		$(_me.base+'[id^="fileContainer"]').each(function(idx,data01){
			$(_me.base+"#"+data01.id+"> ul").each(function(idx,data){
				var data = $(data).data('data')
				if (data && data.submit) {
					if(data["files"]["error"] == null){
						data.submit();
					}
			    }
			});
			var _docPackageId = data01.id.replace("fileContainer_","docPackageId_");
			var _docKndCode = data01.id.replace("fileContainer_","docKndCode_");
			var _chk = data01.id.replace("fileContainer_","chkEcid_");
			if($(_me.base+"#"+_docPackageId).val() != null && $(_me.base+"#"+_docPackageId).val() != ""){
				var sp = $("#"+_docPackageId).attr("id").split('_');
				_me.fn_checkAthflSeq("make");
				var elctProfDocKndCd = $(_me.base+"#"+_docKndCode).val();
				var atchFsno = $(_me.base+"#btn_reqEcid_"+elctProfDocKndCd).data("seq");
				if(atchFsno != null){
					atchFsno = atchFsno.split('-')[1];
				}
				var formData = {
							"systemId":_me.systemId
							, "filepolicy":_me.filepolicy
							, "filePath":_me.systemId+"/HP/"+_me.fn_getCvplFomtCd()
							, "fieldName" : _me.fieldName
							, "athflSeq":_me.retAthflSeq
							, "atchFsno": atchFsno
							, "athflMdulId":sp[1]
							, "atchPaprId":sp[2]
							, "currentCnt":sp[4]
							, "otpbScpeSecd" : _me.otpbScpeSecd
						  }
				$.extend(formData, _me.getEcidData(sp[1]+"_"+sp[2]));
				var request = ComLib.ajaxReqObj("/cm/z/z/9992/saveEcidData.do", formData, false);
				request.done(function(responseObj, statusText, xhr) {
				});
			}else if($(_me.base+"#"+_chk).prop("checked")){
				var sp = $("#"+_chk).attr("id").split('_');
				var docKndCode = $(_me.base+"#"+_chk).data("elctcrtfevdcpaprid");
				var seqExists = $(_me.base+"#"+_chk).data("seq");
				if(seqExists == null || seqExists == ""){
					_me.fn_checkAthflSeq("make");
					var formData = {
								"systemId":_me.systemId
								, "filepolicy":_me.filepolicy
								, "filePath":_me.systemId+"/HP/"+_me.fn_getCvplFomtCd()
								, "fieldName" : _me.fieldName
								, "athflSeq":_me.retAthflSeq
								, "athflMdulId":sp[1]
								, "atchPaprId":sp[2]
								, "currentCnt":sp[4]
								, "ecidData.docKndCode":docKndCode
								, "otpbScpeSecd" : _me.otpbScpeSecd
							  }
					var request = ComLib.ajaxReqObj("/cm/z/z/9992/saveEcidData.do", formData, false);
						request.done(function(responseObj, statusText, xhr) {
					});
				}
			}
		});
		if(_me.uploadCnt==0){
			var sendData = [];
			var txtList = $(_me.base+'[id^="fileTxt_"]');
			for(var i=0 ; i<txtList.length; i++){
				log($(txtList[i]).attr("id"));
				var sp = $(txtList[i]).attr("id").split('_');
				if($(txtList[i]).val() != null && $(txtList[i]).val() != ""){
					var formData = {
							"systemId":_me.systemId
							, "filepolicy":_me.filepolicy
							, "filePath":_me.systemId+"/HP/"+_me.fn_getCvplFomtCd()
							, "fieldName" : _me.fieldName
							, "athflSeq":_me.retAthflSeq
							, "athflMdulId":sp[1]
							, "atchPaprId":sp[2]
							, "currentCnt":sp[4]
							, "atchPaprCn" : $(txtList[i]).val()
							, "otpbScpeSecd" : _me.otpbScpeSecd
						  }
					sendData.push(formData);
				}
			}
			if(sendData.length > 0){
				this.fn_checkAthflSeq("make");
				var request = ComLib.ajaxReqObj("/cm/z/z/9992/saveFileTxtData.do", {"txtData":JsonLib.stringify(sendData)}, false);
				request.done(function(responseObj, statusText, xhr) {
				});
			}
		}
		//첨부파일없이 저장해도 콜백 되도록
		if(_me.uploadComplate == "N"){
			_me._retUpload["athflSeq"] = _me.retAthflSeq;
            _me._retUpload["fieldName"] = _me.fieldName;
			if(opt == null || opt.callback === "Y"){
				_me.uploadFn(_me._retUpload);
			}
		}
		return _me.retAthflSeq;
	}
    this.fn_getFileCnt = function(){
        var ret = $(_me.base+'[id^="fileContainer"] > ul').length;
        return ret;
    }
    return _me;
}



var FILEUPLOAD_MESSAGE = {
    maxNumberOfFiles: '파일 갯수를 초과 하였습니다.',
    acceptFileTypes: '허용하지 않는 파일 확장자 입니다.',
    maxFileSize: '파일 크기가 너무 큽니다.',
    minFileSize: '파일 크기가 너무 작습니다.'
};

// 화면확대축소
var nowZoom = 100;
var bMaxZoom = false;
var bMinZoom = false;
var zoomControl  = {
    zoomOut : function(){

        if(nowZoom <= 90) {
			bMinZoom = true;
			nowZoom = 90;
		} else {
			bMinZoom = false;
			nowZoom = nowZoom - 5;
		}

        zoomControl.zooms(true);
    },
    zoomIn : function(){

        if(nowZoom >= 120) {
			bMaxZoom = true;
			nowZoom = 120;
		} else {
			bMaxZoom = false;
			nowZoom = nowZoom + 5;
		}

        zoomControl.zooms(true);
    },
    zoomReset : function(){
        nowZoom = 100;
        zoomControl.zooms();
    },
    zooms : function(msg){
        var aUserAgent = navigator.userAgent.toLowerCase();

        if (aUserAgent.indexOf("firefox") >= 0){
            $('body').css('-moz-transform','scale('+nowZoom+'%)');
            $('body').css('-moz-transform-origin','0 0');
        } else {
            document.body.style.zoom = nowZoom + "%";
        }
        if(msg){
            if(nowZoom == 90 && bMinZoom) {
                alert("더 이상 축소할 수 없습니다.");
				return false;
            }
            if(nowZoom == 120 && bMaxZoom) {
                alert("더 이상 확대할 수 없습니다.");
				return false;
            }
        }
        zoomControl.setLocalStorage();
    },
    setLocalStorage : function(){
        localStorage.setItem("nowZoom",nowZoom);
    }
}

/**
* 맵 메타구조
*/
var Map = function () {
    this.map = new Object();
};

Map.prototype = {
    put: function (key, value) {
        this.map[key] = value;
    },
    putObj: function (obj) {
        this.map = obj;
    },
    get: function (key) {
        return this.map[key];
    },
    containsKey: function (key) {
        return key in this.map;
    },
    containsValue: function (value) {
        for (var prop in this.map) {
            if (this.map[prop] == value) return true;
        }
        return false;
    },
    isEmpty: function (key) {
        return (this.size() == 0);
    },
    clear: function () {
        for (var prop in this.map) {
            delete this.map[prop];
        }
    },
    remove: function (key) {
        delete this.map[key];
    },
    keys: function () {
        var keys = new Array();
        for (var prop in this.map) {
            keys.push(prop);
        }
        return keys;
    },
    values: function () {
        var values = new Array();
        for (var prop in this.map) {
            values.push(this.map[prop]);
        }
        return values;
    },
    size: function () {
        var count = 0;
        for (var prop in this.map) {
            count++;
        }
        return count;
    }
};

/****************************************************************************************************************/
/**  레포트
/****************************************************************************************************************/
var RptLib = {};

// var report = new RptLib.report( "구직활동내역", "ei", "/mrd7/worknet/seeker.mrd" );
// /hp-cm/src/main/webapp/WEB-INF/jsp/edu/solution/report/report.jsp 파일 참고
RptLib.report = function(rptName, rptSystem, rptPath) {
    var _me = this;
    var _rptName = rptName;
    var _rptSystem = rptSystem;
    var _rptPath = rptPath;

    this._popupYn="Y"; //팝업으로 띄울지 여부
    this._height="1200";
    this._width="800";
    this._scroll="yes";
    this._el;// 팝업으로 안띄울 시
    this.hideToolbarItem = ["inquery","doc","ppt","xls","hwp"]; //기본으로 안띄우는 항목
    this.showToolbarItem = [];  //["doc","hwp"]  보여주는 항목
    this.markYn="N";
    this.directDownloadYn="N"; //직접다운로드
    this.directDownloadFileExt="pdf";
    this.multiYn = "N";
    this.showValidateBtn = "N";
    this.showCustomPrintBtn = "N";

    this.aValue = new Array();
    this.aValues = new Array(); //멀티레포트 시
    this.paramValue = new Map();
    this.paramValues = new Array(); //멀티레포트 시
    this.rOption = new Map();

    //레포트에 전달 할 데이터 셋팅 - 벨류만
    this.setValue = function(value){
        this.aValue.push(value);
        return _me;
    };
    //레포트에 전달 할 데이터 셋팅 - 벨류만 Ary형식
    this.setValueAry = function(values){
        if(values instanceof Array ){
            this.aValue = values;
        }
        return _me;
    };
    //멀티레포트시 파리미터 추가
    this.addValue = function(){
        var _copy = $.extend([],this.aValue);
        this.aValues.push(_copy);
        this.aValue = new Array();
    };
    //레포트에 전달 할 데이터 셋팅
    this.setParamObj = function(obj){
        this.paramValue.putObj(obj);
        return _me;
    };
    //json전달
    this.setJson = function(value){
        this.rOption.put("rdata",value);
        return _me;
    };
    //레포트에 전달 할 데이터 셋팅 -  키 벨류형식
    this.setParamValue = function(key,value){
        this.paramValue.put(key,value);
        return _me;
    };
    //멀티레포트시 파리미터 추가
    this.addParamValue = function(){
        var _copy = $.extend({},this.paramValue);
        this.paramValues.push(_copy);
        this.paramValue = new Map();
    };
    //레포트에 전달 할 옵션 셋팅 -  키 벨류형식, 레포트에 파라미터 안넘길 경우는 "Y" 혹은 "N"
    this.setOption = function(key,value){
        this.rOption.put(key,value);
        return _me;
    };
    this.setShowValidateBtn = function(){
        this.showValidateBtn = "Y";
        return _me;
    };
    this.setShowCustomPrintBtn = function(){
        this.showCustomPrintBtn = "Y";
        return _me;
    };
    this.convertRptString = function(){
        var ret_rp = "";
        var ret_rv = "";
        var ret_option = "";
        if(_me.paramValue.size() >= 1){
            var keys = _me.paramValue.keys();
            $.each(keys, function(i, key) {
                var val = _me.paramValue.get(key);
                ret_rv+=key+"["+val+"] ";
            });
        }
        if(_me.aValue instanceof Array ){
            $.each(_me.aValue, function(i, value) {
                ret_rp+="["+value+"]";
                //ret+=JsonLib.stringify(new Array(value));
            });
        }
        if(_me.rOption.size() >= 1){
            //옵션설정
            var keys = _me.rOption.keys();
            $.each(keys, function(i, key) {
                var val = _me.rOption.get(key);
                if(val == "Y" || val == "N" || val == "" || val == null){
                    if(val == "Y"){ //"Y"인 경우만 적용
                        ret_option+=" /"+key
                    }
                }else{
                    ret_option+=" /"+key+" ["+val+"] ";
                }
            });
        }
        return {
            "rp": ret_rp
            , "rv": ret_rv
            , "option": ret_option
        };
    }

    //초기화
    this.reset = function(){

    }

    //레포트를 표현.
    this.refresh = function(){

		var todayTime = DateLib._getTodayTime();
		_me.setParamValue("printDay","출력일자 : "+todayTime);

        var form = new FormLib.Form();
        var url = location.href;
        var pathArray = url.split('/');
        var cmUrl = pathArray[0]+"//"+pathArray[2]+"/cm";
        var form = _makeFormData();
        if(_me._popupYn == "Y"){//팝업으로 열기
            var popup = PopLib.openPostPup($("#rdpopup"), _rptName, _me._height, _me._width, _me._scroll);
            popup.focus();
        }else{
            var request = ComLib.ajaxReqObj(cmUrl+"/common/getRptData.do", "rdpopup", false);
            request.done(function(responseObj, statusText, xhr) {
                var fr = '<iframe  title="빈 프레임" src="'+cmUrl+'/common/dummyRptFrame.do?_csrf='+$("meta[name='_csrf']").attr("content")+'" style="width:100%;height:100%"></iframe>';
                var iframeRd = $(fr).prependTo(_me._el);
                iframeRd[0].onload = function(){
                    iframeRd[0].contentWindow.postMessage(responseObj["reportVO"],'*');
                }
            });
        }
        form.removeForm();

        function _makeFormData(){
            var form = new FormLib.Form();
            var url = location.href;
            var pathArray = url.split('/');
            var cmUrl = pathArray[0]+"//"+pathArray[2]+"/cm";
            form.createForm("rdpopup", cmUrl+"/common/openRptPopup.do", "POST", null,null).addHidden("_csrf", $("meta[name='_csrf']").attr("content"))
                    .addHidden("rptName", _rptName).addHidden("rptPath", _rptPath).addHidden("rptSystem", _rptSystem)
                            .addHidden("directDownloadYn", _me.directDownloadYn).addHidden("directDownloadFileExt", _me.directDownloadFileExt)
                            .addHidden("hideToolbarItem", JsonLib.stringify(_me.hideToolbarItem))
                            .addHidden("showToolbarItem", JsonLib.stringify(_me.showToolbarItem))
                            .addHidden("showValidateBtn", _me.showValidateBtn)
                            .addHidden("showCustomPrintBtn", _me.showCustomPrintBtn)
                            .addHidden("option", _me.convertRptString().option)
                            .addHidden("multiYn", _me.multiYn);
            if(_me.multiYn != "Y"){
                form.addHidden("rp", _me.convertRptString().rp)  //값만
                form.addHidden("rv", _me.convertRptString().rv);
            }else{//멀티
                $.each( _me.aValues, function( key, value ) {
                    _me.aValue = value;
                    form.addHidden("rpAry", _me.convertRptString().rp);
                });
                $.each( _me.paramValues, function( key, value ) {
                    _me.paramValue = value;
                    form.addHidden("rvAry", _me.convertRptString().rv);
                });
            }
            form.addBody();
            return form;
        }
    }
    //팝업오픈여부
    this.setPopupYn = function(value){
        this._popupYn = value;
        return _me;
    }
    this.setPopupOpt = function(height, width, scroll){
        this._height = height;
        this._width = width;
        this._scroll = scroll;
        return _me;
    }
    this.setEl = function(el){
        this._el = el;
        return _me;
    }
    this.setMarkYn = function(value){
        this.markYn = value;
        return _me;
    }
    this.setDirectDownload = function(value,ext){
        this.directDownloadYn = value;
        if(ext != null) {
            this.directDownloadFileExt = ext;
        }
        if(value == "Y"){
            _me.setPopupYn("Y");
        }
        return _me;
    }

    this.hideToolbarItem = ["doc","ppt","xls","hwp"]; //기본으로 안띄우는 항목
    this.showToolbarItem = [];

    //레포트 다운항목 숨기기
    this.addHideToolbarItem = function(value){
        this.hideToolbarItem.push(value);
        return _me;
    };
    this.addShowToolbarItem = function(value){
        this.showToolbarItem.push(value);
        return _me;
    };
    this.setMultiYn = function(value){
        this.multiYn = value;
        return _me;
    }

    //레포트를 띄우기전에 검검
    var info = getAcrobatInfo();
    if(info.acrobatVersion == null && info.browser == 'ie'){
        var con_check = confirm('PDF Reader를 찾을 수 없습니다.\n\n인쇄를 위해서 PDF Reader를 설치하시기 바랍니다.\n확인 버튼을 누르면 설치 페이지로 이동합니다.');
        if(con_check == true){
            window.open("https://get.adobe.com/reader", '_blank');
        }
    }else if(info.acrobatVersion != null && info.browser == 'ie' && info.acrobatVersion < 10){
        var con_check = confirm('PDF Reader의 버젼이 낮아 출력에 문제가 발생할 수 있습니다.\n삭제 후 최신버젼으로 재설치 바랍니다\n\n확인 버튼을 누르면 설치 페이지로 이동합니다.');
        if(con_check == true){
            window.open("https://get.adobe.com/reader", '_blank');
        }
    }
};

var FormLib = {};
FormLib.Form = function(){
    var form;
    this.createForm = function(formName, action, method, enctype, target){
        this.form = document.createElement("form");
        this.form.setAttribute("action", action);
        this.form.setAttribute("method", method);
        this.form.setAttribute("name", formName);
        this.form.setAttribute("id", formName);
        this.form.setAttribute("target", "");
        if(enctype != null){
            this.form.setAttribute("enctype", enctype);
        }
        if(target != null){
            this.form.setAttribute("target", target);
        }
        return this;
    }
    this.addHidden = function(name,value){
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", name);
        hiddenField.setAttribute("value", value);
        this.form.appendChild(hiddenField);
        return this;
    }
    this.addHiddenFile = function(name, multiple){
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "file");
        hiddenField.setAttribute("name", name);
        if(multiple && multiple !=null && multiple !=""){
            hiddenField.setAttribute("multiple", multiple);
        }
        hiddenField.setAttribute("style", "display: none");
        this.form.appendChild(hiddenField);
        return this;
    }
    this.setHidden = function(name,value){
        var hiddenField;
        var ln = document.getElementsByName(name).length;
        if(ln <= 0 ){
            hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", name);
            hiddenField.setAttribute("value", value);
            this.form.appendChild(hiddenField);
        }else{
            hiddenField = document.getElementsByName(name)[0]
            hiddenField.setAttribute("value", value);
        }
        return this;
    }
    this.addBody = function(){
        var id =  $(this.form).attr("id");

        if($("#"+id).length > 0){
            $("#"+id).remove();
        }

		document.body.appendChild(this.form);
		return this;
		/*
		var id = $(this.form).attr("id");
		if($("#"+id).length > 0){
        	return this;
		}else{
			document.body.appendChild(this.form);
			return this;
		}
		*/
    }
    this.removeForm = function(){
        document.body.removeChild(this.form);
        return this;
    }
    this.resetForm = function(){
        this.form = {};
    }
    this.getForm = function(){
        return this.form;
    }
    this.setForm = function(formName){
        this.form = $(formName)[0];
        return this;
    }
    this.setFormId = function(formId){
        this.form = $("#"+formId)[0];
        return this;
    }
}

var getAcrobatInfo = function() {
    var getBrowserName = function() {
            var userAgent = navigator ? navigator.userAgent.toLowerCase() : "other";
            // 사용자의 브라우저를 확인 하는 부분 (chrome, safari, ie, firefox, etc.)
            if(userAgent.indexOf("chrome") > -1){
                return "chrome";
            } else if(userAgent.indexOf("safari") > -1){
                return "safari";
            } else if(userAgent.indexOf("msie") > -1 || navigator.appVersion.indexOf('Trident/') > 0){
                return "ie";
            } else if(userAgent.indexOf("firefox") > -1){
                return "firefox";
            } else {
                return userAgent;
            }
    };

    var getActiveXObject = function(name) {
        try { return new ActiveXObject(name); } catch(e) {return null;}
    };

    var getNavigatorPlugin = function(name) {
        for(key in navigator.plugins) {
            var plugin = navigator.plugins[key];
            if(plugin.name == name) return plugin;
        }
    };

    var getPDFPlugin = function() {
        return this.plugin = this.plugin || function() {
            if(getBrowserName() == 'ie') {
                return getActiveXObject('AcroPDF.PDF') || getActiveXObject('PDF.PdfCtrl');
            }
        }();
    };

    var isAcrobatInstalled = function() {
        return !!getPDFPlugin();
    };

    var getAcrobatVersion = function() {
        try {
            var plugin = getPDFPlugin();

            if(getBrowserName() == 'ie') {
                var versions = plugin.GetVersions().split(',');
                var latest = versions[0].split('=');
                return parseFloat(latest[1]);
            }

            if(plugin.version) return parseInt(plugin.version);
            return plugin.name
        }
        catch(e) {
            return null;
        }
    }
    return {
        browser: getBrowserName(),
        acrobat: isAcrobatInstalled() ? 'installed' : false,
        acrobatVersion: getAcrobatVersion()
    };
};

//페이징 넣을곳, 페이징객체, 현재페이지번호, 조회함수
function gfn_pagination(paging, paginationInfo, fnSearch, renderType){
    if(renderType == null){
        renderType = "next";
    }
    var contextPath = "";
    if(typeof _contextPath === 'undefined'){
        var url = location.href;
        var pathArray = url.split('/');
        contextPath = "/"+pathArray[3];
    }else{
        contextPath = _contextPath;
    }
    paginationInfo.fnSearch = fnSearch;
    paginationInfo.renderType = renderType;
    var request = ComLib.ajaxReqObj(contextPath+"/common/getRenderPaging.do", paginationInfo, false);
    request.done(function (responseObj, statusText, xhr) {
        paging.empty();
        paging.append(responseObj.contents);
    });
}
//프린팅 객체 ex) gfn_print($("#addrpopup"));
function gfn_print(id){
    id.print({"mediaPrint":true});
}

//다운로드클릭시 정보
function gfn_downloadAttFile(fileInfo){
    var token = $("meta[name='_csrf']").attr("content");
    var url = "/cm/common/myDriveFileDownload.do?param="+encodeURIComponent(JsonLib.stringify(fileInfo))+"&_csrf="+token;
    var ret = new FormLib.Form().createForm("commonfileDownload", url, "POST", "", "_blank").addBody();
    ret.form.submit();
    ret.removeForm();
}

//다운로드클릭시 정보
function gfn_downloadAttFile2nd(encAthflSeq, atchFsno){
    var token = $("meta[name='_csrf']").attr("content");
    var url = "/cm/common/myDriveFileDownload2nd.do?encAthflSeq="+encodeURIComponent(encAthflSeq)+"&_csrf="+token+"&atchFsno="+atchFsno;
    var ret = new FormLib.Form().createForm("commonfileDownload", url, "POST", "", "_blank").addBody();
    ret.form.submit();
    ret.removeForm();
}

//다운로드클릭시 정보
function gfn_downloadAttFile3nd(encAthflSeq, atchFsno){
    var token = $("meta[name='_csrf']").attr("content");
    var url = "/cm/common/fileDownload3nd.do?encAthflSeq="+encodeURIComponent(encAthflSeq)+"&_csrf="+token+"&atchFsno="+atchFsno;
    var ret = new FormLib.Form().createForm("commonfileDownload", url, "POST", "", "_blank").addBody();
    ret.form.submit();
    ret.removeForm();
}

//숏url
function gfn_shortUrl(a,b,c,title) {
    var send = {};
    send["realUrlaCn"]=this.location.pathname+this.location.search;
    send["sysSecd"]=b;
    send["prgmId"]=c;

    var _request = ComLib.ajaxReqObj("/cm/z/z/0123/selectSUrl.do", send, false);
    _request.done(function(responseObj, statusText, xhr) {

        var sUrl = responseObj.sUrl;
        if(sUrl != null && sUrl != ""){

            if(a =="twiter"){ //트위터
                var url = "http://twitter.com/share?url=" + sUrl + "&text=" + encodeURIComponent(title);
                PopLib.openPup(url, "twiterpopup","350","500","yes");
            }else if(a =="face"){//페이스북
                var url = "http://www.facebook.com/sharer.php?s=100&p[url]="+sUrl+"&p[title]="+encodeURIComponent(title);
                PopLib.openPup(url, "facebookpopup","626","436","yes");
            }
        }

    });
};
//텍스트 카피
function gfn_copyToClipboard(txt){
    function handler(event){
        event.clipboardData.setData('text/plain',txt);
        event.preventDefault();
        document.removeEventListener('copy',handler,true);
    }
    document.addEventListener('copy',handler,true);
    document.execCommand('copy');
}

//모바일 select 박스 선택
function gfn_linkValue(_me){
    var _target = $(_me).data("link");
    var _targetVal = $(_me).data("selval");
    $("#"+_target).val(_targetVal);
}

/**
 * F: 고용보험 민원접수증을 출력한다.
 * @param {String} contextPath 각 시스템 Path
 * @return {String} formName formName
 *                          해당 폼에는 cvplRqutRcno <!-- 고용24민원접수번호 -->
 *                                           cvplRceptNo <!-- ASIS 민원접수번호 --> 가 필수로 있어야 함.
  * @return {String} cvplName 민원명
 */
function gfn_CommonCvplRceptTkitPrntng(contextPath,formName,cvplName){
    var now = moment().format("YYYY년 MM월 DD일  hh시 mm분 ss초");
    var request = ComLib.ajaxReqObj(contextPath+"/common/retrieveCommonCvplRceptTkitPrntng.do", formName);
    request.done(function(responseObj, statusText, xhr) {
        var cvplRceptTkit = responseObj.cvplRceptTkit;
        var ofcsAtchInfo = responseObj.ofcsAtchInfo;
        var now = moment().format("YYYY년 MM월 DD일  hh시 mm분 ss초");
        if(cvplRceptTkit == null) {
            alert("출력할 데이터가 없습니다.");
            return false;
        }
        var rptData = {
                  "printDay" : "출력일자 : " + now + " / "+ cvplRceptTkit.cstmrNm //출력일자 / 신청자명
                , "examrqRceptNo" : responseObj.cvplRqutRcno //접수번호
                , "cvplFormatCdNm" : cvplName //민원명
                , "cstmrNm" : cvplRceptTkit.cstmrNm //성명
                , "insttNm" : cvplRceptTkit.insttNm //관할센터/지사
                , "insttTelno" : ComLib.nvl(cvplRceptTkit.telno,"") //대표전화
                , "insttFxnum" : ComLib.nvl(cvplRceptTkit.fxnum,"") //팩스
                , "insttAddr" : "("+ cvplRceptTkit.insttZip +")"+ cvplRceptTkit.insttAdres//주소
                , "examrqDe" : cvplRceptTkit.cvplRceptDe //접수일시
                , "empNm" : cvplRceptTkit.empNm //담당자
                , "nstOfsn": cvplRceptTkit.insttIstdr //청
                , "imgUrl" : location.origin+"/cm/common/myDriveFileDownload2ndView.do?encAthflSeq="+ofcsAtchInfo.athflSeq+"&atchFsno="+ofcsAtchInfo.atchFsno
        };
        var report = new RptLib.report( "접수증", "hp", "/cm/mrd/d/a/hpcmda0120r01.mrd" );
        report.setPopupYn("Y");
        report.setPopupOpt("1200","800","yes"); //가로,세로,스롤
        report.setParamObj(rptData);
        report.refresh();
    });

};

// 전화번호 tel2 tel3 분리 8자리 숫자만 입력 By SJR
var TelLib = {};
TelLib.setHpTelViewer = function(selector){
    //최대 입력 8자리
    $(selector).prop('maxlength', 8);

    //입력값 tel2 tel3 분리
    $(selector).each(function(idx, el){
        let $trgEl = $(el);
        let trgId = $trgEl.prop('id');

        $('#'+trgId).after('<input type="hidden" id="'+trgId+'3" name="'+trgId+'3" value="">');
        $('#'+trgId).after('<input type="hidden" id="'+trgId+'2" name="'+trgId+'2" value="">');
		if($('#'+trgId).prop('readonly') === false){
			$('#'+trgId).after('<button type="reset" class="ico16_delete"><span class="blind">삭제</span></button>');
		}

        $trgEl.prop('id', trgId + '_view');
		$trgEl.prop('name', trgId + '_view');

        let viewVal = $('#'+trgId+'_view').val();
        if(viewVal != null){
            let tel3 = viewVal.slice(-4, viewVal.length);
            let tel2 = viewVal.slice(0, viewVal.length - tel3.length);

            $('input[name='+trgId+'3]').val(tel3);
            $('input[name='+trgId+'2]').val(tel2);
        }
    });

    //변경값 tel2 tel3 셋팅 + 숫자만 입력
    $(selector).on('keyup',function(event){
        let $trg = $(this);
        let viewId = $trg.prop('id');
        let viewVal = $trg.val();

        if((event.key >= 0 && event.key <= 9) || event.key == 'Delete' || event.key == 'Backspace'){
            let tel3 = '';
            let tel2 = '';

            if(viewVal.length <= 4){
                tel2 = viewVal;
            } else if(viewVal.length >= 5 && viewVal.length < 7){
                tel3 = viewVal.slice(-4, viewVal.length);
                tel2 = viewVal.slice(0, viewVal.length - tel3.length);
            } else if(viewVal.length >= 7){
                tel3 = viewVal.slice(-4, viewVal.length);
                tel2 = viewVal.slice(0, viewVal.length - tel3.length);
            }

            let trgId = viewId.substr(0, viewId.indexOf('_view'));
            $('input[name='+trgId+'3]').val(tel3);
            $('input[name='+trgId+'2]').val(tel2);
        } else {
            $('#'+viewId).val(viewVal.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
        }
    });

    //전화번호를 스크립트에서 입력 받은 경우
    //ex) $('#bplcTelno_view').val(obj.bplcTelno2+obj.bplcTelno3).change();
    //change 이밴트 발생시키면 setting 됨
    $(selector).on('change', function(){
        let $trg = $(this);
        let viewId = $trg.prop('id');
        let viewVal = $trg.val();

        let tel3 = viewVal.slice(-4, viewVal.length);
        let tel2 = viewVal.slice(0, viewVal.length - tel3.length);

        let trgId = viewId.substr(0, viewId.indexOf('_view'));
        $('input[name='+trgId+'3]').val(tel3);
        $('input[name='+trgId+'2]').val(tel2);

    });
}

ComLib.fileInit = function(src) {
    // 파일다운로드
    var iframeFiledown$ = $("#iframeFiledown");
    if (iframeFiledown$.length < 1) {
        iframeFiledown$ = $('<iframe id="iframeFiledown" title="빈 프레임" style="display:none;"></iframe>').prependTo("body");
    }
    if( src != null ){
        $("#iframeFiledown").prop("src", src);
    }
}


var PwdLib = {};

PwdLib.validationPwdChk = function (targetId,chkCnt) {
	var flag = true;
	var cnt = 0 ;
	var targetValue = document.getElementById(targetId).value;
	var regExp1 = /[a-zA-Z]/;
	var regExp2 = /[0-9]/;

	//var regExp3 = /[`~!@#$%\^&*\(\)\-\_\+\=\|\\{\}\[\]\;\:\'\",\<\.\>\/\?]/;
	var regExp3 = /[~pw!@#$%&*\(\)\+\=\|{\}\;\:\",\<\.\>\/\?]/;

	if(regExp1.test(targetValue))cnt++;
	if(regExp2.test(targetValue))cnt++;
	if(regExp3.test(targetValue))cnt++;

	if(cnt < chkCnt)
	{
		flag = false;
		//비밀번호는 영문(대/소문자)과 숫자, 특수문자 중 3가지 이상의 종류로 조합하여 8~24자 이내로 입력하세요.
	}
	return flag;
}

/****************************************************************************************************************/
/**  String에 쓸 수 있는 라이브러리
/****************************************************************************************************************/
var StrLib = {};
//StrLib.isNull	해당 변수가 null인지 체크해줌(String전용)
StrLib.isNull = function (str) {
    if (new String(str).valueOf() == "undefined") return true;
    if (str == null) return true;
    var v_ChkStr = new String(str);
    if ("x"+str == "xNaN") return true;
    if( v_ChkStr.valueOf() == "undefined" ) return true;
    if( v_ChkStr.valueOf() == "none" ) return true;
    if (v_ChkStr == null) return true;
    if (v_ChkStr.toString().length == 0 ) return true;
    return false;
}

//StrLib.trimSpecialChar 특수문자를 제외시킴
StrLib.trimSpecialChar = function (str){
	if(StrLib.isNull(str))
		return str;
	str = str.replace(/[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi,"");
	return str;
}

