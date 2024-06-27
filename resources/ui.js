/* 《 고용24 공통 UI js 》 */
var ui = {};
//tab
ui.tab = function(){
	$('.tab_title li').on('click', function () {
		var onTab = $(this).attr('aria-controls');

		$(this).parent('.tab_title').children('li').removeClass('active').children('button').attr('aria-selected', false);
		$(this).parent('.tab_title').siblings('.tab_cont').children('.box_tab-contents').removeClass('active').attr({
			'hidden': true
			//, 'tabindex': -1
		});
		$(this).addClass('active').children('button').attr('aria-selected', true);
		$('#' + onTab).addClass('active').attr({
			'hidden': false
			//, 'tabindex': 0
		});
	});
}


// Dim
ui.dimShow = function(){ /* 딤드 show */
	$("body").addClass("dim");
}
ui.dimHide = function(){ /* 딤드 hide */
	$("body").removeClass("dim");
}
ui.fullPopup = function(){ //팝업
	var $openBtn = $(".full_open"),
		$closeBtn = $(".full_pop .closed");

	$('.full_pop').each(function() {
		$(this).attr('tabindex', '0');
	});

	var $btn = null;

	console.log("ui.fullPopup=======================");

	$openBtn.on("click", function(e) { /* 열기 */
		e.preventDefault();
		$btn = $(this);
		var target = $(this).attr("open-full-pop") || e;
		var layer = $(".full_pop" + "." + target);

		console.log("openBtn click ========================", layer);

		if(layer.find('.tab_title').length) {
			layer.addClass('tab_style');
		}
		layer.fadeIn(150).addClass("on");
		layer.focus();
		ui.dimShow();

		var x = layer.find('> .closed');
		x.on('keydown', function() {
			if (window.event.keyCode === 9) {
				layer.focus();
			}
		});

		let timer = setTimeout(function() {
		// 기본 스크립트 실행
		$(".toast_pop").length && ui.toastPop(); //토스트팝업
		$('.btn_form').length && ui.fullText(); // 전문보기
		$(".box_tooltip").length && ui.tooltip(); // 툴팁
		$(".acd").length && ui.accordion(); // 아코디온
		$("table").length && ui.tableCaption(); // 테이블 캡션 넣기
			$(".box_tooltip").length && ui.tooltip();
		}, 200)
	});

	$closeBtn.on("click", function() { /* 닫기 */
		var target= $(this).closest(".full_pop");
		target.fadeOut(150).removeClass("on");
		ui.dimHide();
		$btn = $btn ?? $(this);
		$btn.focus();
	});
}

ui.fullLayerPopup = function(callObjId){ //팝업
	var $openBtn = $(".full_open"),
		$closeBtn = $(".full_pop .closed");

	$('.full_pop').each(function() {
		$(this).attr('tabindex', '0');
	});

	var $btn = callObjId;

	console.log("ui.fullLayerPopup=======================");


	$closeBtn.off('click').on("click", function() { /* 닫기 */
		console.log("close btn =======================");
		var target= $(this).closest(".full_pop");
		target.fadeOut(150).removeClass("on");
		ui.dimHide();
		$btn = $btn ?? $(this);
		$btn.focus();
	});
}

// ui.childPopup = function(pForm){ //팝업
// 	var $openBtn = $("#childLayer_dialog .full_open"),
// 		$closeBtn = $("#childLayer_dialog .full_pop .closed");

// 	$closeBtn.on("click", function() { /* 닫기 */
// 		var target= $(this).closest("#childLayer_dialog .full_pop");
// 		target.fadeOut(150).removeClass("on");
// 		//ui.dimHide();
// 		$("#"+pForm).removeClass("layer_dim");
// 	});
// }

// ui.alertPopup = function(){ //알럿
// 	var $openBtn = $(".btn_alert"),
// 		$closeBtn = $(".alert_pop .closed");

// 	$openBtn.on("click", function(e) { /* 열기 */
// 		e.preventDefault();
// 		var target = $(this).attr("open-layer-class") || e;
// 		$(".alert_pop" + "." + target).fadeIn(150).addClass("on");
// 		ui.dimShow();
// 	});

// 	$closeBtn.on("click", function() { /* 닫기 */
// 		var target= $(this).closest(".alert_pop");
// 		var popOn = $(".alert_pop.on").length;

// 		target.fadeOut(150).removeClass("on");
// 		if(popOn <= 1){ // 팝업 2개 이상 활성화될 경우 dim 닫지 않기
// 			ui.dimHide();
// 		}
// 	});
// };

ui.toastPop = function (){ //토스트팝업
	var $toastBtn = $(".btn_toast"),
		$toast = $(".toast_pop");
		$tostCloseBtn = $(".toast_pop .closed");

	$toastBtn.on("click", function(e){
		e.preventDefault();
		var target = $(this).attr("open-toast-pop") || e;
		$(".toast_pop" + "." + target + "").addClass("active");

		setTimeout(function(){
			$toast.removeClass("active")
		}, 3000);
	});

	$tostCloseBtn.on("click", function() { /* 닫기 */
		$toast.removeClass("active")
	});
}

// 모바일
// ui.bottomSheet = function(){ //바텀시트팝업
// 	var $openBtn = $(".sheet_open"),
// 		$closeBtn = $(".bottom_sheet .closed");

// 	$(".bottom_sheet").css("display", "none");
// 	$openBtn.on("click", function(e) { /* 열기 */
// 		e.preventDefault();
// 		var target = $(this).attr("open-bottom-sheet") || e;
// 		$(".bottom_sheet" + "." + target).slideDown().addClass("on");
// 		ui.dimShow();
// 	});

// 	$closeBtn.on("click", function() { /* 닫기 */
// 		var target= $(this).closest(".bottom_sheet");
// 		target.slideUp().removeClass("on")
// 		ui.dimHide();
// 	});
// }

//전문닫기 토글
ui.fullText = function() {
	$('.btn_form').click(function(){
    var btnForm = $(this).hasClass('active');
    var parentDiv = $(this).parents('div'); // .btn_form의 부모 div 요소를 찾습니다.

    if (!parentDiv.hasClass('cont_tit')) {
        // 만약 .btn_form의 부모 요소에 .cont_tit 클래스가 없다면
        if (btnForm) {
            $(this).removeClass('active');
            $(this).next().removeClass('active');
            $(this).attr('aria-expanded', 'false');
            $(this).text('전문보기');
        } else {
            $(this).addClass('active');
            $(this).next().addClass('active');
            $(this).attr('aria-expanded', 'true');
            $(this).text('전문닫기');
        }
    } else {
        // 만약 .btn_form의 부모 요소에 .cont_tit 클래스가 있다면
        if (btnForm) {
            $(this).removeClass('active');
            $(parentDiv).next().removeClass('active');
            $(this).attr('aria-expanded', 'false');
            $(this).text('자세히보기');
        } else {
            $(this).addClass('active');
            $(parentDiv).next().addClass('active');
            $(this).attr('aria-expanded', 'true');
            $(this).text('자세히보기');
        }
    }
});
}

ui.btnLayer = function() {
	$('.btn_open').off('click').on('click', function(){
		var btnToggle = $(this).hasClass('active');
		if(btnToggle){
			$(this).removeClass('active');
			$(this).next().hide();
			$(this).attr({'aria-expanded':'false','title':'열기'});
		}else{
			$(this).addClass('active');
			$(this).next().show();
			$(this).attr({'aria-expanded':'true','title':'닫기'});
		}
	});
		$('.ui_layer .btn_close').off('click').on('click', function(){
		$(this).closest('.ui_layer').hide().prev('.btn_open').removeClass('active');
	});
}

//툴팁
ui.tooltip = function() {
	$(".box_tooltip [class*='btn']").click(function(){
		var tooltip = $(this).next('.box_help-data').hasClass('active');
		if(tooltip){
			$(this).next('.box_help-data').removeClass('active');
		}else{
			$('.btn_help').next('.box_help-data').removeClass('active');
			$(this).next('.box_help-data').addClass('active');
		}
	});
	$('.tooltip_close').click(function(){
		$(this).parent('.box_help-data').removeClass('active');
	});
}

// onclick용 tooltip
function tooltipBtn(item) {
	item.classList.toggle('active');
}
function tooltipClose(item){
	item.parentElement.previousElementSibling.classList.remove('active');
}

//아코디언
ui.accordion = function() {
	$('.acd_btn').click(function(){
		if($(this).hasClass('acd_open')){
			$(this).removeClass('acd_open');
			$('.acd.slide_type ul > li, .acd_slide').removeClass('on').attr('aria-expanded', 'false');
			$('.acd.slide_type ul > li .acd_cont, .acd_slide .acd_cont').stop().slideUp();
			$(this).find('.txt').text("펼치기");
		} else {
			$(this).addClass('acd_open');
			$('.acd.slide_type ul > li, .acd_slide').addClass('on').attr('aria-expanded', 'true');
			$('.acd.slide_type ul > li .acd_cont, .acd_slide .acd_cont').stop().slideDown();
			$(this).find('.txt').text("접기");
		}
	});
	$('.acd:not(.type03) > ul > li > *:first-child').attr('role', 'button');
	$('.acd:not(.type03) > ul > li > *:first-child').off('click').on('click', function() {
		if($(this).parent().hasClass('on')) {
			$(this).parent().find('.acd_cont').stop().slideUp();
			$(this).attr('aria-expanded', 'true');
			$(this).parent().removeClass('on');
		} else{
			$(this).parent().closest('.acd').find('> ul > li').removeClass('on');
			$(this).parent().closest('.acd').find('> ul > li .acd_cont').stop().slideUp();
			$(this).parent().find('.acd_cont').stop().slideDown();
			$(this).attr('aria-expanded', 'false');
			$(this).parent().addClass('on');
		}
	});
}

// .acd > ul > li > .b1_sb, .acd > ul > li > *:first-child

// 추가 검색조건 열기/닫기
ui.slideMore = function() {
	$('.btn_slide_more').click(function(){
		$(this).attr('role', 'button');
		var _text = $(this).find('.txt');
		var slideBtn = $(this).hasClass('on');
		if(slideBtn){
			$(this).removeClass('on');
			$('.slide_cont').stop(true,true).slideDown();
            $(this).attr('aria-expanded', 'true');
			_text.text('닫기');
		}else{
			$('.slide_cont').stop().slideUp();
			$(this).addClass('on');
            $(this).attr('aria-expanded', 'false');
			_text.text('열기');
		}
	});
}

// table caption 넣기
ui.tableCaption = function() {
	$('table:not(.notCaption)').each(function() {
		var ths = $(this).find('th');

		if(ths.length) {
			var arr = new Array();
			$(this).find('caption').remove();
			ths.each(function(idx, th) {
				arr.push($(th)[0].firstChild.data || $(th).text());
			});
			var captionContents = arr.join();
			var caption = `${captionContents}을(를) 제공하는 표`;
			$(this).prepend(`<caption>${caption}</caption>`);
		}
	});
}

// breadcrumb
ui.breadcrumb = function() {
	var subBtn = $('.location > ul > li.sub > button');
	subBtn.on('click', function() {
		if ($(this).hasClass('on')) {
			$(this).removeClass('on');
			$(this).closest('li').find('.breadcrumb-layer').hide();
		} else {
			subBtn.removeClass('on');
			$(this).addClass('on');
			$('.breadcrumb-layer').hide();
			$(this).closest('li').find('.breadcrumb-layer').show();
		}
	});
}

ui.scrollEvent = function() {
	$('.cont_wrap_area').each(function() {
		const $this = $(this);
		var box = $this.find('.scroll');
		var tabList = $this.find('.tab_title > li');
		var btn = $this.find('.tab_title > li > button');
		tabList.removeClass('active');
		tabList.eq(0).addClass('active');
		$(window).scroll(function() {
			var scroll = $(this).scrollTop();
			if (scroll > 250) {
				$this.find(".tab_title_wrap").addClass("fixed");
			}
			else {
				$this.find(".tab_title_wrap").removeClass("fixed");
			}
			box.each(function(index, item) {
				if (item.getBoundingClientRect().top < 200) {
					tabList.removeClass('active');
					tabList.eq(index).addClass('active');

					if (tabList.eq(2).hasClass('active')){
						$('.floating_bottom_area').addClass("show");
					}
					else {
						$(".floating_bottom_area").removeClass("show");
					}
				}
			});
		});
		btn.off('click').on('click', function() {
			var myIndex = $(this).parent('li').index();
			$('html, body').stop().animate({ scrollTop : (box.eq(myIndex).offset().top) - 189 }, 200);
		});
	});
}

// 퍼블용 include
$(function(){
	var includes = $('[data-include]');
	jQuery.each(includes, function(){
		var file = '/cm/pub/include/' + $(this).data('include') + '.html';
		//$(this).load(file);
	});
});

//프린트
$(document).on("click touchstart", ".lct_btn_print", function(e){
	window.print();
});

//input type reset
$(document).on("click","button[type=reset]",function(e){
	e.preventDefault();
	$(this).prev().val("");
});

$(function(){
	// $(".alert_pop").length && ui.alertPopup(); //알럿
	$(".full_pop").length && ui.fullPopup(); //팝업
	$(".toast_pop").length && ui.toastPop(); //토스트팝업
	$('.btn_form').length && ui.fullText(); // 전문보기
	$(".box_tooltip").length && ui.tooltip(); // 툴팁
	$(".acd").length && ui.accordion(); // 아코디온
	$('.btn_slide_more').length && ui.slideMore(); // 추가 검색조건 열기/닫기
	$('table').length && ui.tableCaption(); // 테이블 캡션넣기
	$('.location').length && ui.breadcrumb(); // breadcrumb 레이어
	$('.btn_open').length && ui.btnLayer(); //  토글버튼

	//즐겨찾기 토글
	$('.lct_btn_fav').click(function(){
		$(this).toggleClass('active');
	});

	//좋아요 토글
	$('.ico24_ui_like').click(function(){
		$(this).toggleClass('active');
	});

	// gnb
	$("#gnb").on({
		mouseover : function(){
			$(this).closest("#header_bottom").addClass("extend");
		},
		mouseleave : function(){
			$(this).closest("#header_bottom").removeClass("extend");
		}
	});

	$("#gnb ul > li > a").focus(function(){
		$(this).closest("#header_bottom").addClass("extend");
	});

	$("#gnb ul > li:last > a").blur(function(){
		$("#header_bottom").removeClass("extend");
	});

	// qucick menu
	$("#quick_menu").on({
		mouseover : function(){
			$(this).addClass("on");
			$(".quick_top").addClass("on");
		},
		mouseleave : function(){
			$(this).removeClass("on");
			$(".quick_top").removeClass("on");
		},
		focusin :  function(){
			$(this).addClass("on");
			$(".quick_top").addClass("on");
		},
		focusout : function(){
			$(this).removeClass("on");
			$(".quick_top").removeClass("on");
		},
	});

	// lnb 2depth
	$('.lnb > ul > li.depth > a').click(function(){
		$(this).attr('role', 'button');
		var depth2 = $(this).hasClass('on');
		if(depth2){
			$(this).removeClass('on');
			$(this).siblings('ul').stop(true,true).slideUp();
            $(this).attr('aria-expanded', 'true');
		}else{
			$('.lnb ul > li.depth > a').removeClass('on');
			$('.lnb ul > li.depth > ul').stop().slideUp();
			$(this).addClass('on');
			$(this).siblings('ul').stop(true,true).slideDown();
            $(this).attr('aria-expanded', 'false');
		}
	});
	// lnb 3depth
	$('.lnb > ul > li.depth > ul > li.depth > a').click(function(){
		$(this).attr('role', 'button');
		var depth3 = $(this).hasClass('on');
		if(depth3){
			$(this).removeClass('on');
			$(this).siblings('ul').stop(true,true).slideUp();
            $(this).attr('aria-expanded', 'true');
		}else{
			$('.lnb ul > li > ul > li.depth > a').removeClass('on');
			$('.lnb ul > li > ul > li.depth > ul').stop().slideUp();
			$(this).addClass('on');
			$(this).siblings('ul').stop(true,true).slideDown();
            $(this).attr('aria-expanded', 'false');
		}
	});

	// 스텝 프로그레스
	$("ul.form_progress > li.on").last().addClass("last-child");

	// 스크롤 이벤트
	$(".tab_title_wrap").length && ui.scrollEvent();

	// file uploading
	$('.box_file_progress > .close').click(function(){
		$('.box_file_progress').removeClass('on');
	});

	$({ val : 0 }).animate({ val : 100 }, {
		duration: 3000,
	   step: function() {
		 $(".progress_num").text(Math.floor(this.val));
	   },
	   complete: function() {
		 $(".progress_num").text(Math.floor(this.val));
		 $(".progress_num").css("color","#4D65E1");
	   }
	});

	$('.expend_btn_td > button').off('click').on('click', function() {
		if ($(this).hasClass('exp')) {
			$(this).parents('tr').nextAll('.expend_tr').hide();
			$(this).find('span').text('펼치기');
			$(this).removeClass('exp');
		} else {
			$(this).parents('tr').nextAll('.expend_tr').show();
			$(this).find('span').text('닫기');
			$(this).addClass('exp');
		}
	});

	$('.expend_ctr_btn .btn_ctr').off('click').on('click', function() {
		if ($(this).hasClass('exp')) {
			$(this).parents('tr').next('.expend_ctr').hide();
			$(this).find('span.blind').text('펼치기');
			$(this).removeClass('exp');
		} else {
			$(this).parents('tr').next('.expend_ctr').show();
			$(this).find('span.blind').text('닫기');
			$(this).addClass('exp');
		}
	});

	$('.btn_expand_section').off('click').on('click', function(){
		if($(this).hasClass('exp')){
			$(this).closest('.expand_section_wrap').find('.expand_content_area').hide();
			$(this).closest('.expand_section_wrap').removeClass('btn_expand_active');
			$(this).removeClass('exp').find('.blind').text('펼치기');
		}else{
			$(this).closest('.expand_section_wrap').find('.expand_content_area').show();
			$(this).closest('.expand_section_wrap').addClass('btn_expand_active');
			$(this).addClass('exp').find('.blind').text('닫기');
		}
	})

	$('.rdo_chk_expand.checked').each(function(){
		if($(this).is(':checked')){
			$(this).closest('.rdo_expand_group').next('.item').show();
			$(this).closest('.cell').next('.expand_check_area').show();
		}else{
			$(this).closest('.rdo_expand_group').next('.item').hide();
			$(this).closest('.cell').next('.expand_check_area').hide();
		}
	});
	$('.rdo_chk_expand').off('click').on('click', function(){
		if($(this).hasClass('checked')){
			$(this).closest('.rdo_expand_group').next('.item').show();
			$(this).closest('.cell').next('.expand_check_area').show();
		}else{
			$(this).closest('.rdo_expand_group').next('.item').hide();
			$(this).closest('.cell').next('.expand_check_area').hide();
		}
	});

	//마이페이지
	$('.my_info_area .mypage_toggle').click(function(){
		$(this).toggleClass('on');
	});

	$('.my_status_area').each(function() {
		const $this = $(this);
		var tabBtn = $this.find('.tab_wrap .tab_title > button');
		var tabCont = $this.find('.tab_wrap .status_cont');

		tabBtn.on('click', function() {
			var index = $(this).index();

			$(this).addClass('active');
			tabBtn.not($(this)).removeClass('active');
			tabCont.removeClass('active');
			tabCont.eq(index).addClass('active');
		});
	});

	// 이직 확인서 제출
	$('.jobs_confirm .confirm').on('click', function() {
		var $this = $(this);
		if ($this.hasClass('type01')) {
			$this.removeClass('type01').addClass('type02').parent().find('.confirm_layer').hide();
		} else if ($this.hasClass('type02')) {
			$this.removeClass('type02').addClass('type01').parent().find('.confirm_layer').show();
		}
	});

	// 검색테이블 리스트
	let boxFormTable = $('article.box_form_content table').filter(function() {
        return $(this).find('input, select').length > 0;
    });

	// 검색테이블 내 caption 삭제
	boxFormTable.find('caption').remove();

	// boxFormTable 리스트 중 검색테이블 내 th를 td.new_th로 변경
	for(let i = 0; i < boxFormTable.length; i++) {
		let th = boxFormTable[i].querySelectorAll('th');

		th.forEach(function(item){
			item.removeAttribute('scope');
			item.classList.add('new_th');
			let thAfter = item.outerHTML.replace("<th", "<td").replace("</th", "</td");
			item.outerHTML = thAfter;
		});
	}

	// tab keyboard action
	$(document).ready(function() {
		const $tabs = $('[role="tab"]');
		$tabs.on('keydown', function(e) {
			if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
				e.preventDefault();

				const currentIndex = $tabs.index(this);
				let nextIndex;

				if(e.key === 'ArrowRight') {
					nextIndex = (currentIndex + 1) % $tabs.length;
				} else {
					nextIndex = (currentIndex - 1 + $tabs.length) % $tabs.length;
				}

				$tabs.eq(nextIndex).focus();
			}
		});
	});

	// input[type="text"] placeholder와 title을 같게
	// let inputText = document.querySelectorAll('input[type="text"][placeholder]:not(:read-only):not(:disabled)');
	// inputText.forEach(function(item){
	// 	let inputTextPh = item.placeholder;
	// 	item.title = inputTextPh;
	// });

	// p태그 중 타이틀 역할인 것을 헤딩태그로 변경(p를 h3로 변경할 때만 가능)
	let pTitle = document.querySelectorAll('p.t2_sb, p.t1_sb, p.t3_sb');
	let uploadTl = document.querySelectorAll('p[class*="upload_tl"]');

	let changePArr = [pTitle, uploadTl]; //변경할 변수 배열

	for(let i = 0; i < changePArr.length; i++) {
		// console.log(changePArr[i]);

		changePArr[i].forEach(function(item){
			item.outerHTML = item.outerHTML.replace("<p", "<h3").replace("</p", "</h3");
		});
	}

	// link title 변경
	let linkText = document.querySelectorAll('a');
	linkText.forEach(function(item) {
		let titleAttr = item.getAttribute('title');
		// 링크에 btn_link class가 있거나 title에 새창이 있을 때 title을 새창 열림으로 변경
		if(item.classList.contains('btn_link') || titleAttr && titleAttr.includes('새창')) {
			if(item.textContent !== "") {
				item.setAttribute('title', '새창 열림');
			}
		} else {
			// 없을땐 title 삭제
			if(item.textContent !== "") {
				item.removeAttribute('title');
			}
		}
	});

	// select title 넣기
	let selectTag = document.querySelectorAll('select:not(label > select)');

	selectTag.forEach(function(item){
		if(!item.title) { //타이틀이 없을 때 작동
			if(item.id) { //아이디가 있을 때 작동
				let label = document.querySelector(`label[for="${item.id}"]`);
				if(!label) { //이어진 라벨이 없으면
					selectTitHanlder();
				}
			} else { //아이디도 없고 타이틀도 없으면
				selectTitHanlder();
			}
		}

		// 셀렉트에 타이틀 넣어주는 함수
		function selectTitHanlder (){
			let titValueArr = [
				/*
				{
					selText: "셀렉트 옵션에 들어가는 단어",
					selTit: '타이틀에 뭐라고 넣을지',
				},
				*/
				{
					selText: "씩", /* 10개씩, 20개씩이 들어간 셀렉트 */
					selTit: '단위를 선택해 주세요.',
				},
			]

			for(let i = 0; i < titValueArr.length; i++) {
				let selectOpTxt = item.querySelector('option').innerText.indexOf(`${titValueArr[i].selText}`);

				if(selectOpTxt > -1) {
					item.title = titValueArr[i].selTit;
					break;
				}
			}
		}
	});
});