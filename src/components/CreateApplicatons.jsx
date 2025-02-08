import { getApplications } from '@/api/apiApplication'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import ApplicatonCard from './ApplicatonCard'

const CreateApplicatons = () => {

    const {isLoaded , user} = useUser()

   const {
    loading: loadingApplication, 
    data: applications, 
    fn: fnApplications
   } = useFetch(getApplications , { 
    user_id: user.id
   })

   useEffect(() => { 
    if(isLoaded) fnApplications();
   },[isLoaded])

   if(!isLoaded){
    return <BarLoader className="mb--4" width={"100%"} color="#36d7b7" />
   }

  return (
    <div className='flex flex-col gap-2'>
      {applications?.map((applications) => { 
        return ( 
            <ApplicatonCard key={applications.id} application={applications} isCandidate />
        )
      })}
    </div>
  )
}

export default CreateApplicatons
