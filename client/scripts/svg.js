const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("viewBox", "0 0 70 80");
svg.setAttribute("width", "25");
svg.setAttribute("height", "25");

const triangle = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "polygon"
);
triangle.setAttribute("points", "0,0 69,40 0,80");
triangle.setAttribute("fill", "white");
svg.append(triangle);

const smallerSvg = svg.cloneNode(true);
smallerSvg.setAttribute("width", "15");
smallerSvg.setAttribute("height", "15");

const createBigSvg = () => svg.cloneNode(true);
const createSmallSvg = () => smallerSvg.cloneNode(true);

export { createBigSvg, createSmallSvg };
