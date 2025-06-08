import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";
import { Link } from "react-router-dom";
import companies from "../data/companies.json";
import Autoplay from "embla-carousel-autoplay";
import faqs from "../data/faq..json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title tracking-tighter py-4 sm:py-2 font-extrabold text-4xl sm:text-6xl lg:text-8xl">
          Find Your Dream Job{" "}
          <span className="flex gap-2 sm:gap-4">
            and get{" "}
            <img
              src="logo.png"
              alt="Hirrd Log0"
              className="h-14 sm:h-24 lg:h-32"
            />
          </span>
        </h1>

        <p className="text-gray-300 sm:mt-4 text-sm sm:text-xl">
          Explore thousands of job listings or find the perfect candidate
        </p>
      </section>

      <div className="flex gap-6 justify-center">
        <Link to="/joblisting">
          <Button variant="blue" size="xl">
            Find Jobs
          </Button>
        </Link>
        <Link to="/postjobs">
          <Button variant="destructive" size="xl">
            Post a Job
          </Button>
        </Link>
      </div>

      <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full pt-10">
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({ name, id, path }) => {
            return (
              <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain "
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      <img className="w-full" src="banner.jpeg" alt="banner" />
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for jobs , track application, and more
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post jobs application, and find the best candidates.
          </CardContent>
        </Card>
      </section>

      <Accordion type="single" collapsible>
        {faqs.map((faqs, index) => {
          return <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faqs.question}</AccordionTrigger>
            <AccordionContent>
              {faqs.answer}
            </AccordionContent>
          </AccordionItem>;
        })}
      </Accordion>
    </main>
  );
};

export default LandingPage;
