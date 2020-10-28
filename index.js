const BACKGROUND = {
  INTERVAL: 25,
  COLOR: "#777"
};

const LAYOUT = {
  COLOR: "#000",
  FIRST_WIDTH: 20,
  SECOND_WIDTH: 10,
  THIRD_WIDTH: 5
};

const CIRCLE = {
  COLOR: "#ababab",
  X: 360,
  Y: 300,
  THIN_WIDTH: 5,
  THICK_WIDTH: 60,
  FIRST_RADIS: 380,
  SECOND_RADIS: 330,
  THRID_RADIS: 280,
  FORTH_RADIS: 260,
  ALPHA: 0.7,
  ROTATING_ANGLE: Math.PI * 0.45,
  ROTATING_INTERVAL: 8000
};

const ANIMATION = {
  FRAME: 30,
  DELAY_MAX: 4000,
  SLOW_INTERVAL: 0.2
};

const NAME = {
  FONT: "700 100px Serif",
  X: 340,
  Y: 360,
  INTER_X: 40,
  INTER_Y: 110
};

const ABILITY = {
  FONT: "700 70px Serif",
  X: 330,
  Y: 220,
  INTER_X: 30
};

const EXPLANATION = {
  FONT: "700 36px Arial",
  LEN_MAX: 150,
  FRAME_DIVIDER: 10,
  INTER_X: 500,
  TOP_X: -100,
  TOP_Y: 100,
  BOTTOM_X: -300,
  BOTTOM_Y: 690,
  EMPTY_SPACE: "    "
};

let canvas, ctx;

const drawVerticalLine = (x, width = 1) => {
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvas.clientHeight);
  ctx.stroke();
};

const drawHorizontalLine = (y, width = 1) => {
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(-canvas.clientWidth, y);
  ctx.lineTo(canvas.clientWidth, y);
  ctx.stroke();
};

const drawRotatingArc = (begin, end, frame) => {
  const rotated = (Math.PI * frame) / CIRCLE.ROTATING_INTERVAL;
  const x = CIRCLE.X;
  const y = CIRCLE.Y;
  const r = CIRCLE.SECOND_RADIS;
  ctx.beginPath();
  ctx.arc(x, y, r, rotated + begin, rotated + end, false);
  ctx.stroke();
};

const drawBackground = () => {
  ctx.strokeStyle = BACKGROUND.COLOR;
  for (let i = 0; i < canvas.clientWidth; i += BACKGROUND.INTERVAL) {
    drawVerticalLine(i);
    drawHorizontalLine(i);
  }
};

const drawLayout = (frame, delay) => {
  const inversedX = canvas.clientHeight - BACKGROUND.INTERVAL;
  ctx.strokeStyle = LAYOUT.COLOR;
  ctx.save();
  ctx.translate(-1.2 * frame - delay, 0);
  drawHorizontalLine(BACKGROUND.INTERVAL, LAYOUT.FIRST_WIDTH);
  drawHorizontalLine(BACKGROUND.INTERVAL * 2, LAYOUT.SECOND_WIDTH);
  drawHorizontalLine(BACKGROUND.INTERVAL * 2.5, LAYOUT.THIRD_WIDTH);
  drawHorizontalLine(BACKGROUND.INTERVAL * 2.8, LAYOUT.THIRD_WIDTH);
  ctx.restore();
  ctx.save();
  ctx.translate(canvas.clientWidth + 1.2 * frame + delay, 0);
  drawHorizontalLine(inversedX, LAYOUT.FIRST_WIDTH);
  drawHorizontalLine(inversedX - BACKGROUND.INTERVAL, LAYOUT.SECOND_WIDTH);
  drawHorizontalLine(inversedX - BACKGROUND.INTERVAL * 1.5, LAYOUT.THIRD_WIDTH);
  drawHorizontalLine(inversedX - BACKGROUND.INTERVAL * 1.8, LAYOUT.THIRD_WIDTH);
  ctx.restore();
};

const drawStaticCircle = () => {
  ctx.save();
  ctx.strokeStyle = CIRCLE.COLOR;
  ctx.lineWidth = CIRCLE.THIN_WIDTH;
  ctx.globalAlpha = CIRCLE.ALPHA;
  ctx.beginPath();
  ctx.arc(CIRCLE.X, CIRCLE.Y, CIRCLE.FIRST_RADIS, 0, Math.PI * 2, true);
  ctx.arc(CIRCLE.X, CIRCLE.Y, CIRCLE.THRID_RADIS, 0, Math.PI * 2, true);
  ctx.arc(CIRCLE.X, CIRCLE.Y, CIRCLE.FORTH_RADIS, 0, Math.PI * 2, true);
  ctx.stroke();
};

const drawRotatingCircle = frame => {
  ctx.lineWidth = CIRCLE.THICK_WIDTH;
  for (let angle = 0; angle < 2 * Math.PI; angle += 0.5 * Math.PI)
    drawRotatingArc(angle, angle + CIRCLE.ROTATING_ANGLE, frame);
  ctx.restore();
};

const drawName = (name, frame, delay) => {
  const seperatedNames = name.split(" ");
  let len, x, y;
  ctx.save();
  ctx.font = NAME.FONT;
  ctx.translate(frame + delay, 0);
  for (let i = 0; i < seperatedNames.length; i++) {
    len = seperatedNames[i].length;
    x = NAME.X - len * NAME.INTER_X;
    y = NAME.Y + i * NAME.INTER_Y;
    ctx.fillText(seperatedNames[i], x, y);
  }
  ctx.restore();
};

const drawAbility = (ability, frame, delay) => {
  const x = ABILITY.X - ABILITY.INTER_X * ability.length;
  const y = ABILITY.Y;
  ctx.save();
  ctx.font = ABILITY.FONT;
  ctx.translate(-frame - delay, 0);
  ctx.fillText(ability, x, y);
  ctx.restore();
};

const drawExplanation = (explanation, frame) => {
  ctx.save();
  ctx.font = EXPLANATION.FONT;
  while (explanation.length < EXPLANATION.LEN_MAX)
    explanation += EXPLANATION.EMPTY_SPACE + explanation;
  ctx.translate(frame / EXPLANATION.FRAME_DIVIDER - EXPLANATION.INTER_X, 0);
  ctx.fillText(explanation, EXPLANATION.TOP_X, EXPLANATION.TOP_Y);
  ctx.fillText(explanation, EXPLANATION.BOTTOM_X, EXPLANATION.BOTTOM_Y);
  ctx.restore();
};

const draw = (name, ability, explanation, frame, delay) => {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  drawBackground();
  drawLayout(frame, delay);
  drawStaticCircle();
  drawRotatingCircle(frame);
  drawName(name, frame, delay);
  drawAbility(ability, frame, delay);
  drawExplanation(explanation, frame, delay);
  frame -= ANIMATION.FRAME;
  if (frame < -5 * canvas.clientWidth) return;
  if (frame < 0 && delay < ANIMATION.DELAY_MAX)
    delay += ANIMATION.FRAME - ANIMATION.SLOW_INTERVAL;
  requestAnimationFrame(() => draw(name, ability, explanation, frame, delay));
};

window.addEventListener("DOMContentLoaded", () => {
  const explanation = "FRONT-END DEVELOPER";
  const ability = "프론트엔드 개발자";
  const name = "배형진";
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  draw(name, ability, explanation, canvas.clientWidth, 0);
});
