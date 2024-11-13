const config = require('../config/' + process.env.NODE_ENV)

//import axios from "axios"
//import { i18n } from 'vue-lang-router';
// import store from '../store'

let core = {
    baseUrl: function(){
        return config.root_node.url + ":" + config.root_node.port + "/"
    },
    convertMonyUnity: function(amountMony, monyConvertValue){
        return amountMony * monyConvertValue
    },
    convertUnityMony: function(amountUnity, monyConvertValue){
        if(monyConvertValue == 0) return 0
        return amountUnity / monyConvertValue
    }
}

export default core