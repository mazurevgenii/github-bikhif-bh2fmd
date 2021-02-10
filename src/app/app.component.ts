/* tslint:disable:no-shadowed-variable */
import {Component, OnChanges, OnInit} from '@angular/core';
import * as d3 from 'd3';

interface IGraphDatum {
  x: number;
  y: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {
  chartDate = new Date(2020, 2, 20);
  private data = [
    {strokeColor: '#1a5b6e', driverEvent: 3, eventTime: new Date(2020, 2, 20, 0)},
    {strokeColor: '#1a5b6e', driverEvent: 3, eventTime: new Date(2020, 2, 20, 1)},
    {strokeColor: '#dc972d', driverEvent: 7, eventTime: new Date(2020, 2, 20, 1)},
    {strokeColor: '#dc972d', driverEvent: 7, eventTime: new Date(2020, 2, 20, 2)},
    {strokeColor: '#af393b', driverEvent: 1, eventTime: new Date(2020, 2, 20, 2)},
    {strokeColor: '#af393b', driverEvent: 1, eventTime: new Date(2020, 2, 20, 17)},
    {strokeColor: '#1a5b6e', driverEvent: 3, eventTime: new Date(2020, 2, 20, 17)},
    {strokeColor: '#1a5b6e', driverEvent: 3, eventTime: new Date(2020, 2, 20, 21)},
    {strokeColor: '#476c3e', driverEvent: 5, eventTime: new Date(2020, 2, 20, 21)},
    {strokeColor: '#476c3e', driverEvent: 5, eventTime: new Date(2020, 2, 20, 24)},
  ];
  private lineData;
  private sliderData;
  private lines;


  // lineData = this.data.map((point, index, arr) => {
  //   const next = arr[index + 1];
  //   const prev = arr[index - 1];
  //   return {
  //     p: [
  //     {x: point.eventTime, y: point.driverEvent},
  //     {x: (next) ? next.eventTime : prev.eventTime, y: (next) ? next.driverEvent : prev.driverEvent}
  //     x1: point.eventTime,
  //     y1: point.driverEvent,
  //     x2: (next) ? next.eventTime : prev.eventTime,
  //     y2: (next) ? next.driverEvent : prev.driverEvent,
  //     stroke: point.strokeColor
  //   };
  // });
  
  colors = ['#af393b', '#1a5b6e', '#476c3e', '#dc972d'];

  private svg;
  private margin = 50;
  private width = 1252 - (this.margin * 2);
  private height = 297 - (this.margin * 2);

  ngOnInit(): void {
    this.createSvg();
    this.drawPlot();
  }

  ngOnChanges(): void {
    console.log('ngOnChanges');
  }

  private createSvg(): void {
    this.svg = d3.select('figure#scatter')
      .append('svg')
      .attr('width', this.width + (this.margin * 2))
      .attr('height', this.height + (this.margin * 2))
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawPlot(): void {
    // Add X axis
    const xTicks = this.getXTicks(this.chartDate);
    const xTickLabels = [
      'M', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'N',
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'M'
    ];
    const x = d3.scaleTime()
      .domain([this.chartDate, new Date(+this.chartDate + 24 * 60 * 60 * 1000)])
      .range([0, this.width]);

    const xAxis = this.svg.append('g')
      .call(d3.axisTop(x).tickValues(xTicks).tickFormat((d, i) => xTickLabels[i]).tickSize(0));

    xAxis.selectAll('text')
      .style('opacity', '0.5')
      .style('font-size', '12px');

    // Add Y axis
    const yTicks = [1, 3, 5, 7];
    const yLeftTickLabels = ['OFF', 'SB', 'D', 'ON'];
    const yRightTickLabels = ['Time 1', 'Time 2', 'Time 3', 'Time 4'];
    const y = d3.scaleLinear()
      .domain([0, 8])
      .range([0, this.height]);

    const yLeftAxis = this.svg.append('g')
      .call(d3.axisLeft(y).tickValues(yTicks).tickFormat((d, i) => yLeftTickLabels[i]).tickSize(0));

    const yRightAxis = this.svg.append('g')
      .attr('transform', 'translate(' + this.width + ',0)')
      .call(d3.axisRight(y).tickValues(yTicks).tickFormat((d, i) => yRightTickLabels[i]).tickSize(0));

    yLeftAxis.selectAll('text')
      .data(this.colors)
      .style('font-weight', 'bold')
      .style('font-size', '14px')
      .style('fill', (d, i) => this.colors[i]);

    yRightAxis.selectAll('text')
      .data(this.colors)
      .style('font-weight', 'bold')
      .style('font-size', '14px')
      .style('fill', (d, i) => this.colors[i]);

    this.svg.selectAll('.domain')
      .attr('stroke', 'none');

    // Add Grid
    const yGrid = [0, 2, 4, 6, 8];
    const xGrid = this.getXTicks(this.chartDate);
    const xAxisGridSmallLines = this.getTicksForSmallLines(this.chartDate);
    const xAxisGridBigLines = this.getTicksForBigLines(this.chartDate);
    const chartGrid = grid => grid
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.5)
      .call(g => g.append('g')
        .selectAll('line')
        .data(xGrid)
        .join('line')
        .attr('x1', d => 0.5 + x(d))
        .attr('x2', d => 0.5 + x(d))
        .attr('y1', 1)
        .attr('y2', this.height))
      .call(g => g.append('g')
        .selectAll('line')
        .data(yGrid)
        .join('line')
        .attr('y1', d => 0.5 + y(d))
        .attr('y2', d => 0.5 + y(d))
        .attr('x1', 1)
        .attr('x2', this.width))
      .call(g => g.append('g')
        .selectAll('line')
        .data(xAxisGridSmallLines)
        .join('line')
        .attr('x1', d => 0.5 + x(d))
        .attr('x2', d => 0.5 + x(d))
        .attr('y1', 1)
        .attr('y2', this.height / 16))
      .call(g => g.append('g')
        .selectAll('line')
        .data(xAxisGridSmallLines)
        .join('line')
        .attr('x1', d => 0.5 + x(d))
        .attr('x2', d => 0.5 + x(d))
        .attr('y1', this.height / 4 + 1)
        .attr('y2', this.height / 16 * 5))
      .call(g => g.append('g')
        .selectAll('line')
        .data(xAxisGridSmallLines)
        .join('line')
        .attr('x1', d => 0.5 + x(d))
        .attr('x2', d => 0.5 + x(d))
        .attr('y1', this.height / 16 * 11)
        .attr('y2', this.height / 4 * 3))
      .call(g => g.append('g')
        .selectAll('line')
        .data(xAxisGridSmallLines)
        .join('line')
        .attr('x1', d => 0.5 + x(d))
        .attr('x2', d => 0.5 + x(d))
        .attr('y1', this.height / 16 * 15)
        .attr('y2', this.height))
      .call(g => g.append('g')
        .selectAll('line')
        .data(xAxisGridBigLines)
        .join('line')
        .attr('x1', d => 0.5 + x(d))
        .attr('x2', d => 0.5 + x(d))
        .attr('y1', 1)
        .attr('y2', this.height / 8))
      .call(g => g.append('g')
        .selectAll('line')
        .data(xAxisGridBigLines)
        .join('line')
        .attr('x1', d => 0.5 + x(d))
        .attr('x2', d => 0.5 + x(d))
        .attr('y1', this.height / 4 + 1)
        .attr('y2', this.height / 8 * 3))
      .call(g => g.append('g')
        .selectAll('line')
        .data(xAxisGridBigLines)
        .join('line')
        .attr('x1', d => 0.5 + x(d))
        .attr('x2', d => 0.5 + x(d))
        .attr('y1', this.height / 8 * 5)
        .attr('y2', this.height / 4 * 3))
      .call(g => g.append('g')
        .selectAll('line')
        .data(xAxisGridBigLines)
        .join('line')
        .attr('x1', d => 0.5 + x(d))
        .attr('x2', d => 0.5 + x(d))
        .attr('y1', this.height / 8 * 7)
        .attr('y2', this.height));

    this.svg.append('g')
      .call(chartGrid);

    const line = d3.line<IGraphDatum>()
      .x(d => x(d.x))
      .y(d => y(d.y));

    this.getLineData(this.data);

    this.lines = this.svg.append('g');
    this.lines.selectAll('path')
      .data(this.lineData)
      .enter().append('path')
      .attr('class', d => `line-${d.idx}`)
      .attr('d', d => line(d.p))
      .attr('stroke-width', 4)
      .attr('stroke', d => d.stroke)
      .attr('stroke-linecap', 'square')
      .style('opacity', '1')
      .attr('cursor', 'pointer')
      .on('mouseover', (event) => {d3.select(event.currentTarget);})
      .on('mouseleave', (event) => {d3.select(event.currentTarget);})
      .on('click', (event, d) => {
        d3.select(event.currentTarget)
          .style('opacity', 1);
        // console.log('event.nextSibling', event.currentTarget.nextSibling);
        this.getSliderData(d);

        // console.log('sliderData', this.sliderData);

        const sliderLines = this.svg.append('g');
        sliderLines.selectAll('path')
          .data(this.sliderData)
          .enter().append('path')
          .attr('d', d => line(d.lineToSlider))
          .attr('stroke-width', 3)
          .attr('stroke', '#1a5b6e')
          .attr('stroke-dasharray', '10 5')
          .style('opacity', '1');

        const sliderPolygon = this.svg.append('g');
        sliderPolygon.selectAll('path')
          .data(this.sliderData)
          .enter().append('path')
          .attr('class', d => `slider-${d.idx}`)
          .attr('d', d => line(d.sliderShape))
          .attr('fill', '#1a5b6e')
          .attr('stroke-width', 2)
          .attr('stroke', '#1a5b6e')
          .attr('stroke-linejoin', 'round')
          .attr('cursor', 'pointer')
          // .on('click', (event, d) => {
          //   console.log('event:', event);
          //   console.log('d:', d);
          // })

          .call(d3.drag()
            .on('start', this.dragstarted)
            .on('drag', this.dragged)
            .on('end', this.dragended));
      });

    // const dragHandler = d3.drag()
    //   .on('drag', (event) => {
    //     // @ts-ignore
    //     d3.select(event.currentTarget)
    //       .attr('x', event.x)
    //       .attr('y', event.y);
    //   });

    // dragHandler(this.svg.selectAll('.slider'));


    // @ts-ignore
    // const drag = d3.drag()
    //   .on('start', event => {
    //     console.log('event', event);
    //     d3.select(event.currentTarget).attr('stroke', 'black');
    //   });
    // });

    // .style('opacity', '0.8');
    // this.svg.append('path')
    //   .datum(this.data)
    //   .attr('fill', 'none')
    //   .attr('stroke', 'url(#line-gradient)')
    //   .attr('stroke-width', 3)
    //   .attr('stroke-miterlimit', 1)
    //   .style('opacity', '0.8')
    //   .attr('d', line)
    //   .attr('cursor', 'pointer')

    // this.svg.selectAll('line')
    //   .datum(this.lineData)
    //   .enter()
    //   .append('line')
    //   .attr('x1', d => console.log(d.x1.getHours))
    //   .attr('y1', d => console.log(d.y1))
    //   .attr('x2', d => d.x2.getHours)
    //   .attr('y2', d => d.y2)
    //   .attr("stroke", '#1a5b6e') //d => d.strokeColor)
    //   .attr("fill", "none")
    //   .attr("stroke-width", 2);
    // .on('mouseover', (a, b, c) => {
    //   // console.log(a);
    //   // this.attr('class', 'focus')
    // });

    // const nest = d3.nest().key(d => d.driverEvent).entries(this.data);

    // console.log(nest)

    // this.svg.selectAll('path')
    //   .on('click', d => console.log(d)
    //   (d, i) => {
    //   if (!d.active) {
    //     d.active = true;
    //     d3.select(d).classed('active', true);
    //   } else {
    //     d.active = false;
    //     d3.select(d).classed('active', false);
    //   }
    // }
    // );

  }

  dragstarted (event, d) {
              // console.log('dStart', d);
              const slider = d3.select(`.slider-${d.idx}`);
              // console.log('slider1', slider);
              slider.attr('stroke-width', 3);
              // console.log('Event on Start', event);

              // this.dragstarted(event, d)
            }

  dragged (event, d) {

              const slider = d3.select(`.slider-${d.idx}`);
              // console.log('Event on Drag', event);
              // console.log('dDrag', d);
              // console.log('slider1', slider);
              // console.log('eventDrag', event);

              this.data = this.data.map(point => {

                if (point.eventTime === d.point) {
                  point.eventTime = x.invert(event.x);
                  return point;
                }
                // console.log('Point', point)
                return point;
              });

              // console.log('testData', testData);
              // console.log('this.data', this.data);
              this.getLineData(this.data);
              // console.log('this.lineData', this.lineData);
              

              this.lines.selectAll('path')
                .data(this.lineData)
                .enter().append('path')
                .attr('class', d => `line-${d.idx}`)
                .attr('d', d => {
                  console.log(d)
                  line(d.p)
                });
              // d[0] = x.invert(d3.event.x)
              // @ts-ignore
              // d3.select(event.sourceEvent.currentTarget)
              //   .attr('x', event.sourceEvent.x)
              //   .attr('y', event.sourceEvent.y);
              // lines.selectAll('path')
              //   .data(this.lineData)
              //   .enter().append('path')
              //   .attr('class', d => `line-${d.idx}`)
              //   .attr('d', d => line(d.p))

              // this.drawPlot()
            }   
  dragended (event, d) {
              // console.log('eventEnd', event);

              const slider = d3.select(`.slider-${d.idx}`);
              // console.log('slider2', slider);
              slider.attr('stroke-width', 2);

            }                     

  // dragstarted(event, d) {
  //   console.log('event', event);
  //   console.log('d', d);
  //   d3.select(event.currentTarget).attr('stroke', 'black');
  // }
  // drag = {
  //
  //   // dragstarted() {
  //   //   d3.select(this).attr('stroke', 'black');
  //   // },
  //   //
  //   // dragged(event, d) {
  //   //   d3.select(this).raise().attr('cx', d.x = event.x).attr('cy', d.y = event.y);
  //   // },
  //   //
  //   // dragended() {
  //   //   d3.select(this).attr('stroke', null);
  //   // },
  //
  //   return d3.drag()
  //     .on('start', event => d3.select(event.currentTarget).attr('stroke', 'black'))
  //     // .on('drag', dragged)
  //     // .on('end', dragended);
  // }

  // clickPath(d, i) {
  //   if (!d.active) {
  //     d.active = true;
  //     d3.select(d).classed('active', true);
  //   } else {
  //     d.active = false;
  //     d3.select(d).classed('active', false);
  //   }
  // }

  getXTicks(chartDate: Date) {
    const chartDateEnd = +chartDate + 24 * 60 * 60 * 1000;
    const dateArray: Date [] = [];

    while (+chartDate <= chartDateEnd) {
      dateArray.push(chartDate);
      chartDate = new Date(+chartDate + 60 * 60 * 1000);
    }
    return dateArray;
  }

  getTicksForSmallLines(chartDate: Date) {
    const chartDateEnd = +chartDate + 24 * 60 * 60 * 1000;
    const dateArray: Date [] = [];
    chartDate = new Date(+chartDate + 15 * 60 * 1000);

    while (+chartDate < chartDateEnd) {
      dateArray.push(chartDate);
      chartDate = new Date(+chartDate + 30 * 60 * 1000);
    }
    return dateArray;
  }

  getTicksForBigLines(chartDate: Date) {
    const chartDateEnd = +chartDate + 24 * 60 * 60 * 1000;
    const dateArray: Date [] = [];
    chartDate = new Date(+chartDate + 30 * 60 * 1000);

    while (+chartDate < chartDateEnd) {
      dateArray.push(chartDate);
      chartDate = new Date(+chartDate + 60 * 60 * 1000);
    }
    return dateArray;
  }

  getLineData(data) {
    this.lineData = data.map((point, index, arr) => {
      const next = arr[index + 1];
      const prev = arr[index - 1];
      return {
        p: [
          {x: point.eventTime, y: point.driverEvent},
          {x: (next) ? next.eventTime : prev.eventTime, y: (next) ? next.driverEvent : prev.driverEvent}
        ],
        stroke: point.strokeColor,
        strokeWidth: 4,
        idx: index
      };
    });
  }

  getSliderData(data){ 
    this.sliderData = data.p.map((point, index) => {
        return {
          lineToSlider: [
            {x: point.x, y: point.y},
            {x: point.x, y: 9}
          ],
          sliderShape: [
            {x: point.x, y: 8.4},
            {x: new Date(+point.x + 8 * 60 * 1000), y: 8.6},
            {x: new Date(+point.x + 8 * 60 * 1000), y: 9.1},
            {x: new Date(+point.x - 8 * 60 * 1000), y: 9.1},
            {x: new Date(+point.x - 8 * 60 * 1000), y: 8.6},
            {x: point.x, y: 8.4},
          ],
          idx: index,
          point: point.x
        };
      });
    }
}
