/// <reference path="../../event/ActEvent.ts"/>
/// <reference path="./PlayerInfo.ts"/>
/// <reference path="./TeamInfo.ts"/>
/// <reference path="./GameInfo.ts"/>
/// <reference path="./DbInfo.ts"/>

class PanelInfo {
    //for localhost/panel/pid/
    stage:StagePanelInfo;
    player:PlayerPanelInfo;
    win:WinPanelInfo;

    constructor() {
        this.stage = new StagePanelInfo(PanelId.stagePanel);
        this.player = new PlayerPanelInfo(PanelId.playerPanel);
        this.player.stageInfo = this.stage;
        this.win = new WinPanelInfo(PanelId.winPanel);
    }
}
class BasePanelInfo extends EventDispatcher {
    pid:string;

    constructor(pid) {
        super();
        this.pid = pid;
    }
}

class PlayerPanelInfo extends BasePanelInfo {
    playerData:any;
    position:any = {ctnX: 500, ctnY: 500};
    stageInfo:StagePanelInfo;

    getInfo() {
        return {
            playerInfoArr: this.stageInfo.getPlayerInfoArr(),
            playerInfo: this.playerData,
            position: this.position
        };
    }

    showPlayerPanel(param:any) {
        var playerId = parseInt(param);
        for (var i = 0; i < this.stageInfo.getPlayerInfoArr().length; i++) {
            var obj = this.stageInfo.getPlayerInfoArr()[i];
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
class WinPanelInfo extends BasePanelInfo {
    playerInfoArr:Array<PlayerInfo> = new Array(4);

    getInfo() {
        return {
            playerInfoArr: this.playerInfoArr
        }
    }

    updatePlayerAllWin(param:any) {
        // for (var i = 0; i < param.length; i++) {
        //     var obj = param[i];
        //     this.playerInfoArr[obj.pos] = obj;
        //     console.log(this, "updatePlayer", JSON.stringify(obj), obj.pos, obj.isRed);
        // }
        cmd.emit(CommandId.fadeInWinPanel, param, this.pid);
    }
}

class StagePanelInfo extends BasePanelInfo {
    ctnXY:any;
    gameInfo:GameInfo;

    constructor(pid) {
        super(pid);
        this.gameInfo = new GameInfo();
        this.gameInfo.playerDb = dbPlayerInfo();
    }

    getInfo() {
        return {
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

    // _setPlayerPos(pos, playerInfo) {
    //     playerInfo.isRed = (pos > 3);
    //     this.playerInfoArr[pos] = playerInfo;
    // }

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

        if (winTeam)//!winTeam means unsaved
        {
            for (var i = 0; i < winTeam.playerInfoArr.length; i++) {
                var obj:PlayerInfo = winTeam.playerInfoArr[i];
                if (!obj)
                    return;
                if (obj.pos == param.mvp)
                    obj.isMvp = true;
                console.log(JSON.stringify(obj));
            }
            cmd.emit(CommandId.fadeInWinPanel, {mvp: param.mvp, playerDataArr: winTeam.playerInfoArr}, this.pid);
        }
        else {
            //todo unsaved alert in front end;
        }

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
        cmd.emit(CommandId.notice, param, this.pid);
    }
}