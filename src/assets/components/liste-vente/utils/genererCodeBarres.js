import JsBarcode from "jsbarcode";
import { createCanvas } from "canvas";

const genererCodeBarres = (id) => {
  const canvas = createCanvas(200, 100);
  JsBarcode(canvas, id.toString().padStart(12, "0"), {
    format: "CODE128",
    width: 2,
    height: 50,
    displayValue: false,
  });
  return canvas.toDataURL("image/png");
};

export default genererCodeBarres;