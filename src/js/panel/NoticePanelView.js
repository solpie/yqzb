/// <reference path="../clientDef.ts"/>
var NoticePanelView = (function () {
    function NoticePanelView(parent) {
        this.isInit = false;
        this.parent = parent;
    }
    NoticePanelView.prototype.init = function () {
        this.ctn = new createjs.Container();
        var bg = new createjs.Bitmap('/img/panel/noticeBg.png');
        this.ctn.addChild(bg);
        // this.noticeLabel = new createjs.Text("手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦", "28px Arial", "#e2e2e2");
        // this.ctn.addChild(this.noticeLabel);
        this.contentCtn = new createjs.Container();
        this.contentCtn.x = 72;
        this.contentCtn.y = 26;
        this.ctn.addChild(this.contentCtn);
        this.mask = new createjs.Shape();
        this.mask.graphics.beginFill("#eee")
            .drawRect(0, 0, 930, 50);
        // this.ctn.addChild(mask);
        // this.contentCtn.addChild(mask);
        // this.noticeLabel.mask = mask;
        this.parent.addChild(this.ctn);
        this.isInit = true;
    };
    NoticePanelView.prototype.getCtn = function () {
        if (!this.isInit)
            this.init();
        return this.ctn;
    };
    NoticePanelView.prototype.fadeInNotice = function (imgData) {
        if (!this.isInit)
            this.init();
        if (this.noticeImg)
            this.contentCtn.removeChild(this.noticeImg);
        this.noticeImg = new createjs.Bitmap(imgData);
        this.noticeImg.mask = this.mask;
        this.contentCtn.addChild(this.noticeImg);
    };
    return NoticePanelView;
}());
//# sourceMappingURL=NoticePanelView.js.map