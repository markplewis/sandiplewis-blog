import { getColorData } from "utils/color";

import styles from "components/ColorSwatches.module.css";

const pass = <span style={{ textTransform: "uppercase", color: "green" }}>Pass</span>;
const fail = <span style={{ textTransform: "uppercase", color: "red" }}>Fail</span>;

const stats = (num, label) => {
  return (
    <div>
      <p>
        <strong>{label}</strong>
      </p>
      AA lg (3:1) {num < 1 / 3 ? pass : fail}
      <br />
      AA sm (4.5:1) {num < 1 / 4.5 ? pass : fail}
      <br />
      AAA lg (4.5:1) {num < 1 / 4.5 ? pass : fail}
      <br />
      AAA sm (7:1) {num < 1 / 7 ? pass : fail}
    </div>
  );
};

export default function ColorSwatches({ palette }) {
  const colorData = getColorData(palette);

  return Object.keys(colorData).map(key => {
    return (
      <div key={key} style={{ backgroundColor: "white", padding: "10px" }}>
        <div className={styles.paletteGroup}>
          <p>
            <strong>{key}</strong>
          </p>
          {Object.entries(colorData[key]).map(
            ([label, { background, foreground, contrastRatio, contrastFloat }]) => {
              return (
                <div key={`${key}-${label}-${background.hex}`} className={styles.swatchGroup}>
                  <div
                    className={styles.swatch}
                    style={{
                      backgroundColor: background.hex,
                      color: foreground.hex
                    }}>
                    {contrastRatio}
                  </div>
                  {stats(contrastFloat, label)}
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  });
}
