import { Component, OnInit } from '@angular/core';
import { TranscribeStreamingClient } from '@aws-sdk/client-transcribe-streaming';
import { StartStreamTranscriptionCommand } from '@aws-sdk/client-transcribe-streaming';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-audio-stream',
  templateUrl: './audio-stream.component.html',
  styleUrl: './audio-stream.component.css',
})
export class AudioStreamComponent implements OnInit {
  mediaRecorder: any;
  audioChunks: any = [];
  audioContext = new AudioContext({ sampleRate: 16000 });

  starStreaming() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        console.log('streaming is going on');
        const mediaStreamAudioSourceNode = new MediaStreamAudioSourceNode(
          this.audioContext,
          { mediaStream: stream }
        );
        const mediaStreamAudioDestinationNode =
          new MediaStreamAudioDestinationNode(this.audioContext);

        mediaStreamAudioSourceNode.connect(mediaStreamAudioDestinationNode);
        this.mediaRecorder = new MediaRecorder(
          mediaStreamAudioDestinationNode.stream
        );
        this.mediaRecorder.ondataavailable = (event: any) => {
          this.audioChunks.push(event.data);
        };
        this.mediaRecorder.start();

        this.mediaRecorder.onstop = () => {
          console.log(this.audioChunks);
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          console.log(audioBlob.size);
          const audioUrl = URL.createObjectURL(audioBlob);

          console.log(audioUrl);
          const audio = new Audio(audioUrl);

          audio.play();

          // You can also download or save the blob to a server
        };
      })
      .catch((err) => {
        console.error('Error accessing media devices.', err);
      });
  }

  ngOnInit(): void {
    this.starStreaming();
  }

  playAudio() {
    console.log('Audio Recorded as a Stream');
    this.mediaRecorder.stop();
  }
}
