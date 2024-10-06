import React from 'react';

interface CheckboxInterface {
  label: string;
  checked: boolean;
  toggle: () => void;
}

function Checkbox({ label, checked, toggle } : CheckboxInterface): React.ReactElement {
  return (
    <div className="form-control">
      <label className="label cursor-pointer gap-2">
        <span className="label-text">{label}</span>
        <input
          type="checkbox"
          className="toggle"
          checked={checked}
          onChange={() => {toggle()}}
        />
      </label>
    </div>
  );
}

export default Checkbox;