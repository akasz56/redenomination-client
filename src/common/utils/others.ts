export function capitalize(str: string) {
  const words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  return words.join(" ");
}

export const generateRandomHexColor = () =>
  `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;

export function displayPrice(
  price: number | string,
  phaseType = "preRedenomPrice"
) {
  if (typeof price === "string") {
    price = parseFloat(price);
  }

  switch (phaseType) {
    case "preRedenomPrice":
      return "Rp. " + priceMask(price);

    case "transitionPrice":
      return (
        "Rp. " +
        priceMask(price) +
        " / Rp. " +
        priceMask(price / 1000) +
        " (Rupiah Baru)"
      );

    case "postRedenomPrice":
      return "Rp. " + priceMask(price / 1000) + " (Rupiah Baru)";

    default:
      break;
  }
}

export function priceMask(num: number) {
  if (isNaN(num)) {
    return "0";
  } else {
    let [part1, part2] = num.toString().split(".", 2);
    return part2 !== undefined
      ? part1.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + part2
      : part1.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

export function priceUnMask(str: string) {
  const parts = (1234.5).toLocaleString().match(/(\D+)/g);
  if (!parts) {
    throw new Error("RegExpMatchArray is null");
  }
  let unformatted = str;

  unformatted = unformatted.split(parts[0]).join("");
  unformatted = unformatted.split(parts[1]).join(".");

  return parseFloat(unformatted);
}

export function inputNumber(
  e: React.ChangeEvent<HTMLInputElement>,
  str: string
) {
  const value = priceUnMask(str);
  const maskedValue = priceMask(value);
  e.target.value = maskedValue;
  return value;
}
