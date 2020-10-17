import { Color } from "./color";

export class Shadow {
  constructor(
    public x: number,
    public y: number,
    public blur: number,
    public color: Color,
    public visible: boolean = true
  ) {}
}
