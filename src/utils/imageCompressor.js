/**
 * Utilidad clínica para compresión de imágenes en el cliente antes de subir o guardar.
 * Convierte fotos pesadas (5MB+) a WebP/JPEG ultra-liviano (30KB-80KB) usando Canvas HTML5.
 */
export async function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('El archivo proporcionado no es una imagen válida.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Exportar a WebP de alta eficiencia o JPEG como fallback
        const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        const mimeType = supportsWebP ? 'image/webp' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        const approxSizeBytes = Math.round((dataUrl.length * 3) / 4);

        resolve({
          dataUrl,
          mimeType,
          width,
          height,
          originalSizeKb: (file.size / 1024).toFixed(1),
          compressedSizeKb: (approxSizeBytes / 1024).toFixed(1),
          ahorroPorcentaje: Math.round(((file.size - approxSizeBytes) / file.size) * 100)
        });
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
