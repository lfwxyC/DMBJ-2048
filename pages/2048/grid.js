function init() { // 初始化空的矩阵
  var grid = [];
  var size = 4; // 4*4

  for(var i = 0; i < size; i++) { 
    grid[i] = [];

    for(var j = 0; j < size; j++) {
      var obj = {
        "val":"",
        "isNew":false
      };
      grid[i][j] = obj;
    }
  }
  return grid;
}

function set_random_data(grid) { // 随机选择格子填充数据
  var size = 4;
  var row, col;

  while (1) {
    var cell = Math.floor(Math.random() * size * size);
    row = Math.floor(cell / size);
    col = cell % size;

    if (grid[row][col].val == "") break;
  }

  var value = Math.random() < 0.8 ? 2 : 4;
  grid[row][col].val  = value;
  grid[row][col].isNew = true;

  return grid;
}

function start() { // 游戏开始，初始化格子并随机产生两个数据
  var grid = init();
  var size = 4;
  
  for (var i = 0; i < 2; i++) {
    grid = set_random_data(grid);
  }

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      grid[i][j].isNew = false;
    }
  }
  return grid;
}

function move(dir, grid) { // 移动格子
  var size = 4;
  var isMove = false;
  var can = [];
  var score = 0;
  
  for (var i = 0; i < size; i++) {
    can[i] = [];

    for (var j = 0; j < size; j++) {
      can[i][j] = "";
    }
  }

  switch (dir) {
    case 0: { // 上
      for (var j = 0; j < size; j++) {
        for (var i = 1; i < size; i++) {
          if (grid[i][j].val != "") {
            for (var k = i - 1; k >= 0; k--) {
              if (grid[k][j].val == "") continue;
              if (grid[i][j].val == grid[k][j].val ) { // 合并
                if (can[k][j] == "") {
                  grid[k][j].val *= 2;
                  grid[i][j].val = "";
                  can[k][j] = 1;
                  score += grid[k][j].val;
                  isMove = true;
                }
              }
              break;
            }
          }
        }
        for (var i = 1; i < size; i++) {
          if (grid[i][j].val != "") {
            for (var k = i - 1; k >= 0; k--) {
              if (grid[k][j].val == "") { // 移动
                grid[k][j].val = grid[k + 1][j].val;
                grid[k + 1][j].val = "";
                isMove = true;
              }
            }
          }
        }
      }
      break;
    }
    case 1: { // 下
      for (var j = 0; j < size; j++) {
        for (var i = size - 2; i >= 0; i--) {
          if (grid[i][j].val != "") {
            for (var k = i + 1; k < size; k++) {
              if (grid[k][j].val == "") continue;
              if (grid[i][j].val == grid[k][j].val ) { // 合并
                if (can[k][j] == "") {
                  grid[k][j].val *= 2;
                  grid[i][j].val = "";
                  can[k][j] = 1;
                  score += grid[k][j].val;
                  isMove = true;
                }
              }
              break;
            }
          }
        }
        for (var i = size - 2; i >= 0; i--) {
          if (grid[i][j].val != "") {
            for (var k = i + 1; k < size; k++) {
              if (grid[k][j].val == "") { // 移动
                grid[k][j].val = grid[k - 1][j].val;
                grid[k - 1][j].val = "";
                isMove = true;
              }
            }
          }
        }
      }
      break;
    }
    case 2: { // 左
      for (var i = 0; i < size; i++) {
        for (var j = 1; j < size; j++) {
          if (grid[i][j].val != "") {
            for (var k = j - 1; k >= 0; k--) {
              if (grid[i][k].val == "") continue;
              if (grid[i][j].val == grid[i][k].val) { // 合并
                if (can[i][k] == "") {
                  grid[i][k].val *= 2;
                  grid[i][j].val = "";
                  can[i][k] = 1;
                  score += grid[i][k].val;
                  isMove = true;
                }
              }
              break;
            }
          }
        }
        for (var j = 1; j < size; j++) {
          if (grid[i][j].val != "") {
            for (var k = j - 1; k >= 0; k--) {
              if (grid[i][k].val == "") { // 移动
                grid[i][k].val = grid[i][k + 1].val;
                grid[i][k + 1].val = "";
                isMove = true;
              }
            }
          }
        }
      }
      break;
    }
    case 3: { // 右
      for (var i = 0; i < size; i++) {
        for (var j = size - 2; j >= 0; j--) {
          if (grid[i][j].val != "") {
            for (var k = j + 1; k < size; k++) {
              if (grid[i][k].val == "") continue;
              if (grid[i][j].val == grid[i][k].val) { // 合并
                if (can[i][k] == "") {
                  grid[i][k].val *= 2;
                  grid[i][j].val = "";
                  can[i][k] = 1;
                  score += grid[i][k].val;
                  isMove = true;
                }
              }
              break;
            }
          }
        }
        for (var j = size - 2; j >= 0; j--) {
          if (grid[i][j].val != "") {
            for (var k = j + 1; k < size; k++) {
              if (grid[i][k].val == "") { // 移动
                grid[i][k].val = grid[i][k - 1].val;
                grid[i][k - 1].val = "";
                isMove = true;      
              }
            }
          }
        }
      }
      break;
    }
  }

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      grid[i][j].isNew = false;
    }
  }

  if (isMove) {
    grid = set_random_data(grid);
  }

  var obj = {
    "grid":grid,
    "score":score,
    "isMove":isMove
  };
  return obj;
}

function isOver(grid) { // 判断游戏是否结束
  var size = 4;

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      if (grid[i][j].val == "") return false;
    }
  }

  for (var i = 0; i < size; i++) { // 判断左右格子是否可以合并
    for (var j = 1; j < size; j++) {
      if (grid[i][j].val == grid[i][j - 1].val) return false;
    }
  }

  for (var j = 0; j < size; j++) {
    for (var i = 1; i < size; i++) {
      if (grid[i][j].val == grid[i - 1][j].val) return false;
    }
  }
  return true;
}

module.exports = {
  start:start,
  isOver:isOver,
  move:move
}