// Original by David Snyder, edited by Peter Hellmich
let data;
let theta;
let current = 0;
let sectionSize;
let size = 125;
let colors = [];
let spinning = false;
let spinButton, removeButton, resetButton;
let CCDIV;
let backC, prevC;
let selected;
let total;
let prevTheta = 0;
let numbers = [];
let selectedIndex = 0;
let displayDiv;
let closeButton;
let split;
let selectedData;

let drumroll;
let fanfare;

const mouse = () => createVector(mouseX - width / 2, mouseY - height / 2);
const pmouse = () => createVector(pmouseX - width / 2, pmouseY - height / 2);

function preload() {
	// Loading the contributions
	data = loadJSON("superdata-2.json", j => (data = j));
	// Loading Soundfiles
	soundFormats("mp3");
	// drumroll CC0: https://freesound.org/people/bigjoedrummer/sounds/77305/
	drumroll = loadSound("sounds/drumroll");
	// Fanfare CC0: https://freesound.org/people/Robinhood76/sounds/534017/
	fanfare = loadSound("sounds/fanfare");
	fanfare.playMode("untilDone");
}

const getNumbers = () => {
	const shuffled = data.sort(() => random(-1, 1));

	// Get sub-array of first n elements after shuffled
	selectedData = shuffled.slice(0, 10);
	total = min(10, data.length);
	numbers = [...Array(total).keys()].map(val => val + 1);
	sectionSize = TWO_PI / total;
	loadColors();
};

function setup() {
	createCanvas(windowWidth, windowHeight);
	size = (height * 0.7) / 4;
	closeButton = select("#close").mousePressed(() => {
		spinButton.show();
		removeButton.show();
		displayDiv.hide();
		resetButton.show();
	});
	getNumbers();
	current = random(TWO_PI);
	theta = 0;

	displayDiv = select("#display");
	spinButton = createButton("🌀 Spin The Wheel")
		.mousePressed(() => {
			if (!spinning) {
				let force = random(0.4, 0.5);

				if (random(1) > 0.5) force *= -1;

				theta += force;
			}
			spinning = true;
			// Play the Drumroll when spinning
			drumroll.play();
		})
		.addClass("button")
		.position(25, windowHeight - 100);

	removeButton = createButton("🔎 View Selected")
		.mousePressed(() => {
			total--;

			let selected = selectedData.splice(selectedIndex, 1)[0];
			sectionSize = TWO_PI / total;
			loadColors();
			showSelected(selected);
		})
		.addClass("button")
		.position(25, windowHeight - 70);

	resetButton = createButton("❌ Reset")
		.mousePressed(getNumbers)
		.addClass("button")
		.position(25, windowHeight - 40);

	resetButton = createButton("🔇")
		.mousePressed(mute)
		.addClass("button")
		.id("mute")
		.position(140, windowHeight - 40);

	CCDIV = createDiv(
		"copy of <a href = 'http://shiffman.github.io/randomizer/spin/index.html?id=-Lpud6LpelY04t5yqzny' target=_blank>Class Randomizer</a> by Dan Shiffman"
	);
	CCDIV.id("remove");
	loadColors();
	backC = color(51);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mouseReleased() {
	if (mouse().mag() < size * 2) {
		var h1 = mouse().heading();
		var h2 = pmouse().heading();
		var mag = h1 - h2;
		mag = constrain(mag, -3.5, 3.5);
		theta = mag;
	}
}

function draw() {
	if (prevC) {
		backC = lerpColor(backC, prevC, 0.04);
	}

	if (backC);
	{
		backC.setAlpha(200);
		background(backC);
	}

	if (selectedData) {
		translate(width / 2, height / 2);
		stroke(255);
		fill(190);
		noStroke();
		fill(255);
		strokeWeight(1);
		if (mouseIsPressed) {
			if (mouse().mag() < size * 2) {
				current = angleLerp(current, mouse().heading() + TWO_PI, 0.25);
				current %= TWO_PI;
				// theta = mouse().heading();
			}
		}
		// current += constrain(radians(theta - current), -QUARTER_PI / 4, QUARTER_PI / 4);
		current += theta;

		theta *= 0.983;

		// Play the fanfare when near end but spinning
		if (theta < 0.002 && theta > -0.002 && spinning == true) {
			fanfare.play();
		}

		// Stop spinning when near zero movement
		if (theta < 0.001 && theta > -0.001) {
			theta = 0;
			spinning = false;
		}

		current = (current + TWO_PI) % TWO_PI;

		if (similar(current, theta, 0.01)) {
			spinning = false;
			// current = theta;
		}

		strokeWeight(8);
		stroke(360);

		fill(190);

		circle(0, 0, size * 4, size * 4);
		drawArcs();
		drawSpinner();
	}
}

function showSelected(selected) {
	displayDiv.show();
	spinButton.hide();
	removeButton.hide();
	resetButton.hide();
	select("#number").html(`<a target="_blank" href=${selected.link}>` + (selected.title || "Contribution") + "</a>");
	select("#challenge").html(
		`the original challenge is <a target="_blank" href=${selected.challengeURL}>` + selected["Original Challenge"] + "</a>"
	);
	if (selected.authorURL) {
		print("hi");
		select("#contribute").html(`Contributed by: <a target="_blank" href=${selected.authorURL}>` + selected.contributor + "</a>");
	} else {
		select("#contribute").html("Contributed by: <b>" + selected.contributor + "</b>");
	}
}

function drawSpinner() {
	let spinner = size * 4 * 0.35;
	strokeWeight(1);
	rotate(current);

	stroke(255);
	fill(255);
	strokeWeight(8);
	line(-spinner, -0, spinner, 0);
	strokeWeight(1);
	circle(0, 0, 20);
	fill(0);
	circle(0, 0, 5);
	fill(255);

	push();
	translate(spinner - 5, 0);
	rotate(QUARTER_PI);
	triangle(7.5, 7.5, 15, -15, -7.5, -7.5);
	pop();

	rectMode(CENTER);
	rect(-spinner, 0, 16, 16);
}

function drawArcs() {
	for (let i = 0; i < total; i++) {
		push();
		let t = (i / total) * TWO_PI;
		let prev = t - sectionSize;
		rotate(t);
		let c = colors[i];
		c.setAlpha(255);
		let cot = current + 120 * TWO_PI;
		let me = (cot % TWO_PI) - sectionSize;
		let txtSize = 15;
		let sw = 4;
		let astroke = 1;
		let strokeCol = 200;
		let thisSize = size;

		if (me > prev && me < t) {
			prevC = c;
			selectedIndex = i;
			c.setAlpha(190);
			txtSize = 25;
			thisSize += 7;
			sw = 6;
			astroke = 4;
			strokeCol = color(0, 0, 0, 0);
		}
		textSize(txtSize);
		push();
		textAlign(CENTER, CENTER);
		rotate(-QUARTER_PI);
		let txt = selectedData[i].Number;
		let title = selectedData[i].title;
		let n = 0;
		//if (typeof(txt) == 'string') {
		//  n = txt.length * 2 + (txtSize) + 2;
		//  if (str(int(txt)) == txt) n = txt.length * 3;
		// }

		// print(txt.length);

		rotate(sectionSize / 2);
		translate(size * 1.75 + n, size * 1.75 + n);
		rotate(-t);
		rotate(QUARTER_PI / 1.75);
		// rotate(-QUARTER_PI);
		// rotate(PI);
		// rotate(HALF_PI);
		// rotate(t);
		stroke(0, 100);
		//strokeWeight(sw/2);
		strokeWeight(2);
		fill(255);
		//noStroke();
		textSize(15);
		// Contribution Number
		//text(txt, 0, 0);
		// Contribution title
		text(title, 0, 0, 100, 100);
		pop();
		fill(c);
		stroke(strokeCol);

		strokeWeight(astroke);

		arc(0, 0, thisSize * 4, thisSize * 4, 0, sectionSize, PIE);
		pop();
	}
}

function similar(a, b, epsilon = 0.01) {
	return abs(a - b) <= epsilon;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function shortAngleDist(a0, a1) {
	let max = TWO_PI;
	let da = (a1 - a0) % max;
	return ((2 * da) % max) - da;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function angleLerp(a0, a1, t) {
	return a0 + shortAngleDist(a0, a1) * t;
}

function loadColors() {
	// TODO: set better colors with RGB
	colors = [];
	var rainbowColors = [
		createVector(0, 0, 0).set(color("red").levels),
		createVector(0, 0, 0).set(color("orange").levels),
		createVector(0, 0, 0).set(color("yellow").levels),
		createVector(0, 0, 0).set(color("green").levels),
		createVector(38, 58, 150), // blue
		createVector(0, 0, 0).set(color("indigo").levels),
		createVector(0, 0, 0).set(color("violet").levels),
	];
	for (var i = 0; i < total; i++) {
		var colorPosition = i / total;
		var scaledColorPosition = colorPosition * (rainbowColors.length - 1);

		var colorIndex = floor(scaledColorPosition);
		var colorPercentage = scaledColorPosition - colorIndex;
		// print(colorPercentage);

		var nameColor = p5.Vector.lerp(rainbowColors[colorIndex], rainbowColors[colorIndex + 1], colorPercentage);
		colors.push(color(nameColor.x, nameColor.y, nameColor.z));
	}
}

function mute() {
	if (getMasterVolume() < 0.5) {
		masterVolume(1);
		document.getElementById("mute").innerHTML = "🔇";
	} else {
		masterVolume(0);
		document.getElementById("mute").innerHTML = "🔉";
	}
}
