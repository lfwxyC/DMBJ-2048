// pages/2048/2048.js
const { isOver } = require("./grid.js");
var grid_js = require("./grid.js");
var pos = Object();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    score:0, // 分数
    grid:[], // 格子，二维数组
    isOver:false,
    msg:"",
    isWin:false,
    judge:true,
    best_score:0,
    able:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (!wx.getStorageSync('best_score')) {
      wx.setStorageSync('best_score', 0);
    }

    var last_grid = wx.getStorageSync('now_grid');
    if (last_grid && !isOver(last_grid)) {
      this.setData({
        grid:last_grid,
        score:wx.getStorageSync('now_score'),
        isWin:false,
        best_score:wx.getStorageSync('best_score'),
        isOver:false,
        able:true
      });
      this.isWin();
    } else {
      this.start();
    }
  },

  start:function() { //新游戏，游戏重新开始
    this.setData({
      grid:grid_js.start(),
      score:0,
      isWin:false,
      judge:true,
      best_score:wx.getStorageSync('best_score'),
      isOver:false,
      able:false
    });

    wx.setStorageSync('last_grid', this.data.grid);
    wx.setStorageSync('now_grid', this.data.grid);
    wx.setStorageSync('last_score', 0);
    wx.setStorageSync('now_score', 0);
  },
  
  undo:function() {
    if (this.data.able) {
      this.setData({
        grid:wx.getStorageSync('last_grid'),
        able:false,
        score:wx.getStorageSync('last_score')
      });

      this.isWin();
      wx.setStorageSync('now_grid', this.data.grid);
      wx.setStorageSync('now_score', this.data.score);
    }
  },

  start_x:0,
  start_y:0,
  end_x:0,
  end_y:0,
  touch_start:function(e) { // 触摸开始
    var touch = e.changedTouches[0];
    this.start_x = touch.clientX;
    this.start_y = touch.clientY;
  },
  
  touch_end:function(e) {
    var touch = e.changedTouches[0];
    this.end_x = touch.clientX;
    this.end_y = touch.clientY;
    
    var dis_x = this.end_x - this.start_x;
    var dis_y = this.end_y - this.start_y;
    
    if (Math.abs(dis_x) < 10 && Math.abs(dis_y) < 10) return;

    // 0: 上；1：下；2：左；3：右
    var direction = Math.abs(dis_x) > Math.abs(dis_y) ? (dis_x > 0 ? 3 : 2) : (dis_y > 0 ? 1 : 0);
    var obj = grid_js.move(direction, this.data.grid);

    this.setData({
      grid:obj.grid,
      score:this.data.score + obj.score,
      able:true
    });

    if (obj.isMove) {
      var last_grid = wx.getStorageSync('now_grid');
      wx.setStorageSync('last_grid', last_grid);
      wx.setStorageSync('now_grid', this.data.grid);

      var last_score = wx.getStorageSync('now_score');
      wx.setStorageSync('last_score', last_score);
      wx.setStorageSync('now_score', this.data.score);
    }
    
    this.app = getApp();
    this.app.show(this, "ani", 1.1, 1000, "step-start");
    setTimeout(function () {
      this.app.show(this, "ani", 1, 100, "ease");
    }.bind(this), 100);
    
    if (this.data.score > this.data.best_score) {
      this.setData({
        best_score:this.data.score
      });
      wx.setStorageSync('best_score', this.data.best_score);
    }

    if (grid_js.isOver(this.data.grid)) {
      this.setData({
        isOver:true,
        msg:"新年快乐\n再接再厉",
        able:false
      });
    }

    if (this.data.judge) {
      if (this.isWin()) {
        this.setData({
          isWin:true,
          msg:"长白山见"
        });
      }
    }
  },

  isWin:function() {
    var size = 4;

    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        if (this.data.grid[i][j].val == 4096) {
          this.setData({
            judge:false
          });
          return true;
        }
      }
    }
    this.setData({
      judge:true
    });
    return false;
  },

  continue:function() {
    this.setData({
      isWin:false
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})