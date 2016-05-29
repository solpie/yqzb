// import {Vue} from "./BasePanelView";
/**
 * Created by toramisu on 2016/5/28.
 */
/// <reference path="../clientDef.ts"/>
/// <reference path="../../ts/server/models/ActivityInfo.ts"/>
/// <reference path="./BasePanelView.ts"/>

class ActivityPanelView extends BasePanelView {
    ctn:any;
    isInit:Boolean;
    vue:any;

    constructor() {
        super();
        this.initVue();
        this.onServer();
    }

    onServer() {
        cmd.on(CommandId.initPanel, (param) => {
            console.log("initPanel::::::::", param);
            this.onInit(param)
        });
    }

    initVue() {
        var vue = new Vue({
            el: '#panel',
            data: {
                playerIdArr: [],
                dateDataArr: [],

                gameSelected: -1,
                gameOptionArr: [],

                dateSelected: -1,
                dateOptions: [],

                selected: 0,
                options: [
                    {text: '测试赛', value: 1},
                    {text: '63运动', value: 2}
                ]
            },
            // watch: {
            //     selected: function (currentValue) {
            //         console.log('date change');
            //         // do my stuff
            //     }
            // },
            methods: {
                onGameSelected: function () {
                    console.log('game change', this.gameSelected);
                    var selDate = this.dateDataArr[this.dateSelected];
                    var selGame = selDate.gameDataArr[this.gameSelected];
                    this.playerIdArr.length = 0;
                    console.log("sel", JSON.stringify(selDate));
                    for (var i = 0; i < selGame.playerIdArr.length; i++) {
                        this.playerIdArr.push(selGame.playerIdArr[i]);
                    }
                },
                onDateSelected: function () {
                    console.log('date change', this.dateSelected);
                    console.log(vue.dateDataArr[this.dateSelected]);
                    vue.gameOptionArr = [];
                    for (var i = 0; i < vue.dateDataArr[this.dateSelected].gameDataArr.length; i++) {
                        vue.gameOptionArr.push({value: i, text: '第' + (i + 1) + '场'});
                        // console.log('第' + (i + 1) + '场');
                    }
                },
                onGetDateArr: function () {
                    console.log('activity change');
                    var actId = parseInt(this.selected);
                    this.$http.post('/api/act/', {activityId: actId}).then(function (res) {
                        vue.dateDataArr = res.data;
                        vue.dateOptions = [];
                        for (var i = 0; i < vue.dateDataArr.length; i++) {
                            vue.dateOptions.push({value: i, text: '第' + (i + 1) + '天'});
                            console.log('第' + (i + 1) + '天');
                        }
                        // console.log(JSON.stringify(res.data));
                    })
                },
            }
        });
        this.vue = vue;
    }

    onInit(param) {
        this.stage = client.panel.stage;
        this.ctn = new createjs.Container();
        // var bg = new createjs.Bitmap('/img/panel/act/bg.png');
        // this.ctn.addChild(bg);
        this.stage.addChild(this.ctn);
    }

    fadeIn(actInfo:ActivityInfo) {
        this.ctn.alpha = 0;
        for (var gameInfo of actInfo.gameInfoArr) {

        }
        createjs.Tween.get(this.ctn)
            .to({alpha: 1}, 300);
    }

    fadeOut() {

    }

}
var actView;
$(function () {
    actView = new ActivityPanelView();
});