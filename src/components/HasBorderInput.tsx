import React from 'react';

interface HasBorderInputProps {
  onChange: (hasBorder: boolean) => void;
  hasBorder: boolean;
}

function HasBorderInput({hasBorder, onChange} : HasBorderInputProps ): React.ReactElement {
  return (
    <div className="form-control">
      <label className="label cursor-pointer gap-2">
        <span className="label-text">with Frame ?</span>
        <input type="checkbox" className="toggle" checked={hasBorder} onChange={() => onChange(!hasBorder)} />
      </label>
    </div>
  );
}

export default HasBorderInput;