/// <reference path="../event/ActEvent.ts"/>
class PanelInfo {
    stage:StagePanelInfo;

    constructor() {
        this.stage = new StagePanelInfo();
    }
}

class StagePanelInfo extends EventDispatcher {
    winScore:number = 5;
    leftScore:number = 0;
    rightScore:number = 0;
    time:number = 0;
    timerState:number = 0;

    addLeftScore() {
        this.leftScore = (this.leftScore + 1) % (this.winScore + 1);
        cmd.emit(CommandId.addLeftScore, this.leftScore);
    }

    addRightScore() {
        this.rightScore = (this.rightScore + 1) % (this.winScore + 1);
        cmd.emit(CommandId.addRightScore, this.rightScore);
    }
    
    toggleTimer(){
        cmd.emit(CommandId.toggleTimer);    
    }

    resetTimer() {
        cmd.emit(CommandId.resetTimer);
    }

    fadeOut() {
        cmd.emit(CommandId.stageFadeOut);
    }

    fadeIn() {
        cmd.emit(CommandId.stageFadeIn);
    }

    playerScore() {
        cmd.emit(CommandId.playerScore);
    }
}