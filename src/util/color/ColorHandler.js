export default class ColorHandler {
  // Method to validate a hex color
  static validateHexColor(color) {
    if (
      !(color.startsWith("#") && (color.length === 7 || color.length === 4))
    ) {
      throw new Error(
        `Invalid color "${color}". Please provide a valid hex value.`
      );
    }
  }

  // Function to darken a given hex color by a specified percentage
  static darkenColor(color, percent) {
    this.validateHexColor(color);

    // Convert hex to RGB
    let num = parseInt(color.slice(1), 16);
    let r = (num >> 16) * (1 - percent / 100);
    let b = ((num >> 8) & 0x00ff) * (1 - percent / 100);
    let g = (num & 0x0000ff) * (1 - percent / 100);

    // Ensure values are within valid range
    r = Math.min(Math.max(0, r), 255);
    g = Math.min(Math.max(0, g), 255);
    b = Math.min(Math.max(0, b), 255);

    // Convert back to hex
    return "#" + (g | (b << 8) | (r << 16)).toString(16).padStart(6, "0");
  }

  // Function to lighten a given hex color by a specified percentage
  static lightenColor(color, percent) {
    this.validateHexColor(color);

    // Convert hex to RGB
    let num = parseInt(color.slice(1), 16);
    let r = (num >> 16) + percent;
    let g = (num & 0x0000ff) + percent;
    let b = ((num >> 8) & 0x00ff) + percent;

    // Ensure values are within valid range
    r = Math.min(Math.max(0, r), 255);
    g = Math.min(Math.max(0, g), 255);
    b = Math.min(Math.max(0, b), 255);

    // Convert back to hex
    return "#" + (g | (b << 8) | (r << 16)).toString(16).padStart(6, "0");
  }

  static getRandomLightColor() {
    const getLightRandomValue = () => Math.floor(Math.random() * 64 + 192);
    const r = getLightRandomValue();
    const g = getLightRandomValue();
    const b = getLightRandomValue();

    // Convert to hex and pad with zeros if necessary
    const toHex = (value) => value.toString(16).padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
}
