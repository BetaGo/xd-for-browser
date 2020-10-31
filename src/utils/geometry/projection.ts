export class Projection {
  constructor(public min: number, public max: number) {}

  overlaps(projection: Projection): boolean {
    return this.max > projection.min && projection.max > this.min;
  }
}
