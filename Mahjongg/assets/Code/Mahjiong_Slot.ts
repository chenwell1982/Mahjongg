import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { Mahjiong_Prefab } from './Mahjiong_Prefab';
import { Mahjiong_Init } from './Mahjiong_Init';
import { Mahjiong_Click } from './Mahjiong_Click';
const { ccclass, property } = _decorator;

@ccclass('Mahjiong_Slot')
export class Mahjiong_Slot extends Component {
    //卡槽管理脚本

    //定时调度(延迟执行)：this.schedule(回调函数,延迟时间,重复次数)
    //this.schedule(()=>{函数体},延迟时间,重复次数)

    @property(Node)//导入消除动画节点
    Boom: Node = null

    Node_List = []//2D麻将节点列表

    Pos = null//动画节点位置

    start() {

    }
    Get_Node(Node: Node) {//接收麻将节点
        this.Set_Order(Node)//设置排列顺序
        this.node.getComponent(Mahjiong_Click).off()//关闭监听：防止用户快速点击
        this.Run_Order()//开始排列
        this.schedule(() => {//定时调度(延迟执行)
            this.Clear_OK(this.Run_Clear(Node))//消除判断
        }, 0.1)
    }
    Clear_OK(num: number) {//消除成功回调函数
        if (num == 1) {//如果麻将不足3个
            this.node.getComponent(Mahjiong_Click).on()//开启监听
        } else if (num == 2) {//如果麻将不足3个
            this.node.getComponent(Mahjiong_Click).on()//开启监听
        } else {//如果是三消
            this.Clear_Boom()//播放消除动画
            this.Run_Order()//重新排列
            this.node.getComponent(Mahjiong_Click).on()//开启监听
        }
    }
    /* 
    设置排列顺序 --- 三消游戏中经典的相邻算法
    1，先获取新麻将的编号
    2，遍历当前麻将列表的麻将编号
    3，对比当前麻将列表内的麻将编号，是否与新麻将编号相同
    4，如果卡槽内有相同的麻将编号，就把新麻将追加到相同麻将编号的后面
    5，如果没有相同的麻将，就正常追加到麻将列表的后面
    */

    Set_Order(Node: Node) {//设置排列顺序
        const list = this.Node_List//接收麻将列表
        let New_Order = Node.getComponent(Mahjiong_Prefab).Num//获取新麻将的编号
        for (let i = list.length - 1; i >= 0; i--) {//倒序遍历列表
            //倒序可以保证新麻将永远在相同麻将后面
            //如果是正序，遇到相同的麻将就可能会从中间插入
            let Old_Order = list[i].getComponent(Mahjiong_Prefab).Num//获取当前麻将的编号
            if (New_Order == Old_Order) {//如果新麻将编号与当前麻将编号相同
                list.splice(i + 1, 0, Node)//把新麻将追加到相同麻将编号的后面
                return//退出函数
            }
        }
        list.push(Node)//正常追加到麻将列表的后面
    }
    Run_Order() {//排列函数
        let Pos_X = -301//初始X坐标
        for (let i of this.Node_List) {
            tween(i).to(0.05, { position: new Vec3(Pos_X, 0, 0) }).start()//缓动动画
            Pos_X += 86//坐标自增
        }
    }

    Run_Clear(node: Node) {//消除函数 ******* 三消经典算法
        if (this.Node_List.length < 3) {//如果列表内的麻将数量小于3
            return 1//退出函数
        }
        let lie = []//创建临时空列表，用于存放相同麻将节点
        const num = node.getComponent(Mahjiong_Prefab).Num//获取当前麻将的编号
        for (let x of this.Node_List) {//遍历列表
            if (num == x.getComponent(Mahjiong_Prefab).Num) {//如果当前麻将编号与新麻将编号相同
                lie.push(x)//把当前麻将追加到临时列表
            }
        }
        if (lie.length < 3) {//如果临时列表内的麻将数量小于3
            return 2//退出函数
        }
        for (let i = 0; i < 3; i++) {//遍历临时列表
            const x = lie[i]//获取相同麻将节点
            this.node.getComponent(Mahjiong_Init).Mahjiong_NodePool.put(x)//回收麻将节点
            this.Node_List = this.Node_List.filter(item => item != x)//返回不等于当前节点的列表
        }
        this.Pos = lie[1].position//获取消除的麻将，中间麻将的位置
        return 3//消除后返回，表示已经消除成功
    }

    Clear_Boom() {//消除动画
        let Scale = 0.1//初始缩放系数
        this.Boom.setPosition(this.Pos)//把动画节点移动到消除的中间麻将的位置
        this.Boom.setScale(Scale, Scale, Scale)//设置缩放
        this.Boom.active = true//显示动画节点
        const boom = () => {//动画执行内部函数
            Scale += 0.1//自增缩放
            this.Boom.setScale(Scale, Scale, Scale)//设置缩放
            if (Scale >= 0.8) {//如果缩放系数大于1.2
                this.Boom.active = false//隐藏动画节点
                this.unschedule(boom)//取消定时调度
            }
        }
        this.schedule(boom, 0.01)//定时调度执行动画
    }
    update(deltaTime: number) {

    }
}


