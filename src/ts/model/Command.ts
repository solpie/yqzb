/// <reference path="../event/EventDispatcher.ts"/>
enum CommandId{
    ShowConsoleWin = 100000,
    //
    toggleTracker,
    toggleBallRolling,
    //stage panel
    toggleTimer,
    cs_toggleTimer,
    resetTimer,
    cs_resetTimer,
    disableTracker,
    addLeftScore,
    cs_addLeftScore,//1000010
    addRightScore,
    cs_addRightScore,

    minLeftScore,
    cs_minLeftScore,//1000010
    minRightScore,
    cs_minRightScore,

    stageFadeOut,
    cs_fadeOut,
    playerScore,
    cs_playerScore,
    stageFadeIn,
    cs_stageFadeIn,
    moveStagePanel,
    cs_moveStagePanel,//1000020
    updatePlayer,
    cs_updatePlayer,
    updatePlayerAll,
    cs_updatePlayerAll,
    notice,//小喇叭
    cs_notice,
    cs_resetGame,//重置比分 时间 player
    cs_unLimitScore,//不限制比分显示
    unLimitScore,//不限制比分显示
    //-----------------win panel
    fadeInWinPanel,
    cs_fadeInWinPanel,
    fadeOutWinPanel,
    cs_fadeOutWinPanel,
    saveGameRec,
    cs_saveGameRec,
    //---------------- player panel
    cs_queryPlayerByPos,
    fadeInPlayerPanel,
    cs_fadeInPlayerPanel,
    fadeOutPlayerPanel,
    cs_fadeOutPlayerPanel,
    movePlayerPanel,
    cs_movePlayerPanel,
    //自动三杀事件
    straightScore3,
    straightScore5,

    initPanel,
    /////activity panel
    cs_fadeInActPanel,
    fadeInActPanel,
    cs_fadeOutActPanel,
    fadeOutActPanel,
    cs_startGame,
    cs_fadeInRankPanel,
    fadeInRankPanel,

    cs_fadeOutRankPanel,
    fadeOutRankPanel,

    cs_fadeInCountDown,
    fadeInCountDown,
        
    cs_fadeOutCountDown,
    fadeOutCountDown,
    //db op
    cs_findPlayerData,
}
class CommandItem {
    id:number;
    name:string;
    desc:string;

    constructor(id) {
        this.id = id;
    }
}
class Command extends EventDispatcher {
    cmdArr:Array<CommandItem>;

    constructor() {
        super();
        this.cmdArr = [];
        this.newCmd(CommandId.addLeftScore, "addLeftScore");
        this.newCmd(CommandId.addRightScore, "addRightScore");
        this.newCmd(CommandId.toggleTracker, "toggleTracker");
        this.newCmd(CommandId.toggleTimer, "toggleTimer");
        this.newCmd(CommandId.toggleBallRolling, "toggleBallRolling");
        this.newCmd(CommandId.disableTracker, "disableTracker");
        ////test cmd

        // this.newCmd(CommandId.testSwapTrack, "test swap track");
    }

    newCmd(id:number, name:string, desc?:string) {
        var ci = new CommandItem(id);
        ci.name = name;
        ci.desc = desc;
        this.cmdArr.push(ci);
    }
}

