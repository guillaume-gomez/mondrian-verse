import React from 'react';


function Help3D(): React.ReactElement {
  return (
  <div className="dropdown dropdown-hover">
    <label tabIndex={0} className="btn btn-sm">Help ?</label>
    <div tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box list-disc">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Controls</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

          <tr>
            <th>Left Click </th>
            <td>Rotate Camera</td>
          </tr>

          <tr>
            <th>Wheel Scroll</th>
            <td>Zoom In/Out</td>
          </tr>

        </tbody>
      </table>
    </div>
  </div>
  );
}

export default Help3D;