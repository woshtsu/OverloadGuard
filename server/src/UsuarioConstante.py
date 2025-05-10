import aiohttp
import asyncio
import random
import time

# Configuración
url = 'http://localhost:1234/server/archivo1'
num_usuarios_constantes = 20
tiempo_simulacion_total = 60  # segundos
intervalo_peticion_usuario_min = 0.5  # segundos
intervalo_peticion_usuario_max = 1.5  # segundos

async def send_request(session, user_id):
    try:
        # print(f"Usuario Constante {user_id}: Enviando petición...")
        async with session.get(url, timeout=5) as response:
            if response.status != 200:
                print(f"Usuario Constante {user_id}: Error en respuesta: {response.status}")
    except Exception as e:
        print(f"Usuario Constante {user_id}: Error de conexión: {e}")

async def simulate_usuario_constante(session, user_id, stop_event, counter):
    while not stop_event.is_set():
        await send_request(session, user_id)
        counter["count"] += 1
        tiempo_espera = random.uniform(intervalo_peticion_usuario_min, intervalo_peticion_usuario_max)
        try:
            await asyncio.wait_for(stop_event.wait(), timeout=tiempo_espera)
            break
        except asyncio.TimeoutError:
            pass

async def main():
    counter = {"count": 0}
    tasks = []
    stop_event = asyncio.Event()
    step_rps_data = [] # Para registrar RPS por pasos

    print(f"Iniciando simulación con {num_usuarios_constantes} usuarios constantes durante {tiempo_simulacion_total} segundos.")
    start_time = time.time()
    simulation_step_time = 5 # Medir RPS cada 5 segundos

    async with aiohttp.ClientSession() as session:
        for i in range(num_usuarios_constantes):
            task = asyncio.create_task(simulate_usuario_constante(session, i + 1, stop_event, counter))
            tasks.append(task)

        elapsed_time = 0
        last_count = 0
        while elapsed_time < tiempo_simulacion_total:
            await asyncio.sleep(min(simulation_step_time, tiempo_simulacion_total - elapsed_time))
            elapsed_time += simulation_step_time
            
            current_count = counter["count"]
            rps_step = (current_count - last_count) / simulation_step_time
            step_rps_data.append(rps_step)
            print(f"Tiempo: {min(elapsed_time, tiempo_simulacion_total):.0f}s, Peticiones en el último paso: {current_count - last_count}, RPS del paso: {rps_step:.2f}")
            last_count = current_count
            if stop_event.is_set(): # Si se detuvo antes por alguna razón
                break


        print("Tiempo de simulación completado. Deteniendo usuarios...")
        stop_event.set()
        await asyncio.gather(*tasks, return_exceptions=True)

    end_time = time.time()
    print("Simulación de Usuarios Constantes completada.")
    print(f"Total de peticiones enviadas: {counter['count']}")
    print(f"Tiempo total de ejecución: {end_time - start_time:.2f} segundos.")
    if counter["count"] > 0 and (end_time - start_time) > 0:
        rps_promedio_total = counter["count"] / (end_time - start_time)
        print(f"RPS promedio general: {rps_promedio_total:.2f}")
    if step_rps_data:
        avg_step_rps = sum(step_rps_data) / len(step_rps_data)
        print(f"RPS promedio de los pasos medidos: {avg_step_rps:.2f}")


if __name__ == "__main__":
    asyncio.run(main())