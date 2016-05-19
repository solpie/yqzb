/// <reference path="../Node.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../JQuery.ts"/>
var gui = require('nw.gui');
var win = gui.Window.get();
class WindowView {
    isMaximize:boolean = false;

    constructor() {
        // $("#btnClose").on(MouseEvt.CLICK, function () {
        //     win.close();
        // });
        // $("#btnDbg").on(MouseEvt.CLICK, function () {
        //     win.showDevTools('', true);
        // });
        ///dashboard
        //var win = gui.Window.open ('panel.html', {
        //    position: 'center',
        //    toolbar: false,
        //    width: 901,
        //    height: 523
        //});
        //
        //default op
        // var op = gui.Window.open ('http://localhost/panel/stage/op', {
        //    position: 'center',
        //    toolbar: false,
        //    width: 1920,
        //    height: 1200
        // });

        //win.on ('loaded', function () {
        //    // the native onload event has just occurred
        //    var doc = win.window.document;
        //    var getElmById = function (elmId) {
        //        return doc.getElementById(elmId);
        //    };
        //    var addBtnClick = function (elmId,func) {
        //        getElmById(elmId).onclick = func;
        //    };
        //    ///
        //    addBtnClick("btnAddLeftScore", () => {
        //        cmd.emit(CommandId.addLeftScore);
        //    });
        //    addBtnClick("btnAddRightScore", () => {
        //        cmd.emit(CommandId.addRightScore);
        //    });
        //    addBtnClick("btnToggleTime", () => {
        //        cmd.emit(CommandId.toggleTimer);
        //    });
        //    addBtnClick("btnResetTime", () => {
        //        cmd.emit(CommandId.resetTimer);
        //    });
        //});




        //$("#btnMin").on(MouseEvt.CLICK, function () {
        //    win.minimize();
        //});
        //$("#btnMax").on(MouseEvt.CLICK, function () {
        //    if (this.isMaximize) {
        //        win.unmaximize();
        //        this.isMaximize = false;
        //    }
        //    else {
        //        win.maximize();
        //        this.isMaximize = true;
        //    }
        //});
    }
}

