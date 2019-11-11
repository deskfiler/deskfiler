import React, { useEffect } from 'react';
import anime from 'animejs';
import { string } from 'prop-types';
import { Flex, colors } from 'styled';

const Cog1 = props => (
  <svg viewBox="0 0 7.59 7.59" {...props}>
    <defs>
      <style>
        {
          ".cls-2{fill:#3adb76;stroke:#31b55d;stroke-width:.13px;stroke-miterlimit:10}.cls-3{fill:none}"
        }
      </style>
    </defs>
    <g id="Cog1" data-name="Layer 2" style={{ transformOrigin: 'center' }}>
      <g id="Layer_1-2" data-name="Layer 1">
        <circle
          cx={3.79}
          cy={3.79}
          r={2.8}
          transform="rotate(-10.49 3.77 3.806)"
          fill="#3adb76"
        />
        <path
          className="cls-2"
          d="M6.55 3.28a3.29 3.29 0 01.05.58l.92.07a3.63 3.63 0 01-.27 1.26l-.87-.3a3.23 3.23 0 01-.27.5"
        />
        <path
          className="cls-3"
          d="M6.48 3.3a3.22 3.22 0 010 .56H5.6a1.7 1.7 0 01-.13.61l.84.39a3.15 3.15 0 01-.31.48"
        />
        <path
          className="cls-2"
          d="M6.11 5.39a3.15 3.15 0 01-.37.44l.6.7a3.63 3.63 0 01-1.08.7l-.41-.83a3.38 3.38 0 01-.54.16"
        />
        <path
          className="cls-3"
          d="M6 5.34a3.07 3.07 0 01-.37.42L5 5.12a1.71 1.71 0 01-.52.34l.32.87a3.3 3.3 0 01-.53.15"
        />
        <path
          className="cls-2"
          d="M4.3 6.55a3.29 3.29 0 01-.58.05l-.07.92a3.63 3.63 0 01-1.25-.27l.3-.87a3.23 3.23 0 01-.5-.27"
        />
        <path
          className="cls-3"
          d="M4.29 6.48a3.21 3.21 0 01-.56 0V5.6a1.7 1.7 0 01-.61-.13l-.39.84A3.14 3.14 0 012.25 6"
        />
        <path
          className="cls-2"
          d="M2.2 6.11a3.15 3.15 0 01-.44-.37l-.7.6a3.63 3.63 0 01-.7-1.08l.83-.41A3.38 3.38 0 011 4.31"
        />
        <path
          className="cls-3"
          d="M2.24 6a3.07 3.07 0 01-.42-.37L2.47 5a1.71 1.71 0 01-.34-.52l-.87.32a3.3 3.3 0 01-.15-.53"
        />
        <path
          className="cls-2"
          d="M1 4.3a3.29 3.29 0 010-.57l-.94-.07A3.63 3.63 0 01.33 2.4l.87.3a3.23 3.23 0 01.27-.5"
        />
        <path
          className="cls-3"
          d="M1.11 4.29a3.21 3.21 0 010-.56H2a1.7 1.7 0 01.13-.61l-.84-.39a3.14 3.14 0 01.26-.48"
        />
        <path
          className="cls-2"
          d="M1.48 2.2a3.15 3.15 0 01.37-.44l-.6-.7a3.63 3.63 0 011.08-.7l.41.83A3.38 3.38 0 013.28 1"
        />
        <path
          className="cls-3"
          d="M1.54 2.24a3.07 3.07 0 01.37-.42l.65.65a1.71 1.71 0 01.52-.34l-.32-.87a3.3 3.3 0 01.53-.15"
        />
        <path
          className="cls-2"
          d="M3.28 1a3.29 3.29 0 01.58 0l.07-.94a3.63 3.63 0 011.26.27l-.3.87a3.22 3.22 0 01.5.27"
        />
        <path
          className="cls-3"
          d="M3.3 1.11a3.21 3.21 0 01.56 0V2a1.7 1.7 0 01.61.13l.39-.84a3.14 3.14 0 01.48.26"
        />
        <path
          className="cls-2"
          d="M5.39 1.48a3.15 3.15 0 01.44.37l.7-.6a3.63 3.63 0 01.7 1.08l-.83.41a3.38 3.38 0 01.16.54"
        />
        <path
          className="cls-3"
          d="M5.34 1.54a3.07 3.07 0 01.42.37l-.65.65a1.71 1.71 0 01.34.52l.87-.32a3.3 3.3 0 01.15.53"
        />
        <circle
          cx={3.79}
          cy={3.79}
          r={0.27}
          transform="rotate(-8.72 3.8 3.786)"
          fill="#fff"
          stroke="#000"
          strokeWidth=".05px"
          strokeMiterlimit={10}
        />
      </g>
    </g>
  </svg>
);

const Cog2 = props => (
  <svg viewBox="0 0 10.57 10.65" {...props}>
    <defs>
      <style>
        {
          `.cls-2{fill:${props.fill};stroke:#0f294b;stroke-width:.17px;stroke-miterlimit:10}.cls-3{fill:none}`
        }
      </style>
    </defs>
    <g id="Cog2" data-name="Layer 2" style={{ transformOrigin: 'center' }}>
      <g id="Layer_1-2" data-name="Layer 1">
        <circle cx={5.33} cy={5.32} r={4.02} fill={colors.success} />
        <path
          className="cls-2"
          d="M9.35 5.33a4.69 4.69 0 01-.06.73l1.18.28a5.52 5.52 0 01-.55 1.52l-1.1-.53a4.35 4.35 0 01-.41.59"
        />
        <path
          className="cls-3"
          d="M9.25 5.33a4.59 4.59 0 01-.08.67L8 5.85a3 3 0 01-.28.78l1 .64a4.24 4.24 0 01-.4.57"
        />
        <path
          className="cls-2"
          d="M8.41 7.91a4.75 4.75 0 01-.51.53l.72 1a5.26 5.26 0 01-1.4.8l-.5-1.14a3.65 3.65 0 01-.72.19"
        />
        <path
          className="cls-3"
          d="M8.33 7.85a4.65 4.65 0 01-.52.5L7 7.43a2.72 2.72 0 01-.72.41L6.68 9a3.54 3.54 0 01-.68.18"
        />
        <path
          className="cls-2"
          d="M6 9.28a4.35 4.35 0 01-.73.07l-.07 1.21a5.22 5.22 0 01-1.59-.28L4 9.11a3.72 3.72 0 01-.65-.3"
        />
        <path
          className="cls-3"
          d="M6 9.19a4.24 4.24 0 01-.72.05L5.27 8a2.68 2.68 0 01-.82-.14L4 9a3.61 3.61 0 01-.63-.3"
        />
        <path
          className="cls-2"
          d="M3.32 8.81a4.1 4.1 0 01-.61-.42l-.83.88A5.07 5.07 0 01.84 8l1-.69a3.62 3.62 0 01-.31-.65"
        />
        <path
          className="cls-3"
          d="M3.36 8.72a4 4 0 01-.58-.42l.77-.94A2.53 2.53 0 013 6.72l-1.06.58a3.51 3.51 0 01-.29-.63"
        />
        <path
          className="cls-2"
          d="M1.55 6.7a3.49 3.49 0 01-.2-.7l-1.2.13a5 5 0 010-1.61l1.21.12a3.54 3.54 0 01.18-.69"
        />
        <path
          className="cls-3"
          d="M1.64 6.67A3.38 3.38 0 011.47 6l1.19-.23a2.49 2.49 0 010-.83l-1.19-.28A3.44 3.44 0 011.65 4"
        />
        <path
          className="cls-2"
          d="M1.55 3.95a3.56 3.56 0 01.3-.67l-1-.67a5.07 5.07 0 011-1.23l.85.87a4.2 4.2 0 01.59-.41"
        />
        <path
          className="cls-3"
          d="M1.64 4A3.45 3.45 0 012 3.34l1 .59a2.54 2.54 0 01.53-.64l-.76-1a4.09 4.09 0 01.57-.4"
        />
        <path
          className="cls-2"
          d="M3.32 1.84A3.79 3.79 0 014 1.53L3.64.36A5.23 5.23 0 015.22.08l.09 1.22a4.5 4.5 0 01.69.06"
        />
        <path
          className="cls-3"
          d="M3.37 1.93A3.68 3.68 0 014 1.64l.43 1.13a2.68 2.68 0 01.82-.14V1.41a4.39 4.39 0 01.7.06"
        />
        <path
          className="cls-2"
          d="M6 1.37a3.72 3.72 0 01.71.18L7.22.44a5.27 5.27 0 011.4.81l-.71 1a4.57 4.57 0 01.51.51"
        />
        <path
          className="cls-3"
          d="M6 1.46a3.61 3.61 0 01.69.2L6.3 2.81a2.73 2.73 0 01.7.41l.81-.91a4.46 4.46 0 01.49.5"
        />
        <path
          className="cls-2"
          d="M8.41 2.74a4.4 4.4 0 01.43.6l1.09-.55a5.52 5.52 0 01.55 1.52l-1.19.3a4.67 4.67 0 01.07.71"
        />
        <path
          className="cls-3"
          d="M8.33 2.8a4.29 4.29 0 01.4.6L7.7 4a3 3 0 01.3.8l1.2-.17a4.56 4.56 0 01.06.7"
        />
        <circle
          cx={5.33}
          cy={5.32}
          r={0.39}
          transform="rotate(-8.72 5.33 5.353)"
          fill="#fff"
          stroke="#000"
          strokeWidth=".1px"
          strokeMiterlimit={10}
        />
      </g>
    </g>
  </svg>
);

const Spinner = ({ size }) => {
  useEffect(() => {
    anime({
      targets: ['#Cog1', '#Cog2'],
      rotate: 240,
      duration: 2000,
      easing: 'linear',
      loop: true,
    });
  }, []);

  return (
    <Flex>
      <Cog1 style={{ transform: 'translate(-50%, 70%)' }} width={size} />
      <Cog2 width={size} />
    </Flex>
  );
};

Spinner.propTypes = {
  size: string,
};

Spinner.defaultProps = {
  size: '64px',
};

export default Spinner;
