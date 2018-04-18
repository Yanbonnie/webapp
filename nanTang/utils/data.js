
const getconfig = {
    banner: [
        {
            pic: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            url: ''
        },
        {
            pic: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            url: ''
        },
        {
            pic: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
            url: ''
        }
    ],
    config:[
        {
            is_pay_apply:1,  //0-关闭
            is_pay_praise:1
        }
    ],
    data:[
        {
            id:1,
            name:'休闲店',
            logo:'/assets/images/picture.jpeg',
            address:'东风中路',
            praise:10,
            is_praise:1
        },
        {
            id: 1,
            name: '休闲店',
            logo: '/assets/images/picture.jpeg',
            address: '东风中路',
            praise: 10,
            is_praise: 1
        },
    ]
}

module.exports = {
    banner:getconfig.banner,
    data:getconfig.data,
    config:getconfig.config
}