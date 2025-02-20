let P0 = {x: 100, y: 300, dx: 0, dy: 0};
let P1 = {x: 300, y: 100, dx: 0, dy: 0};
let P2 = {x: 500, y: 100, dx: 0, dy: 0};
let P3 = {x: 700, y: 300, dx: 0, dy: 0};
let bezierPoints = [P0, P1, P2, P3];
let cursorT = 0;
let cursorHastighed = 0.002;
let tegnCursor = false;

function setup() {
  createCanvas(800, 600);
  createUI();
}

function draw() {
  background(50);
  tegnHjælpelinjer();
  tegnKurve();
  tegnPunkter();
  tegnCursorPunkt();
}

function calcBezier(t) {
  let A = lerpPoint(P0, P1, t);
  let B = lerpPoint(P1, P2, t);
  let C = lerpPoint(P2, P3, t);
  let D = lerpPoint(A, B, t);
  let E = lerpPoint(B, C, t);
  return lerpPoint(D, E, t);
}

function lerpPoint(p1, p2, t) {
  return { x: lerp(p1.x, p2.x, t), y: lerp(p1.y, p2.y, t) };
}

function tegnHjælpelinjer() {
  stroke(100);
  for (let i = 0; i < bezierPoints.length - 1; i++) {
    line(bezierPoints[i].x, bezierPoints[i].y, bezierPoints[i + 1].x, bezierPoints[i + 1].y);
  }
}

function tegnKurve() {
  stroke(255, 204, 0);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let t = 0; t <= 1; t += 0.005) {
    let p = calcBezier(t);
    vertex(p.x, p.y);
  }
  endShape();
}

function tegnCursorPunkt() {
  if (!tegnCursor) return;
  let p = calcBezier(cursorT);
  fill(0, 255, 0);
  noStroke();
  ellipse(p.x, p.y, 15);
  cursorT += cursorHastighed;
  if (cursorT >= 1) cursorT = 0;
}

function tegnPunkter() {
  fill(255, 0, 0);
  stroke(255);
  bezierPoints.forEach(p => ellipse(p.x, p.y, 15));
}

function mousePressed() {
  bezierPoints.forEach(p => {
    if (dist(mouseX, mouseY, p.x, p.y) < 10) {
      p.dx = p.x - mouseX;
      p.dy = p.y - mouseY;
    }
  });
}

function mouseDragged() {
  bezierPoints.forEach(p => {
    if (p.dx !== 0 || p.dy !== 0) {
      p.x = mouseX + p.dx;
      p.y = mouseY + p.dy;
    }
  });
}

function mouseReleased() {
  bezierPoints.forEach(p => { p.dx = 0; p.dy = 0; });
}

function createUI() {
  let start = createButton('Start');
  start.position(20, 20);
  start.mousePressed(() => tegnCursor = true);
  
  let stop = createButton('Stop');
  stop.position(80, 20);
  stop.mousePressed(() => { tegnCursor = false; cursorT = 0; });
  
  let speedSlider = createSlider(0.001, 0.01, 0.002, 0.001);
  speedSlider.position(20, 50);
  speedSlider.input(() => cursorHastighed = speedSlider.value());
}
