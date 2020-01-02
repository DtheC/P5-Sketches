class CanvasRecorder {
  constructor() {
    this.chunks = [];
    this.stream;
    this.recorder;
    var url = new URL(window.location.href);
    this.doRecord = url.searchParams.get("record");
    console.log(this.doRecord);
    if (this.doRecord) requestAnimationFrame(() => this.startRecordOnCanvasLoad());
  }

  startRecordOnCanvasLoad() {
    if (window.drawingContext != null) {
      this.record();
    } else {
      requestAnimationFrame(() => this.startRecordOnCanvasLoad());
    }
  }

  record() {
    this.chunks.length = 0;
    this.stream = document.querySelector('canvas').captureStream(30);
    this.recorder = new MediaRecorder(this.stream);
    console.log(this.recorder);
    this.recorder.ondataavailable = e => {
      console.log(e.data);
      if (e.data.size) {
        this.chunks.push(e.data);
      }
    };
    this.recorder.start();
    console.log("Started recording video");
  }

  done() {
    if (this.doRecord && this.recorder.state === "recording") {
      this.doRecord = false;
      console.log("Stopped recording video");
      this.recorder.onstop = () => this.download();
      setTimeout(() => this.recorder.stop(), 3000);
    } else {
      console.log("Wasn't recording so doing nothing.");
    }
  }

  exportVideo() {
    var blob = new Blob(this.chunks);
    var vid = document.createElement('video');
    vid.id = 'recorded'
    vid.controls = true;
    vid.src = URL.createObjectURL(blob);
    document.body.appendChild(vid);
    vid.play();
  }

  download() {
    console.log(this.chunks);
    var blob = new Blob(this.chunks, {
      type: 'video/webm'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'test.webm';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

const canvasRecorder = new CanvasRecorder();