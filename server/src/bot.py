import aiohttp
import asyncio
import random
import time

# Configuración
url = 'http://localhost:1234/server/archivo1'
base_clients = 60          # Usuarios concurrentes base
burst_probability = 0.2    # Probabilidad de picos de tráfico
max_burst_increase = 30    # Máximo aumento en picos
avg_request_interval = 1.5 # Segundos promedio entre acciones de un usuario
total_simulation_time = 120  # segundos

async def send_request(session):
    try:
        async with session.get(url, timeout=5) as response:
            if response.status != 200:
                print(f"Error: {response.status}")
    except Exception as e:
        print(f"Error de conexión: {e}")

async def simulate_client(session, client_id, stop_event, counter):
    while not stop_event.is_set():
        await send_request(session)
        counter["count"] += 1

        # Tiempo natural entre acciones (exponencial)
        delay = random.expovariate(1 / avg_request_interval)
        await asyncio.sleep(delay)

async def main():
    counter = {"count": 0}
    stop_event = asyncio.Event()
    start_time = time.time()

    # Número base de clientes
    current_clients = base_clients
    tasks = []

    print(f"Iniciando simulación con {current_clients} clientes...")
    
    async with aiohttp.ClientSession() as session:
        # Crear tareas iniciales
        for i in range(current_clients):
            task = asyncio.create_task(simulate_client(session, i, stop_event, counter))
            tasks.append(task)

        # Simulación principal
        while time.time() - start_time < total_simulation_time:
            # Verificar si hay pico de tráfico
            if random.random() < burst_probability:
                new_clients = random.randint(5, max_burst_increase)
                print(f"[Pico] Aumentando temporalmente en {new_clients} clientes...")
                for i in range(len(tasks), len(tasks) + new_clients):
                    task = asyncio.create_task(simulate_client(session, i, stop_event, counter))
                    tasks.append(task)
                current_clients = len(tasks)

            # Mostrar métricas cada cierto tiempo
            step_start = time.time()
            start_count = counter["count"]
            await asyncio.sleep(10)  # Cada 10 segundos reportar
            end_count = counter["count"]
            elapsed = time.time() - step_start
            rps = (end_count - start_count) / elapsed
            print(f"Peticiones por segundo: {rps:.2f} | Clientes activos: {len(tasks)}")

        # Detener todas las tareas
        stop_event.set()
        await asyncio.gather(*tasks)

    print("Simulación completada.")
    print(f"Total de peticiones enviadas: {counter['count']}")

if __name__ == "__main__":
    asyncio.run(main())