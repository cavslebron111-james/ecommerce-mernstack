import React, { Fragment, useState,useRef ,useEffect} from "react";
import ReactDOM from "react-dom";
import { Camera } from "./camera/index";
import { Root, Preview, Footer, GlobalStyle } from "./cameraStyles";
import axios from 'axios'
import {FileSaver,saveAs} from 'file-saver'
import {useSelector} from 'react-redux'

function Cam(props) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cardImage, setCardImage] = useState();
  const [images, setImages] = useState();
     
     useEffect(() => {
          if(props.user.userData && props.user.userData._id){
            // userId = props.user.userData._id
          }
       
     }, [])
    // console.log('userId is ', userId)
 
  
 
     const imageref = (blob)=>{
       setCardImage(blob)
       const formData = new FormData();
      formData.append('my-file', blob, 'myImg.png');
       
         //Post via axios or other transport method
         console.log('formdata',formData)
        //  axios.post('/api/users1/userImg', userId,formData)
    
    
      }



  return (
    <Fragment>
      <Root>
        {isCameraOpen && (
          <Camera
            onCapture={imageref}
            onClear={() => setCardImage(undefined)}
          />
        )}

        {cardImage && (
          <div>
            <h2>Preview</h2>
            <Preview src={cardImage && URL.createObjectURL(cardImage)} />
          </div>
        )}

        <Footer>
          <button onClick={() => setIsCameraOpen(true)}>Open Camera</button>
          <button
            onClick={() => {
              setIsCameraOpen(false);
              setCardImage(undefined);
            }}
          >
            Close Camera
          </button>
        </Footer>
      </Root>
      <GlobalStyle />
    </Fragment>
  );
}

export default Cam;