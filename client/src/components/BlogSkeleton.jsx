import React from 'react'

const BlogSkeleton = () => {
   return (
    <div className="flex w-full max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-sm p-4 mb-4 animate-pulse">
       
      <div className="w-[100px] h-[100px] bg-gray-300 rounded-md flex-shrink-0" />

     
      <div className="ml-4 flex flex-col justify-center flex-1 space-y-2">
        <div className="h-5 bg-gray-300 rounded w-1/2" /> 
        <div className="h-4 bg-gray-200 rounded w-full" />  
        <div className="h-4 bg-gray-200 rounded w-5/6" />  
        <div className="h-4 bg-gray-200 rounded w-1/3" />  
      </div>
    </div>
  );
}

export default BlogSkeleton