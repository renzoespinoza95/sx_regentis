export async function procesarImagen(file) {
  return new Promise((resolve) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target.result
    }

    img.onload = () => {
      const canvas = document.createElement('canvas')

      const MAX_WIDTH = 1000
      const scale = MAX_WIDTH / img.width

      canvas.width = MAX_WIDTH
      canvas.height = img.height * scale

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          resolve(blob) // 🔥 ya comprimido
        },
        'image/jpeg',
        0.7 // calidad
      )
    }

    reader.readAsDataURL(file)
  })
} 
