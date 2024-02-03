// import React, {useState, useEffect} from 'react'
// import { ReactMic } from 'react-mic'
// import axios from 'axios';
// const Story = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);

//   const startRecording = () => {
//     setIsRecording(true);
//   };

//   const stopRecording = () => {
//     setIsRecording(false);
//     setflet(true)
//   };

//   const onData = (recordedBlob) => {
//     // Handle the audio data here
//     console.log('chunk of real-time data is: ', recordedBlob);
//   };

//   const onStop = (recordedBlob) => {
//     // Handle the final audio data here
//     console.log('recordedBlob is: ', recordedBlob);
//     setAudioBlob(recordedBlob.blob);
//   };


// const sendVoiceNote = async () => {
//   // setflet(false)
//   try {
//     if (!audioBlob) {
//       console.error('No recorded audio to send');
//       alert('No recorded audio to send')
//       return;
//     }

//     // Convert audioBlob to a base64 string
//     const base64Audio = await new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result.split(',')[1]);
//       reader.readAsDataURL(new Blob([audioBlob]));
//     });

//     // Include audio data and additional information in the request body
//     const requestData = {
//       receiverId:"", 
//       senderId :"", 
//       content: 'Voice Note',
//       audio: base64Audio,
//       messageType: 'audio',
//     };
//    console.log(requestData);
//     // Make a POST request to your backend
//     const response = await axios.post("http://localhost:4345/users/uploadvoice", {requestData});

//     console.log(response.data); // Assuming your backend sends some data upon successful upload
//     console.log('Voice note sent successfully');

//     // Reset recording state or perform any other actions as needed
//     setIsRecording(false);
//     setAudioBlob(null);
//   } catch (error) {
//     console.error('Error sending voice note:', error);
//     // Handle the error appropriately
//   }
// };

// const [audioPlayer, setAudioPlayer] = useState(null);
// // const [audioPlayer, setAudioPlayer] = useState(null);

//   const playVoiceNote = (audioUrl) => {
//     // Create an audio element dynamically
//     const audio = new Audio(audioUrl);

//     // Set up event listener for when the audio ends
//     audio.addEventListener('ended', () => {
//       // You may add additional logic here if needed
//     });

//     // Set the audio element to the state
//     setAudioPlayer(audio);

//     // Play the audio
//     audio.play();
//   };

//   const pauseVoiceNote = () => {
//     // Pause the audio if the audioPlayer is defined
//     if (audioPlayer) {
//       audioPlayer.pause();
//     }
//   };

//   return (
//     <>
//     <main>
//     <ReactMic
//       record={isRecording}
//       className="sound-wave"
//       onStop={onStop}
//       onData={onData}
//       strokeColor="#000000"
//       backgroundColor="#FF4081"
//     />
//     </main>
//     </>
//   )
// }

// export default Story