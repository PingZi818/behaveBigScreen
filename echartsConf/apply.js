//老师行为趋势
const myChart_option1 = function(data) {
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "white"
        }
      },
      enterable:true,
      formatter: function(params){
        var totalValue=0
        var html="<ul class='tips-dialog'>";
        for(var i=0,len= params.length;i<len;i++){
          totalValue+= params[i].data;
          html+= "<li>"+params[i].marker;
          html+= "<span class='inline-block w80'>"+params[i].seriesName+"</span><span class='fr'>"+ params[i].data +"次</span></li>";
        }
        html+= "<li class='total pl20'><span>共计</span><span class='fr'>"+ totalValue+"次</span></li></ul></div>";
        return html
      }
    },
    textStyle: {
      color: "#a0a8b9"
    },
    color:["#3134d1","#0190fc","#4ee8fe","#88f7dc"],
    grid: {
      left: "12%",
      bottom: "10%",
      right:'2%',
      top:'32%'
    },
    legend: {
      top:"0",
      left: "right",
      orient:"horizontal",
      itemWidth:8,
      itemHeight:8,
      data: [
        {
          name: "板书行为",
          icon: "circle",
          textStyle: {
            color: "#7d838b"
          }
        },
        {
          name: "演示行为",
          icon: "circle",
          textStyle: {
            color: "#7d838b"
          }
        },
        {
          name: "讲授行为",
          icon: "circle",
          textStyle: {
            color: "#7d838b"
          }
        },
        {
          name: "巡视行为",
          icon: "circle",
          textStyle: {
            color: "#7d838b"
          }
        }
      ],
      top: "10%",
      textStyle: {
        color: "#fff"
      }
    },
    xAxis: [
      {
        type: "category",
        name: "",
        data: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
        axisPointer: {
          type: "shadow"
        },
        axisLabel: {
          formatter: "{value}"
        },
        axisTick:{
          show:false
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        name: "人次",
        nameTextStyle:{
          padding:[0,35,0,0]
        },
        offset:0,
        axisLine:{
          show:false
        },
        axisTick:{
          show:false
        },
        axisLabel: {
          formatter: "{value}"
        },
        splitLine:{
          lineStyle:{
            color:'#242847'
          }
        }
      },
      
    ],
    series: [{
            name:'板书行为',
            stack: '总量',
            type:'bar',
            barWidth: 12,
            data:data["板书行为"]
        },
        {
            name:'演示行为',
            stack: '总量',
            type:'bar',
            barWidth: 12,
            data: data["演示行为"]
        },
        {
            name:'讲授行为',
            stack: '总量',
            type:'bar',
            barWidth: 12,
            data:data["讲授行为"]
        },{
            name:'巡视行为',
            stack: '总量',
            type:'bar',
            barWidth: 12,
            data:data["巡视行为"]
        }]
  };
};

// 教师统计行为
const myChart_option2 = function(data) {
var totalMinutes= data.板书总计+ data.演示总计+ data.讲授总计+ data.巡视总计,
    tocalHours= Math.ceil(parseInt(totalMinutes)/(3*60*60));
  return {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    graphic:[{
          type: 'group',
          left: "43%",
          top: "45%",
          children: [{
              type: 'text',
              left: 0,
              top: 'middle',
              style: {
                text: tocalHours,
                textAlign: 'left',
                fill: "#fff",
                font: "34px fette"
              }
            },{
              type: 'text',
              left: 30,
              top: 'middle',
              style: {
                text: "小时",
                textAlign: 'left',
                fill: "#fff",
                  font: "20px pingfang"
              }
            },
          ]
    }],
    series: [
      {
        name: "",
        type: "pie",
        hoverAnimation: true,
        radius: ["35%", "46%"],
        avoidLabelOverlap: false,
        label: {
          formatter: function(params){
            return "{a|"+Number(params.percent).toFixed(1)+"%}\n{b|"+params.name+"}"
          },
          show: true,
          position: "outside",
          color: "#0153fd",
          verticalAlign: "top",
          rich: {
             a: {
                color: "white",
                lineHeight: 26,
                align: "center",
                fontSize: 24,
                fontFamily:"fette",
                width:60,
              },
              b: {
                fontSize: 16,
                align: "center",
                color: "#fff",
                fontFamily:"pingfang"
              }
          }
        },
        emphasis: {
          label: {
            rich: {
              a: {
                color: "white",
                lineHeight: 26,
                align: "center",
                fontSize: 24,
                fontFamily:"fette",
              },
              b: {
                color: "#fff",
                fontSize: 16,
                fontFamily:"pingfang",
              }
            }
          }
        },
        markPoint:{
          symbol:"circle"
        },
        labelLine: {
          show: true,
          length: 30,
          length2: 50,
          lineStyle: {
            color: "#0054ff"
          },
          emphasis: {
            lineStyle: {
              color: "#22d3fd"
            }
          }
        },
        data: [
          {
            value: data.演示总计,
            name: "演示行为",
            itemStyle:{
              color:'#1bbcfa'
            }           
          },
          { value: data.巡视总计, name: "巡视行为",
            itemStyle:{
              color:'#23548b'
            }  
          },
          { value: data.板书总计, name: "板书行为",
            itemStyle:{
              color:'#162959'
            } 
          },
          { value: data.讲授总计, name: "讲授行为",
            itemStyle:{
              color:'#3352a1'
            } 
          }
         
        ]
      }, {
        name: " ",
        center: [
            "50%",
            "50%"
        ],
        radius: [
            "46%",
            "53%"
        ],
        clockWise: false,
        hoverAnimation: false,
        type: "pie",
        data: [{
            value: 100,
            name: "",
            label: {
                normal: {
                    show: false,
                }
            },
            labelLine: {
                show: false
            },
            itemStyle: {
                normal: {
                    color: "#030c40",
                    // borderColor: "#022479"
                },
            },
        }]
    }, {
        name: " ",
        center: [
            "50%",
            "50%"
        ],
        radius: [
            "53%",
            "54%"
        ],
        clockWise: false,
        hoverAnimation: false,
        type: "pie",
        data: [{
            value: 84,
            name: "",
            label: {
                normal: {
                    show: false,
                }
            },
            labelLine: {
                show: false
            },
            itemStyle: {
                normal: {
                    color: "#5886f0",
                    borderColor: "#022479"
                },
            },
        }]
    }]
  };
};


//学生行为分析
const myChart_option5 = function(data) {
    // var max= Math.max.apply(null,[data.])
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "white"
        }
      },
      enterable:true,
      formatter: function(params){
        var totalValue=0
        var html="<ul class='tips-dialog'>"
        for(var i=0,len= params.length;i<len;i++){
          totalValue+= params[i].data
          html+= "<li>"+params[i].marker;
          html+= "<span class='inline-block w80'>"+params[i].seriesName+"</span><span class='fr'>"+ params[i].data +"次</span></li>"
        }
        html+= "<li class='total pl20'><span>共计</span><span class='fr'>"+ totalValue+"次</span></li></ul></div>"
        return html
      }

      
    },
    textStyle: {
      color: "#a0a8b9"
    },
    color:["#0190fc","#54f4cd"],
    grid: {
      left: "14%",
      bottom: "10%",
      right:'2%',
      top:'32%'
    },
    legend: {
      top:"0",
      left: "right",
      orient:"horizontal",
      itemWidth:8,
      itemHeight:8,
      data: [
        {
          name: "积极行为",
          icon: "circle",
        },
        {
          name: "普通行为",
          icon: "circle",
        }
      ],
      top: "10%",
      textStyle: {
        color: "#fff"
      }
    },
    xAxis: [
      {
        type: "category",
        name: "",
        data: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
        axisPointer: {
          type: "shadow"
        },
        axisLabel: {
          formatter: "{value}"
        },
        axisTick:{
          show:false
        },
      }
    ],
    yAxis: [
      {
        type: "value",
        name: "人次",
        nameTextStyle:{
          align:"left",
          padding:[0,40,0,0]
        },
        offset:0,
        axisLine:{
          show:false
        },
        axisTick:{
          show:false
        },
        axisLabel: {
          formatter: "{value}"
        },
        splitLine:{
          lineStyle:{
            color:'#242847'
          }
        }
      },
      
    ],
    series: [{
            name:'积极行为',
            stack: '总量',
            type:'bar',
            barWidth: 12,
            data: data.activeDatas
        },
        {
            name:'普通行为',
            stack: '总量',
            type:'bar',
            barWidth: 12,
            data: data.negativeDatas
        },
        ]
  };
};

//
const myChart_option6 = function(data) {
    var activeTotal= eval(data.activeDatas.join("+")),
        negativeTotal=eval(data.negativeDatas.join("+")),
        actionsDatas= data.actionsDatas;
  return {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    graphic:{
      type: 'text',
      left: 'center', // 相对父元素居中
      top: 'middle',  // 相对父元素居中
      style: {
          fill: 'white',
          text: '',
          fontSize: '28',        
      }
    },
    
    series: [
      {
        name:'行为类别',
        type:'pie',
        selectedMode: 'single',
        radius: [0, '38%'],

        label: {
            normal: {
                position: 'inner'
            },
            formatter: function(params){
                return "{a|"+Number(params.percent).toFixed(1)+"%}\n{b|"+params.name+"}"
            },
        },

        labelLine: {
            normal: {
                show: false
            }
        },
        startAngle:30,
        data:[

            {
                value:negativeTotal,
                name:'普通行为',
                itemStyle:{
                  color:'#435bc9'
                }
            },
            {
                value:activeTotal,
                name:'积极行为',
                itemStyle:{
                    color:'#f05b73'
                }
            }
        ]
      },
      {
        name: "",
        type: "pie",
        hoverAnimation: true,
        radius: ["58.5%", "70%"],
        startAngle:30,
        avoidLabelOverlap: false,
        label: {
          // formatter: "{a|{d}%}\n{b|{b}}",
          formatter: function(params){
              return "{a|"+Number(params.percent).toFixed(1)+"%}\n{b|"+params.name+"}"
          },
          show: true,
          position: "outside",
          color: "#0153fd",
          verticalAlign: "top",
          rich: {
            // verticalAlign: "top",
            a: {
              color: "white",
              lineHeight: 26,
              align: "center",
              fontSize: 24,
              fontFamily:"fette",
              width:60,
            },
            b: {
              fontSize: 16,
              align: "center",
              color: "#16aefa",
              fontFamily:"pingfang"
            }
          }
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 40,
          lineStyle: {
            color: "#0054ff"
          },
          emphasis: {
            lineStyle: {
              color: "#22d3fd"
            }
          }
        },
        data: [
          {
            value: actionsDatas["张望"],
            name: "张望",
            itemStyle:{
              color:'#24c8f3'
            }
          },
          { value: actionsDatas["放松"], name: "放松",
            itemStyle:{
              color:'#3d9af0'
            } 
          },
          { value: actionsDatas["瞌睡"], name: "瞌睡",
            itemStyle:{
              color:'#1a70ff'
            } 
          },
          { value: actionsDatas["讨论"], name: "讨论",
            itemStyle:{
              color:'#cf67ed'
            } 
          },
          { value: actionsDatas["举手"], name: "举手",
            itemStyle:{
              color:'#a443ff'
            } 
          },
          { value: actionsDatas["听讲"], name: "听讲",
            itemStyle:{
              color:'#eb610b'
            } 
          },
          { value: actionsDatas["思考"], name: "思考",
            itemStyle:{
              color:'#ff7b27'
            } 
          },
          {
                value: actionsDatas["阅读"],
                name: "阅读",
                itemStyle:{
                    color:'#f9ae22'
                }
          }
        ]
      }
    ]
  };
};
