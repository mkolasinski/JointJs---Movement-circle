import {Component, OnInit} from "@angular/core";
import * as $ from "jquery";
import {dia, g, shapes, V} from "jointjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit{

  ngOnInit() {
    let constraint = g.ellipse(400, 150, 100);

    let ConstraintElementView = dia.ElementView.extend({

      pointerdown: function (evt, x, y) {
        let position = this.model.get('position');
        let size = this.model.get('size');
        let center = g.rect(position.x, position.y, size.width, size.height).center();
        let intersection = constraint.intersectionWithLineFromCenterToPoint(center, 0);
        dia.ElementView.prototype.pointerdown.apply(this, [evt, intersection.x, intersection.y]);
      },

      pointermove: function (evt, x, y) {
        let intersection = constraint.intersectionWithLineFromCenterToPoint(g.point(x, y), 0);
        dia.ElementView.prototype.pointermove.apply(this, [evt, intersection.x, intersection.y]);
      }
    });

    let graph = new dia.Graph;
    let paper = new dia.Paper({
      el: $('#paper'),
      width: 3000,
      height: 3000,
      gridSize: 1,
      model: graph,
      elementView: ConstraintElementView
    });

    let orbit = V('<ellipse/>');
    orbit.attr({
      cx: constraint.x, cy: constraint.y, rx: constraint.a, ry: constraint.b,
      fill: '#ECF0F1', stroke: '#34495E', 'stroke-dasharray': [2, 2]
    });
    V(paper.viewport).append(orbit);

    let earth = new shapes.basic.Circle({
      position: constraint.intersectionWithLineFromCenterToPoint(g.point(100,0), 0).offset(-10, -10),
      size: {width: 50, height: 50},
      attrs: {
        text: {text: 'earth', 'font-size': 14, fill: 'white'},
        circle: {fill: '#2ECC71', stroke: '#27AE60', 'stroke-width': 1}
      },
      name: 'earth'
    });

    graph.addCell(earth);
  }
}
