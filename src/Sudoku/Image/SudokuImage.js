import React, {useContext, useState} from "react";
import "./SudokuImage.css"
import Cropper from "react-easy-crop";
import getCroppedImg from "./Logic/cropImage";
import driver from "./Logic/scanImage";
import SudokuContext from "../SudokuContext";
import imageCompression from "browser-image-compression";

const SudokuImage = ({setTab, setLoading}) => {
    const boardCtx = useContext(SudokuContext)
    const [crop, setCrop] = useState({x:0, y:0})
    const [zoom, setZoom] = useState(1)
    const [image, setImage] = useState(null)
    const [croppedArea, setCroppedArea] = React.useState(null);
    const [loading, isLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    const onSelectFile = async (event) => {
        const imageFile = event.target.files[0];
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1000,
            useWebWorker: true,
        }
        try {
            const compressedFile = await imageCompression(imageFile, options);
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.addEventListener("load", () => {
                setImage(reader.result);
            });
            setImage(compressedFile)
        } catch (error) {
            alert("Error: " + error)
        }
        // if (event.target.files && event.target.files.length > 0) {
        //     const reader = new FileReader();
        //     reader.readAsDataURL(event.target.files[0]);
        //     reader.addEventListener("load", () => {
        //         setImage(reader.result);
        //     });
        // }
    };

    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };

    const getProgress = (progress) => {
        setProgress(progress)
    }

    const handleClick = async () => {
        setLoading(true)
        isLoading(true)
        try {
            const croppedImage = await getCroppedImg(image, croppedArea)
            const values = await driver(croppedImage, croppedArea, getProgress)
            setTab(1)
            boardCtx.clearBoard()
            boardCtx.setFullBoard(values, false)
        } catch (e) {
            alert("Error processing Image!, " + e)
        } finally {
            isLoading(false)
            setLoading(false)
        }
    }

    return (
        <div className="imageWrapper">
            <p>The better the crop, the better the results!</p>
            <input type="file" accept="image/*" onChange={onSelectFile}/>
            <button onClick={handleClick} disabled={loading} className="imageButtons">
                Done
            </button>
            {loading && <div>
                <p style={{color: "black"}}>Processing Image {Math.round(progress * 100)}%</p>
            </div>}
            <div className="cropperWrapper">
                <Cropper
                    image={image}
                    zoom={zoom}
                    onZoomChange={setZoom}
                    aspect={1}
                    onCropChange={setCrop}
                    crop={crop}
                    onCropComplete={onCropComplete}
                />
            </div>
        </div>
    )
}
export default SudokuImage
