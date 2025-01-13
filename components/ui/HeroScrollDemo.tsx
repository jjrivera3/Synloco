"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";
import { ChevronRight, Link } from "lucide-react";
import { Button } from "./button";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <div className="relative z-10">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl hero-weight gradient-title pb-6 flex flex-col mt-10">
                Streamline Your Workflow <br />
                <span className="flex mx-auto gap-4 sm:gap-4 items-center">
                  with {""}
                  <Image
                    src={"/logo.png"}
                    alt="synloco logo"
                    width={500}
                    height={180}
                    className="h-14 sm:h-32 w-auto object-contain ml-5"
                  />
                </span>
              </h1>
              <p className="text-xl text-gray-300 mt-2 mb-10 max-w-3xl mx-auto">
                Empower your team with our intuitive project management
                solution.
              </p>
              <Link href="/onboarding">
                <Button size="lg" className="mr-4">
                  Get Started <ChevronRight size={18} className="ml-1" />
                </Button>
              </Link>
              <Link href="#features1">
                <Button size="lg" variant="outline" className="mr-4">
                  Learn More <ChevronRight size={18} className="ml-1" />
                </Button>
              </Link>
            </div>
          </>
        }
      >
        <Image
          src={`/linear.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto mt-10 rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
