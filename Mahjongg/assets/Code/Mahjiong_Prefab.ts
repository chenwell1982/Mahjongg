import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Mahjiong_Prefab')
export class Mahjiong_Prefab extends Component {
    //麻将预制体自身的脚本
    Num = null//麻将编号
    start() {

    }

    Ran_Node(Num) {//根据编号显示对应麻将
        this.Num = String(Num)//接收编号
        this.node.getChildByName(this.Num).active = true//显示对应麻将
    }

    update(deltaTime: number) {

    }
}


