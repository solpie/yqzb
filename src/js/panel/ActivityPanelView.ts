// import {Vue} from "./BasePanelView";
/**
 * Created by toramisu on 2016/5/28.
 */
/// <reference path="../clientDef.ts"/>
/// <reference path="../../ts/server/models/RoundInfo.ts"/>
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
        cmd.on(CommandId.fadeInActPanel, (param) => {
            console.log("fadeInActPanel", param);
        });
    }

    initVue() {
        var vue = new Vue({
            el: '#panel',
            data: {
                showGameArr: [],

                playerIdArr: [],
                roundDataArr: [],

                gameSelected: -1,
                gameOptionArr: [],

                roundSelected: -1,
                roundOptionArr: [],

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
                onClkAddGame: function () {
                    this.showGameArr.push(this.playerIdArr);
                },
                onClkFadeIn: function () {
                    if (this.showGameArr.length)
                        this.$http.post('/op/act/', {
                            cmd: CommandId.cs_fadeInActPanel,
                            param: this.showGameArr
                        }).then(function (res) {
                            console.log(res);
                        });
                    else {
                        console.log('no game arr@!');
                    }
                },
                onGameSelected: function () {
                    console.log('game change', this.gameSelected);
                    var selRound = this.roundDataArr[this.roundSelected];
                    var selGame = selRound.gameDataArr[this.gameSelected];
                    this.playerIdArr.length = 0;
                    console.log("sel", JSON.stringify(selRound));
                    for (var i = 0; i < selGame.playerIdArr.length; i++) {
                        this.playerIdArr.push(selGame.playerIdArr[i]);
                    }
                },
                onRoundSelected: function () {
                    console.log('round change', this.roundSelected);
                    console.log(vue.roundDataArr[this.roundSelected]);
                    vue.gameOptionArr = [];
                    for (var i = 0; i < vue.roundDataArr[this.roundSelected].gameDataArr.length; i++) {
                        vue.gameOptionArr.push({value: i, text: '第' + (i + 1) + '场'});
                        // console.log('第' + (i + 1) + '场');
                    }
                    this.gameSelected = -1;
                    this.playerIdArr = [];
                },
                onGetDateArr: function () {
                    console.log('activity change');
                    var actId = parseInt(this.selected);
                    this.$http.post('/op/act/', {cmd: 'query', param: actId}).then(function (res) {
                        vue.roundDataArr = res.data;
                        vue.roundOptionArr = [];
                        for (var i = 0; i < vue.roundDataArr.length; i++) {
                            vue.roundOptionArr.push({value: i, text: '第' + (i + 1) + '轮'});
                        }
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

    fadeIn(actInfo:RoundInfo) {
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