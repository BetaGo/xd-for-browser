export interface Value {
  r: number;
  g: number;
  b: number;
}

export interface Color {
  mode: string;
  value: Value;
  alpha: number;
}

export interface RowStroke {
  type: string;
  color: Color;
}

export interface Value {
  r: number;
  g: number;
  b: number;
}

export interface Color {
  mode: string;
  value: Value;
  alpha: number;
}

export interface ColumnStroke {
  type: string;
  color: Color;
}

export interface Value {
  r: number;
  g: number;
  b: number;
}

export interface Color {
  mode: string;
  value: Value;
  alpha: number;
}

export interface LayoutRowStroke {
  type: string;
  color: Color;
}

export interface Value {
  r: number;
  g: number;
  b: number;
}

export interface Color {
  mode: string;
  value: Value;
  alpha: number;
}

export interface LayoutColumnStroke {
  type: string;
  color: Color;
}

export interface GridStyle {
  rowStroke: RowStroke;
  columnStroke: ColumnStroke;
  rowSpacing: number;
  columnSpacing: number;
  defaultLayoutWidth: number;
  columns: number;
  gutter: number;
  marginLeft: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  layoutRowStroke: LayoutRowStroke;
  layoutColumnStroke: LayoutColumnStroke;
}

export interface Ux {
  hasCustomName: boolean;
  constraintsDisabled: boolean;
  gridStyle: GridStyle;
}

export interface Meta {
  ux: Ux;
}

export interface Transform {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

export interface LocalTransform {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

export interface Ux {
  hasCustomName: boolean;
  localTransform: LocalTransform;
}

export interface Meta {
  ux: Ux;
}

export interface Transform {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

export interface Ux {
  hasCustomName: boolean;
}

export interface Meta {
  ux: Ux;
}

export interface Ux {
  nameL10N: string;
}

export interface Meta {
  ux: Ux;
}

export interface Transform {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

export interface Value {
  r: number;
  g: number;
  b: number;
}

export interface Color {
  mode: string;
  value: Value;
}

export interface Fill {
  type: string;
  color: Color;
}

export interface Value {
  r: number;
  g: number;
  b: number;
}

export interface Color {
  mode: string;
  value: Value;
}

export interface Stroke {
  type: string;
  color: Color;
  width: number;
}

export interface Value {
  r: number;
  g: number;
  b: number;
}

export interface Color {
  mode: string;
  value: Value;
  alpha: number;
}

export interface DropShadow {
  dx: number;
  dy: number;
  r: number;
  color: Color;
}

export interface Param {
  dropShadows: DropShadow[];
}

export interface Filter {
  type: string;
  global: boolean;
  params: Param;
}

export interface Style {
  fill: Fill;
  stroke: Stroke;
  filters: Filter[];
}

export interface VisualBound {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Shape {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Children {
  type: string;
  name: string;
  meta: Meta;
  id: string;
  transform: Transform;
  style: Style;
  visualBounds: VisualBound;
  shape: Shape;
}

export interface Group {
  children: Children[];
}

export interface Children {
  type: string;
  name: string;
  id: string;
  transform: Transform;
  meta: Meta;
  group: Group;
}

export interface Group {
  children: Children[];
}

export interface Children {
  type: string;
  name: string;
  id: string;
  transform: Transform;
  meta: Meta;
  group: Group;
}

export interface Ux {
  path: string;
}

export interface Meta {
  ux: Ux;
}

export interface Artboard {
  children: Children[];
  meta: Meta;
  ref: string;
}

export interface Value {
  r: number;
  g: number;
  b: number;
}

export interface Color {
  mode: string;
  value: Value;
}

export interface Fill {
  type: string;
  color: Color;
}

export interface Style {
  fill: Fill;
}

export interface Children {
  type: string;
  id: string;
  meta: Meta;
  artboard: Artboard;
  style: Style;
}

export interface Resource {
  href: string;
}

export interface Artboard {
  href: string;
}

export interface RootObject {
  version: string;
  children: Children[];
  resources: Resource;
  artboards: Artboard;
}
