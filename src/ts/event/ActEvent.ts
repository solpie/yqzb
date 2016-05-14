/// <reference path="EventDispatcher.ts"/>
class BaseEvent {
    type:string;
    target:EventDispatcher;
}
enum  MouseButton{
    LEFT = 0,
    MID ,
    RIGHT,
}
class MouseEvt {
    static CLICK:string = "click";//build-in name
    static DBLCLICK:string = "dblclick";//build-in name
    static MOVE:string = "mousemove";
    static UP:string = "mouseup";//build-in name
    static DOWN:string = "mousedown";//build-in name
    static LEAVE:string = "mouseleave";//build-in name
    static RCLICK:string = "contextmenu";//build-in name
}
class KeyEvt {
    static DOWN:string = "keydown";//build-in name
    static UP:string = "keyup";//build-in name
    static PRESS:string = "keypress";//build-in name

}
class ViewEvent {
    static CHANGED:string = "change";//build-in name
    static RESIZE:string = "resize";
    static SCROLL:string = "scroll";
    static LOADED:string = "loaded";
    static HIDED:string = "hided";
}