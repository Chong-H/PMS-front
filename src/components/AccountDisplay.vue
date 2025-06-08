<template>
    <div class="wrapper">
        <h2>id     :  {{ AccDto.id == null?null:AccDto.id}} </h2>
        <form> 
        <label> </label>
        <label>web     :  {{ AccDto.web  }}</label>
        <!-- <label>acc     :    {{ store.VFcode!=""?encryptDecrypt(( decrypt (AccDto.acc==null?"1 ":AccDto.acc,"SKeySKeySKeySKey" )+"","")):"please verify first" }}  </label>
          -->
          <label>acc     :    {{ store.VFcode!=""?
                                                      ( 
                                                                        decrypt (
                                                                            AccDto.acc==null?
                                                                                            "1 ":
                                                                                            AccDto.acc,store.DECScode 
                                                                                )+""
                                                                        )
                                                                    
                                                    :
                                                  "please verify first" }}  </label>

        <label>pin      :   {{ store.VFcode!=""?
                                                     ( 
                                                                        decrypt (
                                                                            AccDto.pin==null?
                                                                                            "1 ":
                                                                                            AccDto.pin,store.DECScode 
                                                                                )+""
                                                                        )
                                                                    
                                                    :
                                                  "please verify first" }}

        </label>
        <label>description      :   {{ AccDto.description }} </label>
        <label>   classify      :   {{AccDto.classify}}</label>
        </form>
        <!-- <button @click="emit('read', trans)">知道了</button>
        <button @click="emit('unread', trans)">设为未读</button> -->
    </div>
</template>

<script setup lang="ts">

import { AccountDto } from '@/pojo/AccountDto';
import { store } from '@/stores/storeAuth';
import { decrypt } from '@/stores/decode';
interface Props {
    AccDto: AccountDto,
}

const {
    AccDto,
} = defineProps<Props>();

// const emit = defineEmits<{
//     (event: 'read', trans: TransactionDto): void,
//     (event: 'unread', trans: TransactionDto): void,

// }>();
// 定义加密序偶表（双向映射）
const encryptionPairs: { [key: string]: string } = {
    "0": "!",
    "6": "@",
    "1": "2",
    "3": "9",
    "4": "?",
    "7": "#",
    "5": "8",
    "!": "0",
    "@": "6",
    "2": "1",
    "9": "3",
    "?": "4",
    "#": "7",
    "8": "5",
    "%": "*",
    "*": "%",
    "-": "+",
    "+": "-",
    "q": "a",
    "a": "q",
    "w": "s",
    "s": "w",
    "e": "d",
    "d": "e",
    "r": "f",
    "f": "r",
    "t": "g",
    "g": "t",
    "y": "h",
    "h": "y",
    "u": "j",
    "j": "u",
    "i": "k",
    "k": "i",
    "o": "l",
    "l": "o",
    "p": "z",
    "z": "p",
    "x": "v",
    "v": "x",
    "c": "b",
    "b": "c",
    "n": "m",
    "m": "n",
    "Q": "Z",
    "Z": "Q",
    "W": "X",
    "X": "W",
    "E": "C",
    "C": "E",
    "R": "V",
    "V": "R",
    "T": "B",
    "B": "T",
    "Y": "N",
    "N": "Y",
    "U": "M",
    "M": "U",
    "I": "K",
    "K": "I",
    "O": "L",
    "L": "O",
    "P": "A",
    "A": "P",
    "S": "F",
    "F": "S",
    "D": "G",
    "G": "D",
    "H": "J",
    "J": "H"
};

// 加密/解密函数
function encryptDecrypt(str: string): string {
    return str.split('').map(char => encryptionPairs[char] || char).join('');
}




</script>


<style scoped>
/* label竖置 */
.wrapper {
    border: 1px solid #ddd;
    /* 边框 */
    border-radius: 8px;
    /* 圆角 */
    padding: 16px;
    /* 内边距 */
    background-color: black;
    /* 背景颜色 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* 阴影 */
    margin-bottom: 20px;
    
}
label {
    display: block; /* 将 label 设置为块级元素 */
    margin-bottom: 5px; /* 添加一些间距 */
}
</style>