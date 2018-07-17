// components/navBar/navBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index:{
        type:Number,
        value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
      changeNav(e){
          
          const { index } = e.currentTarget.dataset;
          this.triggerEvent('changeNav', { index });
      }
  }
})
