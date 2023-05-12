import Camera from "./Camera";
import AWS from "aws-sdk";
import "./App.css";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
  signatureVersion: "v4",
});

function b64toBlob(dataURI) {
    
  const byteString = atob(dataURI.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/png' });
}

function App() {
  const s3 = new AWS.S3();
  // const [imageURL, setImageURL] = useState(null);

  const uploadToS3 = async (base64Picture) => {
    console.log("UPLOADING TO S3");

    const blob = b64toBlob(base64Picture)

    // Pegando a extensão da imagem
    // const fileType = base64Picture.split(";")[0].split("/")[1];

    const params = {
      Bucket: process.env.REACT_APP_BUCKET_NAME,
      Key: `${Date.now()}.png`, // File name
      Body: blob, // Base64 data
      // ContentEncoding: "base64",
      // ContentType: "image/" + fileType,
    };

    try {
      const { Location } = await s3.upload(params).promise(); // Location -> S3 file URL
      console.log(Location);
      return { url: Location };
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <Camera uploadToS3={uploadToS3} />
    </div>
  );
}

export default App;
