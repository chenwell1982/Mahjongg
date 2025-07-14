import { _decorator, BoxCollider, Camera, Component, EventTouch, geometry, Input, input, Node, PhysicsSystem, RigidBody, Vec3 } from 'cc';
import { Mahjiong_Prefab } from './Mahjiong_Prefab';
import { Mahjiong_Slot } from './Mahjiong_Slot';
const { ccclass, property } = _decorator;

@ccclass('Mahjiong_Click')
export class Mahjiong_Click extends Component {
    //麻将触摸脚本

    /* 
    触摸结束监听类型：Input.EventType.TOUCH_END
    射线检测流程：原理：创建射线，检测射线击中的碰撞体，获取碰撞体信息
    创建射线对象：Ray = new geometry.Ray()
    获取相机组件：Camera
    发射射线：相机组件.screenPointToRay(触摸的X坐标，Y坐标，Z坐标)
    发射射线说明：3D相机节点位置是射线起始点，方向是触摸位置的3D空间方向(无限穿透)
    检测射线上最近的碰撞体：PhysicsSystem.instance.raycastClosest(需要检测的射线)
    返回true表示射线击中了碰撞体
    碰撞体信息：PhysicsSystem.instance.raycastClosestResult
    返回false表示射线没有检测到碰撞体
    获取被击中到的碰撞组件/节点：碰撞体信息.collider / 碰撞体信息.collider.node
    */

    /* 
    3D节点转2D节点
    关闭3D节点刚体和碰撞组件：组件.enabled = false
    节点添加3D渲染转2D渲染组件：UIMeshRenderer --- 在编辑器选择节点添加UIMeshRenderer组件
    修改节点所属层为2D：节点.layer = Layer.Enum.UI_2D
    3D坐标转2D本地坐标(根据父节点)：相机组件.convertToUINode(3D坐标，2D父节点)
    设置2D节点：2D坐标、父节点、缩放、旋转
    */



    Ray = new geometry.Ray() //创建射线对象
    @property(Camera)
    Camera: Camera = null //相机组件

    @property(Node)//导入2D麻将父节点
    Mahjiong_2D: Node = null

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
                //console.log(node.getComponent(Mahjiong_Prefab).Num)//输出麻将编号
                this.Mahjiong_3To2(node)//执行麻将节点转换
            }
        }
    }

    Mahjiong_3To2(node: Node) {
        node.getComponent(RigidBody).enabled = false//禁用刚体组件
        node.getComponent(BoxCollider).enabled = false//禁用碰撞组件
        node.getComponent(Mahjiong_Prefab).UI_2D()//麻将设置为2D所属层
        let Pos_3D = node.worldPosition//获取3D节点世界坐标
        let Pos_2D = this.Camera.convertToUINode(Pos_3D, this.Mahjiong_2D)//3D坐标转2D坐标
        node.setPosition(Pos_2D)//将3D节点坐标设置为2D节点坐标  
        node.setParent(this.Mahjiong_2D)//设置父节点
        node.setScale(102, 102, 102)//设置缩放
        node.eulerAngles = new Vec3(90, 0, 0)//设置旋转
        this.node.getComponent(Mahjiong_Slot).Get_Node(node)//传入节点到卡槽函数
    }
    update(deltaTime: number) {

    }
}


