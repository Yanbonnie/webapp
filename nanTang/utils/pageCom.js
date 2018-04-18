
const app = getApp();
const { key } = app.globalData;
import { URL, WXREQ } from './util';
module.exports = {
    'comData': {
        'phoneList':[1,2]
    },
    'methodsArr':{
        getPhoneList(e){
            const { id } = e.currentTarget.dataset;
            
            return new Promise((resolve,reject)=>{
                console.log(id)
                WXREQ('GET',URL['getTel'],{
                    key,
                    id
                },res=>{
                    resolve(res);
                })
            })
        }
    }
}