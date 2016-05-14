/// <reference path="../event/ActEvent.ts"/>
class PanelInfo {
    stagePanelInfo:StagePanelInfo;

    constructor() {
        this.stagePanelInfo = new StagePanelInfo();
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
}