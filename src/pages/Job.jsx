import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import {
  Briefcase,
  CodeSquare,
  DoorClosed,
  DoorOpen,
  MapPinIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // ✅ Fix: Use shadcn/ui Select
import ApplyJob from "@/components/ApplyJob";
import ApplicatonCard from "@/components/ApplicatonCard";

const Job = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, { job_id: id });
  console.log(job);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    { job_id: id }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  if (!isLoaded) {
    return <BarLoader className="mb--4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-bold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {job ? job.location : null}
        </div>
        <div className="flex gap-2">
          <Briefcase /> {job?.applications?.length} Applications
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen /> Open{" "}
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>

      <div clPssName="w-full">
        {job?.recruiter_id === user?.id && (
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger
              className={`w-full ${
                job?.isOpen ? "bg-green-950" : "bg-red-950"
              }`}
            >
              <SelectValue
                placeholder={
                  "Hiring status" + (job?.isOpen ? "(Open)" : "(Closed)")
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bol">What we looking for</h2>

      <MDEditor.Markdown
        source={job?.requirement}
        className="bg-transparent sm:text-lg"
      />
 
      {job?.recruiter_id !== user?.id && (
        <ApplyJob 
          job={job}
          user={user}
          fetchJob={fnJob} 
          applied={job?.applications.find((value) => value.candidate_id === user.id)}
          />
      )}
 
    {job?.applications?.length > 0 && job?.recruiter_id === user?.id && ( 
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
        {job.applications.map((application) => { 
          return <ApplicatonCard key={application.id} application={application} />
        })}
      </div>
    )}

    </div>
  );
};

export default Job;
