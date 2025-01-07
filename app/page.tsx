"use client";
import { useState } from "react";
import InputForm from "../components/InputForm";
import Graph from "@/components/Graph";

export default function Home() {
  const [graphInput, setGraphInput] = useState<GraphInput | null>(null);

  return (
    <div className="flex flex-row min-h-screen justify-center items-center">
      <main className="">
        {graphInput ? (
          <Graph graphData={graphInput} />
        ) : (
          <InputForm
            returnGraphInput={(input: GraphInput) => setGraphInput(input)}
          />
        )}
      </main>
    </div>
  );
}
