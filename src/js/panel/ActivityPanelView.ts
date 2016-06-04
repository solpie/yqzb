// import {Vue} from "./BasePanelView";
/**
 * Created by toramisu on 2016/5/28.
 */
/// <reference path="../clientDef.ts"/>
/// <reference path="../../ts/server/models/RoundInfo.ts"/>
/// <reference path="../../ts/utils/JsFunc.ts"/>
/// <reference path="./BasePanelView.ts"/>
class ActivityPanelView extends BasePanelView {
    ctn:any;
    isInit:Boolean;
    vue:any;
    cdTimer:any;
    cdSec:number;

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

        cmd.on(CommandId.fadeInCountDown, (param) => {
            console.log("CommandId.fadeInCountDown", param);
            this.fadeInCountDown(param.sec);
        });

        cmd.on(CommandId.fadeOutCountDown, (param) => {
            console.log("CommandId.fadeOutCountDown", param);
            this.fadeOutCountDown();
        });
    }

    initVue() {
        var showGame;
        var fadeInGameArr;
        var selectedSection;
        var selectedActivityId;
        var selectedRoundId;
        var playerDataMap;
        var vue = new Vue({
            el: '#panel',
            data: {
                cdText: '距离下场比赛 ',
                countDownSec: 300,
                playerDataMap: {},

                matchGameArr: [],
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
                    console.log('selRound showGameArr change', JSON.stringify(val));
                    // do my stuff
                }
            },
            methods: {
                onClkMatch: function () {
                    if (!this.showGameArr || !this.showGameArr.length)
                        return alert("没有赛程数据");
                    var gameArr = this.showGameArr.concat();

                    var teamMap = {};


                    function getTeam(playerIdArr, start) {
                        var teamIdArr = [];
                        for (var i = start; i < 4 + start; i++) {
                            var playerId = playerIdArr[i];
                            teamIdArr.push(playerId);
                        }
                        return teamIdArr;
                    }

                    for (var i = 0; i < gameArr.length; i++) {
                        var gameData = gameArr[i];
                        var leftTeam = getTeam(gameData.playerIdArr, 0);
                        var rightTeam = getTeam(gameData.playerIdArr, 4);
                        teamMap[JSON.stringify(leftTeam)] = leftTeam;
                        teamMap[JSON.stringify(rightTeam)] = rightTeam;
                    }
                    var teamArr = [];
                    var playerIdArrAll = [];
                    for (var key in teamMap) {
                        var playerIdArr = teamMap[key];
                        playerIdArrAll = playerIdArrAll.concat(playerIdArr);
                        teamArr.push(playerIdArr);
                        console.log(JSON.stringify(playerIdArr));
                    }
                    //队伍混合 计算平均分 排两场
                    function mixTeam(teamDataA, teamDataB) {
                        // console.log(playerIdArrA);
                        var playerIdArrA = teamDataA.playerIdArr;
                        var playerIdArrB = teamDataB.playerIdArr;
                        var tmp;
                        tmp = playerIdArrA[1];
                        playerIdArrA[1] = playerIdArrB[1];
                        playerIdArrB[1] = tmp;

                        tmp = playerIdArrA[3];
                        playerIdArrA[3] = playerIdArrB[3];
                        playerIdArrB[3] = tmp;


                        var gameData:any = {playerIdArr: teamDataA.playerIdArr.concat(teamDataB.playerIdArr)};
                        gameData.activityId = selectedActivityId;
                        gameData.roundId = selectedRoundId;
                        gameData.section = selectedSection;
                        console.log("mixTeam GameData:", JSON.stringify(gameData));
                        return gameData;
                    }

                    this.$http.post('/db/player/op', {
                        cmd: CommandId.cs_findPlayerData,
                        param: {playerIdArr: playerIdArrAll}
                    })
                        .then(function (res) {
                            console.log("/db/player/op", res.data);
                            var playerDataArr = res.data.playerDataArr;//eloScore low at 0
                            playerDataMap = res.data.playerDataMap;//eloScore low at 0


                            var teamDataArr = [];
                            for (var playerIdArr of teamArr) {
                                var teamData:any = {playerIdArr: playerIdArr};
                                console.log("teamData:", JSON.stringify(teamData));
                                var sum = 0;
                                for (var playerId of playerIdArr) {
                                    sum += playerDataMap[playerId].eloScore;
                                }
                                teamData.avgEloScore = sum / 4;
                                teamDataArr.push(teamData);
                            }
                            teamDataArr.sort(sortProp('avgEloScore'));
                            var gameDataArr = [];
                            gameDataArr.push(mixTeam(teamDataArr[0], teamDataArr[1]));
                            gameDataArr.push(mixTeam(teamDataArr[2], teamDataArr[3]));

                            // for (var gameData of gameDataArr) {
                            //     var playerIdArr = gameData.playerIdArr;
                            //     var sum = 0;
                            //     for (var playerId of playerIdArr) {
                            //         sum += playerDataMap[playerId].eloScore;
                            //     }
                            //     gameData.avgEloScore = sum / 4;
                            //     console.log("team elo score avg:", sum);
                            // }
                            vue.matchGameArr = gameDataArr;
                            console.log(teamArr);
                        });
                },
                onClkAddMatchGame: function () {
                    function addGame(idx, gameDataArr) {
                        if (idx < gameDataArr.length) {
                            var gameData = gameDataArr[idx];
                            vue.$http.post("/admin/game/add", {gameData: gameData}).then(function (res) {
                                console.log('/admin/game/add', res.data);
                                idx++;
                                if (res.ok) {
                                    addGame(idx, vue.matchGameArr);
                                }
                            });

                        }
                        addGame(0, vue.matchGameArr);
                    }

                    for (var i = 0; i < vue.matchGameArr.length; i++) {
                        var gameData = vue.matchGameArr[i];
                        vue.$http.post("/admin/game/add", {gameData: gameData}).then(function (res) {
                            console.log('/admin/game/add', res.data);
                        });
                    }
                },
                selectSection: function (start) {
                    var tmp = [];
                    var selRound = this.roundDataArr[this.roundSelected];
                    console.log('selRound:', JSON.stringify(selRound));
                    var high = [];
                    var low = [];
                    for (var i = 0; i < selRound.gameDataArr.length; i++) {
                        var game = selRound.gameDataArr[i];
                        console.log('selRound:', JSON.stringify(game));
                        var gameData:any = {};
                        gameData.id = game.id;
                        gameData.playerIdArr = game.playerIdArr;
                        gameData.section = game.section;
                        if (gameData.section === 0) {
                            high.push(gameData);
                        }
                        else if (gameData.section === 1) {
                            low.push(gameData);
                        }
                    }
                    if (start > 0) {
                        selectedSection = 1;
                        tmp = low;
                    }
                    else {
                        selectedSection = 0;
                        tmp = high;
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

                onClkFadeInCountDown: function () {
                    var sec = parseInt(this.countDownSec);
                    if (sec > 0)
                        this.$http.post('/panel/act/op', {
                            cmd: CommandId.cs_fadeInCountDown,
                            param: {sec: sec}
                        }).then(function (res) {

                        });
                    else
                        alert("没有设置正确时间！！");
                },
                onClkFadeOutCountDown: function () {
                    this.$http.post('/panel/act/op', {
                        cmd: CommandId.cs_fadeOutCountDown
                    }).then(function (res) {

                    });
                },
                onClkFadeInRank: function () {
                    if (this.selected < 1) {
                        alert("没有选择赛事！！")
                    }
                    else {
                        this.$http.post('/panel/act/op', {
                            cmd: CommandId.cs_fadeInRankPanel,
                            param: {activityId: this.selected, limit: 40}
                        }).then(function (res) {
                            console.log('cs_fadeInRankPanel', res);
                        });
                    }

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

                    this.$http.post('/db/player/op', {
                        cmd: CommandId.cs_findPlayerData,
                        param: {playerIdArr: this.playerIdArr}
                    })
                        .then(function (res) {
                            console.log("/db/player/op");
                            playerDataMap = res.data.playerDataMap;//eloScore low at 0
                            vue.playerDataMap = playerDataMap;
                        });
                },
                onRoundSelected: function () {
                    console.log(vue.roundDataArr[this.roundSelected]);
                    vue.gameOptionArr = [];
                    var high = [];
                    var low = [];
                    selectedRoundId = vue.roundDataArr[this.roundSelected].round;
                    console.log('round change', this.roundSelected, selectedRoundId);

                    for (var i = 0; i < vue.roundDataArr[this.roundSelected].gameDataArr.length; i++) {
                        var selGame = vue.roundDataArr[this.roundSelected].gameDataArr[i];
                        var optionData = {value: i, text: ' id:' + selGame.id};
                        if (selGame.section === 0) {
                            optionData.text = '上半区' + optionData.text;
                            high.push(optionData);
                        }
                        else if (selGame.section === 1) {
                            optionData.text = '下半区' + optionData.text;
                            low.push(optionData);
                        }
                        console.log("optionData", optionData);
                    }
                    vue.gameOptionArr = high.concat(low);
                    this.gameSelected = -1;
                    this.playerIdArr = [];
                },
                onGetDateArr: function () {
                    console.log('activity change');
                    var actId = parseInt(this.selected);
                    selectedActivityId = actId;
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

    fadeInRank(playerDataArr, pageNum = 0) {
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
        for (var i = 0; i < 10; i++) {
            var playerData = playerDataArr[i];
            if (!playerData)break;
            imgArr.push(playerData.avatar);
        }

        loadImgArr(imgArr, ()=> {
            for (var i = 0; i < 10; i++) {
                var playerData = playerDataArr[i];
                if (!playerData)break;
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

                var winPercent = new createjs.Text(((playerData.winpercent || 0) * 100).toFixed(2) + "%", "28px Arial", "#fff");
                winPercent.textAlign = 'center';
                winPercent.x = item.x + 710;
                winPercent.y = nameLabel.y;
                this.ctn.addChild(winPercent);

                var eloScore = new createjs.Text(playerData.eloScore, "28px Arial", "#fff");
                eloScore.textAlign = 'center';
                eloScore.x = item.x + 900;
                eloScore.y = nameLabel.y;
                this.ctn.addChild(eloScore);

                var rankPos = new createjs.Text((pageNum * 10 + i + 1).toString(), "28px Arial", "#fff");
                rankPos.textAlign = 'center';
                rankPos.x = item.x + 1100;
                rankPos.y = nameLabel.y;
                this.ctn.addChild(rankPos);
            }

        });

        createjs.Tween.get(this.ctn)
            .to({alpha: 1}, 300);

        if (10 < playerDataArr.length) {
            var nextPage = [];
            for (var i = 10; i < playerDataArr.length; i++) {
                var playerData = playerDataArr[i];
                nextPage.push(playerData);
            }
            createjs.Tween.get(this).wait(10000).call(()=> {
                this.fadeInRank(nextPage, pageNum+1);
            });
        }
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
        // if (len > 6)
        var len = gameInfoArr.length;
        var fadeInCount = 0;

        function fadeSingle(ctn, toX, delay) {
            ctn.x = 1920;
            createjs.Tween.get(ctn)
                .wait(delay)
                .to({x: toX}, 200).call(function () {
                fadeInCount++;
            });
        }

        for (var i = 0; i < 6; i++) {
            if (!gameInfoArr[i])
                break;
            var gameInfo = gameInfoArr[i];
            var gameCtn = new createjs.Container();
            gameCtn.x = (this.stageWidth - 1540) * .5;
            gameCtn.y = i * 169;
            var bg = new createjs.Bitmap('/img/panel/act/bg.png');
            gameCtn.addChild(bg);
            var leftScore = 0;
            var rightScore = 0;
            for (var j = 0; j < gameInfo.playerDataArr.length; j++) {
                var playerInfo = new PlayerInfo(gameInfo.playerDataArr[j]);
                var playerCtn;
                var scoreText = newScoreText();
                scoreText.y = 70;
                if (gameInfo.isFinish)
                    playerInfo.eloScore(gameInfo.playerRecArr[j].eloScore);
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
            fadeSingle(gameCtn, gameCtn.x, i * 250);
        }

        createjs.Tween.get(this.ctn)
            .to({alpha: 1}, 300);

        if (6 < gameInfoArr.length) {
            var nextPage = [];
            for (var i = 6; i < gameInfoArr.length; i++) {
                var gameInfo = gameInfoArr[i];
                nextPage.push(gameInfo);
            }
            createjs.Tween.get(this).wait(5000).call(()=> {
                this.fadeIn(nextPage);
            });
        }
        else {
            // createjs.Tween.get(this.ctn)
            //     .wait(5000).to({alpha: 0}, 300);
        }
    }

    fadeOut() {
        createjs.Tween.get(this.ctn)
            .to({alpha: 0}, 300).call(
            ()=> {
                this.ctn.removeAllChildren();
            }
        );
    }

    fadeInCountDown(sec) {
        this.ctn.removeAllChildren();
        this.ctn.alpha = 0;
        this.cdSec = sec;
        var countDownCtn = new createjs.Container();
        countDownCtn.x = 1920 - 479;
        countDownCtn.y = 1080 - 200;

        var bg = new createjs.Bitmap('/img/panel/act/countDownBg.png');
        countDownCtn.addChild(bg);

        var txt1 = new createjs.Text("", "40px Arial", "#fff");
        txt1.x = 50;
        txt1.y = 25;
        countDownCtn.addChild(txt1);
        if (this.cdTimer)
            clearInterval(this.cdTimer);

        this.cdTimer = setInterval(()=> {
            this.cdSec--;
            if (this.cdSec > 0)
                txt1.text = this.vue.cdText + formatSecond(this.cdSec, '分', '秒');
            else {
                this.fadeOutCountDown();
            }
        }, 1000);

        this.ctn.addChild(countDownCtn);
        createjs.Tween.get(this.ctn)
            .to({alpha: 1}, 300);
    }

    fadeOutCountDown() {
        this.fadeOut();
    }

}
var actView;
$(function () {
    actView = new ActivityPanelView();
});