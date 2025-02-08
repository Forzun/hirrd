import CreateApplicatons from '@/components/CreateApplicatons'
import CreateJobs from '@/components/CreateJobs'
import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { BarLoader } from 'react-spinners'

function MyJobs() {
  const {isLoaded , user} = useUser()

  if(!isLoaded){ 
    return <BarLoader className="mb--4" width={"100%"} color="#36d7b7" />
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>
        {user?.unsafeMetadata?.role === "candidate" ? "My Applicaton" : "My Jobs" }
      </h1>

      {user?.unsafeMetadata?.role === "candidate" ? (<CreateApplicatons />) : ( <CreateJobs />) }

    </div>
  )
}

export default MyJobs;