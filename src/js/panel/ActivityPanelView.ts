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
            this.fadeIn(param.gameInfoArr);
        });
    }

    initVue() {
        var showGame;
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
                selectSection: function (start) {
                    var tmp = [];
                    var selRound = this.roundDataArr[this.roundSelected];
                    for (var i = start; i < start + 6; i++) {
                        var game = selRound.gameDataArr[i];
                        var playerIdArr = [];
                        for (var j = 0; j < game.playerIdArr.length; j++) {
                            playerIdArr.push(game.playerIdArr[j]);
                        }
                        tmp.push(playerIdArr)
                    }
                    this.showGameArr = tmp;
                },
                onClkAddHighSection: function () {
                    this.selectSection(0);
                },
                onClkAddLowSection: function () {
                    this.selectSection(6);
                },
                onClkReset: function () {
                    this.showGameArr = [];
                },
                onClkAddGame: function () {
                    this.showGameArr.push(this.playerIdArr.concat());
                },
                onClkFadeIn: function () {
                    // this.showGameArr = [
                    //     [11, 13, 14, 18, 10029, 10017, 10008, 10034],
                    //     [10029, 10017, 10008, 10034, 12, 17, 16, 15],
                    //     [11, 13, 14, 18, 12, 17, 16, 15],
                    //     [11, 13, 14, 18, 10032, 10030, 10031, 10036],
                    //     [12, 17, 16, 15, 10032, 10030, 10031, 10036],
                    //     [10032, 10030, 10031, 10036, 10029, 10017, 10008, 10034]];
                    if (this.showGameArr.length) {
                        console.log("showGameArr", JSON.stringify(this.showGameArr));
                        this.$http.post('/op/act/', {
                            cmd: CommandId.cs_fadeInActPanel,
                            param: this.showGameArr
                        }).then(function (res) {
                            console.log(res);
                        });
                    }
                    else {
                        alert("没有赛程！！！");
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

    fadeIn(gameInfoArr) {
        this.ctn.removeAllChildren();
        this.ctn.alpha = 0;

        var modal = new createjs.Shape();
        modal.alpha = .4;
        modal.graphics.beginFill("#000").drawRect(0, 0, this.stageWidth, this.stageHeight)
        this.ctn.addChild(modal);
        for (var i = 0; i < gameInfoArr.length; i++) {
            var gameInfo = gameInfoArr[i];
            var gameCtn = new createjs.Container();
            gameCtn.x = (this.stageWidth - 1540) * .5;
            gameCtn.y = i * 169;
            var bg = new createjs.Bitmap('/img/panel/act/bg.png');
            gameCtn.addChild(bg);
            var leftScore = 0;
            var rightScore = 0;
            for (var j = 0; j < gameInfo.playerInfoArr.length; j++) {
                var playerInfo = new PlayerInfo(gameInfo.playerInfoArr[j]);
                var playerCtn;
                var scoreText = newScoreText();
                scoreText.y = 70;
                if (playerInfo.isRed) {
                    scoreText.text = '7';
                    scoreText.x = 830;
                    rightScore += playerInfo.eloScore();
                    playerCtn = getRightPlayerCard(playerInfo, 1);
                    playerCtn.x = 282 + j * 148;
                }
                else {
                    scoreText.text = '9';
                    scoreText.x = 685;
                    leftScore += playerInfo.eloScore();
                    playerCtn = getLeftPlayerCard(playerInfo, 1);
                    playerCtn.x = 1 + j * 148;
                }
                gameCtn.addChild(scoreText);
                playerCtn.y = 36;
                gameCtn.addChild(playerCtn);
            }

            var leftAvgElo = new createjs.Text(Math.floor(leftScore / 4) + "", "18px Arial", "#fff");
            leftAvgElo.textAlign = 'center';
            leftAvgElo.x = 686;
            leftAvgElo.y = 133;
            gameCtn.addChild(leftAvgElo);

            var rightAvgElo = new createjs.Text(Math.floor(rightScore / 4) + "", "18px Arial", "#fff");
            rightAvgElo.textAlign = 'center';
            rightAvgElo.x = 880;
            rightAvgElo.y = leftAvgElo.y;
            gameCtn.addChild(rightAvgElo);

            this.ctn.addChild(gameCtn);
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