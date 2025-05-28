export function solveQueueDifferential (λ, μ, Q0, steps, dt) {
  let Q = Q0
  for (let i = 0; i < steps; i++) {
    const H = Q > 0 ? 1 : 0
    const dQ = (λ - μ * H) * dt
    Q = Math.max(0, Q + dQ) // La cola no puede ser negativa
  }
  return Q
}
