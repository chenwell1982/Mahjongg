import { _decorator, BoxCollider, Component, Node, RigidBody, tween, Vec3 } from 'cc';
import { Mahjiong_Slot } from './Mahjiong_Slot';
import { Mahjiong_Prefab } from './Mahjiong_Prefab';
const { ccclass, property } = _decorator;

@ccclass('Clear')
export class Clear extends Component {
    //清空功能脚本

    //平移回调函数：平移对象0.call(()=>{函数体})

    @property(Node)
    ZDBG: Node = null//遮挡背景导入
    @property(Node)
    No_Node_Tips: Node = null//提示节点导入


    start() {

    }
    Clear_Ad() {
        console.log("这里写看广告函数")
        this.scheduleOnce(() => {
            this.Clear()//调用清空函数
        }, 0.05)//延迟0.05秒执行
    }
    Clear() {//清空
        let mj = this.node.getComponent(Mahjiong_Slot).Node_List//接收卡槽麻将列表
        if (mj.length <= 0) {
            this.No_Node_Tips.active = true//显示提示节点
            this.scheduleOnce(() => {
                this.No_Node_Tips.active = false//隐藏提示节点
            }, 0.5)//0.5秒后执行
            return
        }
        this.ZDBG.active = true//显示遮挡背景
        let Pos_X_2D = -301//初始X坐标2D
        let Pos_x_3D = -1.5//初始X坐标3D
        for (let i of mj) {
            tween(i).to(0.05, { position: new Vec3(Pos_X_2D, 660, 0) }).call(() => {
                i.setParent(this.node)//设置父节点
                i.getComponent(Mahjiong_Prefab).UI_3D()//麻将设置成3D节点
                i.eulerAngles = new Vec3(0, 0, 0)//设置旋转角度
                i.setScale(new Vec3(1, 1, 1))//设置缩放
                i.getComponent(RigidBody).enabled = true//启用刚体组件
                i.getComponent(BoxCollider).enabled = true//启动碰撞组件
                i.setPosition(new Vec3(Pos_x_3D, 5, 0))//设置3D坐标
                i.active = false//隐藏节点
                i.active = true//激活节点
                Pos_x_3D += 0.45//坐标自增
            }).start()//缓动动画
            Pos_X_2D += 86//坐标自增
        }
        this.node.getComponent(Mahjiong_Slot).Node_List = []//清空卡槽列表
        this.scheduleOnce(() => {
            this.ZDBG.active = false//隐藏遮挡背景
        }, 0.5)//0.5秒后执行
    }
    update(deltaTime: number) {

    }
}


