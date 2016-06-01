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
        cmd.on(CommandId.fadeOutActPanel, (param) => {
            this.fadeOut();
        });
        cmd.on(CommandId.fadeInRankPanel, (param) => {
            console.log("fadeInRankPanel", param);
            this.fadeInRank(param.playerDataArr);
        });
        cmd.on(CommandId.fadeOutRankPanel, (param) => {
            console.log("fadeOutRankPanel", param);
            this.fadeOutRank();
        });
    }

    initVue() {
        var showGame;
        var fadeInGameArr;
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
            watch: {
                showGameArr: function (val) {
                    console.log('selRound showGameArr change',JSON.stringify(val));
                    // do my stuff
                }
            },
            methods: {
                onClkMatch: function () {
                    // var gameArr = this.showGameArr.concat();
                },
                selectSection: function (start) {
                    var tmp = [];
                    var selRound = this.roundDataArr[this.roundSelected];
                    console.log('selRound:', JSON.stringify(selRound));
                    for (var i = start; i < start + 6; i++) {
                        var game = selRound.gameDataArr[i];
                        console.log('selRound:', JSON.stringify(game));
                        var gameData:any = {};
                        gameData.id = game.id;
                        gameData.playerIdArr = game.playerIdArr;
                        tmp.push(gameData);
                    }
                    this.showGameArr = tmp;
                },
                onClkStartGame: function () {
                    var selRound = this.roundDataArr[this.roundSelected];
                    var selGame = selRound.gameDataArr[this.gameSelected];
                    console.log('start game:', JSON.stringify(selGame));
                    this.$http.post('/panel/act/op', {
                        cmd: CommandId.cs_startGame, param: {activityId: this.selected, gameData: selGame}
                    }).then(function (res) {
                        console.log(res.data);
                        if (res.data.isFinish) {
                            alert("这个比赛已完结！！");
                        }
                        else
                            alert("比赛创建成功！！");
                    });
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
                    // this.showGameArr.push(this.playerIdArr.concat());
                },
                onClkFadeInRank: function () {
                    this.$http.post('/panel/act/op', {
                        cmd: CommandId.cs_fadeInRankPanel,
                        param: {activityId: this.selected, limit: 10}
                    }).then(function (res) {
                        console.log('cs_fadeInRankPanel', res);
                    });
                },
                onClkFadeOutRank: function () {
                    this.$http.post('/panel/act/op', {
                        cmd: CommandId.cs_fadeOutRankPanel
                    }).then(function (res) {
                        console.log(res);
                    });
                },
                onClkFadeOut: function () {
                    this.$http.post('/panel/act/op', {
                        cmd: CommandId.cs_fadeOutActPanel
                    }).then(function (res) {
                        console.log(res);
                    });
                },
                onClkFadeIn: function () {
                    if (this.showGameArr.length) {
                        console.log("showGameArr", JSON.stringify(this.showGameArr));
                        this.$http.post('/panel/act/op', {
                            cmd: CommandId.cs_fadeInActPanel,
                            param: {
                                activityId: this.activityId,
                                gameArr: this.showGameArr
                            }
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
                    console.log("selGame", JSON.stringify(selGame));
                    for (var i = 0; i < selGame.playerIdArr.length; i++) {
                        this.playerIdArr.push(selGame.playerIdArr[i]);
                    }
                },
                onRoundSelected: function () {
                    console.log('round change', this.roundSelected);
                    console.log(vue.roundDataArr[this.roundSelected]);
                    vue.gameOptionArr = [];
                    for (var i = 0; i < vue.roundDataArr[this.roundSelected].gameDataArr.length; i++) {
                        var selGame = vue.roundDataArr[this.roundSelected].gameDataArr[i];
                        vue.gameOptionArr.push({value: i, text: '第' + (i + 1) + '场 id:' + selGame.id});
                    }
                    this.gameSelected = -1;
                    this.playerIdArr = [];
                },
                onGetDateArr: function () {
                    console.log('activity change');
                    var actId = parseInt(this.selected);
                    this.$http.post('/panel/act/op', {cmd: 'query', param: actId}).then(function (res) {
                        vue.roundDataArr = res.data;
                        vue.roundOptionArr = [];
                        for (var i = 0; i < vue.roundDataArr.length; i++) {
                            var roundData = vue.roundDataArr[i];
                            vue.roundOptionArr.push({value: i, text: '第' + (roundData.round) + '轮'});
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

    fadeInRank(playerDataArr) {
        this.ctn.removeAllChildren();
        this.ctn.alpha = 0;

        var modal = new createjs.Shape();
        modal.alpha = .8;
        modal.graphics.beginFill("#000").drawRect(0, 0, this.stageWidth, this.stageHeight);
        this.ctn.addChild(modal);

        var title = new createjs.Bitmap('/img/panel/act/rankTitle.png');
        title.x = (this.stageWidth - 1200) * .5;
        title.y = 20;
        this.ctn.addChild(title);

        var imgArr = [];
        for (var i = 0; i < playerDataArr.length; i++) {
            var playerData = playerDataArr[i];
            imgArr.push(playerData.avatar);
        }
        loadImgArr(imgArr, ()=> {
            for (var i = 0; i < playerDataArr.length; i++) {
                var playerData = playerDataArr[i];
                imgArr.push(playerData.avatar);

                var item = new createjs.Bitmap('/img/panel/act/rankItem.png');
                item.x = title.x;
                item.y = title.y + i * 95 + 105;
                this.ctn.addChild(item);

                var avatar = new createjs.Bitmap(playerData.avatar);
                avatar.x = item.x + 10;
                avatar.y = item.y + 10;
                var scale = 70 / avatar.getBounds().height;
                avatar.scaleX = avatar.scaleY = scale;
                this.ctn.addChild(avatar);

                var nameLabel = new createjs.Text(playerData.name, "28px Arial", "#fff");
                nameLabel.textAlign = 'center';
                nameLabel.x = item.x + 300;
                nameLabel.y = item.y + 30;
                this.ctn.addChild(nameLabel);

                var gameCount = new createjs.Text(playerData.gameCount, "28px Arial", "#fff");
                gameCount.textAlign = 'center';
                gameCount.x = item.x + 495;
                gameCount.y = nameLabel.y;
                this.ctn.addChild(gameCount);

                var winPercent = new createjs.Text((playerData.winpercent * 100).toFixed(2) + "%", "28px Arial", "#fff");
                winPercent.textAlign = 'center';
                winPercent.x = item.x + 710;
                winPercent.y = nameLabel.y;
                this.ctn.addChild(winPercent);

                var eloScore = new createjs.Text(playerData.eloScore, "28px Arial", "#fff");
                eloScore.textAlign = 'center';
                eloScore.x = item.x + 900;
                eloScore.y = nameLabel.y;
                this.ctn.addChild(eloScore);

                var rankPos = new createjs.Text((i + 1).toString(), "28px Arial", "#fff");
                rankPos.textAlign = 'center';
                rankPos.x = item.x + 1100;
                rankPos.y = nameLabel.y;
                this.ctn.addChild(rankPos);
            }

        });

        createjs.Tween.get(this.ctn)
            .to({alpha: 1}, 300);
    }

    fadeOutRank() {
        createjs.Tween.get(this.ctn)
            .to({alpha: 0}, 300).call(
            ()=> {
                this.ctn.removeAllChildren();
            }
        );
    }

    fadeIn(gameInfoArr) {
        this.ctn.removeAllChildren();
        this.ctn.alpha = 0;

        var modal = new createjs.Shape();
        modal.alpha = .8;
        modal.graphics.beginFill("#000").drawRect(0, 0, this.stageWidth, this.stageHeight);
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
                    scoreText.text = gameInfo.rightScore + "";
                    scoreText.x = 830;
                    rightScore += playerInfo.eloScore();
                    playerCtn = getRightPlayerCard(playerInfo, 1);
                    playerCtn.x = 282 + j * 148;
                }
                else {
                    scoreText.text = gameInfo.leftScore + "";
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
        createjs.Tween.get(this.ctn)
            .to({alpha: 0}, 300).call(
            ()=> {
                this.ctn.removeAllChildren();
            }
        );
    }

}
var actView;
$(function () {
    actView = new ActivityPanelView();
});