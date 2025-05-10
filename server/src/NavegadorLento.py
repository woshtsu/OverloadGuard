import aiohttp
import asyncio
import random
import time

# Configuración
url = 'http://localhost:1234/server/archivo1'
num_usuarios_lentos = 15  # Número constante de usuarios lentos
tiempo_simulacion_total = 60  # segundos
tiempo_min_espera_usuario = 5  # segundos (tiempo mínimo que un usuario espera)
tiempo_max_espera_usuario = 15 # segundos (tiempo máximo que un usuario espera)

async def send_request(session, user_id):
    try:
        print(f"Usuario Lento {user_id}: Enviando petición...")
        async with session.get(url, timeout=10) as response: # Timeout un poco más largo
            if response.status != 200:
                print(f"Usuario Lento {user_id}: Error en respuesta: {response.status}")
            # else:
            #     print(f"Usuario Lento {user_id}: Petición exitosa.")
    except Exception as e:
        print(f"Usuario Lento {user_id}: Error de conexión: {e}")

async def simulate_navegador_lento(session, user_id, stop_event, counter):
    while not stop_event.is_set():
        await send_request(session, user_id)
        counter["count"] += 1
        tiempo_espera = random.uniform(tiempo_min_espera_usuario, tiempo_max_espera_usuario)
        print(f"Usuario Lento {user_id}: Esperando {tiempo_espera:.2f} segundos...")
        try:
            await asyncio.wait_for(stop_event.wait(), timeout=tiempo_espera)
            break # Salir si stop_event se activa durante la espera
        except asyncio.TimeoutError:
            pass # Continuar si la espera se completó sin que stop_event se activara

async def main():
    counter = {"count": 0}
    tasks = []
    stop_event = asyncio.Event()

    print(f"Iniciando simulación con {num_usuarios_lentos} navegadores lentos durante {tiempo_simulacion_total} segundos.")
    start_time = time.time()

    async with aiohttp.ClientSession() as session:
        for i in range(num_usuarios_lentos):
            task = asyncio.create_task(simulate_navegador_lento(session, i + 1, stop_event, counter))
            tasks.append(task)

        # Esperar el tiempo total de simulación
        await asyncio.sleep(tiempo_simulacion_total)

        # Detener todas las tareas
        print("Tiempo de simulación completado. Deteniendo usuarios...")
        stop_event.set()
        await asyncio.gather(*tasks, return_exceptions=True) # return_exceptions para evitar que una tarea fallida detenga todo

    end_time = time.time()
    print("Simulación de Navegadores Lentos completada.")
    print(f"Total de peticiones enviadas: {counter['count']}")
    print(f"Tiempo total de ejecución: {end_time - start_time:.2f} segundos.")
    if counter["count"] > 0 and (end_time - start_time) > 0:
        rps_promedio = counter["count"] / (end_time - start_time)
        print(f"RPS promedio general: {rps_promedio:.2f}")


if __name__ == "__main__":
    asyncio.run(main())