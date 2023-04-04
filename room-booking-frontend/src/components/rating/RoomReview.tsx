import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";

export function RoomReview(props:{setRating?: any, rating?: any}) {
  

  // Catch Rating value
  const handleRating = (rate: number) => {
    props.setRating(rate);

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
      size={30}
      transition
      showTooltip
      readonly={props.rating ? true : false}
      tooltipArray={tooltipArray}
      fillColorArray={fillColorArray}
      tooltipDefaultText="Your Rating"
        initialValue={props.rating || 0}
      emptyStyle={{ display: "flex" }}
      fillStyle={{ display: "-webkit-inline-box" }}
    />
  );
}

export default RoomReview;
