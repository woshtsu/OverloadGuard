import pandas as pd
from sklearn.linear_model import LinearRegression
import json

# Ruta del CSV (ajusta esta ruta si es necesario)
csv_path = "metrics.csv"

# Cargar los datos
df = pd.read_csv(csv_path)  # Asegúrate de que tenga columnas: r, cpu, T

# Variables independientes y dependiente
X = df[['r', 'cpu']]
y = df['T']

# Ajustar el modelo
model = LinearRegression()
model.fit(X, y)

# Extraer los coeficientes
T0 = model.intercept_
alpha = model.coef_[0]
beta = model.coef_[1]

# Guardar en JSON
result = {
    "T0": T0,
    "alpha": alpha,
    "beta": beta
}

with open("model_coefficients.json", "w") as f:
    json.dump(result, f, indent=2)

print("Coeficientes guardados:")
print(result)
