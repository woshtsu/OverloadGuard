import { useEffect } from "react"
import io from 'socket.io-client'

export function ShowModel() {

  useEffect(() => {

    const testSocket = io('http://localhost:1234/test', { path: '/websocket/' })

    testSocket.on('customEvent', (data) => {
      const { time, value } = data

      console.log(`el time: ${time} y el value: ${value}`)

    })

    return () => {
      testSocket.disconnect()
    }
  }, [])

  return (
    <section>
    </section>
  )
}