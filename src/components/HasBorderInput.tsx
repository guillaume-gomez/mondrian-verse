import React from 'react';

import Checkbox from "./Checkbox";

interface HasBorderInputProps {
  onChange: (hasBorder: boolean) => void;
  hasBorder: boolean;
}

function HasBorderInput({hasBorder, onChange} : HasBorderInputProps ): React.ReactElement {
  console.log(hasBorder)
  return (
    <Checkbox
      label={"with Frame ?"}
      checked={hasBorder}
      toggle={() => onChange(!hasBorder)}
    />
  );
}

export default HasBorderInput;