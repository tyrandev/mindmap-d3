import OSUtil from "../util/os/OSUtil.js";
import BrowserUtil from "../util/browser/BrowserUtil.js";
import Circle from "../model/geometric/circle/Circle.js";
import CircleTextHelper from "../model/geometric/circle/CircleTextHelper.js";
import svgManager from "../view/SvgManager.js";

export default class SystemCore {
  startApplication() {
    console.log(OSUtil.getOS());
    console.log(BrowserUtil.getBrowser());
    console.log("Application started");
    this.initializeD3();
  }

  initializeD3() {
    // Initialize the SVG context through SvgManager
    const svg = svgManager.initialize("#mindMapSvg");

    // Retrieve dimensions directly from SvgManager
    const svgWidth = svgManager.getSvgWidth();
    const svgHeight = svgManager.getSvgHeight();

    const circle = new Circle(svgWidth / 2, svgHeight / 2);
    circle.setRadius(50);
    circle.setFillColor("lightyellow");
    circle.setBorderColor("black");
    circle.setText("modern day computing");

    // Draw the circle
    svg
      .append("circle")
      .attr("cx", circle.x)
      .attr("cy", circle.y)
      .attr("r", circle.getRadius())
      .style("fill", circle.getFillColor())
      .style("stroke", circle.getBorderColor())
      .style("stroke-width", 1);

    // Split the text into lines
    const lines = CircleTextHelper.splitTextIntoLines(
      circle.getText(),
      circle.getRadius(),
      circle.fontSize
    );

    // Calculate the total height of the text
    const lineHeight = circle.fontSize * 1.2; // Adjust line height as needed
    const textHeight = lines.length * lineHeight;

    // Add text to the SVG
    svg
      .selectAll("text")
      .data(lines)
      .enter()
      .append("text")
      .attr("x", circle.x)
      .attr("y", (d, i) => circle.y + (i - (lines.length - 1) / 2) * lineHeight)
      .attr("dy", ".3em")
      .attr("text-anchor", "middle")
      .style("fill", circle.textColor || "black")
      .style("font-size", `${circle.fontSize || 12}px`)
      .style("font-family", "Arial")
      .text((d) => d);

    console.log("D3 initialized, circle drawn, and multiline text added");
  }
}
