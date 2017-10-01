import {Component} from "@angular/core";
import * as $ from 'jquery;'
import * as joint from "jointjs";
import {g, V} from "jointjs/types/geometry";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {


  function () {
    let constraint = g.ellipse(g.point(200, 150), 100, 80);

    let ConstraintElementView = new joint.dia.ElementView.extend({

      pointerdown: function (evt, x, y) {
        let position = this.model.get('position');
        let size = this.model.get('size');
        let center = g.rect(position.x, position.y, size.width, size.height).center();
        let intersection = constraint.intersectionWithLineFromCenterToPoint(center);
        joint.dia.ElementView.prototype.pointerdown.apply(this, [evt, intersection.x, intersection.y]);
      },
      pointermove: function (evt, x, y) {

        let intersection = constraint.intersectionWithLineFromCenterToPoint(g.point(x, y));
        joint.dia.ElementView.prototype.pointermove.apply(this, [evt, intersection.x, intersection.y]);
      }
    });

    let graph = new joint.dia.Graph;
    let paper = new joint.dia.Paper({
      el: $('#paper'),
      width: 450,
      height: 300,
      gridSize: 1,
      model: graph,
      elementView: ConstraintElementView
    });

    let earth = new joint.shapes.basic.Circle({
      position: constraint.intersectionWithLineFromCenterToPoint(g.point(100, 100)).offset(-10, -10),
      size: {width: 20, height: 20},
      attrs: {
        text: {text: 'earth', 'font-size': 12, fill: 'white', style: {'text-shadow': '1px 1px 1px black'}},
        circle: {fill: '#2ECC71', stroke: '#27AE60', 'stroke-width': 1}
      },
      name: 'earth'
    });
    graph.addCell(earth);

    let orbit = V('<ellipse/>');
    orbit.attr({
      cx: constraint.x, cy: constraint.y, rx: constraint.a, ry: constraint.b,
      fill: '#ECF0F1', stroke: '#34495E', 'stroke-dasharray': [2, 2]
    });
    V(paper.viewport).append(orbit);
  }
}
