import { useSession } from '@clerk/clerk-react'
import { useState } from 'react';

const useFetch = (callbackFun , options = {}) => { 
    const [data , setData] = useState(undefined); 
    const [loading  , setLoading] = useState(null); 
    const [error , setError] = useState(null);

    const {session} = useSession() 

    const fn = async (...args) => { 
        setLoading(true);
        setError(null);

        try {
            const supabaseAccessToken = await session.getToken({ 
                template: "supabase"
            })
            
            const response = await callbackFun(supabaseAccessToken , options , ...args); 
            console.log(response)
            setData(response);
            setError(null);
            
        } catch (error) {
            setError(error.error)
        }finally{ 
            setLoading(false)
        }
    }
    
    
    return {fn , data , loading , error}
}

export default useFetch;