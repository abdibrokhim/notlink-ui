import React from 'react';

export default function Footer() {
  return (
    <div className="py-[10px] flex justify-center items-center">
        <div className="">
            <p className="text-xs text-center text-black">
                Built with Rust, Actix, Diesel, Neon, Shuttle, NextJS, Typescript.
            </p>
        </div>
    </div>
  );
}
