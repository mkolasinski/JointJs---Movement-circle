import {Component, OnInit} from "@angular/core";
import * as $ from "jquery";
import {dia, g, shapes, V} from "jointjs";
import setPrototypeOf = Reflect.setPrototypeOf;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit{

  ngOnInit() {

    let constraint = g.ellipse(g.point(200,180), 120, 80);
    let ConstraintElementView = dia.ElementView.extend({

      pointerdown: function (evt, x, y) {
        let position = this.model.get('position');
        let size = this.model.get('size');
        let center = g.rect(position.x, position.y, size.width, size.height).center();
        let intersection = constraint.intersectionWithLineFromCenterToPoint(g.point(x,y), 0);
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
      width: 400,
      height: 400,
      gridSize: 1,
      model: graph,
      elementView: ConstraintElementView
    });

      let orbit = V('<ellipse/>');
      orbit.attr({
          cx: 200, cy: 175, rx: constraint.a, ry: constraint.b,
          fill: '#ECF0F1', stroke: '#34495E', 'stroke-dasharray': [1, 2]
      });
      V(paper.viewport).append(orbit);

      let earth: shapes.basic.Circle;
      earth = new shapes.basic.Circle({
          // position: { x: constraint.x, y: constraint.y},
          position: constraint.intersectionWithLineFromCenterToPoint(g.point(0, 0), 0).offset(-70, 0),
          size: {width: 50, height: 50},
          attrs: {
              text: {text: 'Earth', 'font-family': 'Papyrus', 'font-size': 13, 'font-weight': 'bold', fill: 'darkblue'},
              circle: {fill: '#2ECC71', stroke: '#095E06', 'stroke-width': 1}
          },
          name: 'earth'
      });
    graph.addCell(earth);
  }
}
