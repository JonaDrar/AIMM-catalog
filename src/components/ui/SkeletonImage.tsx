"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = {
  containerClassName?: string;
  imageClassName?: string;
  skeletonClassName?: string;
} & Omit<ImageProps, "alt"> & { alt: string };

const shimmerSvg = `
  <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#f5f6f8" offset="0%" />
        <stop stop-color="#e9edf3" offset="50%" />
        <stop stop-color="#f5f6f8" offset="100%" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#g)" />
  </svg>
`;

const blurDataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(shimmerSvg)}`;

export default function SkeletonImage({
  containerClassName = "",
  imageClassName = "",
  skeletonClassName = "",
  alt,
  ...imageProps
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {!loaded && (
        <div
          className={`absolute inset-0 skeleton-shimmer ${skeletonClassName}`}
        />
      )}
      <Image
        {...imageProps}
        alt={alt}
        onLoadingComplete={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={`${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-150 ${imageClassName}`}
      />
    </div>
  );
}
