import { makeAutoObservable } from "mobx";

export class Blur {
  constructor(
    public blurAmount: number,
    public brightnessAmount: number,
    public fillOpacity: number,
    public visible: boolean,
    public isBackgroundEffect: boolean
  ) {
    makeAutoObservable(this);
  }
}
