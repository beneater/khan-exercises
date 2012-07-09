var BLUE = "#6495ED";
var ORANGE = "#FFA500";
var PINK = "#FF00AF";
var GREEN = "#28AE7B";
var PURPLE = "purple";
var RED = "red";
var GRAY = "gray";
var Logic = {
    items: []
};

function addCommas(nStr) {
    nStr += "";
    var x = nStr.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
}


$(document).ready(function() {
    $("#container .exercises-body .current-card-contents").height(Math.max($(window).height() - 212, 1000));

    var container = $("#container .exercises-body .current-card-contents");

    var raphael = new Raphael(container[0]);
    var mouselayer = new Raphael(container[0]);

    var svgPath = function(points) {
        return $.map(points, function(point, i) {
            if (point === true) {
                return "z";
            }
            return (i === 0 ? "M" : "L") + point[0] + " " + point[1];
        }).join("");
    };

    var addGate = function(type, x, y) {
        var gate = $.extend({
            type: type,
            x: 0, y: 0,
            snapX: 10,
            snapY: 10,
            input1: false,
            input2: false,
            input1Floating: true,
            input2Floating: true
        }, {});

        gate.getPos = function() {
            return {
                type: gate.type,
                x: gate.x,
                y: gate.y
            };
        };

        gate.visibleShape = raphael.set();
        gate.highlightableShape = raphael.set();
        if (type === "and") {
            gate.visibleShape.push(raphael.path("M-20,-10 L0,-10"));
            gate.visibleShape.push(raphael.path("M-20,10 L0,10"));
            gate.visibleShape.push(raphael.path("M35,0 L60,0"));
            gate.highlightableShape.push(raphael.path("M0,-15 L20,-15 A15,15,0,0,1,20,15 L0,15 Z"));
            gate.visibleShape.push(gate.highlightableShape);
            gate.visibleShape.push(raphael.circle(-20, -10, 3).attr("fill", BLUE));
            gate.visibleShape.push(raphael.circle(-20, 10, 3).attr("fill", BLUE));
            gate.visibleShape.push(raphael.circle(60, 0, 3).attr("fill", BLUE));
            gate.output = function() {
                return gate.input1 && gate.input2;
            };
        } else if (type === "nand") {
            gate.visibleShape.push(raphael.path("M-20,-10 L0,-10"));
            gate.visibleShape.push(raphael.path("M-20,10 L0,10"));
            gate.visibleShape.push(raphael.path("M43,0 L60,0"));
            gate.highlightableShape.push(raphael.path("M0,-15 L20,-15 A15,15,0,0,1,20,15 L0,15 Z"));
            gate.highlightableShape.push(raphael.circle(39, 0, 4));
            gate.visibleShape.push(gate.highlightableShape);
            gate.visibleShape.push(raphael.circle(-20, -10, 3).attr("fill", BLUE));
            gate.visibleShape.push(raphael.circle(-20, 10, 3).attr("fill", BLUE));
            gate.visibleShape.push(raphael.circle(60, 0, 3).attr("fill", BLUE));
            gate.output = function() {
                return !(gate.input1 && gate.input2);
            };
        } else if (type === "or") {
            gate.visibleShape.push(raphael.path("M-20,-10 L3,-10"));
            gate.visibleShape.push(raphael.path("M-20,10 L3,10"));
            gate.visibleShape.push(raphael.path("M40,0 L60,0"));
            gate.highlightableShape.push(raphael.path("M5,0 C5,-15,-2,-15,-2,-15 C20,-15,25,-19,40,0 M5,0 C5,15,-2,15,-2,15 C20,15,25,19,40,0"));
            gate.visibleShape.push(gate.highlightableShape);
            gate.visibleShape.push(raphael.circle(-20, -10, 3).attr("fill", BLUE));
            gate.visibleShape.push(raphael.circle(-20, 10, 3).attr("fill", BLUE));
            gate.visibleShape.push(raphael.circle(60, 0, 3).attr("fill", BLUE));
            gate.output = function() {
                return gate.input1 || gate.input2;
            }
        } else if (type === "nor") {
            gate.visibleShape.push(raphael.path("M-20,-10 L3,-10"));
            gate.visibleShape.push(raphael.path("M-20,10 L3,10"));
            gate.visibleShape.push(raphael.path("M48,0 L60,0"));
            gate.highlightableShape.push(raphael.path("M5,0 C5,-15,-2,-15,-2,-15 C20,-15,25,-19,40,0 M5,0 C5,15,-2,15,-2,15 C20,15,25,19,40,0"));
            gate.highlightableShape.push(raphael.circle(44, 0, 4));
            gate.visibleShape.push(gate.highlightableShape);
            gate.visibleShape.push(raphael.circle(-20, -10, 3).attr("fill", BLUE));
            gate.visibleShape.push(raphael.circle(-20, 10, 3).attr("fill", BLUE));
            gate.visibleShape.push(raphael.circle(60, 0, 3).attr("fill", BLUE));
            gate.output = function() {
                return !(gate.input1 || gate.input2);
            }
        } else if (type === "xor") {
            gate.visibleShape.push(raphael.path("M-20,-10 L-1,-10"));
            gate.visibleShape.push(raphael.path("M-20,10 L-1,10"));
            gate.visibleShape.push(raphael.path("M40,0 L60,0"));
            gate.highlightableShape.push(raphael.path("M5,0 C5,-15,-2,-15,-2,-15 C20,-15,25,-19,40,0 M5,0 C5,15,-2,15,-2,15 C20,15,25,19,40,0"));
            gate.highlightableShape.push(raphael.path("M0,0 C0,-15,-7,-15,-7,-15 M0,0 C0,15,-7,15,-7,15"));
            gate.visibleShape.push(gate.highlightableShape);
            gate.visibleShape.push(raphael.circle(-20, -10, 3).attr("fill", BLUE));
            gate.visibleShape.push(raphael.circle(-20, 10, 3).attr("fill", BLUE));
            gate.visibleShape.push(raphael.circle(60, 0, 3).attr("fill", BLUE));
            gate.output = function() {
                return gate.input1 ^ gate.input2;
            };
        } else if (type === "xnor") {
            gate.visibleShape.push(raphael.path("M-20,-10 L-1,-10"));
            gate.visibleShape.push(raphael.path("M-20,10 L-1,10"));
            gate.visibleShape.push(raphael.path("M48,0 L60,0"));
            gate.highlightableShape.push(raphael.path("M5,0 C5,-15,-2,-15,-2,-15 C20,-15,25,-19,40,0 M5,0 C5,15,-2,15,-2,15 C20,15,25,19,40,0"));
            gate.highlightableShape.push(raphael.path("M0,0 C0,-15,-7,-15,-7,-15 M0,0 C0,15,-7,15,-7,15"));
            gate.highlightableShape.push(raphael.circle(44, 0, 4));
            gate.visibleShape.push(gate.highlightableShape);
            gate.visibleShape.push(raphael.circle(-20, -10, 3).attr("fill", BLUE));
            gate.visibleShape.push(raphael.circle(-20, 10, 3).attr("fill", BLUE));
            gate.visibleShape.push(raphael.circle(60, 0, 3).attr("fill", BLUE));
            gate.output = function() {
                return !(gate.input1 ^ gate.input2);
            };
        } else if (type === "not") {
            gate.visibleShape.push(raphael.path("M-20,0L0,0"));
            gate.visibleShape.push(raphael.path("M38,0L60,0"));
            gate.highlightableShape.push(raphael.path("M0,-15 L30,0 L0,15 Z"));
            gate.highlightableShape.push(raphael.circle(34, 0, 4));
            gate.visibleShape.push(gate.highlightableShape);
            gate.visibleShape.push(raphael.circle(-20, 0, 3).attr("fill", BLUE));
            gate.visibleShape.push(raphael.circle(60, 0, 3).attr("fill", BLUE));
            gate.output = function() {
                return !gate.input1;
            }
        }

        gate.visibleShape.attr({ stroke: BLUE, "stroke-width": 2 });
        gate.mouseTarget = mouselayer.path("M-10,-20L50,-20L50,20L-10,20Z");
        gate.mouseTarget.attr({ stroke: null, fill: "#000", opacity: 0.0 });

        gate.masterClock = function(event) {
            if (gate.input1Floating || gate.input2Floating) {
                if (gate.input1Floating) {
                    gate.input1 = false;
                }
                if (gate.input2Floating) {
                    gate.input1 = false;
                }
            } else {
                $(Logic).trigger("transition" + gate.outputX + "x" + gate.outputY, gate.output());
            }
            gate.input1Floating = true;
            gate.input2Floating = true;
        };
        $(Logic).bind("master-clock", gate.masterClock);

        gate.input1Changed = function(event, state) {
            gate.input1 = state;
            gate.input1Floating = false;
            $(Logic).trigger("transition" + gate.outputX + "x" + gate.outputY, gate.output());
        };

        gate.input2Changed = function(event, state) {
            gate.input2 = state;
            gate.input2Floating = false;
            $(Logic).trigger("transition" + gate.outputX + "x" + gate.outputY, gate.output());
        };

        gate.moveTo = function(x, y) {
            $(Logic).unbind("transition" + this.input1X + "x" + this.input1Y, gate.input1Changed);
            $(Logic).unbind("transition" + this.input2X + "x" + this.input2Y, gate.input2Changed);
            this.x = x;
            this.y = y;
            this.input1X = x - 20;
            this.input1Y = type === "not" ? y : y - 10;
            this.input2X = x - 20;
            this.input2Y = y + 10;
            this.outputX = x + 60,
            this.outputY = y;
            this.visibleShape.translate(this.x - this.mouseTarget.attr("translation").x, this.y - this.mouseTarget.attr("translation").y);
            this.mouseTarget.translate(this.x - this.mouseTarget.attr("translation").x, this.y - this.mouseTarget.attr("translation").y);
            $(Logic).bind("transition" + this.input1X + "x" + this.input1Y, gate.input1Changed);
            $(Logic).bind("transition" + this.input2X + "x" + this.input2Y, gate.input2Changed);
        };
        $(gate.mouseTarget[0]).css("cursor", "move");
        $(gate.mouseTarget[0]).bind("vmousedown vmouseover vmouseout", function(event) {
            if (event.type === "vmouseover") {
                gate.highlight = true;
                if (!Interactive.dragging) {
                    gate.highlightableShape.animate({stroke: ORANGE, "stroke-width": 3}, 50);
                }
            } else if (event.type === "vmouseout") {
                gate.highlight = false;
                if (!gate.dragging) {
                    gate.highlightableShape.animate({stroke: BLUE, "stroke-width": 2}, 50);
                }
            } else if (event.type === "vmousedown") {
                event.preventDefault();
                var xOffset = gate.x - event.pageX;
                var yOffset = gate.y - event.pageY;
                $(document).bind("vmousemove vmouseup", function(event) {
                    event.preventDefault();
                    var mouseX = event.pageX + xOffset;
                    var mouseY = event.pageY + yOffset;
                    mouseX = Math.round(mouseX / gate.snapX) * gate.snapX;
                    mouseY = Math.round(mouseY / gate.snapY) * gate.snapY;
                    mouseX = Math.max(10, Math.min(raphael.width - 10, mouseX));
                    mouseY = Math.max(10, Math.min(raphael.height - 10, mouseY));
                    if (event.type === "vmousemove") {
                        gate.moveTo(mouseX, mouseY);
                    } else if (event.type === "vmouseup") {
                        $(document).unbind("vmousemove vmouseup");
                    }
                });
            }
        });

        $(gate.mouseTarget[0]).dblclick(function(event) {
            Logic.items = _.without(Logic.items, gate);
            gate.remove();
        });

        gate.remove = function() {
            $(Logic).unbind("transition" + this.input1X + "x" + this.input1Y, gate.input1Changed);
            $(Logic).unbind("transition" + this.input2X + "x" + this.input2Y, gate.input2Changed);
            $(Logic).unbind("master-clock", gate.masterClock);
            gate.visibleShape.remove();
            gate.mouseTarget.remove();
        };

        gate.moveTo(x, y);
        return gate;
    };

    var addLED = function(x, y) {
        var led = $.extend({
            x: x, y: y,
            snapX: 10,
            snapY: 10,
            input: false
        }, {});

        led.getPos = function() {
            return {
                type: "led",
                x: this.x,
                y: this.y
            };
        };

        led.visibleShape = raphael.set();
        led.highlightableShape = raphael.set();

        led.highlightableShape.push(raphael.path("M0,0 L0,-20"));
        led.visibleShape.push(led.highlightableShape);
        led.visibleShape.push(raphael.circle(0, 0, 3).attr("fill", BLUE));
        led.visibleShape.attr({ stroke: BLUE, "stroke-width": 2 });
        led.indicator = raphael.circle(0, -20, 7).attr({ stroke: GRAY, fill: "#eee" });
        led.visibleShape.push(led.indicator);
        led.mouseTarget = mouselayer.path("M-15,-35L15,-35L15,15L-15,15Z");
        led.mouseTarget.attr({ stroke: null, fill: "#000", opacity: 0.0 });

        led.masterClock = function(event) {
            if (led.input) {
                led.indicator.attr({ stroke: GRAY, fill: GREEN });
            } else {
                led.indicator.attr({ stroke: GRAY, fill: "#eee" });
            }
            led.input = false;
        };
        $(Logic).bind("master-clock", led.masterClock);

        led.inputChanged = function(event, state) {
            led.input = state;
            if (led.input) {
                led.indicator.attr({ stroke: GRAY, fill: GREEN });
            } else {
                led.indicator.attr({ stroke: GRAY, fill: "#eee" });
            }
        };

        led.moveTo = function(x, y) {
            $(Logic).unbind("transition" + this.inputX + "x" + this.inputY, led.inputChanged);
            this.x = x;
            this.y = y;
            this.inputX = x,
            this.inputY = y;
            this.visibleShape.translate(this.x - this.mouseTarget.attr("translation").x, this.y - this.mouseTarget.attr("translation").y);
            this.mouseTarget.translate(this.x - this.mouseTarget.attr("translation").x, this.y - this.mouseTarget.attr("translation").y);
            $(Logic).bind("transition" + this.inputX + "x" + this.inputY, led.inputChanged);
        };

        $(led.mouseTarget[0]).css("cursor", "move");
        $(led.mouseTarget[0]).bind("vmousedown vmouseover vmouseout", function(event) {
            if (event.type === "vmouseover") {
                led.highlight = true;
                if (!Interactive.dragging) {
                    led.highlightableShape.animate({stroke: ORANGE, "stroke-width": 3}, 50);
                }
            } else if (event.type === "vmouseout") {
                led.highlight = false;
                if (!led.dragging) {
                    led.highlightableShape.animate({stroke: BLUE, "stroke-width": 2}, 50);
                }
            } else if (event.type === "vmousedown") {
                event.preventDefault();
                var xOffset = led.x - event.pageX;
                var yOffset = led.y - event.pageY;
                $(document).bind("vmousemove vmouseup", function(event) {
                    event.preventDefault();
                    var mouseX = event.pageX + xOffset;
                    var mouseY = event.pageY + yOffset;
                    mouseX = Math.round(mouseX / led.snapX) * led.snapX;
                    mouseY = Math.round(mouseY / led.snapY) * led.snapY;
                    mouseX = Math.max(10, Math.min(raphael.width - 10, mouseX));
                    mouseY = Math.max(10, Math.min(raphael.height - 10, mouseY));
                    if (event.type === "vmousemove") {
                        led.moveTo(mouseX, mouseY);
                    } else if (event.type === "vmouseup") {
                        $(document).unbind("vmousemove vmouseup");
                    }
                });
            }
        });

        led.moveTo(x, y);

        $(led.mouseTarget[0]).dblclick(function(event) {
            Logic.items = _.without(Logic.items, led);
            led.remove();
        });

        led.remove = function() {
            $(Logic).unbind("transition" + this.inputX + "x" + this.inputY, led.inputChanged);
            $(Logic).unbind("master-clock", led.masterClock);
            led.visibleShape.remove();
            led.mouseTarget.remove();
        };
        return led;
    };


    var addInput = function(x, y) {
        var button = $.extend({
            x: 0, y: 0,
            snapX: 10,
            snapY: 10,
            input: false
        }, {});

        button.getPos = function() {
            return {
                type: "input",
                x: this.x,
                y: this.y
            };
        };

        button.visibleShape = raphael.set();
        button.highlightableShape = raphael.set();
        button.visibleShape.push(raphael.path("M-25,0 L0,0"));
        button.highlightableShape.push(raphael.path("M-55,-15 L-25,-15 L-25,15 L-55,15 Z"));
        button.visibleShape.push(button.highlightableShape);
        button.visibleShape.push(raphael.circle(0, 0, 3).attr("fill", BLUE));
        button.visibleShape.attr({ stroke: BLUE, "stroke-width": 2 });
        button.mouseTarget = mouselayer.path("M-70,-25 L-5,-25 L-5,25 L-70,25Z");
        button.mouseTarget.attr({ stroke: null, fill: "#000", opacity: 0.0 });
        button.indicator = mouselayer.circle(-40, 0, 9).attr({ stroke: GRAY, fill: "#eee" });
        button.visibleShape.push(button.indicator);

        button.masterClock = function(event) {
            $(Logic).trigger("transition" + button.outputX + "x" + button.outputY, button.input);
        };
        $(Logic).bind("master-clock", button.masterClock);

        button.moveTo = function(x, y) {
            this.x = x;
            this.y = y;
            this.outputX = x,
            this.outputY = y;
            this.visibleShape.translate(this.x - this.mouseTarget.attr("translation").x, this.y - this.mouseTarget.attr("translation").y);
            this.mouseTarget.translate(this.x - this.mouseTarget.attr("translation").x, this.y - this.mouseTarget.attr("translation").y);
        };

        $(button.indicator[0]).css("cursor", "pointer");
        $(button.indicator[0]).bind("vmouseup", function(event) {
            button.input = !button.input;
            if (button.input) {
                button.indicator.attr({ stroke: GRAY, fill: GREEN });
            } else {
                button.indicator.attr({ stroke: GRAY, fill: "#eee" });
            }
        });

        $(button.mouseTarget[0]).css("cursor", "move");
        $(button.mouseTarget[0]).bind("vmousedown vmouseover vmouseout", function(event) {
            if (event.type === "vmouseover") {
                button.highlight = true;
                if (!Interactive.dragging) {
                    button.highlightableShape.animate({stroke: ORANGE, "stroke-width": 3}, 50);
                }
            } else if (event.type === "vmouseout") {
                button.highlight = false;
                if (!button.dragging) {
                    button.highlightableShape.animate({stroke: BLUE, "stroke-width": 2}, 50);
                }
            } else if (event.type === "vmousedown") {
                event.preventDefault();
                var xOffset = button.x - event.pageX;
                var yOffset = button.y - event.pageY;
                $(document).bind("vmousemove vmouseup", function(event) {
                    event.preventDefault();
                    var mouseX = event.pageX + xOffset;
                    var mouseY = event.pageY + yOffset;
                    mouseX = Math.round(mouseX / button.snapX) * button.snapX;
                    mouseY = Math.round(mouseY / button.snapY) * button.snapY;
                    mouseX = Math.max(10, Math.min(raphael.width - 10, mouseX));
                    mouseY = Math.max(10, Math.min(raphael.height - 10, mouseY));
                    if (event.type === "vmousemove") {
                        button.moveTo(mouseX, mouseY);
                    } else if (event.type === "vmouseup") {
                        $(document).unbind("vmousemove vmouseup");
                    }
                });
            }
        });

        button.moveTo(x, y);

        $(button.mouseTarget[0]).dblclick(function(event) {
            Logic.items = _.without(Logic.items, button);
            button.remove();
        });

        button.remove = function() {
            $(Logic).unbind("master-clock", button.masterClock);
            button.visibleShape.remove();
            button.mouseTarget.remove();
        };
        return button;
    };

    var addClock = function(x, y) {
        var clock = $.extend({
            x: 0, y: 0,
            snapX: 10,
            snapY: 10,
            period: 500,
            state: false
        }, {});

        clock.getPos = function() {
            return {
                type: "clock",
                x: this.x,
                y: this.y
            };
        };

        clock.visibleShape = raphael.set();
        clock.highlightableShape = raphael.set();
        clock.visibleShape.push(raphael.path("M45,0L70,0"));
        clock.highlightableShape.push(raphael.path("M0,-15 L45,-15 L45,15 L0,15 Z"));
        clock.highlightableShape.push(raphael.path("M4,0 Q8,-15 15,0 T26,0"));
        clock.visibleShape.push(clock.highlightableShape);
        clock.visibleShape.push(raphael.circle(70, 0, 3).attr("fill", BLUE));
        clock.indicator = raphael.circle(36, 0, 5).attr({ stroke: GRAY, fill: "#eee" });
        clock.visibleShape.attr({ stroke: BLUE, "stroke-width": 2 })
        clock.visibleShape.push(clock.indicator);

        clock.mouseTarget = mouselayer.path("M-5,-20L50,-20L50,20L-5,20Z");
        clock.mouseTarget.attr({ stroke: null, fill: "#000", opacity: 0.0 });

        clock.moveTo = function(x, y) {
            this.x = x;
            this.y = y;
            this.outputX = x + 70,
            this.outputY = y;
            this.visibleShape.translate(this.x - this.mouseTarget.attr("translation").x, this.y - this.mouseTarget.attr("translation").y);
            this.mouseTarget.translate(this.x - this.mouseTarget.attr("translation").x, this.y - this.mouseTarget.attr("translation").y);
        };

        clock.moveTo(x, y);

        $(clock.mouseTarget[0]).css("cursor", "move");
        $(clock.mouseTarget[0]).bind("vmousedown vmouseover vmouseout", function(event) {
            if (event.type === "vmouseover") {
                clock.highlight = true;
                if (!Interactive.dragging) {
                    clock.highlightableShape.animate({stroke: ORANGE, "stroke-width": 3}, 50);
                }
            } else if (event.type === "vmouseout") {
                clock.highlight = false;
                if (!clock.dragging) {
                    clock.highlightableShape.animate({stroke: BLUE, "stroke-width": 2}, 50);
                }
            } else if (event.type === "vmousedown") {
                event.preventDefault();
                var xOffset = clock.x - event.pageX;
                var yOffset = clock.y - event.pageY;
                $(document).bind("vmousemove vmouseup", function(event) {
                    event.preventDefault();
                    clock.dragging = true;
                    var mouseX = event.pageX + xOffset;
                    var mouseY = event.pageY + yOffset;
                    mouseX = Math.round(mouseX / clock.snapX) * clock.snapX;
                    mouseY = Math.round(mouseY / clock.snapY) * clock.snapY;
                    mouseX = Math.max(10, Math.min(raphael.width - 10, mouseX));
                    mouseY = Math.max(10, Math.min(raphael.height - 10, mouseY));
                    if (event.type === "vmousemove") {
                        clock.moveTo(mouseX, mouseY);
                    } else if (event.type === "vmouseup") {
                        $(document).unbind("vmousemove vmouseup");
                        clock.dragging = false;
                    }
                });
            }
        });

        clock.oscillatorClock = function(event, state) {
            clock.state = state;
        };
        $(Logic).bind("oscillator", clock.oscillatorClock);


        clock.masterClock = function(event) {
            if (clock.state) {
                clock.indicator.attr({ stroke: GRAY, fill: GREEN });
            } else {
                clock.indicator.attr({ stroke: GRAY, fill: "#eee" });
            }
            $(Logic).trigger("transition" + clock.outputX + "x" + clock.outputY, clock.state);
        };
        $(Logic).bind("master-clock", clock.masterClock);

        $(clock.mouseTarget[0]).dblclick(function(event) {
            Logic.items = _.without(Logic.items, clock);
            clock.remove();
        });

        clock.remove = function() {
            $(Logic).unbind("oscillator", clock.oscillatorClock);
            $(Logic).unbind("master-clock", clock.masterClock);
            clock.visibleShape.remove();
            clock.mouseTarget.remove();
        };
        return clock;
    };

    var oscillatorState = false;
    var setOscillator = function() {
        setTimeout(function() {
            oscillatorState = !oscillatorState;
            $(Logic).trigger("oscillator", oscillatorState);
            setOscillator();
        }, 500);
    };
    setOscillator();

    var addLine = function(x1, y1, x2, y2) {
        var pointA = Interactive.addMovablePoint({
            graph: raphael,
            coord: [x1, y1],
            snapX: 10,
            snapY: 10,
            normalStyle: {
                fill: BLUE,
                stroke: BLUE
            }
        });

        var pointZ = Interactive.addMovablePoint({
            graph: raphael,
            coord: [x2, y2],
            snapX: 10,
            snapY: 10,
            normalStyle: {
                fill: BLUE,
                stroke: BLUE
            }
        });

        var line = Interactive.addMovableLineSegment({
            pointA: pointA,
            pointZ: pointZ,
        });

        line.getPos = function() {
            return {
                type: "line",
                x1: pointA.coord[0],
                y1: pointA.coord[1],
                x2: pointZ.coord[0],
                y2: pointZ.coord[1]
            };
        };

        line.onMove = function(dX, dY) {
            this.coordA[0] = Math.round(this.coordA[0] / 10) * 10;
            this.coordA[1] = Math.round(this.coordA[1] / 10) * 10;
            this.coordZ[0] = Math.round(this.coordZ[0] / 10) * 10;
            this.coordZ[1] = Math.round(this.coordZ[1] / 10) * 10;
            if (this.pointA.onMove(this.coordA[0], this.coordA[1]) !== false) {
                this.pointA.setCoord(this.coordA);
            }
            if (this.pointZ.onMove(this.coordZ[0], this.coordZ[1]) !== false) {
                this.pointZ.setCoord(this.coordZ);
            }
            this.pointA.updateLineEnds();
            this.pointZ.updateLineEnds();
        };

        var inputAState = false;
        var inputAFloating = true;
        var inputZState = false;
        var inputZFloating = true;

        var inputAChanged = function(event, state) {
            inputAState = state;
            inputAFloating = false;
            $(Logic).unbind("transition" + pointZ.coord[0] + "x" + pointZ.coord[1], inputZChanged);
            $(Logic).trigger("transition" + pointZ.coord[0] + "x" + pointZ.coord[1], inputAState);
            $(Logic).bind("transition" + pointZ.coord[0] + "x" + pointZ.coord[1], inputZChanged);
        };

        var inputZChanged = function(event, state) {
            inputZState = state;
            inputZFloating = false;
            $(Logic).unbind("transition" + pointA.coord[0] + "x" + pointA.coord[1], inputAChanged);
            $(Logic).trigger("transition" + pointA.coord[0] + "x" + pointA.coord[1], inputZState);
            $(Logic).bind("transition" + pointA.coord[0] + "x" + pointA.coord[1], inputAChanged);
        };

        inputAChanged(null, false);
        inputZChanged(null, false);

        pointA.onMove = function(x, y) {
            if (x === pointZ.coord[0] && y === pointZ.coord[1]) {
                return false;
            }
            $(Logic).unbind("transition" + this.coord[0] + "x" + this.coord[1], inputAChanged);
            $(Logic).bind("transition" + x + "x" + y, inputAChanged);
        };

        pointZ.onMove = function(x, y) {
            if (x === pointA.coord[0] && y === pointA.coord[1]) {
                return false;
            }
            $(Logic).unbind("transition" + this.coord[0] + "x" + this.coord[1], inputZChanged);
            $(Logic).bind("transition" + x + "x" + y, inputZChanged);
        };

        line.masterClock = function(event) {
            if (inputAFloating) {
                inputAState = false;
            } else {
                $(Logic).unbind("transition" + pointZ.coord[0] + "x" + pointZ.coord[1], inputZChanged);
                $(Logic).trigger("transition" + pointZ.coord[0] + "x" + pointZ.coord[1], inputAState);
                $(Logic).bind("transition" + pointZ.coord[0] + "x" + pointZ.coord[1], inputZChanged);
            }
            if (inputZFloating) {
                inputZState = false;
            } else {
                $(Logic).unbind("transition" + pointA.coord[0] + "x" + pointA.coord[1], inputAChanged);
                $(Logic).trigger("transition" + pointA.coord[0] + "x" + pointA.coord[1], inputZState);
                $(Logic).bind("transition" + pointA.coord[0] + "x" + pointA.coord[1], inputAChanged);
            }
            inputAFloating = true;
            inputZFloating = true;
        };

        $(line.mouseTarget[0]).dblclick(function(event) {
            Logic.items = _.without(Logic.items, line);
            line.remove();
        });

        line.remove = function() {
            $(Logic).unbind("transition" + pointA.coord[0] + "x" + pointA.coord[1], inputAChanged);
            $(Logic).unbind("transition" + pointZ.coord[0] + "x" + pointZ.coord[1], inputZChanged);
            $(Logic).unbind("master-clock", line.masterClock);
            pointA.visibleShape.remove();
            pointA.mouseTarget.remove();
            pointZ.visibleShape.remove();
            pointZ.mouseTarget.remove();
            line.visibleLine.remove();
            line.mouseTarget.remove();
        }

        return line;
    };

    Interactive.init(raphael, mouselayer);

    //addGate("and", 100, 200);
    //drawOr(100, 250);
    //drawXor(100, 300);
    //drawNand(100, 350);
    //drawNot(100, 150);
    //addClock(200, 200);
    //addLED(200, 100);
    //addLED(200, 150);
    //addInput(200,100);
    //addInput(200,150);
    //addLine(10,10, 50, 50);

/*
    addInput(100, 50);
    addInput(100, 100);
    addInput(100, 150);
    addGate("xor", 150, 60);
    addLine(100, 100, 130, 100)
    addLine(100, 50, 130, 50)
    addLine(130, 70, 130, 100)
    addGate("xor", 230, 140);
    addLine(210, 90, 210, 130)
    addLine(100, 150, 210, 150)
    addLED(290, 140);
    addGate("not", 100,300);
    addClock(100,200);
    */

    var setPeriodicTimer = function() {
        setTimeout(function() {
            $(Logic).trigger("master-clock");
            setPeriodicTimer();
        }, 100)
    };
    setPeriodicTimer();

    $("#save-button").click(function() {
        $("#save-area").val(JSON.stringify($.map(Logic.items, function(item) {
            return item.getPos();
        })));
    });

    $("#load-button").click(function() {
        $.each(Logic.items, function(n, item) {
            item.remove();
        });
        Logic.items = [];

        try {
            var layout = JSON.parse($("#save-area").val());
            $.each(layout, function(n, item) {
                if (_.contains(["and", "nand", "or", "nor", "xor", "xnor", "not"], item.type)) {
                    Logic.items.push(addGate(item.type, item.x, item.y));
                } else if (item.type === "line") {
                    Logic.items.push(addLine(item.x1, item.y1, item.x2, item.y2));
                } else if (item.type === "input") {
                    Logic.items.push(addInput(item.x, item.y));
                } else if (item.type === "clock") {
                    Logic.items.push(addClock(item.x, item.y));
                } else if (item.type === "led") {
                    Logic.items.push(addLED(item.x, item.y));
                } else {
                    console.log(item.type);
                }
            });
        } catch(e) {
            //alert("invalid input");
        }
    });

    $("#load-1").click(function() {
        $.ajax({ url: "demo.json", type: "GET", success: function(data) {
            $("#save-area").val(data);
            $("#load-button").trigger("click");
        }});
    });

    $("#load-2").click(function() {
        $.ajax({ url: "adder.json", type: "GET", success: function(data) {
            $("#save-area").val(data);
            $("#load-button").trigger("click");
        }});
    });

    $("input.add-tool").click(function(event) {
        var type = event.target.defaultValue;
        if (type === "AND") {
            Logic.items.push(addGate("and", raphael.width - 350, 100));
        } else if (type === "NAND") {
            Logic.items.push(addGate("nand", raphael.width - 350, 100));
        } else if (type === "OR") {
            Logic.items.push(addGate("or", raphael.width - 350, 100));
        } else if (type === "NOR") {
            Logic.items.push(addGate("nor", raphael.width - 350, 100));
        } else if (type === "XOR") {
            Logic.items.push(addGate("xor", raphael.width - 350, 100));
        } else if (type === "XNOR") {
            Logic.items.push(addGate("xnor", raphael.width - 350, 100));
        } else if (type === "NOT") {
            Logic.items.push(addGate("not", raphael.width - 350, 100));
        } else if (type === "Input") {
            Logic.items.push(addInput(raphael.width - 300, 100));
        } else if (type === "Clock") {
            Logic.items.push(addClock(raphael.width - 350, 100));
        } else if (type === "LED") {
            Logic.items.push(addLED(raphael.width - 350, 100));
        } else if (type === "Connect") {
            Logic.items.push(addLine(raphael.width - 400, 100, raphael.width - 300, 100));
        }
    });

    var setLessonCountTimer = function() {
        setTimeout(function() {
            var estimatedTotalViews = -4.792993409561827e9 + 3.6966675231488018e-3 * (+new Date());
            var totalViewsString = addCommas("" + Math.round(estimatedTotalViews));
            $("#numlessons").text(totalViewsString);
            setLessonCountTimer();
        }, 100)
    };
    setLessonCountTimer();

});

$(window).resize(function() {
    $("#container .exercises-body .current-card-contents").height(Math.max($(window).height() - 212, 1000));
    $("#container .exercises-body .current-card-contents svg").height(Math.max($(window).height() - 212, 1000));
});
