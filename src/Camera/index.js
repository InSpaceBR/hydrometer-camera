import { useEffect, useState, useCallback, useRef } from "react";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import CameraAltIcon from "@material-ui/icons/CameraAlt";

import useMediaDevice from "../hooks/useMediaDevice";
import { getCroppingDimensions } from "../utils/croppImage";
import StyledButton from "../Button";
import { CameraWrapper, StyledFormHelperText } from "./styles";

const MEDIA_CAPTURE_SETTINGS = {
  audio: false,
  video: { facingMode: "environment", aspectRatio: 16 / 9 },
};

function Camera(props) {
  const { uploadToS3 } = props;

  const [cameraPermission, setCameraPermission] = useState("");
  const videoRef = useRef();
  const videoContainerRef = useRef();
  const [imgURL, setImgURL] = useState("");
  const { mediaStream, stopStreaming, flashlight, flashlightMode } =
    useMediaDevice(MEDIA_CAPTURE_SETTINGS, cameraPermission);
  const [cameraWidth, setCameraWidth] = useState(
    videoContainerRef?.current?.offsetWidth
  );
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [picture, setPicture] = useState("");

  if (
    mediaStream &&
    videoRef.current &&
    !videoRef.current.srcObject &&
    cameraPermission === "granted"
  ) {
    videoRef.current.srcObject = mediaStream;
  } else if (cameraPermission === "denied") {
    videoRef.current.srcObject = null;
  }

  window.onresize = () => {
    setCameraWidth(videoContainerRef.current.offsetWidth);
  };

  useEffect(() => {
    setCameraWidth(videoContainerRef?.current?.offsetWidth);
    return () => stopStreaming();
  }, []);

  navigator.permissions.query({ name: "camera" }).then((permissionStatus) => {
    const ps = permissionStatus;
    setCameraPermission(ps.state);
    ps.onchange = () => {
      setCameraPermission(ps.state);
    };
  });

  const onCapture = () => {
    const canvas = document.createElement("canvas");
    const canvasContext = canvas.getContext("2d");
    let cropped = null;

    if (canvasContext) {
      const { cropSizeX, cropSizeY } = getCroppingDimensions(
        videoRef.current.videoWidth,
        videoRef.current.videoHeight,
        videoRef.current.offsetWidth,
        videoRef.current.offsetHeight,
        videoContainerRef.current.offsetWidth,
        videoContainerRef.current.offsetHeight
      );

      canvas.width = cropSizeX;
      canvas.height = cropSizeY;

      canvasContext.drawImage(
        videoRef.current,
        0, // sourceX
        0, // sourceY
        cropSizeX, // NewImgW
        cropSizeY, // NewImgH
        0, // drawing starting point
        0, //
        cropSizeX,
        cropSizeY
      );

      cropped = canvas.toDataURL("image/png");
    }

    canvas.remove(); // liberar memoria
    setPicture(cropped);
    setOpenModal(true); // Abre o modal pra exibicao
    setError(false);
  };

  const getMeasure = async () => {
    setLoading(true);
    
    try {
      const response = await uploadToS3(picture);
      console.log(response);
      if (response.url) {
        setImgURL(response.url);
        setError(false);
      } else {
        setImgURL('');
        setError(true);
      }
    } catch (e) {
      setImgURL('');
      setError(true);
    }

    setLoading(false);
    setOpenModal(false);
  };

  const tryAgain = useCallback(() => {
    setPicture("");
    setImgURL("");
    setOpenModal(false);
  }, []);

  return (
    <>
      <Modal
        open={openModal}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          outline: "none",
        }}
      >
        <div
          style={{
            padding: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            backgroundColor: "#FFF",
            marginX: 4,
            maxWidth: "500px",
          }}
        >
          <img
            src={picture}
            alt="imagem do hidrometro"
            style={{ width: "100%", height: "100%" }}
          />
          <div
            style={{
              marginTop: 8,
              marginBottom: 8,
              marginLeft: 8,
              marginRight: 8,
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              flexDirection: "column",
              backgroundColor: "#FFF",
            }}
          >
            <Typography marginTop={1} variant="h5" textAlign="center">
              <b>Esta foto está ok?</b>
            </Typography>

            <Typography marginTop={1} variant="body2" textAlign="center">
              Certifique-se que a foto está bem iluminada, legível e que vê
              todos os números do medidor.
            </Typography>
          </div>
          <div
            style={{
              width: "100%",
              height: 60,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <CircularProgress color="primary" />
            ) : (
              <>
                <Button
                  variant="text"
                  onClick={tryAgain}
                  style={{ marginRight: 4 }}
                >
                  Tentar de novo
                </Button>
                <Button variant="text" onClick={() => getMeasure()}>
                  Sim
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal>
      <CameraWrapper>
        <div
          ref={videoContainerRef}
          style={{
            height: 70,
            width: "50%",
            border: "2px solid yellow",
            overflow: "hidden",
          }}
        >
          <video
            id="device_camera"
            ref={videoRef}
            width={cameraWidth}
            onCanPlay={() => videoRef.current.play()}
            autoPlay
            muted
          />
        </div>
        <div style={{ margin: "15px 0" }}>
          <Typography>
            <a href={imgURL}>{imgURL}</a>
          </Typography>
        </div>
        {error && (
          <StyledFormHelperText
            id="component-error-text"
            style={{ marginBottom: 10, color: "#f00" }}
          >
            Algo deu errado, tire outra foto ou digite a medida!
          </StyledFormHelperText>
        )}
        <div>
          <StyledButton
            onClick={onCapture}
            variant="contained"
            disabled={picture && !error}
            style={{
              borderRadius: "60%",
              height: 60,
              width: 60,
              cursor: "pointer",
            }}
          >
            <CameraAltIcon style={{ color: "#FFF" }} />
          </StyledButton>
          <StyledButton
            onClick={() => flashlight(!flashlightMode)}
            variant="contained"
            disabled={picture && !error}
            style={{
              marginLeft: "10px",
              borderRadius: "60%",
              height: 60,
              width: 60,
              cursor: "pointer",
            }}
          >
            {flashlightMode ? "on" : "off"}
          </StyledButton>
        </div>
      </CameraWrapper>
    </>
  );
}

export default Camera;
