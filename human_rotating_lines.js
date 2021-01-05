function setup() {
    createCanvas(1000, 1000);
    angle = 0
    angleSpeed = 3.5
    from = color(255, 10, 0)
    to = color(255,255,255);
    c = from
}
  
function draw() {
    if (mouseIsPressed && mouseButton == LEFT) {
        push();
        translate(mouseX, mouseY);
        rotate(radians(angle));
        stroke(c);
        line(0,0,lineLength, 0);
        pop();
        
        c = lerpColor(from,to, float(angle % (2*Math.PI))/float(2*Math.PI))
        angle += angleSpeed;
    }
}

function mousePressed(){
    lineLength = random(70,200)
}