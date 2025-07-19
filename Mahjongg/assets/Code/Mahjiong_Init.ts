import { _decorator, Component, instantiate, Node, NodePool, Prefab, RigidBody, Vec3 } from 'cc';
import { Mahjiong_Prefab } from './Mahjiong_Prefab';
import { Mahjiong_Click } from './Mahjiong_Click';
import { Get_Data } from './Get_Data';
import { MainUI } from './MainUI';
const { ccclass, property } = _decorator;

@ccclass('Mahjiong_Init')
export class Mahjiong_Init extends Component {
    //麻将初始化脚本

    /* 
    节点池：NodePool，适用于频繁创建/销毁的节点，如子弹
    用于管理节点的缓存池
    避免反复创建，销毁节点，节约游戏性能
    创建节点池：节点池 = new NodePool();
    从节点池获取节点：节点池.get();
    将节点放回节点池：节点池.put(节点);
    节点池销毁：节点池.clear();
    节点池大小：节点池.size();
    节点池是否为空：节点池.hasFree();
    节点池是否为满：节点池.hasAny();
    节点池最大容量：节点池.maxSize;
    节点池最小容量：节点池.minSize;
    节点池自动增长：节点池.autoReleaseCount;
    节点池初始化：节点池.init(节点);
    节点池预加载：节点池.preload(节点);
    节点池预加载多个：节点池.preloadMultiple(节点,数量);
    节点池回收所有节点并销毁：节点池.destroy();
    节点池回收所有节点并销毁所有组件：节点池.destroyAll();
    节点池回收所有节点并销毁所有组件并重置节点：节点池.destroyAll(true);
    节点池回收所有节点并销毁所有组件并重置节点并重置位置：节点池.destroyAll(true,true);
    */

    /* 
    定时器调度功能(循环执行某个函数)：this.schedule(函数，间隔时间)
    停止调度(停止循环)：this.unschedule(函数);
    定时器调度功能(只执行一次)：this.scheduleOnce(函数，间隔时间);
    定时器调度功能(延迟执行)：this.scheduleOnce(函数，间隔时间，延迟时间);
    定时器调度功能(循环执行某个函数，延迟执行)：this.schedule(函数，间隔时间，延迟时间);
    定时器调度功能(循环执行某个函数，延迟执行，重复次数)：this.schedule(函数，间隔时间，延迟时间，重复次数);
    */

    @property(Prefab)
    Mahjiong_Prefab: Prefab = null;//导入麻将预制体

    Mahjiong_NodePool: NodePool = null;//节点池对象

    Mahjiong_List = []//麻将列表

    start() {
        this.Mahjiong_Init();//执行初始化
    }

    Mahjiong_Init() { //初始化函数
        let Mahjiong_Num = this.node.getComponent(Get_Data).Number//接收生成麻将总数量
        let Mahjiong_Group = this.node.getComponent(Get_Data).Group//接收生成麻将的组数
        let Mahjiong_Class = this.node.getComponent(Get_Data).Class//接收生成麻将的类型数量(10代表1-10随机)
        this.node.getComponent(MainUI).Init()//初始化UI文本
        this.Mahjiong_NodePool_Init(Mahjiong_Num)//节点池初始化
        this.Mahjiong_Ran(Mahjiong_Group, Mahjiong_Class)//取随机麻将编号到列表
        this.Mahjiong_Send(this.Mahjiong_List)//初始化麻将发牌
    }

    Mahjiong_NodePool_Init(num: number) {  //麻将节点池初始化
        this.Mahjiong_NodePool = new NodePool();//创建节点池
        for (let i = 0; i < num; i++) {
            let node = instantiate(this.Mahjiong_Prefab);//实例化麻将预制体
            this.Mahjiong_NodePool.put(node);//将节点放入节点池
        }
    }
    Mahjiong_Ran(Group: number, Class: number) {//取随机麻将编号到列表
        for (let i = 0; i < Group; i++) {//循环麻将组数
            let num = Math.floor(Math.random() * Class) + 1//随机麻将编号
            for (let j = 0; j < 3; j++) {//循环3次 = 三消规则
                this.Mahjiong_List.push(num)
            }

        }
    }
    Mahjiong_Send(List: number[]) {//发牌函数
        let Speed = 6//发牌速度初始值
        let Rad = 0//发牌弧度初始值
        let H = 0//发牌高度初始值
        let R = 0.5//发牌半径初始值
        let step = 20//发牌角度初始值
        for (let i = List.length - 1; i > 0; i--) {//洗牌算法，游戏中的经典算法
            let j = Math.floor(Math.random() * (i + 1));//随机一个数
            [List[i], List[j]] = [List[j], List[i]];//交换位置
        }
        const Send = () => {
            const Num = List.pop()//取出1个随机编号，并从列表删除
            if (!Num) {//如果随机列表空了，就停止
                this.unschedule(Send)//停止调度
                this.node.getComponent(Mahjiong_Click).on()//发牌完毕，开启触摸监听
                return
            }
            let node = this.Mahjiong_NodePool.get()//取出一个节点
            node.setParent(this.node)//设置节点的父节点
            node.getComponent(Mahjiong_Prefab).Ran_Node(Num)//显示对应节点
            let x = Math.cos(Rad) * R//计算x轴坐标
            let z = Math.sin(Rad) * R//计算z轴坐标
            let y = 1 + H++ / 100//计算Y坐标，值越小高度越高
            node.setPosition(x, y, z);//设置节点的位置
            let boby = node.getComponent(RigidBody)//获取刚体组件
            boby.setLinearVelocity(new Vec3(x * Speed, 0, z * Speed));//设置刚体的线速度
            Rad += (Speed * Math.PI) / 180//增加弧度
        }
        this.schedule(Send, 0.01)
    }

    protected onDestroy(): void {//销毁函数
        this.Mahjiong_NodePool.clear()//销毁节点池
        this.Mahjiong_NodePool = null

    }

    update(deltaTime: number) {

    }
}


