export function getCroppingDimensions(
      imgX,
      imgY,
      videoX,
      videoY,
      rectX,
      rectY,
    ) {
      const ratioX = imgX / videoX;
      const ratioY = imgY / videoY;
    
      const cropSizeX = ratioX * rectX;
      const cropSizeY = ratioY * rectY;
    
      return {
        cropSizeX,
        cropSizeY,
      };
    }