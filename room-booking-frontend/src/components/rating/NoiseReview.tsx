import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { AiFillSound, AiOutlineSound} from "react-icons/ai";

export function NoiseReview(props: { setNoise: any }) {
  // Catch Rating value
  const handleRating = (rate: number) => {
    props.setNoise(rate);
    // other logic
  };

  const tooltipArray = ["1 🔇", "2 🔉", "3 🔉", "4 🔉", "5 🔉"];
  const fillColorArray = [
    "#f1d045",
    "#f1b345",
    "#f1a545",
    "#f19745",
    "#f17a45",
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
      tooltipArray={tooltipArray}
      fillColorArray={fillColorArray}
      tooltipDefaultText="Room Loudness"
      tooltipStyle={{fontSize: "18px"}}
      emptyIcon={<AiOutlineSound size={50} />}
      fillIcon={<AiFillSound size={50} />}
      emptyStyle={{ display: "flex" }}
      fillStyle={{ display: "-webkit-inline-box" }}
    />
  );
}

export default NoiseReview;
