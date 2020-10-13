import { Transform } from "./transform";

export type UX = {
  localTransform: Transform;
  nameL10N?: string;
  constraintsDisabled?: boolean;
  rotation?: number;
  hasCustomName?: boolean;
};

export interface IElementMeta {
  ux: UX;
}
