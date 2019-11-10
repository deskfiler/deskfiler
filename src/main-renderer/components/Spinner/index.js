import React, { useEffect } from 'react';
import anime from 'animejs';

const Poly = props => (
  <svg id="Layer_1" data-name="Layer 1" viewBox="0 0 47.45 53.2" {...props}>
    <defs>
      <style>
        {'.cls-1{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px}'}
      </style>
    </defs>
    <polygon
      className="cls-1"
      points="45.11 40.47 22.41 52.05 1.03 38.18 2.35 12.73 25.05 1.15 46.43 15.02 45.11 40.47"
    />
  </svg>
);

const Spinner = () => {
  useEffect(() => {
    anime({
      targets: ['.cls-1'],
      points: "45.11 40.47 22.41 52.05 1.03 38.18 2.35 12.73 25.05 1.15 46.43 15.02 45.11 40.47",
      duration: 1000,
      easing: 'linear',
    });
  }, []);

  return (
    <Poly />
  );
};

export default Spinner;
