/**
 * Created by toramisu on 2016/5/9.
 */
/// <reference path="../lib.ts"/>
/// <reference path="StagePanelView.ts"/>
/// <reference path="TrackerView.ts"/>
import Stage = createjs.Stage;

class StageView {
    canvasEl:HTMLElement;
    canvas:HTMLElement;
    stage:Stage;
    ctx:any;
    stageWidth:number = 1200;
    stageHeight:number = 800;
    panelView:TopPanelView;
    trackerView:TrackerView;

    constructor() {
        //this.canvasEl = document.getElementById("stage");
        //this.canvasEl.setAttribute("width", 800 + "");
        //this.canvasEl.setAttribute("height", 300 + "");
        //this.ctx = this.canvasEl.getContext("2d");
        /////////draw bar
        //this._fillRect("#ffff00", 0, 0, 800, 300);
        //this.test()


        ////createjs
        this.canvas = document.getElementById("stage");
        this.canvas.setAttribute("width", this.stageWidth + "");
        this.canvas.setAttribute("height", this.stageHeight + "");
        this.stage = new createjs.Stage(this.canvas);
        this.stage.autoClear = true;


        //stage bg
        //var bgRed = new createjs.Shape();
        //bgRed.graphics.beginFill("#ff0000");
        //bgRed.graphics.beginFill("#2b2b2b");
        //bgRed.graphics.drawRect(0, 0, this.stageWidth, this.stageHeight);
        //bgRed.graphics.endFill();
        //this.stage.addChild(bgRed);
        //add mod
        this.panelView = new TopPanelView(this.stage, false);
        this.trackerView = new TrackerView(this.stage, false);


        ////avatar panel
        //var bgAvatar = new createjs.Shape();
        //bgAvatar.graphics.beginFill("#cccccc");
        //bgAvatar.graphics.drawRect(5, 50, 115, 580);
        //bgAvatar.graphics.endFill();
        //this.stage.addChild(bgAvatar);


        //var images = [];
        //for (var i = 1; i <= 14; i++) {
        //    images.push("img/grossini_dance_" + (i < 10 ? ("0" + i) : i) + ".png");
        //}
        ////
        //var sheet = new createjs.SpriteSheet({
        //    images: images,
        //    frames: {width: 85, height: 121, regX: 42, regY: 60}
        //});
        ////需要设置每帧的宽高，注册点信息
        //var man = new createjs.Sprite(sheet);
        //man.framerate = 60 / 7;
        //man.x = 300;
        //man.y = 400;
        //man.play();
        //this.stage.addChild(man);
        ////  }
        //this.stage.update();


        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", ()=> {
            this.stage.update(event);
        });
    }


    init() {

    }

    test() {
        //var image = new Image();
        //image.onload = ()=> {
        //    //this.ctx.drawImage(image, 0, 60, 53, 53);
        //    //this.ctx.drawImage(image, 0, 0, 53, 80, 10, 10, 53, 80);
        //    //this._drawImage(image, 50, 50, 586, 111, 0, 0);
        //
        //    var posy = 0;
        //    var tween = TweenLite.to(image, 2, {
        //        paused: true,
        //        setFilterRadius: 0,
        //        onUpdate: ()=> {
        //            this.ctx.clearRect(0, 0, 800, 300);
        //            this._drawImage(image, posy, 5, 586, 111, 0, 0);
        //            posy += 1;
        //            console.log(posy);
        //        }
        //    });
        //    //tween.play();
        //};
        ////image.src = "img/digits.png";
        //image.src = "img/panel.png";
        //TweenLite.to("#img2", 2, {left: 200, opacity: 0}).play();
        //TweenLite.to("#quote", 2, {
        //    left: 200, opacity: 0, onUpdate: ()=> {
        //    }
        //}).play();
    }

    addScore() {

    }
}