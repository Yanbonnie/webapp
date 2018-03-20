var plugin = requirePlugin("myPlugin");
console.log(plugin)
Page({
  onLoad: function() {
    plugin.getData()
  }
})