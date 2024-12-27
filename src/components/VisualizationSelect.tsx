import React from 'react';

export type visualizationType = "basic"|"bordered"| "color-bordered"|"explode"|"cubist"|"randomZ"| "city";


interface VisualizationProps {
  onChange: (type: visualizationType) => void;
  visualization: visualizationType;
}

function VisualizationSelect({onChange, visualization} : VisualizationProps ): React.ReactElement {
  return (
    <select
      className="select w-full max-w-xs"
      value={visualization}
      onChange={(event) => onChange(event.target.value as visualizationType)}
    >
        <option disabled selected>Pick your vizualisation</option>
        <option value="basic">Basic</option>
        <option value="bordered">Bordered</option>
        <option value="color-bordered">Color Bordered</option>
        <option value="randomZ">Random Z axis</option>
        <option value="explode">Explode</option>
        <option value="cubist">Cubist</option>
        <option value="city">City</option>
    </select>
  );
}

export default VisualizationSelect;