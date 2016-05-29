// import {Vue} from "./BasePanelView";
/**
 * Created by toramisu on 2016/5/28.
 */
/// <reference path="../clientDef.ts"/>
/// <reference path="../../ts/server/models/ActivityInfo.ts"/>
/// <reference path="./BasePanelView.ts"/>

class ActivityPanelView extends BasePanelView {
    ctn:any;
    isInit:Boolean;

    constructor() {
        super();
        this.initVue();
        this.onServer();
    }

    onServer() {
        cmd.on(CommandId.initPanel, (param) => {
            console.log("initPanel::::::::", param);
            this.onInit(param)
        });
    }

    initVue() {
        var vue = new Vue({
            el: '#panel',
            data: {
                dateArr: [],
                selected: 1,
                options: [
                    {text: '测试赛', value: 1},
                    {text: '63运动', value: 2}
                ]
            },
            // watch: {
            //     selected: function (currentValue) {
            //         console.log('date change');
            //         // do my stuff
            //     }
            // },
            methods: {
                onGetDateArr: function () {
                    console.log('date change');
                    var actId = parseInt(this.selected);
                    this.$http.post('/api/act/', {activityId: actId}).then(function (res) {
                        console.log(JSON.stringify(res.data));
                    })
                },
            }
        })
    }

    onInit(param) {
        this.stage = client.panel.stage;
        this.ctn = new createjs.Container();
        // var bg = new createjs.Bitmap('/img/panel/act/bg.png');
        // this.ctn.addChild(bg);
        this.stage.addChild(this.ctn);
    }

    fadeIn(actInfo:ActivityInfo) {
        this.ctn.alpha = 0;
        for (var gameInfo of actInfo.gameInfoArr) {

        }
        createjs.Tween.get(this.ctn)
            .to({alpha: 1}, 300);
    }

    fadeOut() {

    }

}

$(function () {
    new ActivityPanelView();
});