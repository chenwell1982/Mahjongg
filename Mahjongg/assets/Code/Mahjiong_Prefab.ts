import { _decorator, Component, Layers, Node } from 'cc';
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


    UI_2D() {//修改节点所属从为2D --- 3D物件转2D
        this.node.getChildByName(this.Num).layer = Layers.Enum.UI_2D
    }
    UI_3D() {//修改节点所属从为3D --- 2D物件转3D
        this.node.getChildByName(this.Num).layer = Layers.Enum.UI_3D
    }
    update(deltaTime: number) {

    }
}


