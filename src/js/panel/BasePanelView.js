/// <reference path="../clientDef.ts"/>
var BasePanelView = (function () {
    function BasePanelView() {
        this.stageWidth = 1920;
        this.stageHeight = 1080;
        this.isOp = false;
    }
    BasePanelView.prototype.newBtn = function (func, text) {
        var ctn = new createjs.Container();
        var btn = new createjs.Shape();
        var btnWidth = 75 * 3, btnHeight = 30 * 3;
        btn.graphics
            .beginFill("#3c3c3c")
            .drawRect(0, 0, btnWidth, btnHeight);
        btn.addEventListener("click", func);
        // btn.addEventListener("mousedown", func);
        ctn.addChild(btn);
        if (text) {
            var txt = new createjs.Text(text, "30px Arial", "#e2e2e2");
            txt.x = (btnWidth - txt.getMeasuredWidth()) * .5;
            txt.y = (btnHeight - txt.getMeasuredHeight()) * .5 - 5;
            txt.mouseEnabled = false;
            ctn.addChild(txt);
        }
        return ctn;
    };
    return BasePanelView;
}());
//# sourceMappingURL=BasePanelView.js.map