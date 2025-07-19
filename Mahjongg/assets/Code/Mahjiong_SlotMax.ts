import { _decorator, Component, director, Node } from 'cc';
import { Mahjiong_Click } from './Mahjiong_Click';
import { Mahjiong_Slot } from './Mahjiong_Slot';
import { Clear } from './Clear';
const { ccclass, property } = _decorator;

@ccclass('Mahjiong_SlotMax')
export class Mahjiong_SlotMax extends Component {
    //卡槽上限控制脚本

    @property(Node)//导入解锁节点
    Unlk_1: Node = null
    @property(Node)//导入解锁节点
    Unlk_2: Node = null


    @property(Node)//导入游戏失败UI节点
    Slot_Max_UI_Node: Node = null
    Max_Num = 6//初始卡槽值
    start() {

    }

    Max(Num) {//卡槽上限判断函数
        if (Num >= this.Max_Num) {//如果卡槽上限达到
            this.Slot_Max_UI_Node.active = true//显示游戏失败UI节点
        } else {
            this.node.getComponent(Mahjiong_Click).on()//如果卡槽没满，开启监听
        }

    }
    Unlk_Ad() {//分享/广告
        console.log("这里写分享函数")
        this.scheduleOnce(() => {//
            this.Unlk()
        }, 0.01)
    }
    Unlk() {//解锁卡槽上限函数
        if (this.Max_Num == 6) {
            this.Unlk_1.active = false//因此第一个解锁节点
            this.Max_Num = 7//增加卡槽上限
        } else if (this.Max_Num == 7) {
            this.Unlk_2.active = false//因此第二个解锁节点
            this.Max_Num = 8//增加卡槽上限
        }
    }
    Restart() {//重新开始游戏函数
        director.loadScene("Main")//重新加载场景
    }

    clear() {//清空继续执行函数
        this.Slot_Max_UI_Node.active = false//隐藏游戏失败UI节点
        this.node.getComponent(Clear).Clear_Ad()//调用清空脚本
        this.node.getComponent(Mahjiong_Click).on()//重新开启监听
    }
    update(deltaTime: number) {

    }
}


