import { getJobs } from "@/api/apiJobs";
import useFetch from "../hooks/useFetch";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCards from "@/components/JobCards";
import { getCompanies } from "@/api/apiCompanies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, { searchQuery, location, company_id });

  const { fn:fnCompanies, data:companies } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, searchQuery, location, company_id]);

  const clearFilter = () => {  
    setCompany_id(""); 
    setLocation("");
  }

  if (!isLoaded) {
    return <BarLoader className="mb--4" width={"100%"} color="#36d7b7" />;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      <form
        onSubmit={handleSearch}
        className="h-14 flex items-center w-full gap-3"
      >
        <Input
          type="text"
          placeholder="Search Jobs by Title"
          name="search-query"
          className="h-full flex-1 p-4 text-md"
        />
        <Button variant="blue" type="submit" className="h-full sm:w-28">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2 mt-3" >
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter to location"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
             {State.getStatesOfCountry("IN").map(({name}) => {
               return <SelectItem key={name} value={name}>{name}</SelectItem>
             })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={company_id} onValueChange={(value) => setCompany_id(value)} >
          <SelectTrigger>
            <SelectValue placeholder="Filter to compan"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Array.isArray(companies) ? companies.map(({name , id}) => {
                 return <SelectItem key={name} value={id}>
                  {name}
                </SelectItem>
              }) : <p>Loading companies...</p>}
            </SelectGroup>
          </SelectContent>

          <Button onClick={clearFilter} variant="destructive" className="sm:w-1/2" >Clear Fitlers</Button>
        </Select>

      </div>

      {loadingJobs && (
        <BarLoader className="mb--4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job, index) => {
              return (
                <JobCards
                  key={index}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div>No Jobs Found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
