const userColorMap = {};

const getRandomHexColor = () => {
  const r = Math.floor(175 + Math.random() * 80);
  const g = Math.floor(175 + Math.random() * 80);
  const b = Math.floor(175 + Math.random() * 80);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
};

const getUserColor = (userKey) => {
  if (!userColorMap[userKey]) {
    userColorMap[userKey] = getRandomHexColor();
  }
  return userColorMap[userKey];
}

const getContrastColor = (hex) => {
  const cleaned = hex.replace("#", "");

  const r = parseInt(cleaned.substr(0, 2), 16);
  const g = parseInt(cleaned.substr(2, 2), 16);
  const b = parseInt(cleaned.substr(4, 2), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000" : "#fff";
};

export { getUserColor, getContrastColor };