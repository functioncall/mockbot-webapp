<template>
  <div>
    <!-- header start -->
    <header class="header">
      <h2>{{ name }}</h2>
      <button class="btn" @click="create">Create</button>
    </header>
    <!-- header end -->

    <div class="features-main-container">
      <div class="container">
        <div class="row ">
         <div class="output">
            <audio class="d-none" controls :src="audioSrc" ref="audio" @timeupdate="updateProgressBar"></audio>
         </div>
          
          <!-- left-side component -->
          <div class="col-lg-6">
            <div class="container-image-main">
              <img :src="processing ? processingMainImgSrc : mainImgSrc" alt="main-img" class="main-img">
              <div v-if="isNarration || selectedImageSrc != ''" class="container-image-position">
                <img :src="selectedImageSrc" alt="cartoon-image">
              </div>
                <div class="container-image-position">
                  <video ref="video"  autoplay></video>
                  <canvas ref="canvas" style="display:none;"></canvas>
                </div>

              
              <div v-if="isNarration" class="range-slider-position">
                <input type="range" step="0.001" ref="rangeInput" class="progress-bar-custom" min="0" :max="duration"   v-model="currentTime" @input="updateSlider" :style="{backgroundSize: backgroundSize}">
                <div class="time-indicator">
                      <span>{{ formattedTime(currentTime) }}</span>
                      <span>{{ formattedTime(duration) }}</span>
                </div>
              </div>
              <div v-if="isNarration" class="image-summary" style="max-width: 270px;" > </div>
              <!-- <div v-if="processing" class="image-summary" style="width: 270px;" >
                Thinking...
              </div>   -->
            </div>
          </div>
          <!-- right-side component -->
          <div class="col-lg-5">
            <div class="container-image-main-content">
              <div>
                <div v-if="isNarration">
                  <h2 class="mb-3">Narration Summary</h2>
                  <div class="summary-text-flex">
                    <p class="mb-0">{{ transcript }}</p>
                    <button class="copy-btn" @click="copySummary">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="128" height="128"
                            viewBox="0 0 24 24"><g fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"><path
                                    d="M7 9.667A2.667 2.667 0 0 1 9.667 7h8.666A2.667 2.667 0 0 1 21 9.667v8.666A2.667 2.667 0 0 1 18.333 21H9.667A2.667 2.667 0 0 1 7 18.333z" /><path
                                    d="M4.012 16.737A2.005 2.005 0 0 1 3 15V5c0-1.1.9-2 2-2h10c.75 0 1.158.385 1.5 1" /></g></svg>
                    </button>
                  </div>
                </div>
                <h2>{{isNarration ? 'Channel used' : 'Select channel'}}</h2>
                <div v-if="!isNarration" class="row mb-md-5 mb-0">
                  <div class="col-md-6 upload-image-margin">
                    <div v-if="selectedChannel == 'camera'" class="upload-image-container bg-black-dark">
                      <img :src="cameraRollImgSrc" alt>
                      <h3>Camera feed</h3>
                      <a href="#">Live</a>
                    </div>
                    <div v-else class="upload-image-container" @click="startCamera">
                      <p>Connect Camera</p>
                    </div>
                  </div>
                  <div class="col-md-6 upload-image-margin">
                    <div v-if="selectedChannel == 'upload'" class="upload-image-container bg-black-dark">
                      <img :src="selectedImageSrc" alt>
                      <h3>{{ selectedFile?.name }}</h3>
                      <a href="#">Uploaded</a>
                      <input type="file" ref="fileInput" class="file-upload-main" @change="handleFileChange">
                    </div>
                    <div v-else class="upload-image-container">
                      <input type="file" ref="fileInput" class="file-upload-main" @change="handleFileChange">
                      <p>Upload Image</p>
                    </div>
                  </div>
                </div>
                <div v-else class="row mb-md-5 mb-0">
                  <div v-if="selectedChannel == 'camera'" class="col-md-6 upload-image-margin">
                    <div  class="upload-image-container bg-black-dark">
                      <img :src="cameraRollImgSrc" alt>
                      <h3>Camera feed</h3>
                      <a href="#">Live</a>
                    </div>
                  </div>
                  <div v-if="selectedChannel == 'upload'" class="col-md-6 upload-image-margin">
                    <div class="upload-image-container bg-black-dark">
                      <img :src="selectedImageSrc" alt>
                      <h3>{{ selectedFile?.name }}</h3>
                      <a href="#">Uploaded</a>
                      <input type="file" ref="fileInput" class="file-upload-main" @change="handleFileChange">
                    </div>
                  </div>
                </div>
                <div v-if="!isNarration" class="col-lg-8">
                  <div class="progress-main">
                    <label for="narration-length">Narration length</label>
                    <input type="range" class="progress-bar-main" v-model="narrationLength">
                  </div>
                </div>
              </div>
              <div v-if="isNarration">
                <!-- <div class="social-media-container">
                    <div class="social-media-container-flex">
                        <div class="copy-btn">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="128" height="128"
                                viewBox="0 0 24 24"><path
                                    fill="currentColor"
                                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" /></svg>
                        </div>
                        <div class="social-media-text">
                            <h2>Share to Instagram</h2>
                            <p>Al-narrated video 1</p>
                        </div>
                    </div>
                    <button class="share-btn">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="128" height="128"
                            viewBox="0 0 24 24"><path
                                fill="currentColor"
                                d="m11.293 17.293l1.414 1.414L19.414 12l-6.707-6.707l-1.414 1.414L15.586 11H6v2h9.586z" /></svg>
                    </button>
                </div>
                <div class="social-media-container">
                    <div class="social-media-container-flex">
                        <div class="copy-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 256 256"><path fill="currentColor" d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m12 191.13V156h20a12 12 0 0 0 0-24h-20v-20a12 12 0 0 1 12-12h16a12 12 0 0 0 0-24h-16a36 36 0 0 0-36 36v20H96a12 12 0 0 0 0 24h20v55.13a84 84 0 1 1 24 0"/></svg>
                        </div>
                        <div class="social-media-text">
                            <h2>Share to Facebook</h2>
                            <p>Al-narrated video 1</p>
                        </div>
                    </div>
                    <button class="share-btn">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="128" height="128"
                            viewBox="0 0 24 24"><path
                                fill="currentColor"
                                d="m11.293 17.293l1.414 1.414L19.414 12l-6.707-6.707l-1.414 1.414L15.586 11H6v2h9.586z" /></svg>
                    </button>
                </div>
                <div class="social-media-container">
                    <div class="social-media-container-flex">
                        <div class="copy-btn">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="128" height="128"
                                viewBox="0 0 256 256"><path
                                    fill="currentColor"
                                    d="M224 68a44.05 44.05 0 0 1-44-44a12 12 0 0 0-12-12h-40a12 12 0 0 0-12 12v132a16 16 0 1 1-22.85-14.47a12 12 0 0 0 6.85-10.84V88a12 12 0 0 0-14.1-11.81a79.35 79.35 0 0 0-47.08 27.74A81.84 81.84 0 0 0 20 156a80 80 0 0 0 160 0v-33.33a107.47 107.47 0 0 0 44 9.33a12 12 0 0 0 12-12V80a12 12 0 0 0-12-12m-12 39.15a83.05 83.05 0 0 1-37-14.91a12 12 0 0 0-19 9.76v54a56 56 0 0 1-112 0a57.86 57.86 0 0 1 32-51.56V124a40 40 0 1 0 64 32V36h17.06A68.21 68.21 0 0 0 212 90.94Z" /></svg>
                        </div>
                        <div class="social-media-text">
                            <h2>Share to Tiktok</h2>
                            <p>Al-narrated video 1</p>
                        </div>
                    </div>
                    <button class="share-btn">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="128" height="128"
                            viewBox="0 0 24 24"><path
                                fill="currentColor"
                                d="m11.293 17.293l1.414 1.414L19.414 12l-6.707-6.707l-1.414 1.414L15.586 11H6v2h9.586z" /></svg>
                    </button>
                </div>
                <div class="social-media-container">
                    <div class="social-media-container-flex">
                        <div class="copy-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 256 256"><path fill="currentColor" d="M251.09 67.41A12 12 0 0 0 240 60h-28.18a52.73 52.73 0 0 0-43.67-24a50.85 50.85 0 0 0-36.6 14.85A51.87 51.87 0 0 0 116 88v.78c-36.83-11.57-66.38-40.9-66.7-41.23a12 12 0 0 0-20.47 7.38c-6.31 70.17 24.65 107.79 42.06 123.12C56.4 192.83 36 200.68 35.8 200.76a12 12 0 0 0-5.8 17.9C32 221.55 43.44 236 80 236c72.25 0 132.7-55.26 139.6-126.63l28.88-28.88a12 12 0 0 0 2.61-13.08m-51.57 28.11a11.93 11.93 0 0 0-3.49 7.72C192.14 164.23 141.18 212 80 212a90.78 90.78 0 0 1-12.49-.79C78 204.55 89.72 195.07 98 182.66a12 12 0 0 0-3.9-17c-.12-.07-12.33-7.49-23.43-24.42s-17.26-37-18.46-59.78C69.37 94.4 96 110.79 126 115.84A12 12 0 0 0 140 104V88a28 28 0 0 1 8.41-20.07A27.07 27.07 0 0 1 167.86 60a28.83 28.83 0 0 1 25.82 16.81a12 12 0 0 0 11 7.19H211Z"/></svg>
                        </div>
                        <div class="social-media-text">
                            <h2>Share to Twitter</h2>
                            <p>Al-narrated video 1</p>
                        </div>
                    </div>
                    <button class="share-btn">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="128" height="128"
                            viewBox="0 0 24 24"><path
                                fill="currentColor"
                                d="m11.293 17.293l1.414 1.414L19.414 12l-6.707-6.707l-1.414 1.414L15.586 11H6v2h9.586z" /></svg>
                    </button>
                </div> -->
                <div class="social-media-container">
                    <div class="social-media-container-flex">
                        <div class="copy-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="currentColor" d="M10.59 13.41c.41.39.41 1.03 0 1.42c-.39.39-1.03.39-1.42 0a5.003 5.003 0 0 1 0-7.07l3.54-3.54a5.003 5.003 0 0 1 7.07 0a5.003 5.003 0 0 1 0 7.07l-1.49 1.49c.01-.82-.12-1.64-.4-2.42l.47-.48a2.982 2.982 0 0 0 0-4.24a2.982 2.982 0 0 0-4.24 0l-3.53 3.53a2.982 2.982 0 0 0 0 4.24m2.82-4.24c.39-.39 1.03-.39 1.42 0a5.003 5.003 0 0 1 0 7.07l-3.54 3.54a5.003 5.003 0 0 1-7.07 0a5.003 5.003 0 0 1 0-7.07l1.49-1.49c-.01.82.12 1.64.4 2.43l-.47.47a2.982 2.982 0 0 0 0 4.24a2.982 2.982 0 0 0 4.24 0l3.53-3.53a2.982 2.982 0 0 0 0-4.24a.973.973 0 0 1 0-1.42"/></svg>
                        </div>
                        <div class="social-media-text">
                            <h2>Copy link</h2>
                            <p>Al-narrated video 1</p>
                        </div>
                    </div>
                    <button class="share-btn">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="128" height="128"
                            viewBox="0 0 24 24"><path
                                fill="currentColor"
                                d="m11.293 17.293l1.414 1.414L19.414 12l-6.707-6.707l-1.414 1.414L15.586 11H6v2h9.586z" /></svg>
                    </button>
                </div>
                <div class="last-button">
                    <button class="bottom-btn" @click="downloadVideo" >Download</button>
                </div>
              </div>
              <div v-else class="last-button">
                <button class="bottom-btn" @click="generateNarration" :disabled="processing"> {{processing == true ? 'Thinking...' : `Let's hear it.`}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import Typed from 'typed.js';

export default {
  name:'ShortenForm',
  data() {
    return {
      name: 'Kazuya',
      processingMainImgSrc: require('@/assets/img/processing_tv_image.jpeg'),
      mainImgSrc: require('@/assets/img/tv-image.jpg'),
      cartoonImgSrc: require('@/assets/img/cartton.jpeg'),
      cameraRollImgSrc: require('@/assets/img/camera-roll.jpg'),
      narrationLength: 25,
      narrationSummaryLink: 'narration-summary',
      selectedChannel: 'camera',
      selectedImageSrc:'',
      selectedFile:'',
      transcript:'',
      audioSrc:'',
      processing: false,
      isNarration:false,
      currentTime: 0,
      duration: 0,
      backgroundSize: '0% 100%'
    };
  },
  mounted() {
    this.startCamera();
  },
  watch:{
    currentTime() {
      if (this.isNarration) {
          const rangeInput = this.$refs.rangeInput;
          let clickedElement = rangeInput,
          // min = clickedElement.min,
          max = clickedElement.max,
          val = clickedElement.value;
          // this.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
          this.backgroundSize = (Math.floor(val) / Math.floor(max)) * 100 + '% 100%';
          console.log(this.backgroundSize)
      }
    }
  },
  methods: {
    async startCamera() {
      const constraints = {
        video: true
      };
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.$refs.video.srcObject = stream;
        this.selectedChannel = 'camera'

      } catch (err) {
        console.error('Error accessing camera: ', err);
      }
    },
    async stopCamera() {
      const videoElement = this.$refs.video;
      const stream = videoElement.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoElement.srcObject = null;
      }
    },
    formattedTime(seconds) {
      const format = val => `0${Math.floor(val)}`.slice(-2);
      const mins = (seconds % 3600) / 60;
      const secs = seconds % 60;
      return `${format(mins)}:${format(secs)}`;
    },
    updateProgressBar(event) {
      const audio = event.target;
      this.currentTime = audio.currentTime;
      this.duration = audio.duration;
    },
    async generateNarration() {
        try {
          this.processing = true;
          let formData = new FormData();
          if(this.selectedChannel == 'upload'){
            formData.append('file', this.selectedFile);
            await this.sendImageToServer(formData);
          } else {
            this.$refs.canvas.width = this.$refs.video.videoWidth;
            this.$refs.canvas.height = this.$refs.video.videoHeight;
            this.$refs.canvas.getContext('2d').drawImage(this.$refs.video, 0, 0);
            this.$refs.canvas.toBlob(async (blob) => {
              formData.append('file', blob, 'image.jpeg');
                this.selectedChannel = 'camera';
                this.selectedImageSrc = URL.createObjectURL(blob);
                await this.stopCamera();
                await this.sendImageToServer(formData);
            }, 'image/jpeg');
          }      
        } catch (err) {
          console.error('Error sending image to server: ', err);
          this.processing = false;
        }
    },
    async typedSummary(){
        if (this.transcript) {
          const words = this.transcript.split(/\s+/);
          let typed_strings = [];

          for (let i = 0; i < words.length; i += 6) {
            let chunk = words.slice(i, i + 6).join(' ');
            typed_strings.push(chunk);
          }    
          new Typed('.image-summary', {
            strings: typed_strings,
            showCursor: false, 
            loop: false,
            typeSpeed: 25,
            startSpeed: 2,
            startDelay: 1000
          });
        }
    },
    async sendImageToServer(formData) {
      try {
        const response = await fetch('https://oyzekbotvh.execute-api.ap-northeast-1.amazonaws.com/prod/app/narration/123487', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        this.transcript = data.response.transcript;
        this.audioSrc = data.response.audio_file;
        this.isNarration = true;
        this.$nextTick(() => {
          this.$refs.audio.play();
          this.processing = false;
          this.typedSummary();
        });      
      } catch (err) {
        console.error('Error sending image to server: ', err);
        this.processing = false;
      }
    },
    copySummary() {
      const el = document.createElement('textarea');
      el.value = this.transcript;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    },
    async handleFileChange() {
      await this.stopCamera();
      this.transcript = '';
      this.audioSrc = '';
      this.isNarration = false;
      this.selectedFile = this.$refs.fileInput.files[0];
      if (this.selectedFile) {
        this.selectedChannel = 'upload';
        this.selectedImageSrc = URL.createObjectURL(this.selectedFile);
      }
    },
    updateSlider(e) {
      let clickedElement = e.target,
      min = clickedElement.min,
      max = clickedElement.max,
      val = clickedElement.value;
      this.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
      const audio = this.$refs.audio;
      audio.currentTime = event.target.value;
      this.$nextTick(() => {
          this.$refs.audio.play();
          // this.typedSummary();
      });  
    },
    create(){
      this.transcript = '';
      this.audioSrc = '';
      this.isNarration = false;
      this.selectedImageSrc = '';
      this.selectedChannel = 'camera';
      this.startCamera();
    },
    async downloadVideo() {
      // Get reference to the container div
      const container = document.querySelector('.container-image-main');
      console.log('container',container);
      // Capture the contents of the container as an image using html2canvas
      const canvas = await html2canvas(container);
      console.log('canvas',canvas);

      // Convert the canvas to a data URL
      const dataURL = canvas.toDataURL('image/jpeg');
      console.log('dataURL',dataURL);

      // Create a temporary link element to download the video
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'video.mp4';
      link.click();
    }
  }
};
</script>
<style scoped>
.output {
  text-align: center;
}
/* Time indicators */
.time-indicator {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999; /* Adjust color as needed */
}
.time-indicator span{
  color: #fff;
}
.time-indicator span:first-child {
  text-align: left;
}

.time-indicator span:last-child {
  text-align: right;
}
.data {
  text-align: center;
  margin-top: 24px;
}
.image-summary{
  background-color: #f6fafd;
  padding: 10px;
  word-wrap: break-word;
  box-shadow: 0 0 10px rgb(181 181 181 / 50%);
  border-radius: 10px;
  font-size: 18px;
  font-weight: 400;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-26%, 36%);
  text-align: center;
}
.range-slider-position{

  position: absolute;
  left: 50%;
  bottom: 31px;
  /* width: 100%; */
width: calc(100% - 100px);
  transform: translatex(-50%);
}
/* Slider CSS */
.progress-bar-custom {
    -webkit-appearance: none;
    display: block;
    width: 100%;
    margin: 16px 0;
    background: #84796f;
    background-image: -webkit-linear-gradient(left, #fff 0%,#fff 100%);
    background-image: -moz-linear-gradient(left, #fff 0%, #fff 100%);
    background-image: -o-linear-gradient(to right, #fff 0%,#fff 100%);
    background-image: linear-gradient(to right, #fff 0%,#fff 100%);
    background-repeat: no-repeat;
}

.progress-bar-custom:focus {
  outline: none;
}

.progress-bar-custom::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  box-shadow: none;
  background: transparent;
  border-radius: 0px;
  border: none;
}

.progress-bar-custom::-webkit-slider-thumb {
  box-shadow: none;
  border: 4px solid #fff;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -5px;
}

.progress-bar-custom:focus::-webkit-slider-runnable-track {
  background: transparent;
}

.progress-bar-custom::-moz-range-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  box-shadow: none;
  background: transparent;
  border-radius: 0px;
  border: none;
}

.progress-bar-custom::-moz-range-thumb {
  box-shadow: none;
  border: 4px solid #fff;
  height: 16px;
  width: 16px;
  border-radius: 2px;
  background: #ffffff;
  cursor: pointer;
}

.progress-bar-custom::-ms-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}

.progress-bar-custom::-ms-fill-lower {
  background: transparent;
  border: none;
  border-radius: 0px;
  box-shadow: none;
}

.progress-bar-custom::-ms-fill-upper {
  background: transparent;
  border: none;
  border-radius: 0px;
  box-shadow: none;
}

.progress-bar-custom::-ms-thumb {
  box-shadow: none;
  border: 4px solid #fff;
  height: 16px;
  width: 16px;
  border-radius: 2px;
  background: #ffffff;
  cursor: pointer;
  height: 4px;
}

.progress-bar-custom:focus::-ms-fill-lower {
  background: transparent;
}

.progress-bar-custom:focus::-ms-fill-upper {
  background: transparent;
}

</style>
