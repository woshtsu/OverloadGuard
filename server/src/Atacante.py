import aiohttp
import asyncio
import random
import time

# Configuración
url = 'http://localhost:1234/server/archivo1'
initial_clients = 10
max_clients = 120
step_clients = 10
simulation_time_per_step = 10  # segundos
total_simulation_time = 60     # segundos

async def send_request(session):
    try:
        async with session.get(url, timeout=5) as response:
            if response.status != 200:
                print(f"Error: {response.status}")
    except Exception as e:
        print(f"Error de conexión: {e}")

async def simulate_client(session, stop_event, counter):
    while not stop_event.is_set():
        await send_request(session)
        counter["count"] += 1
        await asyncio.sleep(random.uniform(0.1, 0.5))  # Variación en frecuencia

async def main():
    counter = {"count": 0}
    current_clients = initial_clients
    tasks = []
    stop_event = asyncio.Event()

    start_time = time.time()

    async with aiohttp.ClientSession() as session:
        while time.time() - start_time < total_simulation_time:
            # Agregar nuevos clientes si es necesario
            if len(tasks) < current_clients:
                for _ in range(len(tasks), current_clients):
                    task = asyncio.create_task(simulate_client(session, stop_event, counter))
                    tasks.append(task)
                print(f"Aumentando clientes a {current_clients}...")

            # Medir tasa de llegada real en este paso
            step_start = time.time()
            start_count = counter["count"]
            await asyncio.sleep(simulation_time_per_step)
            end_count = counter["count"]
            rps = (end_count - start_count) / (time.time() - step_start)
            print(f"Peticiones por segundo con {current_clients} clientes: {rps:.2f}")

            current_clients += step_clients
            if current_clients > max_clients:
                current_clients = max_clients

        # Detener todas las tareas
        stop_event.set()
        await asyncio.gather(*tasks)

    print("Simulación completada.")
    print(f"Total de peticiones enviadas: {counter['count']}")

if __name__ == "__main__":
    asyncio.run(main())
