import { _decorator, Camera, Component, EventTouch, geometry, Input, input, Node, PhysicsSystem } from 'cc';
import { Mahjiong_Prefab } from './Mahjiong_Prefab';
const { ccclass, property } = _decorator;

@ccclass('Mahjiong_Click')
export class Mahjiong_Click extends Component {
    //麻将触摸脚本

    //触摸结束监听类型：Input.EventType.TOUCH_END
    //射线检测流程：原理：创建射线，检测射线击中的碰撞体，获取碰撞体信息
    //创建射线对象：Ray = new geometry.Ray()
    //获取相机组件：Camera
    //发射射线：相机组件.screenPointToRay(触摸的X坐标，Y坐标，Z坐标)
    //发射射线说明：3D相机节点位置是射线起始点，方向是触摸位置的3D空间方向(无限穿透)
    //检测射线上最近的碰撞体：PhysicsSystem.instance.raycastClosest(需要检测的射线)
    //返回true表示射线击中了碰撞体
    //碰撞体信息：PhysicsSystem.instance.raycastClosestResult
    //返回false表示射线没有检测到碰撞体
    //获取被击中到的碰撞组件/节点：碰撞体信息.collider / 碰撞体信息.collider.node

    Ray = new geometry.Ray() //创建射线对象
    @property(Camera)
    Camera: Camera = null //相机组件

    start() {

    }
    protected onDestroy(): void {//销毁函数，关闭监听
        input.off(Input.EventType.TOUCH_END, this.TOUCH_END, this);
    }
    on() {//开启触摸结束监听
        input.on(Input.EventType.TOUCH_END, this.TOUCH_END, this);
    }
    off() {//关闭触摸结束监听
        input.off(Input.EventType.TOUCH_END, this.TOUCH_END, this);
    }
    TOUCH_END(event: EventTouch) {//触摸结束回调函数
        this.Camera.screenPointToRay(event.getLocationX(), event.getLocationY(), this.Ray)//发射射线
        if (PhysicsSystem.instance.raycastClosest(this.Ray)) {//检测射线是否击中了碰撞体
            const node: Node = PhysicsSystem.instance.raycastClosestResult.collider.node//获取碰撞体节点
            if (node.name == "Mahjiong") {//判断节点名称是否为麻将节点
                console.log(node.getComponent(Mahjiong_Prefab).Num)//输出麻将编号
            }
        }
    }

    update(deltaTime: number) {

    }
}


