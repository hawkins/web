import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import h337 from 'heatmap.js';
import DotaMap from '../DotaMap';

/**
 * Adjust each x/y coordinate by the provided scale factor.
 * If max is provided, use that, otherwise, use local max of data.
 * Shift all values by the provided shift.
 * Returns the adjusted heatmap data.
 */
function scaleAndExtrema(points, scalef, max, shift) {
  const newPoints = points.map(p => ({
    x: Math.floor(p.x * scalef),
    y: Math.floor(p.y * scalef),
    value: p.value + (shift || 0),
  }));
  const vals = points.map(p => p.value);
  const localMax = Math.max.apply(null, vals);
  return {
    min: 0,
    max: max || localMax,
    data: newPoints,
  };
}

const drawHeatmap = ({
  points = [],
  width,
}, heatmap) => {
  // scale points by width/127 units to fit to size of map
  // offset points by 25 units to increase visibility
  const adjustedData = scaleAndExtrema(points, width / 127, null, 25);
  heatmap.setData(adjustedData);
};

class Heatmap extends Component {
  static propTypes = {
    width: PropTypes.number,
  }

  componentDidMount() {
    this.heatmap = h337.create({
      container: document.getElementById(this.id),
      radius: 15 * (this.props.width / 600),
    });
    drawHeatmap(this.props, this.heatmap);
  }
  UNSAFE_componentWillMount() {
    this.id = `a-${uuid.v4()}`;
  }
  UNSAFE_componentWillUpdate(nextProps) {
    drawHeatmap(nextProps, this.heatmap);
  }

  render() {
    return (
      <div
        style={{
          width: this.props.width,
          height: this.props.width,
        }}
        id={this.id}
      >
        <DotaMap width={this.props.width} maxWidth={this.props.width} />
      </div>);
  }
}

Heatmap.defaultProps = {
  width: 600,
};

export default Heatmap;
