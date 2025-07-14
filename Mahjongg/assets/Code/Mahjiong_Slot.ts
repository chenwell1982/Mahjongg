import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { Mahjiong_Prefab } from './Mahjiong_Prefab';
const { ccclass, property } = _decorator;

@ccclass('Mahjiong_Slot')
export class Mahjiong_Slot extends Component {
    //卡槽管理脚本
    Node_List = []//2D麻将节点列表
    start() {

    }
    Get_Node(Node: Node) {//接收麻将节点
        this.Set_Order(Node)//设置排列顺序
        //this.Node_List.push(Node)//追加麻将到列表内
        this.Run_Order()//开始排列
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

    update(deltaTime: number) {

    }
}


