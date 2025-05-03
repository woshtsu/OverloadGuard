import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
import json
import matplotlib.pyplot as plt
import os
# 1. Cargar datos desde CSV

csv_path = os.path.join(os.path.dirname(__file__), "metrics.csv")  # Asegúrate de que exista y tenga columnas: r, cpu, T
df = pd.read_csv(csv_path)

# 2. Preparar X (r, cpu) e y (T)
X = df[['r', 'cpu']]
y = df['T']

# 3. Ajustar regresión lineal
model = LinearRegression()
model.fit(X, y)

# 4. Extraer coeficientes
T0 = model.intercept_
alpha, beta = model.coef_

# 5. Calcular R²
y_pred = model.predict(X)
r2 = r2_score(y, y_pred)

# 6. Guardar en JSON
result = {
    "T0": float(T0),
    "alpha": float(alpha),
    "beta": float(beta),
    "r2": float(r2)
}
with open("model_coefficients.json", "w") as f:
    json.dump(result, f, indent=2)

# 7. Graficar comparación
plt.figure(figsize=(8, 6))
plt.scatter(y, y_pred, alpha=0.6)
plt.plot([y.min(), y.max()], [y.min(), y.max()], 'k--', linewidth=1)
plt.xlabel("T reales (avgResponseTime)")
plt.ylabel("T predichos por el modelo")
plt.title(f"Comparación T real vs T predicho (R² = {r2:.3f})")
plt.grid(True)
plt.tight_layout()
plt.savefig("comparison_real_vs_predicted.png")
plt.show()
