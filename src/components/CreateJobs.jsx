import { getMyJobs } from "@/api/apiJobs"
import useFetch from "@/hooks/useFetch"
import { useUser } from "@clerk/clerk-react"
import { useEffect } from "react"
import JobCards from "./JobCards"
import { BarLoader } from "react-spinners"

const CreateJobs = () => {
  const {isLoaded , user} = useUser()

  const {
    loading: loadingCreateJobs, 
    data: createJobs, 
    fn: fnCreateJobs
  } = useFetch(getMyJobs, { 
    recruiter_id: user.id
  })

  useEffect(() => { 
    if(isLoaded) fnCreateJobs();
  }, [isLoaded])

  if(loadingCreateJobs){ 
    return <BarLoader className="mb--4" width={"100%"} color="#36d7b7" />
  }


  return (
    <div>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {createJobs?.length ? (
          createJobs.map((job) => { 
            return ( 
              <JobCards
                key={job.id}
                job={job}
                onJobSaved={fnCreateJobs}
                isMyJob
              />
            )
          })
        ) : ( 
          <div>No Jobs Found</div>
        )}
      </div>
    </div>
  )
}

export default CreateJobs
