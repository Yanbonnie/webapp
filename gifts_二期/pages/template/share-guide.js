module.exports = function (that, event) {
    clearTimeout(that['shareGuideTimer']);

    var list = that.data.list;
    list.forEach(function (item, index){
        list[index].showVideo = false;
    });
    if(that.data.canIUseOpenShare){
        return;
    }
    that.data.shareGuideVisible = !that.data.shareGuideVisible;
    that.setData({
        list: list,
        shareGuideVisible: that.data.shareGuideVisible
    });
    setTimeout(function (){
        that.data.shareGuideFadeIn = that.data.shareGuideVisible;
        that.setData({
            shareGuideFadeIn: that.data.shareGuideFadeIn
        });
    }, 20);

    that['shareGuideTimer'] = setTimeout(function (){
        that.data.shareGuideVisible = false;
        that.setData({
            shareGuideVisible: that.data.shareGuideVisible
        });
    }, 2000);
}
