import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-webcam-snapshot',
  templateUrl: './webcam-snapshot.component.html',
  styleUrls: ['./webcam-snapshot.component.scss']
})
export class WebcamSnapshotComponent {

  WIDTH = 340;
  HEIGHT = 380;

  @ViewChild("video")
  public video?: ElementRef;

  @ViewChild("canvas")
  public canvas?: ElementRef  ;

  captures: string[] = [];
  error: any;
  isCaptured: boolean = false;

  async ngAfterViewInit() {
    await this.setupDevices();
  }

  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (stream && this.video) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = "You have no output video device";
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  capture() {
    this.drawImageToCanvas(this.video?.nativeElement);
    this.captures.push(this.canvas?.nativeElement.toDataURL("image/png"));
    this.isCaptured = true;
  }

  removeCurrent() {
    this.isCaptured = false;
  }

  removePhoto(index: number): void {
    this.captures.splice(index, 1);
  }
  setPhoto(idx: number) {
    this.isCaptured = true;
    var image = new Image();
    image.src = this.captures[idx];
    this.drawImageToCanvas(image);
  }

  drawImageToCanvas(image: any) {
    this.canvas?.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }
}
