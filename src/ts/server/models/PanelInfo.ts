/// <reference path="../../event/ActEvent.ts"/>
class PanelInfo {
    stage:StagePanelInfo;

    constructor() {
        this.stage = new StagePanelInfo(PanelId.stagePanel);
    }
}
class BasePanelInfo extends EventDispatcher {
    pid:string;

    constructor(pid) {
        super();
        this.pid = pid;
    }
}

class StagePanelInfo extends BasePanelInfo {
    winScore:number = 5;
    leftScore:number = 0;
    rightScore:number = 0;
    time:number = 0;
    timerState:number = 0;
    addLeftScore() {
        this.leftScore = (this.leftScore + 1) % (this.winScore + 1);
        // this.broadcast(CommandId.addLeftScore, this.leftScore);
        cmd.emit(CommandId.addLeftScore, this.leftScore, this.pid);
    }

    addRightScore() {
        this.rightScore = (this.rightScore + 1) % (this.winScore + 1);
        cmd.emit(CommandId.addRightScore, this.rightScore, this.pid);
    }

    toggleTimer() {
        cmd.emit(CommandId.toggleTimer, null, this.pid);
    }

    resetTimer() {
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
}