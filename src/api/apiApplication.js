import supabaseClient, { supabaseUrl } from "@/utils/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export async function applyToJob(token , _, jobData){ 
    const supabase = await supabaseClient(token);

    const random = Math.floor(Math.random() * 90000);
    
    const fileName = `resume-${random}-${jobData.candidate_id}`

    const {error:StorageError} = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume)

    if(StorageError){ 
        console.error("Error file uploading resume")
    }

    const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`

    const {error , data} = await supabase
    .from("applications")
    .insert([
        {
            ...jobData, 
            resume
        }
    ]).select()

    if(error){ 
        console.error("Error submitting application")
    }
}


export async function updateApplications(token , {job_id}, status){ 
    const supabase = await supabaseClient(token); 

    const {data , error} = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select() 


    if(error || data.length === 0){ 
        console.error("error update applications status:", error);
    }

}

export async function addNewJob(token , _, jobData){
    const supabase = await supabaseClient(token); 

    const {error , data} = await supabase 
    .from("jobs")
    .insert([jobData])
    .select()

    if(error){
        console.error("error inserting data in jobs:" , error);
    }
} 

export async function addNewCompany(token , _, companyData){ 
    const supabase = await supabaseClient(token); 

    const random = Math.floor(Math.random() * 90000);
    const fileName = `logo-${random}-${companyData.name}`;

    const {error:companyError} = await supabase.storage
    .from("company-logo")
    .upload(fileName , companyData.logo)

    if(companyError){ 
        console.error("Error uploading company", companyError);
    }

    const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

   const {data  , error} = await supabase
   .from("companies")
   .insert([{
    name:companyData.name,
    logo_url
   }])
   .select()

   if(error){ 
        console.error("Error submitting company", error)
        return null;
   } 
}


export async function getApplications(token , {user_id}){ 
    const supabase = await supabaseClient(token); 
    
    const {data , error} = await supabase
    .from("applications")
    .select("* , job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

    if(error){
        console.error("Error Fetching applications"); 
        return null;
    }

    return data;
}
