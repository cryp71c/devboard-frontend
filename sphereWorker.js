self.onmessage = function (e) {
  const { length, width, height, diameter, limit } = e.data;
  const radius = diameter / 2;

  const range = (start, stop, step) => {
    const out = [];
    for (let i = start; i <= stop; i += step) out.push(i);
    return out;
  };

  const xRange = range(radius, length + radius, 2 * radius);
  const yRange = range(radius, width + radius, 2 * radius);
  const zRange = range(radius, height + radius, Math.sqrt(2) * radius);

  const positions = [];

  outer: for (const z of zRange) {
    for (const y of yRange) {
      for (const x of xRange) {
        const fillerNum = z / (Math.sqrt(2) * radius);
        const changed = Math.floor(fillerNum) % 2;
        const x_mod = changed === 0 ? 0 : radius;
        const y_mod = changed === 0 ? 0 : radius;

        const ball_pos_x = x + x_mod;
        const ball_pos_y = y + y_mod;
        const ball_pos_z = z;

        if (
          ball_pos_x + radius <= length &&
          ball_pos_y + radius <= width &&
          ball_pos_z + radius <= height
        ) {
          positions.push([ball_pos_x, ball_pos_y, ball_pos_z]);
          if (positions.length >= limit) break outer;
        }
      }
    }
  }

  console.log("Worker done:", positions.length, "positions");
  postMessage(positions);
};
