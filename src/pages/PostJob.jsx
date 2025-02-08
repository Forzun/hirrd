import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { State } from 'country-state-city'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import useFetch from '@/hooks/useFetch'
import { getCompanies } from '@/api/apiCompanies'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners'
import { Navigate, useNavigate } from 'react-router-dom'
import { fileURLToPath } from 'url'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button'
import { addNewJob } from '@/api/apiApplication'
import AddCompanyDrawer from '@/components/AddCompanyDrawer'

import { Input } from '@/components/ui/input'
const schema = z.object({ 
  title: z.string().min(1, {message:"Title is required"}),
  description: z.string().min(1,{message:"Description is required"}),
  location: z.string().min(1, {message:"Select a location"}), 
  company_id: z.string().min(1, {message: "Select or add new company"}), 
  requirement: z.string().min(1 , {message:"Requirements are required"})

})

const PostJob = () => {

  const {isLoaded , user} = useUser()
  const navigate = useNavigate();

  const {register ,control , handleSubmit , formState:{errors}} =  useForm({
    defaultValues:{
      location:"", 
      company_id:"", 
      requirement:""
    },
    resolver: zodResolver(schema)
  })

  const {fn: fnCompanies , data: companies , loading: loadingCompanies} = useFetch(getCompanies);

  if(user?.unsafeMetadata?.role !== "recuriter"){
    return <Navigate to="/joblisting" />
  }

  useEffect(() => { 
    if(isLoaded) fnCompanies();
  }, [isLoaded])

  const {
    loading: loadingCreateJob, 
    error: errorCreateJob, 
    data: dataCreateJob, 
    fn: fnCreateJob,
  } = useFetch(addNewJob)

  const onSubmit = (data) => { 
    fnCreateJob({
      ...data,
      recruiter_id: user.id, 
      isOpen: true,
    })
  }

 useEffect(() => { 
  if (loadingCreateJob) {
    navigate("/joblisting");
}
 },[loadingCreateJob])

  if(!isLoaded || loadingCompanies){
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7'  />
  }

  return (
    <div >
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>Post a Job</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 p-4 pb-0'>
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className='text-red-500'>{errors.title.message}</p> }

      <Textarea placeholder='Job Description' {...register("description")} />
      {errors.description && <p className='text-red-500'>{errors.description.message}</p> }

    <div className='flex gap-4 items-center'>

      <Controller
        name='location'
        control={control}
        render={({field}) => (
          <Select value={field.value} onValueChange={field.onChange} >
          <SelectTrigger>
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({name}) => {
                return <SelectItem key={name} value={name} >{name}</SelectItem>
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        )}
      />

      <Controller
        name='company_id'
        control={control}
        render={({field}) => { 
          return <Select value={field.value} onValueChange={field.onChange} > 
          <SelectTrigger> 
            <SelectValue placeholder="Select company" >
              {field.value ? companies?.find((com) => com.id === Number(field.value))?.name : "Company"}
            </SelectValue>
          </SelectTrigger> 
          <SelectContent>
            <SelectGroup>
              {companies?.map(({name , id}) => { 
                return <SelectItem key={name} value={String(id)} >{name}</SelectItem>
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        }}
      />

        <AddCompanyDrawer fetchCompanies={fnCompanies} /> 

      </div>
      {errors.location && ( 
        <p className='text-red-500'>{errors.location.message}</p>
      )}
      {errors.company_id && (
        <p className='text-red-500'>{errors.company_id.message}</p>
      )}

      <Controller 
        name="requirement"
        control={control}
        render={({field}) => {
          return <MDEditor value={field.value || "" } onChange={field.onChange} />
        }}
      />  

      {errors.requirement && (
        <p className='text-red-500'>{errors.requirement.message}</p>
      )}

      <Button type="submit" variant="blue" size="lg" className="mt-2" >
        Submit
      </Button>

      {errorCreateJob?.message && (
        <p className='text-red-500'>{errorCreateJob?.message}</p>
      )}
      
      {loadingCreateJob && <BarLoader className="mb--4" width={"100%"} color="#36d7b7" />}

      </form>
    </div>
  )
}

export default PostJob
