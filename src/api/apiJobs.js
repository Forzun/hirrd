import supabaseClient from "@/utils/supabase";
import { createClient } from "@supabase/supabase-js";
import { CodeSquare } from "lucide-react";
import { useActionState } from "react";


export async function getJobs(token , {location , company_id , searchQuery}){ 
    const supabse = await supabaseClient(token);

    let query = supabse.from("jobs").select("*, company:companies(name, logo_url), saved:saved_jobs(id)");

    if(location){
        query = query.eq("location", location);
    }

    if(company_id){ 
        query = query.eq("company_id", company_id);
    }
    
    if(searchQuery){
        query = query.ilike("title" , `%${searchQuery}%`)
    }

    const {data , error} = await query;

    if(error){ 
        console.log(error.error)
        return null;
    }

    return data;    
}

export async function saveJob(token, {alreadySaved}, saveData) { 
    const supabase = await supabaseClient(token);
    console.log(saveData)

    if (alreadySaved) { 
        const { data, error: deleteError } = await supabase
            .from("saved_jobs")
            .delete()
            .eq("job_id", saveData.job_id)

        if (deleteError) { 
            console.error("Error Deleting Saved Job:", deleteError);
            return null;
        }
        
        return data;
    } else { 
        const { data, error: insertError } = await supabase
            .from("saved_jobs")
            .insert([saveData]) // Removed .select("*")
            .select(); // Optional

        if (insertError) { 
            console.error("Error saving job:", insertError); 
            return null;
        }
        
        return data;
    }
}

export async function getSingleJob(token , {job_id} ) { 
    const supabase = await supabaseClient(token)

    const {data , error} = await supabase
    .from("jobs")
    .select("* , company:companies(name, logo_url), applications:applications(*)")
    .eq("id", job_id)
    .single()

    if(error){ 
        console.error("Error Fetching Job" , error); 
        return null;
    }

    return data;
}

export async function updateHiringStatus(token , {job_id} , isOpen) { 
    const supabase = await supabaseClient(token)

    const { data , error} = await supabase 
    .from("jobs")
    .update({isOpen})
    .eq("id" , job_id)
    .select();

    if(error){ 
        console.error("Error Updating job", error);
        return null;
    }
    return data;
}

export async function getSavedJobs(token){
    const supabase = await supabaseClient(token);

    const {data , error} = await supabase
    .from("saved_jobs")
    .select("* , job:jobs(* , company:companies(name , logo_url))");

    if(error){ 
        console.error("Error saving jobs",error);
        return null;
    }

    return data;
}


export async function getMyJobs(token , {recruiter_id}) { 
    const supabase = await supabaseClient(token); 

    const {data , error} = await supabase
    .from("jobs")
    .select("* , company:companies(name , logo_url)")
    .eq("recruiter_id" , recruiter_id)

    if(error){
        console.error("Error Fetching jobs", error);
    }
    
    return data;
}

export async function deleteJob(token ,{ job_id }){
    const supabase = await supabaseClient(token); 

    const {data , error} = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select()

    if(error){ 
        console.error("Error Deletilng Jobs", error); 
        return null;
    }

    return data;
}


