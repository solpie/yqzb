class EventDispatcher {
    _func:Object;
    _funcId:number;

    constructor() {
        this._func = {};
        this._funcId = 0;
    }

    on(type:any, func) {
        if (!this._func[type])
            this._func[type] = [];
        this._funcId++;
        this._func[type].push({func: func, id: this._funcId});
    }

    emit(type:any, param = null,panelid=null) {
        console.log(this._func);
        if (this._func[type]) {
            for (var i = 0; i < this._func[type].length; ++i) {
                var f = this._func[type][i];
                if (f)
                    f.func(param);
            }
        }
        if (this.broadcast)
            this.broadcast(panelid,type, param);
    }

    proxy:any;

    broadcast:any;

    del(type:string, funcId:number = -1) {
        if (this._func[type])
            if (funcId < 0) {
                this._func[type] = [];
            }
            else {
                for (var i = 0; i < this._func[type].length; ++i) {
                    var f = this._func[type][i];
                    if (f) {
                        if (f.id == funcId) {
                            delete this._func[type][i];
                            console.log('del event', type, funcId);
                            break;
                        }
                    }
                }
            }

    }

    removeAll() {
        this._func = {};
    }
}