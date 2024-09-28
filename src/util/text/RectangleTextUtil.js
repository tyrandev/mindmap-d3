export default class RectangleTextUtil {
  static countLettersAndNumbers(text) {
    return text.replace(/[^a-zA-Z0-9]/g, "").length;
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
}
