import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";

export function CalendarReview() {
  const [rating, setRating] = useState(0);

  // Catch Rating value
  const handleRating = (rate: number) => {
    setRating(rate);

    // other logic
  };

    const tooltipArray = ["1 ⭐", "2 ⭐", "3 ⭐", "4 ⭐", "5 ⭐"];
    const fillColorArray = [
      "#f17a45",
      "#f19745",
      "#f1a545",
      "#f1b345",
      "#f1d045",
    ];
  // Optinal callback functions
  const onPointerEnter = () => console.log("Enter");
  const onPointerLeave = () => console.log("Leave");
  const onPointerMove = (value: number, index: number) =>
    console.log(value, index);

  return (
      <Rating
        onClick={handleRating}
        size={1}
        // transition
        showTooltip
        readonly
        tooltipArray={tooltipArray}
        // fillColorArray={fillColorArray}
        initialValue={5}
      />
  );

}

export default CalendarReview;
