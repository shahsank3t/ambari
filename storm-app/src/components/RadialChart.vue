<template>
    <svg class="radial-chart"></svg>
</template>
<script>
  import d3 from 'd3';
  import d3Tip from 'd3-tip';

  export default{
    name : "RadialChart",
    props : ["graphData","labels","width","height","innerRadius","outerRadius","color"],
    data : () => {
      return{
        const : {}
      };
    },
    created(){
      this.const = {
        tau: 2 * Math.PI,
        width: this.width || "44",
        height: this.height || "52",
        innerRadius: parseInt(this.innerRadius, 10) || 20,
        outerRadius: parseInt(this.outerRadius, 10) || 25,
        color: this.color || d3.scale.category20()
      };
      this.arc = d3.svg.arc()
        .innerRadius(this.const.innerRadius)
        .outerRadius(this.const.outerRadius)
        .startAngle(0);
    },
    mounted(){
      this.drawChart();
    },
    watch: {
      graphData: function() {
        this.animateGraph();
      }
    },
    methods : {
      drawChart() {
        const self = this;
        this.tip = d3Tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function() {
            var text = "<div class='summary'>" + this.labels[0] + ": " + this.graphData[0] + "</div>";
            text += "<div class='summary'>Free: " + (parseInt(this.graphData[1], 10) - parseInt(this.graphData[0], 10)) + "</div>";
            text += "<div class='summary'>" + this.labels[1] + ": " + this.graphData[1] + "</div>";
            return text;
          }.bind(this));
        var svg = this.svg = d3.select(this.$el)
          .attr('width', this.const.width + "px")
          .attr('height', this.const.height + "px")
          .append('g').attr('transform', 'translate(' + (this.const.width / 2) + ', ' + (this.const.height / 2) + ')');

        this.text = svg.append("text")
          .attr("y", "0.3em")
          .attr("class", "graphVal")
          .attr("text-anchor", "middle")
          .attr("font-size", this.const.fontSize)
          .on("mouseover", function(d){
            self.tip.show(d, this);
          })
          .on("mouseout", function(d){
            self.tip.hide(d, this);
          })
          .text("0");

        var background = svg.append("path")
          .datum({
            endAngle: this.const.tau
          })
          .style("fill", this.const.color[0])
          .attr("d", this.arc);

        this.foreground = svg.append("path")
          .datum({
            endAngle: 0
          })
          .style("fill", function(d, i) {
            return this.const.color[1];
          }.bind(this))
          .attr("d", this.arc);
        this.svg.call(this.tip);
        // $('#container').append($('body > .d3-tip'));
        this.animateGraph();
      },
      animateGraph(){
        var percent = (parseInt(this.graphData[0], 10) / parseInt(this.graphData[1], 10) * 100);
        if (percent) {
          percent = percent.toFixed(0) + ' %';
        } else {
          percent = '0 %';
        }

        d3.select(this.$el).select('.graphVal').text(percent);
        // d3.select(ReactDOM.findDOMNode(this)).select('.graphVal').text(percent);

        var newValue = this.graphData[0] / this.graphData[1] * 100;
        this.foreground.transition()
          .duration(750)
          .call(this._arcTween.bind(this), this.const.tau * (newValue / 100));
      },
      _arcTween(transition, newAngle) {
        var arc = this.arc;
        transition.attrTween("d", function(d) {
          var interpolate = d3.interpolate(d.endAngle, newAngle);
          return function(t) {
            d.endAngle = interpolate(t);
            if (!d.endAngle) {
              d.endAngle = 0;
            }
            return arc(d);
          };
        });
      }

    }
  };
</script>
