/**
 *
 * Date: 2018-4-14
 * Author: guona
 *
 * **/

var LocalDataHandler= (function(){
    var timer= null;
    var xData=["9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];

    /*
     * 本地存储数据
     */
    var setItem= function(key,value){
        if(arguments.length<2) return;
        window.localStorage.setItem(key,JSON.stringify(value))
    };

    /*
     * 获取本地数据
     */
    var getItem= function(key){
        if(!key) return;
        return JSON.parse(window.localStorage.getItem(key))
    };

    /*
     * 清除数据
     */
    var clearItem= function(key){
        if(!key) return;
        window.localStorage.clear(key);
    };

    /*
     * 初始页面是数据
     *
     * */
    var initLocalData= function(){
        var teacherActionsDatas= {
            currAction:"",
            板书行为: {
                "9:00": 9504,
                "10:00": 13068,
                "11:00": 16632,
                "12:00":21384,
                "13:00":4752,
                "14:00":10692,
                "15:00":17820,
                "16:00":15444,
                "17:00": 9504
            },
            演示行为: {
                "9:00": 6048,
                "10:00": 8316,
                "11:00": 10584,
                "12:00":13608,
                "13:00":3024,
                "14:00":6804,
                "15:00":11340,
                "16:00":9828,
                "17:00": 6048
            },// demonstrationAction
            讲授行为:{
                "9:00": 24192,
                "10:00": 33264,
                "11:00": 42336,
                "12:00":54432,
                "13:00":12096,
                "14:00":27216,
                "15:00":45360,
                "16:00":39312,
                "17:00": 24192
            },//teachingAction
            巡视行为: {
                "9:00": 3456,
                "10:00": 4752,
                "11:00": 6048,
                "12:00": 7776,
                "13:00": 1728,
                "14:00": 3888,
                "15:00": 6480,
                "16:00":5616,
                "17:00": 3456
            } //patrolAction
        }
        var studentActionsDatas={
            听讲: {
                "9:00": 170100,
                "10:00": 283500,
                "11:00": 245700,
                "12:00":151200,
                "13:00":75600,
                "14:00":151200,
                "15:00":207900,
                "16:00":264600,
                "17:00": 340200
            },
            思考:{
                "9:00": 63180,
                "10:00": 105300,
                "11:00": 91260,
                "12:00":56160,
                "13:00":18080,
                "14:00":56160,
                "15:00":77220,
                "16:00":98280,
                "17:00": 126360
            },
            阅读:{
                "9:00": 43740,
                "10:00": 72900,
                "11:00": 63180,
                "12:00":38880,
                "13:00":19440,
                "14:00":38880,
                "15:00":53460,
                "16:00":68040,
                "17:00": 87480
            },
            讨论:{
                "9:00": 53460,
                "10:00": 89100,
                "11:00": 77220,
                "12:00":47520,
                "13:00":23760,
                "14:00":47520,
                "15:00":65340,
                "16:00":83160,
                "17:00": 106920
            },
            举手:{
                "9:00": 48600,
                "10:00": 81000,
                "11:00": 70200,
                "12:00":43200,
                "13:00":21600,
                "14:00":43200,
                "15:00":59400,
                "16:00":75600,
                "17:00": 97200
            },
            张望:{
                "9:00": 34020,
                "10:00": 56700,
                "11:00": 49140,
                "12:00":30240,
                "13:00":15120,
                "14:00":30240,
                "15:00":41580,
                "16:00":52920,
                "17:00": 68040
            },
            瞌睡:{
                "9:00": 29160,
                "10:00": 18600,
                "11:00": 42120,
                "12:00":25920,
                "13:00":12960,
                "14:00":25920,
                "15:00":35640,
                "16:00":45360,
                "17:00": 58320
            },
            放松:{
                "9:00": 43740,
                "10:00": 72900,
                "11:00": 63180,
                "12:00":38880,
                "13:00":19440,
                "14:00":38880,
                "15:00":53460,
                "16:00":68040,
                "17:00": 87480
            },
            学习:{
                "9:00": 0,
                "10:00": 0,
                "11:00": 0,
                "12:00":0,
                "13:00":0,
                "14:00":0,
                "15:00":0,
                "16:00":0,
                "17:00": 0
            }
        };

        //页面分析次数
        setItem("analysisTimes",1080000);
        // 老师数据
        setItem("teacherActions",teacherActionsDatas)
        setItem("studentActions",studentActionsDatas)
        // 学生数据
        setItem("voiceList",new Array());
        //老师上一次状态
        //setItem("teacherPrevAction",teacherPrevAction);

    }


    var createInClassNums= function(data){
        var template='<span class="count-items">{{num}}</span>';
        var arr= data.toString().split("");
        var html='';
        for(var i=0,len= arr.length; i<len; i++){
            html+= template.replace(/\{\{num\}\}/, arr[i])
        }
        return html
    };

    /*
    * 判断某个时间是在规定的那个时间段内
    *
    * */
    var checkTime= function(){
        var date= new Date(),
            year= date.getFullYear(),
            month= date.getMonth(),
            date= date.getDate(),
            nowTime= Date.now(),
            eightOClock= new Date(year,month,date,8,0,0).getTime(),
            nineOClock= new Date(year,month,date,9,0,0).getTime(),
            tenOClock= new Date(year,month,date,10,0,0).getTime(),
            elevenOClock= new Date(year,month,date,11,0,0).getTime(),
            twelveOClock= new Date(year,month,date,12,0,0).getTime(),
            thirteenOClock= new Date(year,month,date,13,0,0).getTime(),
            fourteenOClock= new Date(year,month,date,14,0,0).getTime(),
            fifteenOClock= new Date(year,month,date,15,0,0).getTime(),
            sixteenOClock= new Date(year,month,date,16,0,0).getTime(),
            seventeenOClock= new Date(year,month,date,17,0,0).getTime();
        var flag;
        if(nowTime>=eightOClock && nowTime<nineOClock){
            flag= "9:00"
        }else if(nowTime>=nineOClock && nowTime<tenOClock){
            flag= "10:00"
        }else if(nowTime>=tenOClock && nowTime<elevenOClock){
            flag= "11:00"
        }else if(nowTime>=elevenOClock && nowTime<twelveOClock){
            flag= "12:00"
        }else if(nowTime>=twelveOClock && nowTime<thirteenOClock){
            flag= "13:00"
        }else if(nowTime>=thirteenOClock && nowTime<fourteenOClock){
            flag= "14:00"
        }else if(nowTime>=fourteenOClock && nowTime<fifteenOClock){
            flag= "15:00"
        }else if(nowTime>=fifteenOClock && nowTime<sixteenOClock){
            flag= "16:00"
        }else if(nowTime>=sixteenOClock && nowTime<=seventeenOClock){
            flag= "17:00"
        }
        return flag

    }
    var studentBenavior={
        0:"讨论",
        1:"举手",
        2:"举手",
        3:"思考",
        4:"阅读",
        5:"学习",
        6:"听讲",
        7:"瞌睡",
        8:"张望",
        9:"放松",
}
    var teacherBenavior={
        0: "板书行为",
        1: "演示行为",
        2: "讲授行为",
        3: "巡视行为"
    }

    // var covertData= function(benaviorArr){
    //     var len= benaviorArr.length;
    //     for(var i=0; i<len; i++){
    //         var data= benaviorArr[i];
    //     }
    // }

    /*
     *行为数据整合
     */

    var translateActionData= function(data,fn){
        // console.log(data)
        var analisisCount= getItem("analysisTimes") -0 +1;
        setItem("analysisTimes",analisisCount);
        updateAnalysisTimes(8,analisisCount);
        // flag:身份标识：0：老师，1：学生 ,
        // num:识别人数
        // benavior:识别结果：[ [听讲]，[张望]，[讨论]...]
        // var data={
        //     flag: 1,
        //     num:10,
        //     benavior:["听讲","思考","阅读","讨论","举手","瞌睡","张望","放松"]
        // }

        var flag= data.flag,
            num= data.num,
            behavior= data.behavior,
            keyName= checkTime();

        var localData;
        //取数据
        if(flag==0){
            localData= getItem("teacherActions");
        }else{
            localData= getItem("studentActions");
        }

        !localData && (localData={})

        var datas={}//将num和 behavior对应起来的
        for(var i=0,len= behavior.length;i<len;i++){

            var kind;//举手，或者 瞌睡，板书行为等等
            if(flag==0){
                kind= teacherBenavior[behavior[i]];
            }else if(flag==1){
                kind= studentBenavior[behavior[i]];
            }
            if(!datas[kind]){datas[kind]=0}
            datas[kind]= datas[kind] - 0 + 1;
            !localData[kind] && (localData[kind]={});
            kind &&  (localData[kind][keyName] = localData[kind][keyName] + 1 )
        }
        var currentDatas={
            flag: flag,
            counts: num,
            behavior: datas
        };
        //存数据
        if(flag==0){
            setItem("teacherActions",localData)
        }else{
            setItem("studentActions",localData)
        }
        // 更新实时
        if(fn && "[object Function]"===toString.call(fn)) {
           fn(currentDatas)
        }
    }

    /*
     *获取对象的所有可读属性值的和
     */
    var getAllKindDatas= function(data){
        var keysData= Object.keys(data),
            total=0;
        for(var j=0,len=keysData.length; j<len; j++){
            if(!isNaN(data[keysData[j]])){
                total+= data[keysData[j]] -0;
            }else{
                continue
            }
        }
        return total
    }
    var collectStudentDatas= function(){
        var total= 0;
        var studentActions= getItem("studentActions");
        //积极行为数据和消极行为数据
        var activeDatas=[],
            negativeDatas=[];
        for(var i=0,len= xData.length;i<len; i++){
            activeDatas[i]= studentActions["听讲"][xData[i]] + studentActions["思考"][xData[i]]+ studentActions["阅读"][xData[i]]+ studentActions["讨论"][xData[i]]+studentActions["举手"][xData[i]];
            negativeDatas[i]=  studentActions["张望"][xData[i]] + studentActions["瞌睡"][xData[i]]+ studentActions["放松"][xData[i]];
        }
        var actionsDatas={
            "听讲": getAllKindDatas(studentActions["听讲"]),
            "思考":getAllKindDatas(studentActions["思考"]),
            "阅读":getAllKindDatas(studentActions["阅读"]),
            "讨论":getAllKindDatas(studentActions["讨论"]),
            "举手":getAllKindDatas(studentActions["举手"]),
            "张望":getAllKindDatas(studentActions["张望"]),
            "瞌睡":getAllKindDatas(studentActions["瞌睡"]),
            "放松":getAllKindDatas(studentActions["放松"])
        };
        return{
            activeDatas: activeDatas,
            negativeDatas: negativeDatas,
            actionsDatas: actionsDatas
        }
    };
    //将提取data属性值，组成一个新数组返回
    var objToArr= function(data){
        var arr=[];
        for(var i=0,len= xData.length;i<len; i++){
            arr.push(data[xData[i]])
        }
        return arr
    };
    //获取同一时间段内的数据的总和
    var getKindsTotal= function(data){
        for(var i=0,len= xData.length;i<len; i++){
            teacherDatas[xData[i]]= teacherActions["板书行为"][xData[i]] + teacherActions["演示行为"][xData[i]]+ teacherActions["讲授行为"][xData[i]]+ teacherActions["巡视行为"][xData[i]]
        }
    };
    var collectTeacherDatas= function(){
        var teacherActions= getItem("teacherActions");
            teacherDatas={};
        return{
            // teacherDatas:teacherDatas
            "板书总计": getAllKindDatas(teacherActions["板书行为"]),
            "演示总计": getAllKindDatas(teacherActions["演示行为"]),
            "讲授总计": getAllKindDatas(teacherActions["讲授行为"]),
            "巡视总计": getAllKindDatas(teacherActions["巡视行为"]),
            "板书行为": objToArr(teacherActions["板书行为"]),
            "演示行为": objToArr(teacherActions["演示行为"]),
            "讲授行为": objToArr(teacherActions["讲授行为"]),
            "巡视行为": objToArr(teacherActions["巡视行为"])
        }
    }
    /*
     * 更新画面分析次数次数
     * totalNums ：表示显示分析次数，显示几位数字
     * data： 当前画面分析的总次数
     * */
    var updateAnalysisTimes= function(totalNums,data){
        var data= data.toString().split(""),
            len= data.length;
        var zeroCount= totalNums-len;
        var html= "";
        for(var i=0;i< totalNums;i++){
            if(i<zeroCount){
                html+='<span class="count-items">0</span>';
            }else{
                html+='<span class="count-items">'+ data[i-zeroCount] +'</span>';
            }
        }
        $(".statistics").html(html)
    };

    var updateChildrenActions= function(){
        var data= this.collectChildrenData();
        var activeDatas= data.activeDatas,
            negativeDatas= data.negativeDatas,
            activeDatas= data.actionsData;
        myChart_option2(data)
    };
    //更新语音
    var updateVoiceList= function(str){
        var voiceListData= getItem("voiceList");
        if(voiceListData==null){
            voiceListData=[]
        }
        voiceListData.unshift(str);
        setItem("voiceList",voiceListData);
    };
    var clearCurrentSection= function(){
        var html=LocalDataHandler.createInClassNums(0);
        $("#teacher_analisis .count-wrap").html(html);
        $("#student_analisis .count-wrap").html(html);
        $(".teacher-actions .action-items").removeClass("active");
        $(".student-actions .stus-num").html(0);


    };

    return {
        setItem:setItem,
        getItem:getItem,
        clearItem: clearItem,
        initLocalData:initLocalData,//初次进入页面初始本地数据
        createInClassNums:createInClassNums,
        updateAnalysisTimes: updateAnalysisTimes, //更新分析次数
        collectStudentDatas: collectStudentDatas,//用于获取学生行为趋势的积极行为和消极行为
        collectTeacherDatas: collectTeacherDatas,
        translateActionData: translateActionData,//将行为分析数据转换成合适的格式并存储到本地
        updateVoiceList:updateVoiceList,//更新语音数据及显示列表
        clearCurrentSection: clearCurrentSection,
    }
})();
//5s内没有上报行为，清空当前页面状态
var analysisTimer;
var teacherPrevAction={
    板书行为:false,
    演示行为:false,
    讲授行为:false,
    巡视行为:false
};
$(function(){
    // 设置时间
    var setTime = function() {
        var res = getCurrentTime();
        $(".currentTime").text(res.currentTime);
        $(".currentDate").text(res.currentDate);
        $(".currentWeek").text(res.currentWeek);
    };
    setTime();

    // 定时更新时间
    var timing = function() {
        setInterval(function() {
            setTime();
        }, 1000);
    };
    timing();
    /********************************echarts********************************/
    //老师行为柱状统计图表
    const myChart1 = echarts.init(document.getElementById("serviceTimeChart"));
    //教师行为饼图统计图表
    const myChart2 = echarts.init(document.getElementById("gradeRateChart"));
    //学生积极和消极行为统计
    const myChart5 = echarts.init(document.getElementById("hourUseChart"));
    //学生饼图
    const myChart6 = echarts.init(document.getElementById("warnChart"));

    /*****************************老师部分*******************************/
    // 老师行为柱状图趋势
    var teacherActionCharts = function(data) {
        myChart1.setOption(myChart_option1(data));
    };

    // 教师行为饼图
    var gradeRateChart = function(data) {
        myChart2.setOption(myChart_option2(data));
    };

    //更新教师数据
    var updateTeacherSection= function(){
        var data= LocalDataHandler.collectTeacherDatas();
        var html="";
        html+="<tr><td>板书行为</td><td>"+ data['板书总计'] +"</td><td>"+ Math.ceil(data['板书总计']/(60*3)) +"min</td></tr>";
        html+="<tr><td>演示行为</td><td>"+ data['演示总计'] +"</td><td>"+ Math.ceil(data['演示总计']/(60*3)) +"min</td></tr>"
        html+="<tr><td>讲授行为</td><td>"+ data['讲授总计'] +"</td><td>"+ Math.ceil(data['讲授总计']/(60*3)) +"min</td></tr>"
        html+="<tr><td>巡视行为</td><td>"+ data['巡视总计'] +"</td><td>"+ Math.ceil(data['巡视总计']/(60*3)) +"min</td></tr>"
        $(".faultConditionTable tbody").html(html);
        //    更新下方饼图
        // var teacherDatas= LocalDataHandler.getItem();
        gradeRateChart(data);
        teacherActionCharts(data);
    };
    /*******************************学生部分**********************************/
    //学生行为柱状图
    var childrenActionCharts = function(data) {
        myChart5.setOption(myChart_option5(data));
    };

    //学生行为饼图
    var warnChart = function(data) {
        myChart6.setOption(myChart_option6(data));
    };

    var updateStudentSection= function(){
        var data= LocalDataHandler.collectStudentDatas(),
            actionsDatas= data.actionsDatas;
        if(!actionsDatas) alert("数据有误")
        var html="<div class='behavioral-list'>";

            html+='<div class="items"><span class="bg-block">'+ actionsDatas["听讲"] +'</span><span class="fz18">听讲</span></div>';
            html+='<div class="items"><span class="bg-block">'+ actionsDatas["思考"] +'</span><span class="fz18">思考</span></div>';
            html+='<div class="items"><span class="bg-block">'+ actionsDatas["阅读"] +'</span><span class="fz18">阅读</span></div>';
            html+='<div class="items"><span class="bg-block">'+ actionsDatas["讨论"] +'</span><span class="fz18">讨论</span></div>';
            html+='</div><div class="mt10 behavioral-list">';
            html+='<div class="items"><span class="bg-block">'+ actionsDatas["举手"] +'</span><span class="fz18">举手</span></div>';
            html+='<div class="items"><span class="bg-block">'+ actionsDatas["张望"] +'</span><span class="fz18">张望</span></div>';
            html+='<div class="items"><span class="bg-block">'+ actionsDatas["瞌睡"] +'</span><span class="fz18">瞌睡</span></div>';
            html+='<div class="items"><span class="bg-block">'+ actionsDatas["放松"] +'</span><span class="fz18">放松</span></div>';
            html+='</div>'
        $("#student_behavioral_statistics").html(html);
        // 更新下方饼图
        childrenActionCharts(data);
        warnChart(data);
    }
    /***************************每一分钟更新一次左右两侧的数据*******************************/

    //进入页面的时候立即渲染一次

    var initPage= function(){
        //初始化数据 页面分析次数
        var analysisTimes= LocalDataHandler.getItem("analysisTimes") ;
        if(analysisTimes==null ||analysisTimes==undefined ){
            LocalDataHandler.initLocalData();
            analysisTimes= 1080000;
        }
        LocalDataHandler.updateAnalysisTimes(8, analysisTimes);
        var voiceListData= LocalDataHandler.getItem("voiceList");
        if(voiceListData==null) {
            LocalDataHandler.setItem("voiceList",[]);
            voiceListData=[]
        }else{
            var html="";
            for(var i=0, len=voiceListData.length;i<len;i++){
                html+="<li>"+ voiceListData[i] +"</li>";
            }
            $("#useSituationChart").html(html);
        }
        LocalDataHandler.clearCurrentSection();
        updateStudentSection();
        updateTeacherSection();
    };
    initPage();

    var updateTime= setInterval(function(){
        updateStudentSection();
        updateTeacherSection();
    },6000);
    /********************************语音**********************************/
    //语音处滚动条
    var _dom= $('#useSituationChart').get(0);
    var scrollObj=new PerfectScrollbar(_dom,{
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20,
        swipeEasing:false,
    });
    //语音
    var voiceDiscern = plugin.voiceDiscern;
    var translatedVoice='';
    $(".micro-action").on("click", function(){
        var $this= $(this);
        var $parent= $this.parent(".micor-handles-container");
        if($parent.hasClass("active")){
            $parent.removeClass("active");
            $this.html("语音输入");
            voiceDiscern.stopVoiceDiscern(function(){
                if(translatedVoice.length<= 0){
                   $("#useSituationChart li:first").remove();
                   return
                }
                LocalDataHandler.updateVoiceList(translatedVoice);
                scrollObj.update();
            })
        }else{
            $parent.addClass("active");
            $this.html("我说完了");
            voiceDiscern.startVoiceDiscern(function(data) {
                var html=$("<li></li>");
                translatedVoice="";
                $("#useSituationChart").prepend(html);
                $("#useSituationChart").get(0).scrollTop = 0;
            });
        }
    });
    voiceDiscern.init("CodyyAIEngineWeb", function(data) {
        voiceDiscern.activateVoiceDiscern();
    });

    voiceDiscern.addEvent("OnTranslateSuccess", function(data) {
         console.log("success"+data);
        translatedVoice= data.result;
        var $li=  $("#useSituationChart li:first");
        $li.html(translatedVoice);
    });

    voiceDiscern.addEvent("OnVoice", function(data) {

    });

    voiceDiscern.addEvent("OnFunctionResult", function(data) {

    });

   //

   // var teacherPrevAction= LocalDataHandler.getItem("teacherPrevAction");
    //行为分析上报,回调
   voiceDiscern.addEvent("OnBehavior", function(data) {
       if(!data) return;
        //拿到数据，转换并存储到本地并同步view
        LocalDataHandler.translateActionData(data, function(data){
            clearTimeout(analysisTimer);
            analysisTimer= setTimeout(function(){
                LocalDataHandler.clearCurrentSection()
            }, 5000);
            var currActions= data.behavior;
            var html1=LocalDataHandler.createInClassNums(data.counts);
               // html2=LocalDataHandler.createInClassNums(0);
            if(data.flag==0){
                $("#teacher_analisis .count-wrap").html(html1);
                // $("#student_analisis .count-wrap").html(html2);

                // if(!teacherPrevAction){
                //     teacherPrevAction=  LocalDataHandler.getItem("teacherPrevAction");
                // }

                console.log(teacherPrevAction)
                if(currActions.板书行为>0){

                        $(".teacher-actions .blackboard-writing-action").addClass("active");
                        teacherPrevAction.板书行为= true

                }else{
                    $(".teacher-actions .blackboard-writing-action").removeClass("active");
                    teacherPrevAction.板书行为= false;
                }

                if(currActions.演示行为>0){

                        $(".teacher-actions .demonstration-action").addClass("active");
                        teacherPrevAction.演示行为= true;

                }else{
                    $(".teacher-actions .demonstration-action").removeClass("active");
                    teacherPrevAction.演示行为= false;
                }
                if(currActions.讲授行为>0){

                        $(".teacher-actions .teaching-action").addClass("active");
                        teacherPrevAction.讲授行为= true;

                }else{
                    $(".teacher-actions .teaching-action").removeClass("active");
                    teacherPrevAction.讲授行为= false;
                }

                if(currActions.巡视行为>0){

                        $(".teacher-actions .patrol-action").addClass("active");
                        teacherPrevAction.巡视行为= true;

                }else{
                    $(".teacher-actions .patrol-action").removeClass("active");
                    teacherPrevAction.巡视行为= false;
                }

                // LocalDataHandler.setItem("teacherPrevAction",teacherPrevAction);

            }else if(data.flag==1){
                // $("#teacher_analisis .count-wrap").html(html2);
                $("#student_analisis .count-wrap").html(html1);
                $(".student-actions .listening .stus-num").html(currActions.听讲?currActions.听讲:0);
                $(".student-actions .thinking .stus-num").html(currActions.思考?currActions.思考:0);
                $(".student-actions .reading .stus-num").html(currActions.阅读?currActions.阅读:0);
                $(".student-actions .talking .stus-num").html(currActions.讨论?currActions.讨论:0);
                $(".student-actions .handing-up .stus-num").html(currActions.举手?currActions.举手:0);
                $(".student-actions .looking-around .stus-num").html(currActions.张望?currActions.张望:0);
                $(".student-actions .sleeping .stus-num").html(currActions.瞌睡?currActions.瞌睡:0);
                $(".student-actions .relexing .stus-num").html(currActions.放松?currActions.放松:0);
                 // 清老师部分实时数据
                // $(".teacher-actions .active").removeClass("active");
            }
        });
        //更新页面分析次数
       //LocalDataHandler.updateAnalysisTimes();
   });
    //图例适应屏幕变化
    var chartResize = function(){
        myChart1.resize();
        myChart2.resize();
        myChart5.resize();
        myChart6.resize();
    }
    window.onresize = debounce(chartResize,500);
})