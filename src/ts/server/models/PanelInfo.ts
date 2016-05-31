/// <reference path="../../event/ActEvent.ts"/>
/// <reference path="./PlayerInfo.ts"/>
/// <reference path="./TeamInfo.ts"/>
/// <reference path="./GameInfo.ts"/>
/// <reference path="./DbInfo.ts"/>
/// <reference path="../../utils/JSONFile.ts"/>
/// <reference path="../../model/ElemID.ts"/>
/// <reference path="../../libs/createjs/createjs.d.ts"/>

class PanelInfo {
    //for localhost/panel/pid/
    stage:StagePanelInfo;
    player:PlayerPanelInfo;
    act:ActivityPanelInfo;

    constructor() {
        this.stage = new StagePanelInfo(PanelId.stagePanel, this);
        this.player = new PlayerPanelInfo(PanelId.playerPanel, this);
        this.act = new ActivityPanelInfo(PanelId.actPanel, this);
    }
}
class BasePanelInfo extends EventDispatcher {
    pid:string;
    panelInfo:any;

    constructor(pid, panelInfo) {
        super();
        this.pid = pid;
        this.panelInfo = panelInfo;
        this.initInfo();
    }

    initInfo() {

    }
}

class PlayerPanelInfo extends BasePanelInfo {
    playerData:any;
    position:any = {ctnX: 500, ctnY: 500};

    getInfo() {
        return {
            playerInfoArr: this.panelInfo.stage.getPlayerInfoArr(),
            playerInfo: this.playerData,
            position: this.position
        };
    }

    showPlayerPanel(param:any) {
        var playerId = parseInt(param);
        for (var i = 0; i < this.panelInfo.stage.getPlayerInfoArr().length; i++) {
            var obj = this.panelInfo.stage.getPlayerInfoArr()[i];
            if (obj && obj.id == playerId) {
                this.playerData = obj;
                cmd.emit(CommandId.fadeInPlayerPanel, obj, this.pid);
            }
        }
    }

    hidePlayerPanel() {
        cmd.emit(CommandId.fadeOutPlayerPanel, null, this.pid);
    }

    movePanel(param:any) {
        this.position = param;
        cmd.emit(CommandId.movePlayerPanel, param, this.pid);
    }
}

class ActivityPanelInfo extends BasePanelInfo {
    roundInfo:RoundInfo;
    gameData:any;

    getInfo() {
        return {
            roundInfo: this.roundInfo
        }
    }

    initInfo() {
        this.roundInfo = new RoundInfo();
    }

    getCurPlayerIdArr() {
        if (this.gameData)
            return this.gameData.playerIdArr;
        else
            return []
    }

    fadeInActPanel(param) {
        console.log("fade in act panel", JSON.stringify(param));
        var queryIdArr = [];//[{id:}]
        for (var playerIdArr of param.gameArr) {
            //query playerData
            for (var playerId of playerIdArr) {
                queryIdArr.push({id: playerId});
            }
        }
        console.log('get Player Arr:', JSON.stringify(queryIdArr));
        db.player.getPlayerDataMapByIdArr(queryIdArr, (err, playerDataMap)=> {
            if (!err) {
                this.roundInfo = new RoundInfo();
                for (var playerIdArr of param.gameArr) {
                    //query playerData
                    var gameInfo:GameInfo = new GameInfo();
                    for (var i = 0; i < playerIdArr.length; i++) {
                        var playerId = playerIdArr[i];
                        var playerInfo:PlayerInfo = new PlayerInfo(playerDataMap[playerId]);
                        gameInfo.setPlayerInfoByPos(i, playerInfo);
                        console.log('push playerInfo');
                    }
                    this.roundInfo.gameInfoArr.push(gameInfo);
                }
                cmd.emit(CommandId.fadeInActPanel, this.roundInfo, this.pid);
            }
            else {
                throw new Error(err);
            }
        })
    }

    fadeOutActPanel() {
        cmd.emit(CommandId.fadeOutActPanel, null, this.pid);
    }

    startGame(param) {//{activityId: this.selected, gameData: selGame}
        this.gameData = param.gameData;
        param.gameData.activityId = param.activityId;
        param.gameData.isFinish = false;
        db.game.startGame(param.gameData);
    }

    fadeInRankPanel(param:any) {
        db.player.getRankPlayerArr(param.activityId, param.limit, (err, docs)=> {
            if (!err) {
                cmd.emit(CommandId.fadeInRankPanel, {playerDataArr: docs}, this.pid);
            }
            else
                throw new Error("db error!!");
        });
    }

    fadeOutRankPanel(param:any) {
        cmd.emit(CommandId.fadeOutRankPanel, null, this.pid);
    }
}

class StagePanelInfo extends BasePanelInfo {
    ctnXY:any;
    gameInfo:GameInfo;
    stageNotice:any;

    constructor(pid, panelInfo) {
        super(pid, panelInfo);
        this.gameInfo = new GameInfo();
        this.gameInfo.playerDb = dbPlayerInfo();
        this.initCanvasNotice();
    }

    initCanvasNotice() {
        var stageWidth = 8000;
        var stageHeight = 60;
        var canvas = document.getElementById("canvasNotice");
        canvas.setAttribute("width", stageWidth + "");
        canvas.setAttribute("height", stageHeight + "");
        var stage = new createjs.Stage(canvas);

        this.stageNotice = stage;
        return stage;
    }

    getNoticeImg(content) {
        this.stageNotice.removeAllChildren();
        var noticeLabel = new createjs.Text(content, "35px Arial", "#fff");
        this.stageNotice.addChild(noticeLabel);
        var canvas = document.getElementById("canvasNotice");
        canvas.setAttribute("width", noticeLabel.getBounds().width + "");
        this.stageNotice.cache(0, 0, noticeLabel.getBounds().width, 60);
        this.stageNotice.update();
        var data = this.stageNotice.toDataURL('rgba(0,0,0,0)', "image/png");
        // base64ToPng('img/text.png', data);
        return data;
    }


    getInfo() {
        return {
            playerIdArr: this.panelInfo.act.getCurPlayerIdArr(),
            leftScore: this.gameInfo.leftScore,
            rightScore: this.gameInfo.rightScore,
            time: this.gameInfo.time,
            state: this.gameInfo.timerState,
            ctnXY: this.ctnXY,
            playerInfoArr: this.getPlayerInfoArr()
        }
    }

    getPlayerInfoArr():Array<any> {
        return this.gameInfo.getPlayerInfoArr();
    }

    addLeftScore() {
        this.gameInfo.leftScore = (this.gameInfo.leftScore + 1) % (this.gameInfo.winScore + 1);
        cmd.emit(CommandId.addLeftScore, this.gameInfo.leftScore, this.pid);

        this.gameInfo.straightScoreRight = 0;
        this.gameInfo.straightScoreLeft++;
        if (this.gameInfo.leftScore == 0)
            this.gameInfo.straightScoreLeft = 0;
        if (this.gameInfo.straightScoreLeft == 3) {
            console.log("straight score 3");
            cmd.emit(CommandId.straightScore3, {team: "left"}, this.pid);
        }
        if (this.gameInfo.straightScoreLeft == 5)
            cmd.emit(CommandId.straightScore5, {team: "left"}, this.pid);
    }

    addRightScore() {
        this.gameInfo.rightScore = (this.gameInfo.rightScore + 1) % (this.gameInfo.winScore + 1);
        cmd.emit(CommandId.addRightScore, this.gameInfo.rightScore, this.pid);

        this.gameInfo.straightScoreLeft = 0;
        this.gameInfo.straightScoreRight++;
        if (this.gameInfo.rightScore == 0)
            this.gameInfo.straightScoreRight = 0;
        if (this.gameInfo.straightScoreRight == 3)
            cmd.emit(CommandId.straightScore3, {team: "right"}, this.pid);
        if (this.gameInfo.straightScoreRight == 5)
            cmd.emit(CommandId.straightScore5, {team: "right"}, this.pid);
    }

    toggleTimer() {
        this.gameInfo.toggleTimer();
        cmd.emit(CommandId.toggleTimer, null, this.pid);
    }

    resetTimer() {
        this.gameInfo.resetTimer();
        cmd.emit(CommandId.resetTimer, null, this.pid);
    }

    fadeOut() {
        cmd.emit(CommandId.stageFadeOut, null, this.pid);
    }

    fadeIn() {
        cmd.emit(CommandId.stageFadeIn, null, this.pid);
    }

    playerScore() {
        cmd.emit(CommandId.playerScore, null, this.pid);
    }

    movePanel(param) {
        this.ctnXY = param;
        cmd.emit(CommandId.moveStagePanel, param, this.pid);
    }

    updatePlayer(param:any) {
        var pos = param.pos;
        param.playerInfo.pos = pos;
        // this.playerInfoArr[pos] = param.playerInfo;
        this.gameInfo.setPlayerInfoByPos(pos, param.playerInfo);
        console.log(this, "updatePlayer", JSON.stringify(param.playerInfo), param.playerInfo.pos);
        cmd.emit(CommandId.updatePlayer, param, this.pid);
    }

    showWinPanel(param:any) {
        var winTeam:TeamInfo;
        if (param.mvp < 4) {
            winTeam = this.gameInfo.setLeftTeamWin();
        }
        else {
            winTeam = this.gameInfo.setRightTeamWin();
        }
        console.log("showWinPanel param:", param, "mvp:", param.mvp, this.getPlayerInfoArr());
        // console.log("win team:", JSON.stringify(winTeam.playerInfoArr));

        // if (winTeam)//!winTeam means unsaved
        // {
        for (var i = 0; i < winTeam.playerInfoArr.length; i++) {
            var obj:PlayerInfo = winTeam.playerInfoArr[i];
            if (!obj)
                return;
            if (obj.pos == param.mvp)
                obj.isMvp = true;
            console.log(JSON.stringify(obj));
        }
        cmd.emit(CommandId.fadeInWinPanel, {mvp: param.mvp, playerDataArr: winTeam.playerInfoArr}, this.pid);
        // }
        // else {
        //     //todo unsaved alert in front end;
        // }

        // console.log(this, "after elo");
        // for (var i = 0; i < this.getPlayerInfoArr().length; i++) {
        //     var obj = this.getPlayerInfoArr()[i];
        //     console.log(JSON.stringify(obj));
        // }
    }

    hideWinPanel(param:any) {
        cmd.emit(CommandId.fadeOutWinPanel, param, this.pid);
    }

    updatePlayerAll(playerDataArr:any) {
        for (var i = 0; i < playerDataArr.length; i++) {
            var obj = playerDataArr[i];
            this.gameInfo.setPlayerInfoByPos(obj.pos, obj.playerData);
            console.log(this, "updatePlayer", JSON.stringify(obj.playerData), obj.pos);
        }
        cmd.emit(CommandId.updatePlayerAll, this.getPlayerInfoArr(), this.pid);
    }

    notice(param:any) {
        param.img = this.getNoticeImg(param.notice);
        cmd.emit(CommandId.notice, param, this.pid);
    }
}