import { useEffect, useState } from 'react';

function useMediaDevice(captureSettings, permission) {
  const [mediaStream, setMediaStream] = useState(undefined);
  const [flashlightMode, setFlashlightMode] = useState(false);

  useEffect(() => {
    async function enableMediaStream() {
      const stream = await navigator.mediaDevices.getUserMedia(captureSettings);
      // const [videoTrack] = stream.getVideoTracks();

      // await videoTrack.applyConstraints({
      //   advanced: [{ zoom: 2 }],
      // });

      setMediaStream(stream);
    }

    try {
      enableMediaStream();
      if (permission === 'denied') {
        setMediaStream(undefined);
      }
    } catch (e) {
      console.log(e);
    }

    // retornar uma função que para as tracks para evitar vazamento de memoria e a captura enquanto não estamos usando o componente Camera
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [captureSettings, permission]);

  const flashlight = (on) => {
    if (mediaStream) {
      let videoTrack = null;

      mediaStream.getTracks().forEach((track) => {
        if (track.kind === 'video' && !videoTrack) {
          videoTrack = track;
        }
      });

      videoTrack
        .applyConstraints({
          advanced: [{ torch: on }],
        })
        .then(() => {
          setFlashlightMode(on);
        })
        .catch((e) => {
          console.log(e);
          setFlashlightMode(false);
        });
    }
  };

  console.log(flashlightMode);

  const stopStreaming = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  return { mediaStream, stopStreaming, flashlight, flashlightMode };
}

export default useMediaDevice;
