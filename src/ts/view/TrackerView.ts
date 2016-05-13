import Container = createjs.Container;


class TrackerView extends BaseView {
    tracker:Container;
    ballCtn:Container;
    constructor(stage) {
        super();
        this.stage = stage;
        this.init();

        cmd.on(CommandId.toggleTracker, ()=> {
            if (this.tracker.parent)
                this.tracker.parent.removeChild(this.tracker);
            else
                this.stage.addChildAt(this.tracker, 1);
        });

        appInfo.on(MouseEvt.MOVE, ()=> {
            if (this.tracker.visible) {
                this.tracker.x = appInfo.mouseX - 100;
                this.tracker.y = appInfo.mouseY - 300;
            }
            else {

            }
        });

        var isRolling = false;
        cmd.on(CommandId.toggleBallRolling, ()=> {
            if (!isRolling) {
                isRolling = true;
                createjs.Tween.get(this.ballCtn, {loop: false}, true)
                    .to({rotation: 5 * 360}, 200, createjs.Ease.circInOut)
                    .call(()=> {
                        this.ballCtn.rotation = 0;
                        isRolling = false;
                    });
            }
        });
    }

    init() {
        //var sp = new createjs.
        var tracker = new createjs.Container();
        this.tracker = tracker;
        //this.stage.addChild(tracker);
        var bg = new createjs.Bitmap("img/trackBg.png");
        tracker.addChild(bg);
        tracker.x = 300;
        tracker.y = 300;
        tracker.scaleX = tracker.scaleY = .5;

        var ballCtn = new createjs.Container();
        ballCtn.x = 80+29*2;
        ballCtn.y = 80+116*2;
        tracker.addChild(ballCtn);
        var ball = new createjs.Bitmap("img/trackBall.png");
        ball.x = -39;
        ball.y = -35;
        ballCtn.addChild(ball);
        this.ballCtn = ballCtn;
        ////



        var video = document.getElementById('camFeed');
        var canvas = document.getElementById('camCanvas');
        var context = canvas.getContext('2d');

        var tracker1 = new tracking.ObjectTracker('face');
        tracker1.setInitialScale(4);
        tracker1.setStepSize(2);
        tracker1.setEdgesDensity(0.1);

        tracking.track('#camFeed', tracker1, { camera: true });

        tracker1.on('track', function(event) {
            context.clearRect(0, 0, canvas.width, canvas.height);

            event.data.forEach(function(rect) {
                context.strokeStyle = '#a64ceb';
                context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                context.font = '11px Helvetica';
                context.fillStyle = "#fff";
                context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
            });
        });
    }
}