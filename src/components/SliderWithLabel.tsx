// from https://github.com/guillaume-gomez/tile-and-square/blob/main/src/Components/SliderWithLabel.tsx
import React from 'react';
import Slider from "./Slider";

interface SliderWithLabelInterface {
  value: number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
}

function SliderWithLabel({ value, onChange, min = 1, max = 100, step = 1, label } : SliderWithLabelInterface): React.ReactElement {
  return (
   <div>
     <div className="flex justify-between">
       <label className="font-semibold">{label}</label>
       <p className="badge badge-lg bg-base-300">{value}</p>
     </div>
     <Slider value={value} onChange={onChange} min={min} max={max} />
    </div>
  );
}

export default SliderWithLabel;