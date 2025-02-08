import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react'
import { CodeSquare } from 'lucide-react';
import { useEffect, useInsertionEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BarLoader } from "react-spinners";

const Onboarding = () => {  
  const {user , isLoaded} = useUser()
  const navigate = useNavigate()

  const handleRoleSelection = async (role) => { 
    await user.update({
      unsafeMetadata:{role}
    }).then(() => { 
      navigate(role === "recuriter" ? "/postjobs" : "/" )
    }).catch((error) => { 
      console.log(error.error);
    })
  }

  useEffect(() => { 
    if(user?.unsafeMetadata?.role){
      navigate(
        user?.unsafeMetadata?.role === "recuriter" ? "/postjobs" : "/"
      )   
    }
  }, [user])

  if(!isLoaded){
    return <BarLoader className='mb-14' width={"100%"} color='#36d7b7' />
  }

  return (
    <div className='flex flex-col items-center justify-center mt-32'>
      <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter'>I am a..</h2>
      <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
        <Button onClick={() => handleRoleSelection("candidate")} className="h-36 text-2xl" variant="blue">
          Candidate
        </Button>
        <Button onClick={() => handleRoleSelection("recuriter")} className="h-36 text-2xl" variant="destructive">
          recruiter 
        </Button>
      </div>
    </div>
  )
}

export default Onboarding;