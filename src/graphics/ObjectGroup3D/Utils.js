import { subtractVectors, cross } from "../lib/m4";

const surfaceNormal = (p1, p2, p3) => {
  const a = subtractVectors(p1, p2);
  const b = subtractVectors(p3, p2);
  return cross(a, b);
};

export { surfaceNormal };
