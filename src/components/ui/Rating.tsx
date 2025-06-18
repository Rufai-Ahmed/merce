"use client";

import React from "react";
import { Rating as SimpleRating, RatingProps } from "react-simple-star-rating";

const Rating = (props: RatingProps) => {
  return (
    <div className="flex flex-row items-center">
      <SimpleRating {...props} />
    </div>
  );
};

export default Rating;
