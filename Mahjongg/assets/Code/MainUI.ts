import { _decorator, Component, director, Label, Node } from 'cc';
import { Get_Data } from './Get_Data';
import { Mahjiong_Prefab } from './Mahjiong_Prefab';
import { Mahjiong_Click } from './Mahjiong_Click';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {
    //UI脚本

    //导入文本组件
    @property(Label)
    Name_Label: Label = null;//关卡名字
    @property(Label)
    Number_Label: Label = null;//关卡数量
    @property(Label)
    Time_Label: Label = null;//关卡时间
    @property(Node)
    Win_Node: Node = null;//胜利节点
    @property(Node)
    Time_Qut: Node = null;//时间到节点
    @property(Node)
    Stop_Node: Node = null;//暂停节点

    //定义参数，便于后续使用
    Name = null;//关卡名字
    Number = null;//关卡数量
    Time = null;//关卡时间

    Time_SW = true;//时间定时调度开关

    start() {

    }

    Init() {
        //初始化文本
        this.Name = this.node.getComponent(Get_Data).Name//读取关卡名字
        this.Number = this.node.getComponent(Get_Data).Number//读取关卡总数
        this.Time = this.node.getComponent(Get_Data).Time//读取关卡时间
        //设置文本显示
        this.Name_Label.string = this.Name
        this.Number_Label.string = "剩余数量:" + this.Number
        this.Time_Label.string = this.Time_Count(this.Time)//设置时间
        this.Up_Time()//更新时间
    }
    Up_Number() {
        //更新数量文本
        this.Number -= 3
        this.Number_Label.string = "剩余数量:" + this.Number
        if (this.Number > 0) {
            //数量大于0，开启监听
            this.node.getComponent(Mahjiong_Click).on()
        } else {//如果没有麻将，消除完毕
            this.Win()
        }
    }
    Win() {
        //胜利节点显示
        this.Win_Node.active = true
    }
    Next_Game() {
        let Game: any = localStorage.getItem("Game_MJ")//读取本地关数
        Game = Number(Game) + 1//关卡数+1
        localStorage.setItem("Game_MJ", String(Game))//写入本地关数
        director.loadScene("Main")//重新加载场景
    }
    Up_Time() {
        this.Time_Label.string = this.Time_Count(this.Time)//显示时间
        //时间倒计时
        let Time = () => {//倒计时函数
            if (!this.Time_SW) { return }//如果时间开关关闭了，就不再往下执行
            this.Time_Label.string = this.Time_Count(this.Time -= 1)//更新文本显示
            if (this.Time <= 0) {//如果时间小于等于0
                this.unschedule(Time)//取消定时调度
                this.Time_Out()//时间到节点显示
            }
        }
        this.schedule(Time, 1)//定时调度执行倒计时函数
    }
    Time_Count(Num) {//时间格式转换
        const M = Math.floor(Num / 60)//计算分钟
        const S = Num % 60//计算秒
        const M1 = (M < 10 ? "0" : '') + M//分钟小于10，前面加0
        const S1 = (S < 10 ? "0" : '') + S//秒小于10，前面加0
        const Time = `${M1}:${S1}`//打包字符串
        return Time//返回时间字符串
    }
    Time_Out() {
        //时间到节点显示
        this.node.getComponent(Mahjiong_Click).off()//取消监听和停止计时
        this.Time_Qut.active = true//显示倒计时结束节点
    }

    Time_Add_Ad() {//看完广告后，延迟0.5秒，执行this.Time_Add()
        console
        this.scheduleOnce(() => {
            this.Time_Add()
        }, 0.5)
    }

    Time_Add() {
        this.Time_Qut.active = false//隐藏倒计时结束节点
        //时间增加
        this.Time += 60//时间增加
        this.node.getComponent(Mahjiong_Click).on()//取消监听和停止计时
        this.Up_Time()//更新时间
    }

    On_Stop() {//开启暂停
        this.node.getComponent(Mahjiong_Click).off()//取消监听和停止计时
        this.Stop_Node.active = true//暂停节点显示
    }
    Off_Stop() {//关闭暂停
        this.node.getComponent(Mahjiong_Click).on()//开启监听和停止计时
        this.Stop_Node.active = false//暂停节点隐藏
    }


    update(deltaTime: number) {

    }
}


