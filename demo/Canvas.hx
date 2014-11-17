import boidz.Boid;
import boidz.Flock;
import boidz.rules.*;
import boidz.render.*;
using thx.core.Arrays;
using thx.core.Floats;

import js.Browser;

class Canvas {
  static var width  = 800;
  static var height = 600;

  public static function main() {
    var flock  = new Flock(),
        canvas = getCanvas(),
        render = new CanvasRender(canvas);

    var goalRule = new MoveTowardGoal(width * Math.random(), height * Math.random()),
        avoidCollisions = new AvoidCollisions(flock),
        matchGroupVelocity = new MatchGroupVelocity(flock),
        limitSpeed = new LimitSpeed();

    // this rule doesn't make much sense when used together with MoveTowardGoal, right?
    //flock.addRule(new MoveTowardCenter(flock));
    flock.addRule(avoidCollisions);
    flock.addRule(matchGroupVelocity);
    flock.addRule(new RespectBoundaries(10, width - 10, 10, height - 10));
    flock.addRule(goalRule);
    flock.addRule(limitSpeed);

    addBoids(flock, 1000);

    var benchmarks = [],
        residue = 0.0,
        step    = flock.step * 1000;
    thx.core.Timer.frame(function(delta) {
      delta += residue;
      while(delta - step >= 0) {

        var time = thx.core.Timer.time();
        flock.update();
        benchmarks.push(thx.core.Timer.time() - time);

        delta -= step;
      }
      residue = delta;
      render.render(flock);
    });

    thx.core.Timer.repeat(function() {
      var average = benchmarks.average().round(2),
          min     = benchmarks.min().round(2),
          max     = benchmarks.max().round(2);
      // executions time 8.62 (5.03 -> 13.38) with 1000
      trace('executions time $average ($min -> $max)');
    }, 2000);

    canvas.addEventListener("click", function(e) {
      goalRule.goalx = e.clientX;
      goalRule.goaly = e.clientY;
    }, false);

    var sui = new sui.Sui();
    sui.int("boids",
      flock.boids.length, { min : 0, max : 5000 },
      function(v){
        if(v > flock.boids.length)
          addBoids(flock, v - flock.boids.length)
        else
          flock.boids.splice(v, flock.boids.length - v);
      });
    sui.int("collision radius",
      avoidCollisions.radius, { min : 0, max : 50 },
      function(v) avoidCollisions.radius = v);
    sui.float("match velocity ratio",
      matchGroupVelocity.ratio, { min : 0, max : 1 },
      function(v) matchGroupVelocity.ratio = v);
    sui.float("speed limit",
      limitSpeed.speedLimit, { min : 0, max : 100 },
      function(v) limitSpeed.speedLimit = v);
    sui.attach();
  }

  static function getCanvas() {
    var canvas = Browser.document.createCanvasElement();
    canvas.width = width;
    canvas.height = height;
    Browser.document.body.appendChild(canvas);
    return canvas;
  }

  static function addBoids(flock : Flock, howMany : Int) {
    var w = Math.min(width, height);
    for (i in 0...howMany) {
      // create a new boid and add it to the stage
      var a = Math.random() * 2 * Math.PI,
          d = w * Math.random(),
          b = new Boid(width / 2 + Math.cos(a) * d, height / 2 + Math.sin(a) * d);
      flock.boids.push(b);
    }
  }
}