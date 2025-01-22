import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFvrDocument } from '../../../../core/interfaces/app/fvr/IFvrModel';
@Component({
  selector: 'app-carousel',
  templateUrl: 'carousel.host.component.html',
  styleUrl: 'carousel.host.component.scss',
})
export class CarouselHostComponent {
  currentSlideIndex: number = 1;
  images: IFvrDocument[] = [];
  currentIndex: number = 0;
  constructor(
    private _mdr: MatDialogRef<CarouselHostComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.images = data.images;
    this.currentSlideIndex = data.index;
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.images.length;
  }

  prevSlide() {
    this.currentSlideIndex =
      (this.currentSlideIndex - 1 + this.images.length) % this.images.length;
  }
}
