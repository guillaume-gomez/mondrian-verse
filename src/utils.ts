
export interface CustomRect{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function length(axis1: number, axis2: number) : number {
    return Math.abs(axis2 - axis1);
}

export function widthRect({x1, x2}: CustomRect) : number {
    return length(x2, x1);
}

export function heightRect({y1, y2} : CustomRect) : number {
    return length(y2, y1);
}

export function randInt(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min) + min)
}