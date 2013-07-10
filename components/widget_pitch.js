define (
[
    'components/component_manager',
    'libs/raphael/raphael'
],
                                
function (ComponentManager) {
    
    return ComponentManager.create('pitchWidget', PitchWidget);
                                                        
    function PitchWidget () {
        
        this.defaultAttrs({
            pitchChart: '.pitch-chart',
            pitchLabel: '.pitch-label',
            fillColor: '#6F8388',
            borderColor: '#6F8388',
            baseColor: '#E9EFF0',
            id: 'pitch-widget',
            angle: 75
        });
                                                                                        
        this.after('initialize', function () {
            this.$node.attr('id', this.attr.id);
            
            //this.$nodeMap = $('<div>').addClass('pitch-label').appendTo(this.$node);

            //var obj = this.createTemperatureChart();
            this.on('drawPitch', function (event, angle) {
                var text = $.isNumeric(angle) ? (angle + 'º') : '-';
                this.attr.angle = angle || 0;
                this.$node.empty();
                this.$nodeMap = $('<div>').addClass('pitch-label').appendTo(this.$node);
                this.attr.widget = this.createPitchChart();
                this.drawPitch(this.attr.widget, this.attr.angle);
                $(this.attr.pitchLabel).html( text );
            });
        });


        this.createPitchChart = function() {
            var paper = Raphael(this.attr.id, 100, 60),
                arm;

            arm = paper.rect(11.5,37, 4, 15.5);
            smph = paper.rect(8,10,11,27,3);
            redLight = paper.circle(13.6,16, 2.25);
            yellowLight =paper.circle(13.6,23.5, 2.25);
            greenLight = paper.circle(13.6,31, 2.25);
            base = paper.rect(18,52,21.5,1);
            line = this.obtainLine(16, 52, 29, 0 , 90, paper);
            fill = paper.rect(12.5,35,2, 3);
            coverLine = paper.rect(16,23.5,5,4);

            base.attr({stroke: this.attr.borderColor, "stroke-width":0,'fill-opacity':0});
            arm.attr({stroke: this.attr.borderColor,'fill-opacity':0});
            smph.attr({stroke: this.attr.borderColor,'fill-opacity':0}); 
            redLight.attr({fill: this.attr.fillColor,stroke: this.attr.fillColor});
            yellowLight.attr({fill: this.attr.fillColor,stroke: this.attr.fillColor});
            greenLight.attr({fill: this.attr.fillColor,stroke: this.attr.fillColor});
            fill.attr({fill: this.attr.baseColor, stroke: this.attr.baseColor});
            coverLine.attr({fill: this.attr.baseColor, stroke: this.attr.baseColor});

            coverLine.toBack();

            redLight.toFront();
            yellowLight.toFront();
            greenLight.toFront();
            line.toBack();
            base.toBack();
             arm.toBack();

            greenLight.hide();
            arm.hide();
            yellowLight.hide();
            redLight.hide();
            smph.hide();
            base.hide();
            line.hide();

            return {
                base: base,
                redLight: redLight,
                yellowLight: yellowLight,
                greenLight: greenLight,
                smph: smph,
                paper: paper,
                arm: arm,
                line:line,
                fill: fill,
                coverLine: coverLine
            };
        }

        this.drawPitch = function(pitchChart, angle) {
            xmin = 15.5;
            ymax = 52.5;
            r = 27; 

            if (angle > 90){
                angle = abs(angleSmph-180);
            }
            if (angle < 10) {
                angle = 10;
            }
            
            angleSmph = -angle + 90;

            x1 = xmin + r * Math.cos(-0 * Math.PI / 180),
            x2 = xmin + r * Math.cos(-angle * Math.PI / 180),
            y1 = ymax + r * Math.sin(-0 * Math.PI / 180),
            y2 = ymax + r * Math.sin(-angle * Math.PI / 180);

            pitchChart.greenLight.animate({
              transform: "r" + angleSmph +","+xmin + ","+ ymax
            },500);

            pitchChart.yellowLight.animateWith(pitchChart.smph,null,{
              transform: "r" + angleSmph +","+xmin + ","+ ymax

            },500);
            pitchChart.redLight.animateWith(pitchChart.smph,null,{
              transform: "r" + angleSmph +","+xmin + ","+ ymax
            },500);
            pitchChart.arm.animateWith(pitchChart.smph,null,{
              transform: "r"+ angleSmph +","+xmin + ","+ ymax
            },500);
            pitchChart.smph.animateWith(pitchChart.smph,null,{
              transform: "r"+angleSmph+","+xmin + ","+ ymax
            },500);
            pitchChart.fill.animateWith(pitchChart.smph,null,{
              transform: "r"+angleSmph+","+xmin + ","+ ymax
            },500);
            pitchChart.coverLine.animateWith(pitchChart.smph,null,{
              transform: "r"+angleSmph+","+xmin + ","+ ymax
            },500);
            pitchChart.line.animateWith(pitchChart.smph,null,{
              path: ["M", x1, y1, "A", r, r, 0, 0, 0, x2, y2],
              stroke: this.attr.borderColor
            },500);
            
            //Show elements
            pitchChart.smph.show();
            pitchChart.base.show();
            pitchChart.arm.show();
            pitchChart.redLight.show();
            pitchChart.yellowLight.show();
            pitchChart.greenLight.show();
            //this.pitchChart.line.show();
            this.attr.widget.line.show();
          }

        this.obtainLine = function(cx, cy, r, startAngle, endAngle, paper) {
            x1 = cx + r * Math.cos(-startAngle * Math.PI / 180),
            x2 = cx + r * Math.cos(-endAngle * Math.PI / 180),
            y1 = cy + r * Math.sin(-startAngle * Math.PI / 180),
            y2 = cy + r * Math.sin(-endAngle * Math.PI / 180);
            x =paper.path(["M", x1, y1, "A", r, r, 0, 0, 0, x2, y2]).attr({
                stroke: this.attr.borderColor
            });//, 'stroke-miterlimit': "decimal"});
            return x;
        }

    } // </PitchWidget>
});

