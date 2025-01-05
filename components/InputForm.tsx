"use client";
import { useState } from "react";

const InputForm = () => {
  const [url, setUrl] = useState("");

  const handleChange = (url: string) => {
    setUrl(url);
  };

  const submit = async () => {
    console.log(url);
    const result = await fetch('/api', {
      method: 'POST',
      body: JSON.stringify({
        siteUrl: url
      })
    }).then(r => r.json())
    console.log(result)
  };

  return (
    <>
      <input
        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
        placeholder="url"
        onChange={(evt) => handleChange(evt.currentTarget.value)}
      />
      <button
        onClick={submit}
        className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
      >
        crawl
      </button>
    </>
  );
};

export default InputForm;
