;(function(fn, undefined) {
    "use strict";
    var isUnload = false,
        callbackMap = {},
        duang = fn.call(Object.create(null)),
        toString = Object.prototype.toString,
        tool = duang?duang.getModule("Tool").getController("tool"):window.tool,
        url = "https:"===location.protocol?"wss://localhost:9099":"ws://localhost:9098";

    var eventMap = {
        5530: "OnTranslateSuccess",   //转写结果上报
        5531: "OnVoice",    //语音数据上报
        5532: "OnFunctionResult",    //通用调用结果反馈
        5533: "OnBehavior",  //姿态识别结果上报
        5534: "OnCommand",  //指令上报
        5535: "OnRealTimeTranslate" //长语音实时转写结果上报
    };

    var commandMap = {
        0: "切教师跟踪画面",
        1: "切班班通画面",
        2: "切学生跟踪画面",
        3: "切板书画面",
        4: "切教师全景画面",
        5: "切学生全景画面",
        6: "切单画面",
        7: "切画中画",
        8: "切主界面",
        9: "课件演示",
        10: "PPT向上翻页",
        11: "PPT向下翻页",
        12: "自动跟踪",
        13: "手动跟踪",
        14: "教室1发言",
        15: "教室2发言",
        16: "教室3发言"
    };

    var idMap = {
        0: "1106740696",
        1: "5a795b09",
        2: ""
    };

    var keyMap = {
        0: "JIlgWSqhNwE2QArn",
        1: "",
        2: ""
    };

    var eventHandle = {};

    var addEvent = window.addEventListener?function(target, type, fn, use) {
        target.addEventListener(type, fn, use||false);
    }:function(target, fn, type) {
        target.attachEvent("on"+type, fn);
    };

    addEvent(window, "beforeunload", function() {
        isUnload = true;
    });

    var Pip = function() {
        var self = this,
            state = 0, //0为初始化，1为执行中，2为执行完毕，-1为出现bug
            taskList = [];

        function __Pip__() {}

        __Pip__.prototype = {
            constructor: __Pip__,
            pip: function() {
                if(1===state) return ;
                taskList.push([].slice.call(arguments, 0));
                return this;
            },
            then: function() {
                if(1===state || -1===state || 2===state) return ;
                taskList.push([].slice.call(arguments, 0));
                return this;
            },
            exec: function() {
                state = 1;

                if(taskList.length>0) {
                    try {
                        run(taskList[0]);
                    } catch(e) {
                        state = -1;
                        console.error(e);
                    }
                }
            }
        };

        function run() {
            var args = arguments[0],
                fName = args.shift(),
                fn = args.pop();

            if("[object Function]"===toString.call(fName) && void(0)===fn) return fName();
            if("[object String]"!=toString.call(fName) || !self[fName]) throw "no function name";

            if("[object Function]"!=toString.call(fn)) {
                void(0)!=fn && args.push(fn);
                fn = null;
            }

            args.push(function() {
                fn && fn.apply(this, [].slice.call(arguments, 0));
                taskList.shift();
                taskList.length>0 && run(taskList[0]);
            });

            return self[fName] && self[fName].apply(self, args);
        }

        return new __Pip__();
    };

    var WSVoice = (function() {
        var	ws = null, custEvent = new tool.constructor.CustomerEvent();

        var _WSVoice = function(params, callback1, callback2) {
            var self = this;
            ws = new WebSocket(url);

            eventHandle[9999] = function() {
                voiceInterface.initRemoModule(params.time, function() {
                    var args = [].slice.call(arguments, 0);
                    callback1 && callback1.apply(ws, args);
                });
            };

            ws.onopen = function() {
                self.state = this.readyState;

                var registerConfig = {
                    key: "register",
                    value: params.moduleName.toString()
                };

                WSVoice.send(tool.encodeBase64(JSON.stringify(registerConfig)));
            };

            ws.onmessage = function() {
                var args = [].slice.call(arguments, 0),
                    arg = args.shift(),
                    data = tool.decodeBase64(arg.data);
                try {
                    data = JSON.parse(data);
                } catch(e) {
                    switch(data) {
                        case "register success":
                            eventHandle[9999]();
                            break;
                    }
                    throw "data type must be JSON";
                } 

                if(data.uuid) {
                    callbackMap[data.uuid] && callbackMap[data.uuid].call(self, data);
                    delete callbackMap[data.uuid];
                } else {
                    if(eventHandle[data.event]) {
                        eventHandle[data.event](data.param);
                    } else {
                        callback2 && callback2.call(obj, data);
                    }
                }
            };

            ws.onclose = function() {
                self.state = this.readyState;
                if(isUnload) return;
                _WSVoice.call(self, params, null, callback2);
            };

            return this;
        };

        var _send = function(msg) {
            ws.send(msg);
        };

        var obj = Object.create({
            addEvent: custEvent.addCustEvent,
            removeEvent: custEvent.removeCustEvent,
            fireEvent: custEvent.fire,
            handles: [],
            send: _send
        }, {init: {
            writable: false,
            configurable: false,
            enumerable: false,
            value: _WSVoice
        }});

        return obj;
    }());

    var voiceInterface = {
        initRemoModule: function(time, fn) {
            var config = {
                method: 5500,
                delayExitTime: +time
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }
            WSVoice.send(tool.encodeBase64(JSON.stringify(config)));
        },
        setTranslateMode: function(type, sdk, fn) {
            var config = {
                method: 5501,
                param: {
                    mode: +type,
                    sdk: sdk,
                    id: idMap[sdk],
                    key: keyMap[sdk]
                }
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSVoice.send(tool.encodeBase64(JSON.stringify(config)));
        },
        setRunState: function(type, state, fn) {
            var config = {
                method: 5502,
                param: {
                    mode: +type,
                    state: +state
                }
            };

            var uuid = tool.random(20);
            config.uuid = uuid;

            if(fn && "[object Function]"===toString.call(fn)) {
                callbackMap[uuid] = fn;
            }

            WSVoice.send(tool.encodeBase64(JSON.stringify(config)));
        }
    };

    var voiceDiscern = {
        init: function() {
            var args = [].slice.call(arguments, 0),
                callback = args.pop(),
                params = args.shift();

            if("[object Function]"!=toString.call(callback)) {
                if(void(0)===params && "[object Object]"===toString.call(callback)) params = callback;
                callback = null;
            }

            if("[object Object]"!=toString.call(params)) {
                params = {moduleName: "CodyyAIEngineWeb", time: 0};
            } else {
                params.moduleName = params.moduleName || "CodyyAIEngineWeb";
                params.time = isNaN(params.time)?0:+params.time;
            }

            WSVoice.init.call(WSVoice, params, callback, function() {
                var args = [].slice.call(arguments),
                    data = args.shift(),
                    eventName = data.param && data.param.key?eventMap[data.event][data.param.key]:eventMap[data.event];
                data.param?delete data.param.key:(data.param = "");
                
                if("OnCommand"===eventName) {
                    Object.defineProperty(data.param, "message", {
                        value: commandMap[data.param.id],
                        writable: false,
                        enumerable: false,
                        configurable: false,
                        get: function() {
                            return ;
                        }
                    });
                }

                eventName && this.fireEvent({type: eventName, message: data.param});
            });
        },
        //当需要有多个任务需要被调用，且下一个任务需要等待上一个任务完成后执行时调用此接口
        //参数1 在“wsPublish”中的接口名，string
        //参数2-n 插件需要的参数
        //参数n+1 回调函数
        pip: function() {
            var args = [].slice.call(arguments, 0),
                pip = Pip.call(this);
            args.length>0 && pip.pip.apply(this, args);
            return pip;
        },
        addEvent: function(type, callback) {
            if(void(0)===type || void(0)===callback) return;
            WSVoice.addEvent(type, callback);
        },
        removeEvent: function(type) {
            if(void(0)===type) return;
            WSVoice.removeEvent(type);
        },
        /**
         * 启用语音指令功能，此功能针对事先录入的一些特定的指令有效
         * 参数1 代表调用的是哪个供应商的sdk，0:腾讯，1:科大讯飞，2:阿里
         * 参数2 回调函数
         */
        activateVoiceOrder: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;

            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }

            var sdk = args.shift();
            sdk = !isNaN(sdk)?sdk:(!isNaN(lastArg)?lastArg:1);
            voiceInterface.setTranslateMode(0, sdk, fn);
        },
        /**
         * 启用语音识别功能
         * 参数1 代表调用的是哪个供应商的sdk，0:腾讯，1:科大讯飞，2:阿里
         * 参数2 回调函数
         */
        activateVoiceDiscern: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;

            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }

            var sdk = args.shift();
            sdk = !isNaN(sdk)?sdk:(!isNaN(lastArg)?lastArg:0);
            console.log("go")
            voiceInterface.setTranslateMode(1, sdk, fn);
        },
        /**
         * 启用长语音转写功能
         * 参数1 代表调用的是哪个供应商的sdk，0:腾讯，1:科大讯飞，2:阿里
         * 参数2 回调函数
         */
        activateVoiceTranslate: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;

            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }

            var sdk = args.shift();
            sdk = !isNaN(sdk)?sdk:(!isNaN(lastArg)?lastArg:1);
            voiceInterface.setTranslateMode(2, sdk, fn);
        },
        /**
         * 开始语音指令功能，此功能针对事先录入的一些特定的指令有效
         * 参数1 回调函数
         */
        startVoiceOrder: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;

            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }

            voiceInterface.setRunState(0, 0, fn);
        },
        /**
         * 开始语音识别功能
         * 参数1 回调函数
         */
        startVoiceDiscern: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;

            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }

            voiceInterface.setRunState(1, 0, fn);
        },
        /**
         * 开始长语音转写功能
         * 参数1 回调函数
         */
        startVoiceTranslate: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;

            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }

            voiceInterface.setRunState(2, 0, fn);
        },
        /**
         * 关闭语音指令功能
         * 参数1 回调函数
         */
        stopVoiceOrder: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;

            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }

            voiceInterface.setRunState(0, 1, fn);
        },
        /**
         * 关闭语音识别功能
         * 参数1 回调函数
         */
        stopVoiceDiscern: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;

            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }

            voiceInterface.setRunState(1, 1, fn);
        },
        /**
         * 关闭长语音转写功能
         * 参数1 回调函数
         */
        stopVoiceTranslate: function() {
            var args = [].slice.call(arguments, 0), lastArg = args.pop(), fn = null;

            if("[object Function]"===toString.call(lastArg)) {
                fn = lastArg;
                lastArg = null;
            }

            voiceInterface.setRunState(2, 1, fn);
        },
    };

    var plugin = {
        voiceDiscern: voiceDiscern
    };

    !duang?(window.plugin = Object.assign(window.plugin||{}, plugin)):(function() {
        duang.module("Tool", []).directive("AIPlugin", ["tool"], function() {
            return voiceDiscern;
        });
    }());
}(function() {
    return !window.duang?null:window.duang;
}));