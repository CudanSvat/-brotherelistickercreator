class ImageProcessor {
  static async processImage(file, options = {}) {
    const { crop, maxSize = 512 } = options;
    return await this.processStaticImage(file, crop, maxSize);
  }

  static async processStaticImage(file, crop, maxSize) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (crop) {
          const { x, y, width, height } = crop;
          canvas.width = maxSize;
          canvas.height = maxSize;
          ctx.drawImage(img, x, y, width, height, 0, 0, maxSize, maxSize);
        } else {
          // Calculate dimensions to maintain aspect ratio
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          const width = img.width * scale;
          const height = img.height * scale;
          
          canvas.width = maxSize;
          canvas.height = maxSize;
          
          // Center the image
          const x = (maxSize - width) / 2;
          const y = (maxSize - height) / 2;
          
          ctx.fillStyle = 'transparent';
          ctx.fillRect(0, 0, maxSize, maxSize);
          ctx.drawImage(img, x, y, width, height);
        }

        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      };
      img.src = URL.createObjectURL(file);
    });
  }

  static async getImageDimensions(file) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.src = URL.createObjectURL(file);
    });
  }
} 