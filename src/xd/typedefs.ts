export type Point = {
  x: number;
  y: number;
};

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Interaction = {
  trigger: Trigger;
  action: Action;
};

// TODO: trigger typedef
export type Trigger = {
  type: string;
};

// TODO: action typedef
export type Action = {
  type: string;
};
