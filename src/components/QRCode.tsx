import { useEffect, useRef } from 'react'

export default function QRCode({ data }: { data: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateQR = async () => {
      const QRCodeLib = await import('qrcode')
      if (canvasRef.current) {
        QRCodeLib.toCanvas(canvasRef.current, data, {
          width: 150,
          margin: 2,
          color: {
            dark: '#1a3a5c',
            light: '#ffffff'
          }
        })
      }
    }
    generateQR()
  }, [data])

  return <canvas ref={canvasRef}></canvas>
}
