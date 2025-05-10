import aiohttp
import asyncio
import random
import time

# Configuración
url = 'http://localhost:1234/server/archivo1'
num_usuarios_rafaga = 10
tiempo_simulacion_total = 60  # segundos
peticiones_por_rafaga_min = 3
peticiones_por_rafaga_max = 8
tiempo_entre_peticiones_rafaga = 0.2 # segundos
tiempo_inactividad_min = 10 # segundos
tiempo_inactividad_max = 25 # segundos

async def send_request(session, user_id, req_num_in_burst):
    try:
        # print(f"Usuario Ráfaga {user_id}: Enviando petición {req_num_in_burst} de la ráfaga...")
        async with session.get(url, timeout=5) as response:
            if response.status != 200:
                print(f"Usuario Ráfaga {user_id}: Error en respuesta: {response.status}")
    except Exception as e:
        print(f"Usuario Ráfaga {user_id}: Error de conexión: {e}")

async def simulate_usuario_rafaga(session, user_id, stop_event, counter):
    while not stop_event.is_set():
        num_peticiones_actual_rafaga = random.randint(peticiones_por_rafaga_min, peticiones_por_rafaga_max)
        print(f"Usuario Ráfaga {user_id}: Iniciando ráfaga de {num_peticiones_actual_rafaga} peticiones.")
        for i in range(num_peticiones_actual_rafaga):
            if stop_event.is_set(): break
            await send_request(session, user_id, i + 1)
            counter["count"] += 1
            await asyncio.sleep(tiempo_entre_peticiones_rafaga) # Pequeña pausa entre peticiones de la misma ráfaga

        if stop_event.is_set(): break

        tiempo_inactividad = random.uniform(tiempo_inactividad_min, tiempo_inactividad_max)
        print(f"Usuario Ráfaga {user_id}: Ráfaga completada. Inactivo por {tiempo_inactividad:.2f} segundos.")
        try:
            await asyncio.wait_for(stop_event.wait(), timeout=tiempo_inactividad)
            break
        except asyncio.TimeoutError:
            pass

async def main():
    counter = {"count": 0}
    tasks = []
    stop_event = asyncio.Event()

    print(f"Iniciando simulación con {num_usuarios_rafaga} usuarios de ráfaga durante {tiempo_simulacion_total} segundos.")
    start_time = time.time()

    async with aiohttp.ClientSession() as session:
        for i in range(num_usuarios_rafaga):
            task = asyncio.create_task(simulate_usuario_rafaga(session, i + 1, stop_event, counter))
            tasks.append(task)

        await asyncio.sleep(tiempo_simulacion_total)

        print("Tiempo de simulación completado. Deteniendo usuarios...")
        stop_event.set()
        await asyncio.gather(*tasks, return_exceptions=True)

    end_time = time.time()
    print("Simulación de Usuarios de Ráfaga completada.")
    print(f"Total de peticiones enviadas: {counter['count']}")
    print(f"Tiempo total de ejecución: {end_time - start_time:.2f} segundos.")
    if counter["count"] > 0 and (end_time - start_time) > 0:
        rps_promedio = counter["count"] / (end_time - start_time)
        print(f"RPS promedio general: {rps_promedio:.2f}")

if __name__ == "__main__":
    asyncio.run(main())