import * as d3 from "d3";

const MAX_CHARACTER_NUMBER_CIRCLE = 35;

export default class CircleTextHelper {
  static calculateFontSize(text, radius) {
    const textLength = text.length;
    if (textLength <= 8) {
      return Math.floor(radius / 2.85);
    } else if (textLength <= 12) {
      return Math.floor(radius / 3);
    } else {
      return Math.floor(radius / 3.5);
    }
  }

  static measureTextWidth(text, fontSize) {
    const svg = d3.select("body").append("svg").style("visibility", "hidden");
    const textElement = svg
      .append("text")
      .attr("font-size", fontSize)
      .attr("font-family", "Arial")
      .text(text);

    const bbox = textElement.node().getBBox();
    const width = bbox.width;

    svg.remove();
    return width;
  }

  static limitTextCharacterNumber(newText) {
    return newText.substring(0, MAX_CHARACTER_NUMBER_CIRCLE);
  }

  static splitTextIntoLines(text, radius, fontSize) {
    const maxLineWidth = radius * 2;
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word, index) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const lineWidth = this.measureTextWidth(testLine, fontSize);

      if (lineWidth > maxLineWidth && currentLine) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine.trim());
    }

    return lines;
  }

  static calculateTextLines(text, radius) {
    const fontSize = this.calculateFontSize(text, radius);
    return this.splitTextIntoLines(text, radius, fontSize);
  }
}
