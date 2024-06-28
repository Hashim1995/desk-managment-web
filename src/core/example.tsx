/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';

function ReservationCircle({ reservations }: any) {
  const radius = 100;
  const centerX = 110;
  const centerY = 110;

  const convertISOToHourFraction = (isoTime: string | number | Date) => {
    const date = new Date(isoTime);
    return (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;
  };

  const getCoordinatesForTimeFraction = (timeFraction: number) => {
    const angle = 2 * Math.PI * timeFraction - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  // Create paths for each time slice, color them based on reservation coverage
  const slices = Array.from({ length: 24 }, (_, i) => {
    const startFraction = i / 24;
    const endFraction = (i + 1) / 24;
    const start = getCoordinatesForTimeFraction(startFraction);
    const end = getCoordinatesForTimeFraction(endFraction);

    // Check if the slice is reserved partially or fully
    const reservationCoverage = reservations.reduce(
      (
        coverage: { start: number; end: number }[],
        reservation: { start: any; end: any }
      ) => {
        const resStart = convertISOToHourFraction(reservation.start);
        const resEnd = convertISOToHourFraction(reservation.end);
        if (resStart < endFraction && resEnd > startFraction) {
          // Calculate covered part within the current slice
          const coveredStart = Math.max(startFraction, resStart);
          const coveredEnd = Math.min(endFraction, resEnd);
          coverage.push({ start: coveredStart, end: coveredEnd });
        }
        return coverage;
      },
      []
    );

    // Generate paths for reserved and unreserved parts
    const paths = [];
    let lastEnd = startFraction;
    reservationCoverage.forEach((coverage: { start: number; end: number }) => {
      if (coverage.start > lastEnd) {
        // Add green path for free time
        const freeStart = getCoordinatesForTimeFraction(lastEnd);
        const freeEnd = getCoordinatesForTimeFraction(coverage.start);
        paths.push(
          <path
            key={`free-${lastEnd}`}
            d={`M${centerX},${centerY} L${freeStart.x},${freeStart.y} A${radius},${radius} 0 0,1 ${freeEnd.x},${freeEnd.y} Z`}
            fill="green"
            stroke="black"
            strokeWidth="0.5"
          />
        );
      }
      // Add red path for reserved time
      const resStart = getCoordinatesForTimeFraction(coverage.start);
      const resEnd = getCoordinatesForTimeFraction(coverage.end);
      paths.push(
        <path
          key={`res-${coverage.start}`}
          d={`M${centerX},${centerY} L${resStart.x},${resStart.y} A${radius},${radius} 0 0,1 ${resEnd.x},${resEnd.y} Z`}
          fill="red"
          stroke="black"
          strokeWidth="0.5"
        />
      );
      lastEnd = coverage.end;
    });
    if (lastEnd < endFraction) {
      // Add green path for remaining free time
      const freeStart = getCoordinatesForTimeFraction(lastEnd);
      const freeEnd = getCoordinatesForTimeFraction(endFraction);
      paths.push(
        <path
          key={`free-${lastEnd}`}
          d={`M${centerX},${centerY} L${freeStart.x},${freeStart.y} A${radius},${radius} 0 0,1 ${freeEnd.x},${freeEnd.y} Z`}
          fill="green"
          stroke="black"
          strokeWidth="0.5"
        />
      );
    }
    return paths;
  });

  return (
    <svg width="220px" height="220px" viewBox="0 0 220 220">
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="lightgray"
        strokeWidth="2"
      />
      {slices.flat()}
    </svg>
  );
}

export default ReservationCircle;
