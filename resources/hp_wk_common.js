var WkComLib = {};

// 디바이스 체크(true : 모바일기기, false : 모바일이 아닐때)
var device = navigator.userAgent;
if(device.indexOf("iPhone") > 0 || device.indexOf("iPod") > 0 || device.indexOf("iPad") > 0 || device.indexOf("Android")>0){
    isMobile = true;
}else{
    isMobile = false;
}

/**
 * 직종찾기 팝업 호출
 *
 * @param callBackFunction
 */
WkComLib.openJobFindPopup = function (callBackFunction, type, self) {
    var oCallBackFunction = "";
    var param = {
        pageType : 0,
        type : type
    }
    if (callBackFunction == undefined || callBackFunction == null || callBackFunction == "") {
        oCallBackFunction = "WkComLib.openJobFindPopupCallBack";
    } else {
        oCallBackFunction = callBackFunction;
    }

	ComFnLib.fn_openLayerPopup('wk-jobs-search', '/wk/l/b/1100/PopJobsSrchList.do', param, oCallBackFunction);

	// Layer 팝업 오픈 후 Focus(웹접근성)
	(function focusLayer() {
		var target = $("#layer_dialog").find(":focusable").eq(0);
		if (target.length > 0) {
			target.focus();
			$("#layer_dialog").find(".closed").click(function() {
				self.focus();
			});
			return;
		}
		requestAnimationFrame(focusLayer);
	})();
}

/**
 * 직종찾기 팝업 호출 CallBack 예제
 *
 * @param jobsCd
 */
// 직종찾기 팝업 호출 CallBack 예제
WkComLib.openJobFindPopupCallBack = function (jobsCd) {
    console.log(jobsCd.jobsCdDepth1 + ' -> ' + jobsCd.jobsCdNmDepth1);
    console.log(jobsCd.jobsCdDepth2 + ' -> ' + jobsCd.jobsCdNmDepth2);
    console.log(jobsCd.jobsCdDepth3 + ' -> ' + jobsCd.jobsCdNmDepth3);
}

/**
 * 전공찾기 팝업 호출
 *
 * @param callBackFunction
 * @param pageType 전공만 필요 할 경우 1
 */
WkComLib.openMajorFindPopup = function (callBackFunction,pageType,pageName) {
    var oCallBackFunction = "";
    window.pageType = pageType
    window.pageName = pageName

    if (callBackFunction == undefined || callBackFunction == null || callBackFunction == "") {
        oCallBackFunction = "WkComLib.openMajorFindPopupCallBack";

    } else {
        oCallBackFunction = callBackFunction;
    }

    ComFnLib.fn_openLayerPopup('wk-major-search', '/wk/p/a/1300/PopMaJorMultiSearchList.do', {}, oCallBackFunction);
}

/**
 * 전공찾기 팝업 호출 CallBack 예제
 *
 * @param majorCd
 */
// 전공찾기 팝업 호출 CallBack 예제
WkComLib.openMajorFindPopupCallBack = function (majorCd) {
    console.log('전공', majorCd[0].firstCode + ' -> ' + majorCd[0].firstName);
    console.log('부전공', majorCd[0].secondCode + ' -> ' + majorCd[0].secondName);
    console.log('복수전공', majorCd[0].thirdCode + ' -> ' + majorCd[0].thirdName);
    console.log('이중전공', majorCd[0].fourthCode + ' -> ' + majorCd[0].fourthName);
};

/**
 * 자격증찾기 팝업 호출
 *
 * @param callBackFunction 콜백함수
 */
WkComLib.openLicenseFindPopup = function (callBackFunction, self) {
    var oCallBackFunction = "";

    if (callBackFunction == undefined || callBackFunction == null || callBackFunction == "") {
        oCallBackFunction = "WkComLib.openLicenseFindPopupCallBack";
    } else {
        oCallBackFunction = callBackFunction;
    }

    ComFnLib.fn_openLayerPopup('wk-license-find', '/wk/p/a/1300/PopCertLicSrchList.do', {}, oCallBackFunction);

	//Layer 팝업 오픈 시 Focus 처리(웹접근성)
	(function focusLayer() {
		var target = $("#layer_dialog").find(":focusable").eq(0);
		if (target.length > 0) {
			target.focus();
			$("#layer_dialog").find(".closed").click(function() {
				self.focus();
			});
			return;
		}
		requestAnimationFrame(focusLayer);
	})();
}

/**
 * 업종찾기 팝업 호출
 *
 * @param callBackFunction
 */
WkComLib.opentpPopUpPopup = function (callBackFunction) {
    var oCallBackFunction = "";
    if (callBackFunction == undefined || callBackFunction == null || callBackFunction == "") {
        oCallBackFunction = "WkComLib.opentpPopUpPopupCallBack";
    } else {
        oCallBackFunction = callBackFunction;
    }

ComFnLib.fn_openLayerPopup('tpPopUp', '/wk/p/a/1300/registerResumeView.do', {}, oCallBackFunction);
}

/**
 * 직종찾기 팝업 호출 CallBack 예제
 *
 * @param jobsCd
 */
// 직종찾기 팝업 호출 CallBack 예제
WkComLib.openJobFindPopupCallBack = function (jobsCd) {
    console.log(jobsCd.jobsCdDepth1 + ' -> ' + jobsCd.jobsCdNmDepth1);
    console.log(jobsCd.jobsCdDepth2 + ' -> ' + jobsCd.jobsCdNmDepth2);
    console.log(jobsCd.jobsCdDepth3 + ' -> ' + jobsCd.jobsCdNmDepth3);
}

/**
 * 자격증찾기 팝업 호출 콜백 예제
 *
 * @param licenseCd 자격증코드
 */
WkComLib.openLicenseFindPopupCallBack = function (licenseCd) {
    console.log(licenseCd[0].code + ' -> ' + licenseCd[0].name);
}

WkComLib.opentpPopUpPopupCallBack = function (obj) {
    console.log(obj);
}

/**
 * 시도 목록을 가지고 와서 설정합니다.
 *
 * @param sidoId 시도 select id.
 */
WkComLib.getSidoList = function (sidoId) {
    var data = {gubun :'region', detailCd : '' };
    var request = ComLib.ajaxReqObj("/wk/p/b/1141/selectCommonCodeListAjax.do", data);

    request.done(function (res, statusText, xhr) {
        var result = res.awardRptList;

        $("#" + sidoId).empty();
        $("#" + sidoId).append("<option value=\"\">--- 시도 ---</option>");
        for (var i = 0; i < result.length; i++) {
            var detailCd = result[i].detailCd;
            var cdKorNm = result[i].cdKorNm;

            if (detailCd.substring(2,5) == "000" && detailCd != '00000000' && detailCd != '00000') {
                var html = "<option value='" + detailCd + "'>" + cdKorNm + "</option>";
                $("#" + sidoId).append(html);
            }
        }
    });
}

/**
 * 시도코드에 맞는 시군구 목록을 가지고 와서 설정합니다.
 *
 * @param obj this
 * @param sigunguId 시군구 selectbox id
 */
WkComLib.getSigunguList = function (obj, sigunguId) {
    if (obj.value != "") {
        var data = {gubun: 'region', detailCd: obj.value};
        var request = ComLib.ajaxReqObj("/wk/p/b/1141/selectCommonCodeListAjax.do", data);

        request.done(function (res, statusText, xhr) {
            var result = res.awardRptList;

            $("#" + sigunguId).empty();
            $("#" + sigunguId).append("<option value=\"\">--- 시군구 ---</option>");
            for (var i = 1; i < result.length; i++) {
                var detailCd = result[i].detailCd;
                var cdKorNm = result[i].cdKorNm;

                var html = "<option value='" + detailCd + "'>" + cdKorNm + "</option>";
                $("#" + sigunguId).append(html);
            }
        });
    } else {
        $("#" + sigunguId).empty();
        $("#" + sigunguId).append("<option value=\"\">--- 시군구 ---</option>");
    }
}

/**
 * 문자열 바이트 길이를 반환합니다. (UTF-8 인코딩 기준)
 * @param str 길이를 검사할 문자열
 * @return int 문자열 바이트 길이
 */
WkComLib.getByteLength = function (str) {
	var b;
	var i;
	for(b=i=0;c=str.charAt(i++);) {
		if (c == '\n') {
			b += 2;
		} else if (c == '<' || c == '>' || c == '≠' || c == '≤' || c == '≥' || c == 'μ') {
			b += 4;
		} else if (c == '®') {
			b += 5;
		} else if (c == '\'' || c == '"' || c == '•' || c == '⇒' || c == '⇔' || c == '§' || c == '→' || c == '←' || c == '↑' || c == '↓' || c == '↔' || c == '¶') {
			b += 6;
		} else if (c == '×' || c == '√' || c == '´' || c == '♣' || c == '‘' || c == '’'  || c == '“' || c == '”'  || c == '′'  || c == '″') {
			b += 7;
		} else if (c == '·' || c == '±' || c == '÷' || c == '…' || c == '♠'  || c == '♥' || c == '†'  || c == '†') {
			b += 8;
		} else if(escape(c).length > 4) {
			b += 3;
		} else {
			b += 1;
		}
	};
	return b;
}

/**
 * 문자열의 시작부터 지정한 바이트 길이까지 문자열을 반환합니다. (UTF-8 인코딩 기준)
 * 문자열의 최소 길이가 지정한 바이트 길이보다 큰 경우 빈 문자열을 반환합니다.
 * @param str substring 할 문자열
 * @param maxByteLength byte길이
 * @return string 문자열
 */
WkComLib.substringByBytes = function (str, maxByteLength) {
	var b;
	var c;
	for (b = i = 0; c = str.charAt(i++);) {
		if (c == '\n') {
			b += 2;
		} else if (c == '<' || c == '>' || c == '≠' || c == '≤' || c == '≥' || c == 'μ') {
			b += 4;
		} else if (c == '®') {
			b += 5;
		} else if (c == '\'' || c == '"' || c == '•' || c == '⇒' || c == '⇔' || c == '§' || c == '→' || c == '←' || c == '↑' || c == '↓' || c == '↔' || c == '¶') {
			b += 6;
		} else if (c == '×' || c == '√' || c == '´' || c == '♣' || c == '‘' || c == '’'  || c == '“' || c == '”'  || c == '′'  || c == '″') {
			b += 7;
		} else if (c == '·' || c == '±' || c == '÷' || c == '…' || c == '♠'  || c == '♥' || c == '†'  || c == '†') {
			b += 8;
		} else if(escape(c).length > 4) {
			b += 3;
		} else {
			b += 1;
		}
		if(b > maxByteLength) {
			break;
		}
	}
	return str.substring(0, i - 1);
}

/**
 * 문자열의 시작부터 지정한 바이트 길이까지 문자열을 반환합니다. (UTF-8 인코딩 기준)
 * 문자열의 최소 길이가 지정한 바이트 길이보다 큰 경우 빈 문자열을 반환합니다.
 * @param item textarea ID
 * @param limitByte 제한 byte 최대 값
 * @return string 문자열
 */
WkComLib.byteChecker = function (item,limitByte){
    var $this = $('textarea[id='+item.id+']')
    var _thisLimitByte = limitByte;
    var text = item.value;
    var currentByte = WkComLib.getByteLength(text);
    if (currentByte > _thisLimitByte) {
        item.value = WkComLib.substringByBytes(text, _thisLimitByte);
    }
    if (isMobile) {
        $this.parent().parent().find('span').text(currentByte)
    } else {
        $this.parent().find('span').text(currentByte)
    }

}

WkComLib.addHyphen = function (num,leng){
    if(!num) return "";
    var formatNum = '';
    num=num.replace(/\s/gi,"");
    switch(leng){
        case 6 :
        try{
            if(num.length==6){
                formatNum = num.replace(/(\d{4})(\d{2})/,'$1-$2');
            }
        }
        catch(e){
                formatNum = num;
                // console.log(e);
        }
        break;

        case 8 :
        try{
            if(num.length==8){
                formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');
            }
        }
        catch(e){
                formatNum = num;
                // console.log(e);
        }
        break;

    }

        return formatNum;
}

/**
 * 숫자 단위를 한글로 변환합니다. 백조 단위까지 입력 가능합니다.
 * @param strMoney 변환할 숫자
 * @param addMoney strMoney를 곱절할 값.
 * @return string 문자열.
 * 예: WkComLib.korNumberUnitConverter (5, 10000) => "오만"
 */
WkComLib.korNumberUnitConverter = function(strMoney, addMoney){
	arrayNum=new Array("","일","이","삼","사","오","육","칠","팔","구");
	arrayUnit=new Array("","십","백","천","만 ","십만 ","백만 ","천만 ","억 ","십억 ","백억 ","천억 ","조 ","십조 ","백조");
	arrayStr= new Array();

	iMoney = (addMoney != 0)? (strMoney*addMoney).toString():(strMoney*1).toString();
	len = iMoney.length;
	hanStr = "";
	for(var i=0;i<len;i++) { arrayStr[i] = iMoney.substr(i,1); }
	code = len;
	for(var i=0;i<len;i++) {
		code--;
		tmpUnit = "";
		if(arrayNum[arrayStr[i]] != ""){
			tmpUnit = arrayUnit[code];
			if(code>4) {
				if(( Math.floor(code/4) == Math.floor((code-1)/4) && arrayNum[arrayStr[i+1]] != "")
				|| ( Math.floor(code/4) == Math.floor((code-2)/4) && arrayNum[arrayStr[i+2]] != "")) {
					tmpUnit=arrayUnit[code].substr(0,1);
				}
			}
		}
		hanStr +=  arrayNum[arrayStr[i]]+tmpUnit;
	}
	return hanStr;
};

/**
 * 기업정보 팝업(hpwkpb1141p03)을 호출합니다.
 * @param busino 사업자등록번호(필수값. '-' 없이 숫자만 입력합니다.)
 * @param popupAreaSelector (모바일만 사용)팝업을 출력할 영역 선택자 (ex: "#layer01")
 * @param redirectUrl
 */
WkComLib.openCorpInfoPopup = function(busino, popupAreaSelector, redirectUrl) {
	if (!busino) return false;
	else if (!/^\d{10}$/.test(busino)) return false;
	var popupParameter = {
		busino : busino
	  , redirectUrl : redirectUrl
	};

	var popupUrl = "/wk/p/b/1141/corpInfoDetail.do";

	//if (!ComLib.isEmpty(redirectUrl))
	//	popupUrl += "?redirectUrl="+redirectUrl;


	if (!ComLib.mobileDeviceYn()) {
		ComFnLib.fn_openLayerPopup("hpwkpb1141p03", popupUrl, popupParameter);
		return null;
	} else {
		return new ComFnLib.fn_m_openLayerPopup($(popupAreaSelector), popupUrl, popupParameter);
	}
}

/**
 * 모바일 팝업 Close.
 */

WkComLib.closePopupMobile = function(){
    $('#layer01').fadeOut()
}

$(document).ready(function() {
    var vKey= 86;
    var aKey= 65;
    var cKey= 67;
    var backSpaceKey= 8;
    var deleteKey = 46;
    var hyphenKey = 189;
    var hyphenNumKey = 109;
    var tabKey = 9;
    var leftKey = 37;
    var rightKey = 39;
    var enterKey = 13;

    $(".only-number").on("keydown", function(e) {
        if (
            !(
                (e.keyCode >= 48 && e.keyCode <= 57) // 숫자
                || (e.keyCode >= 96 && e.keyCode <= 105) // 숫자(Num)
                || (e.ctrlKey && e.keyCode == vKey) // ctrl + v
                || (e.ctrlKey && e.keyCode == aKey) // ctrl + a
                || (e.ctrlKey && e.keyCode == cKey) // ctrl + c
                || (e.keyCode == backSpaceKey) // Backspace
                || (e.keyCode == deleteKey) // delete
                || (e.keyCode == tabKey) // tab
                || (e.keyCode == leftKey) // 왼쪽방향키
                || (e.keyCode == rightKey) // 오른쪽방향키
                || (e.keyCode == enterKey) // 엔터
            )
        ) {
            e.preventDefault();
        }
    });

    $(".only-number").on("keyup", function(e) {
        if (e.keyCode == backSpaceKey) {
            e.stopPropagation();
        } else {
            var orgVal = $(this).val();
            var regex = /[^0-9]/g;
            var replaceVal = orgVal.replace(regex, "");
            $(this).val(replaceVal);
        }
    });

    $(".hpNo").on("keyup", function (e) {
        var hpno = $(this).val().replace(/-/gi, "");

        if (e.keyCode == backSpaceKey) {
            e.stopPropagation();
        } else {
            if (hpno.length >= 3) {
                if (hpno.substring(0,3) != "010"
                    && hpno.substring(0,3) != "011"
                    && hpno.substring(0,3) != "016"
                    && hpno.substring(0,3) != "017"
                    && hpno.substring(0,3) != "018"
                    && hpno.substring(0,3) != "019") {
                    alert("휴대전화 번호를 확인 바랍니다.");
                    $(this).val("");
                    return;
                }
            }
            if (hpno.length >= 3) {
                $(this).val(hpno.substring(0,3) + "-" + hpno.substring(3, hpno.length));
            }

            if (hpno.length >= 7) {
                $(this).val(hpno.substring(0,3) + "-" + hpno.substring(3,7) + "-" + hpno.substring(7, hpno.length));
            }

            if (hpno.length >= 11) {
                $(this).val(hpno.substring(0,3) + "-" + hpno.substring(3,7) + "-" + hpno.substring(7,11));
            }
        }
    });

    $(".input_txt").on("keyup", function() {
        WkComLib.errorViewRemove($(this));
    });
});

/**
 * 오늘 본 채용정보 쿠키 문자열 생성
 * @param companyNm 기업명(필수)
 * @param title 채용제목(필수)
 * @param infoTypeNm 채용정보 제공처(필수)
 * @param wantedAuthNo 채용인증번호(필수)
 * @param workRegion 기업 주소
 * @param untilEmpWantedYn 채용마감시까지("Y" 또는 "N")
 * @param receiptCloseDt 채용마감일
 * @return 쿠키에 저장할 문자열. uriEncoding 되지 않음.
 */
WkComLib.getEmpInfoCookieString = function (companyNm, title, infoTypeNm, wantedAuthNo, workRegion, untilEmpWantedYn, receiptCloseDt) {
	var p1 = companyNm;
	var p2 = title;
	var p3 = (workRegion) ? workRegion : "";
	var p4 = null;
	if (untilEmpWantedYn === "Y") p4 = "채용시까지<br/>(인증일로부터 최대 2개월 이내";
	else p4 = (receiptCloseDt) ? receiptCloseDt : "";
	var p5 = wantedAuthNo;
	var p6 = "wantedAuthNo=" + wantedAuthNo;
	var p7 = infoTypeNm;
	var cookieValueArr = [p1, p2, p3, p4, p5, p6, p7];
	return cookieValueArr.join("^");
}

/**
 * 오늘 본 채용정보 쿠키 저장. 쿠키 key는 "todayCheyoungJobyoung"
 * 쿠키 값 길이를 700 byte로 제한함. 780 byte 이상일 경우 request header is too large 에러 발생.
 * @param newCookieString 저장할 쿠키 문자열(uriEncoding 되지 않은 상태로)
 * @param delimiter 쿠키 문자열 구분자 (기본값 '$')
 * @return 쿠키 추가 여부 (true = 저장됨, false = 저장되지 않음(중복된 데이터))
 */
WkComLib.addEmpInfoCookie = function (newCookieString, delimiter) {
	var cookieString = ComCookie.get("todayCheyoungJobyoung");
	var delimiterVal = (delimiter) ? delimiter : "$";
	var empInfoHistArray = (cookieString) ? cookieString.split(delimiterVal) : [];
	empInfoHistArray = empInfoHistArray.map(
			e=>{return {cookieValue:e, cookieLength:ComLib.calCharLen(encodeURIComponent(e))}}
		);
	var isDuplicated = empInfoHistArray.filter(e=>{return e.cookieValue === newCookieString});
	if (isDuplicated.length > 0) return false;
	empInfoHistArray.push(
			{cookieValue:newCookieString, cookieLength:ComLib.calCharLen(encodeURIComponent(newCookieString))}
		);
	while (true) {
		var cookieStringLength = ComLib.calCharLen(encodeURIComponent(empInfoHistArray.map(e=>e.cookieValue).join("$")));
		if (cookieStringLength > 700) empInfoHistArray = empInfoHistArray.slice(1);
		else break;
	}
	ComCookie.set("todayCheyoungJobyoung", empInfoHistArray.map(e=>e.cookieValue).join(delimiterVal));
	return true;
}

/**
 * -가 없는 휴대전화번호 입력 시 옳바른 형식의 휴대전화번호인지 식별
 *
 * @param phoneNum 휴대전화번호
 * @returns {boolean}
 */
WkComLib.validationPhoneNumber = function (phoneNum) {
    var newPhoneNum = phoneNum.replace(/[^0-9]/g, '');
    var pattern = /^01[0-9]{8,9}$/;
    return pattern.test(newPhoneNum);
}

/**
 * YYYY-M-D 입력 가능한 날짜 유효성 체크 ex) 2023-1-1
 * @returns boolean
 */
WkComLib.isDate = function(date){
    var dateFormat = /[0-9]{4}-[0-9]{2}-(0?[1-9]|[12][0-9]|3[01])/;
    return dateFormat.test(date);
}


WkComLib.dateValid = function(element){
    if(!WkComLib.isDate($(element).val())){
    	$(element).val("");
        $(element).focus();
        alert('유효하지 않는 날짜입니다.')
        return false;
    }

}

WkComLib.dateValidator = function(st,ed){
    if($('input[name='+st+']').val() != '' && $('input[name='+ed+']').val() != ''){
        if(WkComLib.dateValid($('input[name='+st+']').eq(0)) == false) {
            $('input[name='+st+']').val('')
            return false;
        }
        if(WkComLib.dateValid($('input[name='+ed+']').eq(0)) == false) {
            $('input[name='+ed+']').val('')
            return false;
        }
    }
}

WkComLib.setDateInputToday = function(st,ed){
    if($('input[name='+st+']').val() == '' || $('input[name='+ed+']').val() == '') {
        $('input[name='+st+']').val(DateLib.getToday('YYYY-MM-DD'))
        $('input[name='+ed+']').val(DateLib.getToday('YYYY-MM-DD'))
    }
}

/**
 * 파일 다운로드.
 *
 * @param docId 문서아이디
 * @param path 경로
 * @param docTitle 문서명
 */
WkComLib.fileDownload = function (docId, path, docTitle) {
    var param = {
        "systemId": "WK"
        ,"docId": docId
        ,"path": path
        ,"docTitle": docTitle
    };

    gfn_downloadAttFile(param);
}

/**
 * 지도 팝업
 * @param url 지도팝업URL
 * @param data 필요데이터
 * @returns {boolean}
 */
WkComLib.mapView = function (url, data) {

    if (data.basicAddr == "" && data.basicAddr == null) {
        alert("주소 정보가 옳바르지 않습니다.");
        return false;
    }

    var dialog = $('<div id="layer_dialog" class="box_btn_wrap"></div>');

    $(document.body).append(dialog);

    dialog.load(url, data, function(responseText, textStatus, jqXHR) {
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
        ui.fullPopup();
        ui.dimShow();
        $("#mapPopUp").fadeIn(150).addClass("on");
    });
    return;
}

WkComLib.memberInfoChage = function(type) {
    if (confirm("입력하던 페이지에서 벗어납니다.\n회원정보 수정페이지로 이동하시겠습니까?")) {
        if (type == "C") {
            var url = "/cm/a/a/0220/openEntrMberInfoUpdtPage.do";
        } else  {
            var url = "/cm/a/a/0210/openIndvMberInfoUpdtPage.do";
        }

        window.location.href = url;
    }
}

/**
 * 등록 화면에 오류메시지 추가 input 전에 <div class="cell"> 존재해야함.
 *
 * @param id
 * @param message
 */
WkComLib.errorView = function(id, message) {
    WkComLib.errorViewRemove($("#" + id));
    var obj = document.getElementById(id);
    obj.closest(".cell").classList.add("error");

    var errorElement = document.createElement('p');
    errorElement.classList.add('ipt_txt_error');
    errorElement.innerText = message;

    obj.closest(".cell").after(errorElement);
}

/**
 * 등록 화면에 오류메시지 제거
 *
 * @param id
 */
WkComLib.errorViewRemove = function(obj) {
    if (obj.parent().parent().attr("class") != undefined && obj.parent().parent().attr("class").indexOf("error") > -1) {
        obj.parent().parent().removeClass("error");
        obj.parent().parent().parent().children("p").remove();

    }
}

/**
 *
 * @param obj this
 */
WkComLib.moveScrollTop = function(obj){
    if($(obj).find('.txt').text() == '닫기'){
        if(window.innerHeight > 1080){
            $('html').animate({scrollTop:'230'},300)
        }else{
            $('html').animate({scrollTop:'650'},300)
        }
    }
}

/**
 * 워크넷링크로이동
 *
 * @param obj this
 */
WkComLib.goWkSsoLink = function(url, winName) {
    var targetUrl = ComLib.getSsoLink("WK", url);
    var remote = window.open(targetUrl, winName);
    if (remote != null && remote != undefined) {
        remote.focus();
    }
}

/**
 * 링크이동
 *
 * @param obj this
 */
WkComLib.goLink = function(url, winName) {
    var remote = window.open(url, winName);
    if (remote != null && remote != undefined) {
        remote.focus();
    }
}

/**
 * @description datepicker 내부 함수를 재정의합니다.
 * 1) .ui-datepicker-year, .ui-datepicker-month, .ui-datepicker-prev, .ui-datepicker-next를 선택했을 때 focus를 클릭한 버튼에 유지합니다.
 * (2024.02. 고용24 접근성 개선 관련 조치입니다.)
 * @return (boolean)
 */
WkComLib.retainDatepickerFocus = function () {
	// datepicker plugin이 없는 경우 false return
	if ($.datepicker === undefined || $.datepicker === null) return false;
	$.extend($.datepicker, {
		_attachHandlers: function( inst ) {
			var stepMonths = this._get( inst, "stepMonths" ),
				id = "#" + inst.id.replace( /\\\\/g, "\\" );
			inst.dpDiv.find( "[data-handler]" ).map( function() {
				var handler = {
					prev: function() {
						$.datepicker._adjustDate( id, -stepMonths, "M" );
						inst.dpDiv.find(".ui-datepicker-prev").focus();	// 접근성 수정.
					},
					next: function() {
						$.datepicker._adjustDate( id, +stepMonths, "M" );
						inst.dpDiv.find(".ui-datepicker-next").focus();	// 접근성 수정.
					},
					hide: function() {
						$.datepicker._hideDatepicker();
					},
					today: function() {
						$.datepicker._gotoToday( id );
					},
					selectDay: function() {
						$.datepicker._selectDay( id, +this.getAttribute( "data-month" ), +this.getAttribute( "data-year" ), this );
						return false;
					},
					selectMonth: function() {
						$.datepicker._selectMonthYear( id, this, "M" );
						inst.dpDiv.find(".ui-datepicker-month").focus();	// 접근성 수정.
						return false;
					},
					selectYear: function() {
						$.datepicker._selectMonthYear( id, this, "Y" );
						inst.dpDiv.find(".ui-datepicker-year").focus();	// 접근성 수정.
						return false;
					}
				};
				$( this ).on( this.getAttribute( "data-event" ), handler[ this.getAttribute( "data-handler" ) ] );
			} );
		}
	});
	// tabindex 지정
	$.datepicker.setDefaults({
		onUpdateDatepicker : function(inst){
			inst.dpDiv.find(".ui-datepicker-prev, .ui-datepicker-next").on("keydown", function(e) {
			//inst.dpDiv.find(".ui-datepicker-prev, .ui-datepicker-next").attr("tabindex", "0").on("keydown", function(e) {
				if(e.keyCode == 13) {
					$(this).click();
				}
			});
		}
	});
	return true;
}

/**
 * @description
 * <p>
 *		(pc) layerPopup 호출 후 focus 이동을 해주는 함수를 생성합니다. 팝업 함수를 호출 후 생성된 함수를 호출하는 방법으로 사용합니다.
 * 		예시)
 * 		ComFnLib.fn_openLayerPopup("layerPopupSectionId", popupUrl, parameter);
 * 		WkComLib.layerPopupOpenAndCloseFocus("#layer_dialog #layerPopupSectionId", "#openButtonId")();		// 주의. 반환된 함수를 실행하도록 '()' 해야 작동합니다.
 * </p>
 * @param layerPopupScopeSelector layerPopup scope 선택자를 전달합니다.
 * @param openButtonSelector (optional) layerPopup을 닫은 후에 focus를 이동할 위치의 선택자를 지정합니다. 미지정시 닫은 후 focus이동하지 않습니다.
 * @param focusTargetSelectFunction (optional) layerPopupScopeSelector에서 focus를 지정할 대상을 선택할 함수입니다. parameter는 $(layerPopupScopeSelector)을 전달합니다. 미지정시 가장 상위의 focusable 요소에 focus를 이동합니다.
 * (2024.02. 고용24 접근성 개선 관련 조치입니다.)
 * @return function
 */
WkComLib.layerPopupOpenAndCloseFocus = function (layerPopupScopeSelector, openButtonSelector, focusTargetSelectFunction) {
	if (layerPopupScopeSelector === undefined || layerPopupScopeSelector === null || layerPopupScopeSelector === "") throw "Illegal Argument";
	var start = Date.now();
	if (typeof focusTargetSelectFunction === "function") {
		if (openButtonSelector) {
			return function inner() {
				if ((Date.now() - start) > 5000) return;		// 5초 이내 완료되지 않으면 중단.
				var $target = focusTargetSelectFunction($(layerPopupScopeSelector))
				if ($target.length === 0) $(layerPopupScopeSelector).filter(":focusable").eq(0);
				if ($target.length === 0) $target = $(layerPopupScopeSelector).find(":focusable").eq(0);
				if($target.length > 0) {
					$target.focus();
					$(layerPopupScopeSelector).find(".closed").click(function() {
						setTimeout(function() {
							$(openButtonSelector).focus();
						}, 0);
					});
					return;
				}
				requestAnimationFrame(inner);
			}
		} else {
			return function inner() {
				if ((Date.now() - start) > 5000) return;		// 5초 이내 완료되지 않으면 중단.
				var $target = focusTargetSelectFunction($(layerPopupScopeSelector))
				if ($target.length === 0) $(layerPopupScopeSelector).filter(":focusable").eq(0);
				if ($target.length === 0) $target = $(layerPopupScopeSelector).find(":focusable").eq(0);
				if($target.length > 0) {
					$target.focus();
					return;
				}
				requestAnimationFrame(inner);
			}
		}
	} else {
		if (openButtonSelector) {
			return function inner() {
				if ((Date.now() - start) > 5000) return;		// 5초 이내 완료되지 않으면 중단.
				var $target = $(layerPopupScopeSelector).filter(":focusable").eq(0);
				if ($target.length === 0) $target = $(layerPopupScopeSelector).find(":focusable").eq(0);
				if($target.length > 0) {
					$target.focus();
					$(layerPopupScopeSelector).find(".closed").click(function() {
						setTimeout(function() {
							$(openButtonSelector).focus();
						}, 0);
					});
					return;
				}
				requestAnimationFrame(inner);
			}
		} else {
			return function inner() {
				if ((Date.now() - start) > 5000) return;		// 5초 이내 완료되지 않으면 중단.
				var $target = $(layerPopupScopeSelector).filter(":focusable").eq(0);
				if ($target.length === 0) $target = $(layerPopupScopeSelector).find(":focusable").eq(0);
				if($target.length > 0) {
					$target.focus();
					return;
				}
				requestAnimationFrame(inner);
			}
		}
	}
}