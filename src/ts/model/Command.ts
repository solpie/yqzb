/// <reference path="../event/EventDispatcher.ts"/>
enum CommandId{
    ShowConsoleWin = 100000,
    //test cmd
    testSwapTrack,
    //
    toggleTracker,
    toggleBallRolling,
    toggleTimer,
    resetTimer,
    disableTracker,
    addLeftScore,
    cs_addLeftScore,
    addRightScore,
    cs_addRightScore,
    updateLeftTeam,
    updateRightTeam,
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

        this.newCmd(CommandId.testSwapTrack, "test swap track");
    }

    newCmd(id:number, name:string, desc?:string) {
        var ci = new CommandItem(id);
        ci.name = name;
        ci.desc = desc;
        this.cmdArr.push(ci);
    }
}