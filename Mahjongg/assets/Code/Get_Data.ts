import { _decorator, Component, Node } from 'cc';
import { Config } from './Config';
const { ccclass, property } = _decorator;

@ccclass('Get_Data')
export class Get_Data extends Component {
    //读写玩家数据脚本

    //写入玩家本地数据：localStorage.setItem("标题","内容")
    //读取玩家本地数据：localStorage.getItem("标题")
    //删除玩家本地数据：localStorage.removeItem("标题")
    //清除所有玩家本地数据：localStorage.clear()

    Name = null //关卡名称
    Group = null //组数
    Class = null //麻将类型1-42
    Number = null //关卡总数
    Time = null //关卡限时
    protected onLoad(): void {
        let Game: any = localStorage.getItem("Game_MJ")//读取数据，如果玩家第一次登录，读取不到内容
        if (Game) {//如果有数据
            Game = Config[Game]//根据数值，读取对应关卡配置数据
            this.Get(Game)//接收关卡数值
        } else {//如果没有读取到数值(玩家第一次登录)
            localStorage.setItem("Game_MJ", "1")//写入初始关卡数值
            Game = Config["1"]//根据数值，读取对应关卡配置数据
            this.Get(Game)//接收关卡数值
        }
    }

    Get(Game: any) {
        this.Name = Game.Name//接收关卡名字
        this.Group = Game.Group//接收组数
        this.Class = Game.Class//接收麻将类型
        this.Number = Game.Group * 3//接收关卡总数
        this.Time = Game.Time//接收关卡限时
    }
    start() {

    }

    update(deltaTime: number) {

    }
}


