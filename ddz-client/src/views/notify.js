import {
    Notify
} from "vant"
import {
    Toast
} from 'vant';
import Router from '@/router'
export default function (action) {
    const {
        type,
        result,
        data
    } = action;
    switch (type) {
        case "login_resp":
            if (result == 0) {
                Notify({
                    type: 'success',
                    message: '登录成功'
                });
            }
            break;
        case "createroom_resp":
            if (result == 0) {
                Notify({
                    type: 'success',
                    message: '创建房间成功'
                });
                Router.push('/room')
            }
            break;
        case "joinroom_resp":
            if (result == 0) {
                Notify({
                    type: 'success',
                    message: '加入房间成功'
                });
                Router.push('/room')
            }
            break;
        case "player_joinroom_notify":
            if (result == 0) {
                Notify({
                    type: 'success',
                    message: data.nick_name + '加入了房间'
                });
            }
            break;

        case "gameStart_notify":
            if (result == 0) {
                Toast.success('开始了');
            }
            break;
    }
}

export class cardType{
    constructor(){

    }
    //出一张牌
    isOneCard = function (cardList) {
        if (cardList.length === 1) {
            return true;
        }
        return false;
    }

    //是否对子
    IsDoubleCard = function(cardList){
        
        if(cardList.length!=2){
            return false
        }
        //cardList[0].value==undefined说明是大小王，值是存储在king字段
        if(cardList[0].card_data.value== undefined 
            || cardList[0].card_data.value!=cardList[1].card_data.value){
            return false
        }

        return true
    }

     //三张不带
    Isthree = function(cardList){
        
        if(cardList.length!=3){
            return false
        }
        //不能是大小王
        if(cardList[0].card_data.value== undefined || cardList[1].card_data.value== undefined){
            return false
        }
        //判断三张牌是否相等
        if(cardList[0].card_data.value != cardList[1].card_data.value){
            return false
        }

        if(cardList[0].card_data.value != cardList[2].card_data.value){
            return false
        }

        if(cardList[1].card_data.value != cardList[2].card_data.value){
            return false
        }
        return true
    }
    //三带一
    IsThreeAndOne = function(cardList){
        if(cardList.length!=4){
            return false
        }
        //被带的一张放在2头
        if(cardList[1].card_data.value==undefined || cardList[2].card_data.value==undefined){
            return false
        }
        if (cardList[0].card_data.value==cardList[1].card_data.value && 
            cardList[1].card_data.value==cardList[2].card_data.value &&
            cardList[2].card_data.value!=cardList[3].card_data.value ){
            return true;

        }else if (cardList[1].card_data.value == cardList[2].card_data.value && 
                  cardList[2].card_data.value == cardList[3].card_data.value &&
                  cardList[3].card_data.value != cardList[0].card_data.value){
                return true;
        }
        return false
    }

    //三带二
    IsThreeAndTwo = function(cardList){
        if(cardList.length!=5){
            return false
        }

        if (cardList[0].card_data.value==cardList[1].card_data.value
            &&cardList[1].card_data.value==cardList[2].card_data.value){
            if (cardList[3].card_data.value == cardList[4].card_data.value) {
                return true;
            }

        } else if (cardList[2].card_data.value == cardList[3].card_data.value &&
             cardList[3].card_data.value == cardList[4].card_data.value){
            if (cardList[0].card_data.value == cardList[1].card_data.value) {
                return true;
            }
        }

        return false ;

    }

    //四张炸弹
    IsBoom = function(cardList){
        if(cardList.length!=4){
            return false
        }

        var map = {}
        for(var i=0;i<cardList.length;i++){
            if(map.hasOwnProperty(cardList[i].card_data.value)){
                map[cardList[i].card_data.value]++
            }else{
                map[cardList[i].card_data.value] = 1
            }
        }
        
        var keys = Object.keys(map)
        if(keys.length==1){
            return true
        }

        return false
    }

    //王炸
    IsKingBoom = function(cardList){
        if(cardList.length!=2){
            return false
        }

        if(cardList[0].card_data.king!=undefined && cardList[1].card_data.king!=undefined){
            return true
        }

        return false
    }

    //飞机不带
    IsPlan=function(cardList){
        if(cardList.length!=6){
            return false
        }
    
        var map = {}
        for(var i=0;i<cardList.length;i++){
            if(map.hasOwnProperty(cardList[i].card_data.value)){
                map[cardList[i].card_data.value]++
            }else{
                map[cardList[i].card_data.value] = 1
            }
        }
        
        var keys = Object.keys(map)
        console.log("IsPlan keys"+keys)
        if(keys.length==2){
            //判断相同牌是否为三张
            for(key in map){
                if(map[key]!=3){
                    return false
                }
            }

            //判断是否为相邻的牌
            var p1 = Number(keys[0]) 
            var p2 = Number(keys[1])
            if(Math.abs(p1-p2)!=1){
                return false
            }
            return true
        }

        return false
    }

    //飞机带2个单张
    IsPlanWithSing = function(cardList){
        if(cardList.length!=8){
            return false
        }
        
        var map = {}
        for(var i=0;i<cardList.length;i++){
            if(map.hasOwnProperty(cardList[i].card_data.value)){
                map[cardList[i].card_data.value]++
            }else{
                map[cardList[i].card_data.value] = 1
            }
        }

        var keys = Object.keys(map)
        console.log("IsPlan keys"+keys)
        if(keys.length!=4){
            return false
        }
        //判断是否有2个三张牌
        var three_list = []
        var sing_count = 0
        for(var i in map){
            if(map[i]==3){
                three_list.push(i)
            }else if(map[i]==1){
                sing_count++
            }
        }

        if(three_list.length!=2 || sing_count!=2){
            return false
        }

         //判断是否为相邻的牌
         var p1 = Number(three_list[0]) 
         var p2 = Number(three_list[1])
         if(Math.abs(p1-p2)!=1){
             return false
         }

        return true
    }
    //飞机带2对 
    IsPlanWithDouble = function(cardList){
        if(cardList.length!=10){
            return false
        }

        var map = {}
        for(var i=0;i<cardList.length;i++){
            if(map.hasOwnProperty(cardList[i].card_data.value)){
                map[cardList[i].card_data.value]++
            }else{
                map[cardList[i].card_data.value] = 1
            }
        }

        var keys = Object.keys(map)
        if(keys.length!=4){
            return false
        }
        /*
        "3":3,
        "4":4,
        "j":2,
        "9":2,
        */
       var three_list = []
       var double_count = 0
       for(var i in map){
         if(map[i]==3){
            three_list.push(i)
         }else if(map[i]==2){
            double_count++
         }
       }   

       if(three_list.length!=2 || double_count!=2){
             return false
       }

        //判断是否为相邻的牌
        var p1 = Number(three_list[0]) 
        var p2 = Number(three_list[1])
        if(Math.abs(p1-p2)!=1){
            return false
        }
   
        return true
    }

    //顺子
    IsShunzi = function(cardList){
        
        if(cardList.length<5 || cardList.length>12){
            return false
        }
        var tmp_cards = cardList
        //不能有2或者大小王
        for(var i=0;i<tmp_cards.length;i++){
            if(tmp_cards[i].card_data.value==13 || tmp_cards[i].card_data.value==14
                ||tmp_cards[i].card_data.value==15){
              return false  
            }
        }

        //排序 从小到大
        //sort返回正值做交换
        tmp_cards.sort(function(x,y){
            return Number(x.card_data.value)-Number(y.card_data.value)
        })
        //console.log("IsShunzi tmp_cards"+JSON.stringify(tmp_cards))
        for(var i=0;i<tmp_cards.length;i++){
            if(i+1==tmp_cards.length){
                break
            }
            var p1 = Number(tmp_cards[i].card_data.value) 
            var p2 = Number(tmp_cards[i+1].card_data.value)
            if(Math.abs(p1-p2)!=1){
                return false
            }
    
        }

        return true
    }

    //连队
    IsLianDui = function(cardList){
        if(cardList.length<6 || cardList.length>24){
            return false
        }

        //不能包括大小王,和2
        for(var i=0;i<cardList.length;i++){
            if(cardList[i].card_data.value==14
                ||cardList[i].card_data.value==15||cardList[i].card_data.value==13){
              return false  
            }
        }

        var map = {}
        for(var i=0;i<cardList.length;i++){
            if(map.hasOwnProperty(cardList[i].card_data.value)){
                map[cardList[i].card_data.value]++
            }else{
                map[cardList[i].card_data.value] = 1
            }
        }

        //相同牌只能是2张
        for(var key in map){
            if(map[key]!=2){
                return false
            }
        }
        var keys = Object.keys(map)
        if(keys.length<3){
            return false
        }
        //从小到大排序
        keys.sort(function(x,y){
            return Number(x)-Number(y)
        })

        //对子之间相减绝对值只能是1
        for(var i=0;i<keys.length;i++){
            if(i+1==keys.length){
                break
            }
            var p1 = Number(keys[i]) 
            var p2 = Number(keys[i+1])
            if(Math.abs(p1-p2)!=1){
                return false
            }
    
        }

        return true
    }
}
// 黑桃：spade
// 红桃：heart
// 梅花：club
// 方片：diamond
// const CardShape = {
//     "S": 1,
//     "H": 2,
//     "C": 3,
//     "D": 4,
// };
// const cardShpae = {
//     "1": 3,
//     "2": 2,
//     "3": 1,
//     "4": 0
// };