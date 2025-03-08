import React from 'react';

export default function BuiltWith() {
  return (
    <div className="py-[10px] flex justify-center items-center mx-auto w-full">
        <div className="">
            <p className="text-xs text-center text-black/30">
                Built with Rust, Actix, Diesel, Neon, Shuttle, NextJS, Typescript.
            </p>
        </div>
    </div>
  );
}