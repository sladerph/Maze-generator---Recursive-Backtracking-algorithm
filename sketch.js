var maze = [];
var open = [];
var w = 40;
var cols;
var rows;
var current;
var obstacles;
var rate_obstacles = 15;

function setup() {
  //frameRate(10);
  screen_w = 1800;
  screen_h = 800;
  createCanvas(screen_w, screen_h);
  cols = floor(screen_w / w);
  rows = floor(screen_h / w);
  obstacles = ((cols * rows) * rate_obstacles) / 100;
  createEmptyMaze(cols, rows);
  current = maze[index(floor(random(0, cols)), floor(random(0, rows)))];
  current.start = true;
  var end = current;
  while(end == current) {
    end = maze[index(floor(random(0, cols)), floor(random(0, rows)))];
  }
  end.end = true;
  createObstacles(obstacles);
}

function draw() {
  background(0);
  showMaze();
  if(current) {
    fill(255, 0, 255, 128);
    rect(current.x * w, current.y * w, w, w);
  }
  
  current.visited = true;
  
  var next = current.checkNeighbors();

  if(next) {
    open.push(current);
    removeWalls(current, next);
    current = next;
  }
  else if(open.length > 0) {
    current = open.pop();
  }
}

function index(x, y) {
  if(x < 0 || y < 0 || x > cols - 1 || y > rows - 1) {
    return -1;
  }
  return x + y * cols;
}

function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.walls = [true, true, true, true]; // Top, right, bottom, left.
  this.visited = false;
  this.start = false;
  this.end = false;
  this.obstacle = false;
  
  this.checkNeighbors = function(){
    var n = [];
    var top = maze[index(this.x, this.y - 1)];
    var right = maze[index(this.x + 1, this.y)];
    var bottom = maze[index(this.x, this.y + 1)];
    var left = maze[index(this.x - 1, this.y)];
    
    if(top && !top.visited && !top.obstacle) {
      n.push(top);
    }
    if(right && !right.visited && !right.obstacle) {
      n.push(right);
    }
    if(bottom && !bottom.visited && !bottom.obstacle) {
      n.push(bottom);
    }
    if(left && !left.visited && !left.obstacle) {
      n.push(left);
    }
    
    if(n.length > 0) {
      return n[floor(random(0, n.length))];
    }
    else {
      return undefined;
    }
  }
  
  this.show = function() {
    stroke(255);
    if (this.walls[0] == true) {
      line(this.x * w, this.y * w, this.x * w + w, this.y * w);
    }
    if (this.walls[1] == true) {
      line(this.x * w + w, this.y * w, this.x * w + w, this.y * w + w);
    }
    if (this.walls[2] == true) {
      line(this.x * w, this.y * w + w, this.x * w + w, this.y * w + w);
    }
    if (this.walls[3] == true) {
      line(this.x * w, this.y * w, this.x * w, this.y * w + w);
    }
    if (this.visited == true) {
      noStroke();
      fill(0, 240, 0, 100);
      rect(this.x * w, this.y * w, w, w);
    }
    if (this.start == true) {
      noStroke();
      fill(0, 0, 255, 128);
      rect(this.x * w, this.y * w, w, w);
    }
    if (this.end == true) {
      noStroke();
      fill(255, 0, 0, 128);
      rect(this.x * w, this.y * w, w, w);
    }
    if(this.obstacle == true) {
      noStroke();
      fill(255, 255, 255);
      rect(this.x * w, this.y * w, w, w);
    }
  }
}

function createEmptyMaze(w, h) {
  for (var y = 0 ; y < h ; y++) {
    for (var x = 0 ; x < w ; x++) {
      var cell = new Cell(x, y);
      maze.push(cell);
    }
  }
}

function showMaze() {
  for (var i = 0 ; i < maze.length ; i++) {
    maze[i].show();
  }
}

function removeWalls(a, b) {
  var x = a.x - b.x;
  var y = a.y - b.y;
  
  if(x == 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  }
  else if(x == -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  if(y == 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  }
  else if(y == -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

function createObstacles(nb) {
  while(nb > 0) {
    var ok = false;
    do {
      var id = floor(random(0, maze.length));
      var cell = maze[id];
      if(!cell.obstacle && !cell.start && !cell.end) {
        ok = true;
        cell.obstacle = true;
      }
    }while(!ok);
    nb--;
  }
}









// LOL.