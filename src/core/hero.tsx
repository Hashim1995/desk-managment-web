import { Button, Divider, Input } from '@nextui-org/react';
import React from 'react';
import { BsCheck } from 'react-icons/bs';

export function Hero() {
  return (
    <>
      <div className="flex sm:flex-row flex-col justify-center items-center gap-3 sm:mt-20 px-6 w-full">
        <div className="flex flex-col gap-5 pt-13">
          <div className="max-w-600px">
            <h1 className="inline">The modern landing page </h1>
            <h1 className="inline">for </h1>
            <h1 className="inline text-primary">React developers</h1>
          </div>

          <span className="max-w-400px text-accents8 text-lg">
            The easiest way to build a React landing page in seconds. Save time
            and focus on your project.
          </span>

          <div className="gap-8 pt-4 wrap">
            <Input placeholder="Enter your email address" size="lg" />
            <Button>Start Free Trial</Button>
          </div>

          <div className="gap-8 py-7 sm:py-4 wrap">
            <div className="items-center text-accents7">
              <BsCheck /> No credit card required.
            </div>
            <div className="items-center text-accents7">
              <BsCheck /> 14-day free trial.
            </div>
            <div className="items-center text-accents7">
              <BsCheck /> Cancel anytime.
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full">
          <img
            src="mock.png"
            alt="Mockup"
            className="w-[775px] object-contain"
          />
        </div>
      </div>
      <Divider className="left-0 absolute inset-0 mt-10" />
    </>
  );
}
