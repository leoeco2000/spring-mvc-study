var CourseOverviewModel = Backbone.Model.extend({
	classname : "CourseOverviewModel"
});

var CourseOverviewView = Backbone.View.extend({
	classname : "CourseOverviewView",
	el : "#main",
	dispId : "CourseOver",

	events : {
		// "click button[class=btn_expand_minus]": "btnMinusClick",
		// "click button[class=btn_expand_plus]": "btnPlusClick"

		"click #btn_print_item_setting" : "getCourse",
		"click a" : "getCourse"
	},

	initialize : function(options) {
		this.render();
	},

	render : function() {
		// this.makeList([{targetModel:this.model, targetId:"#wrapper"}]);
		// this.autoGet({targetModel:this.model, targetId:"#wrapper"});

	},

	getCourse : function(e) {
		getCoursesById(e);
	},

});
function getCoursesById(e) {
	var defer = $.Deferred();
//	alert(e.currentTarget.id);

	var sendData = {
		recordNo : (e.currentTarget.value || e.currentTarget.id)
	};
	
//	alert(nurl.COURSE_OVER + sendData.recordNo);
	// $.post("mvc/getPerson",{name:$("#name").val()},function(data){
	// alert(data);
	// });
	var href = nurl.COURSE_OVER + sendData.recordNo;
	$.ajax({
		type : "GET",
		data : sendData,
		cache : false,
		url : href,
		error : function(XHR, status, errorThrown) {
			if (XHR.getResponseHeader(HEAD_KEY_ERR) != "") {
				// sessionStorage.setItem(HEAD_KEY_ERR,
				// XHR.getResponseHeader(HEAD_KEY_ERR));
			}
			defer.resolve();
		},
		success : function(data, status) {
			console.log(data);
			$(e.currentTarget).append(data.age);
			// if (data.systemInfoValue == cmconst.OPEN_NEW_EIP_FLAG) {
			// localStorage.setItem(cmconst.STORAGE_NAME_WSDL_SWTICH_FLAG,
			// cmconst.OPEN_NEW_EIP_FLAG);
			// } else {
			// localStorage.setItem(cmconst.STORAGE_NAME_WSDL_SWTICH_FLAG,
			// cmconst.CLOSE_NEW_EIP_FLAG);
			// }
//			location.href = href;
			defer.resolve();
		}
	});
	return defer.promise();
}

// var success = _.bind(function(data){
// this.makeReloadReportData_(data);
// this.afterSendIFSecond();
// }, this);
// var error = _.bind(this.afterSendIFSecond, this);
// callAjax_({agentId : sekkeiPlan.AGENT_ID, insuredId : sekkeiPlan.INSURED_ID,
// sekkeiPlanNo : sekkeiPlan.SEKKEI_PLAN_NO}
// , "/navi/Sync/common/reportOutput/reload"
// , success
// , error);

// var defer = $.Deferred();
// $.when.apply(null, promises).done($.proxy(function() {
// defer.resolve();
// }));
// return defer.promise();

// function getStartupInfo(param)
// {
// var defer = $.Deferred();
// var sendData = {
// recordNo : "14"
// };
//
// $.ajax({
// type:"GET",
// data: sendData,
// cache:false,
// url: "url",
// error:function(XHR, status, errorThrown){
// // if(XHR.getResponseHeader(HEAD_KEY_ERR) != ""){
// // sessionStorage.setItem(HEAD_KEY_ERR, XHR.getResponseHeader(HEAD_KEY_ERR));
// // }
// defer.resolve();
// },
// success: function(data, status){
// param.startupInfo = data;
// defer.resolve();
// }
// });
// return defer.promise();
// }

// function checkCaplibVersion(params){
// var defer = $.Deferred();
// var caplibInfoKey = cmconst.CAPLIB_INFO_KEY;
//
// //EOFフラグがない場合はローカルCapLibバージョン確認は行わない。
// if(!isValidEOF()) {
// return defer.resolve().promise();
// }
//
// axa.navi.lt.caplib.getLocalVersion()
// .done(function(versionInfo) {
// if(!versionInfo.isValid){
// var curVer = versionInfo.current;
// var reqVer = versionInfo.required;
// var detMsg = "{CCM0012;" + curVer + ";" + reqVer + "}";
// outputSosaLog({ SHIKIBETSUSHI: 'F', LOG_DET: detMsg });
// customMessage("確認",[new
// Message("CCM0012",curVer,reqVer)],"C",[callCalcVerUp,closeWindow],this,cmconst.DIALOG_TYPE_ORIGIN,["バージョンアップを実行","終了"]);
// return defer.reject().promise();
// }
// localStorage.setItem(caplibInfoKey, JSON.stringify(versionInfo));
// return defer.resolve().promise();
// })
// .fail(function(xhr, status, error) {
// return defer.resolve().promise();
// });
//
// return defer.promise();
// }

// function uploadSosaLogData(params){
// // IndexedDBからSOSALOGレコードを取得し、Ajax成功後に、削除する
// var defer = $.Deferred();
// var taskManager = TaskManager.create();
// taskManager.addTask(log_db_open_);
// taskManager.addTask(log_db_get_);
// taskManager.addTask(log_ajax_);
// taskManager.addTask(log_db_del_);
// taskManager.seriallyExecute({collectionName: "SosaLogCollection", sendUrl:
// cmurl.SOSA_LOG}).done(function() {
// defer.resolve();
// }).fail(function() {
// // アップロードエラーでも後続タスクを継続する必要があるためresolve()とする
// defer.resolve();
// });
//	
// return defer.promise();
// }

// function setPXVersion(params){
// var defer = $.Deferred();
// var pxInfoKey = cmconst.PX_INFO_KEY;
// var serverPXInfo = {
// px_type : cmconst.PX_TYPE_SERVER,
// px_version : "-"
// };
// var localPXInfo = {
// px_type : cmconst.PX_TYPE_LOCAL,
// px_version : ""
// };
// //EOFフラグがない場合。コンフィグで明示的にローカルPXを使うと定義していない場合はローカルPXにリクエストを投げない。
// if(!isValidEOF() && !axaconfig.useOnlyLocalPX) {
// localStorage.setItem(pxInfoKey,JSON.stringify(serverPXInfo));
// return defer.resolve().promise();
// }
// var soapMessage = generateCheckSoap();
// var enablePXver = JSON.parse(axaconfig.enablePXver);
// // ローカルPX生存確認
// Backbone.soap(soapMessage, {
// // successであればローカルPXへ計算リクエストを送信
// success: function (resp, xhr, req) {
// var sXML = xhr;
// var pxVersion = $(sXML).find("clc\\:CalculationOutput,
// CalculationOutput").find("clc\\:RuntimeConfiguration,
// RuntimeConfiguration").attr("version");
// localPXInfo.px_version = pxVersion;
// localStorage.setItem(pxInfoKey,JSON.stringify(localPXInfo));
// validatePXVersion_(enablePXver,pxVersion);
// },
// // errorであればサーバPX バージョン「―」をセット
// error: function () {
// localStorage.setItem(pxInfoKey,JSON.stringify(serverPXInfo));
// return defer.resolve();
// }
// });
//
// function validatePXVersion_(enablePXver,pxVer) {
// var message_ = "";
// if((enablePXver.minVer && pxVer < enablePXver.minVer) ||(enablePXver.maxVer
// && pxVer > enablePXver.maxVer)){
// if(enablePXver.minVer){
// message_ += enablePXver.minVer + "以上";;
// }
// if(enablePXver.maxVer){
// message_ += enablePXver.maxVer + "以下";
// }
// }
// if (message_ !== "") {
// var detMsg = "{CCM0011;" + pxVer + ";" + message_ + "}";
// outputSosaLog({ SHIKIBETSUSHI: 'F', LOG_DET: detMsg });
// customMessage("確認",[new
// Message("CCM0011",pxVer,message_)],"C",[callCalcVerUp,closeWindow],this,cmconst.DIALOG_TYPE_ORIGIN,["バージョンアップを実行","終了"]);
// }else{
// return defer.resolve();
// }
// }
// return defer.promise();
// }

function readyScreen() {
	CourseOverviewView = new CourseOverviewView({
		model : CourseOverviewModel
	});
};

