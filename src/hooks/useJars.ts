import { jarsService } from "@/services/jars";
import type { Jar } from "@/types";
import { useEffect, useState } from "react";

export function useJars() {
  const [isLoading, setIsLoading] = useState(false);
  const [jars, setJars] = useState<Jar[]>([]);

  const fetchJars = async () => {
    setIsLoading(true);
    try {
      const data = await jarsService.getJars();
      setJars(data);
    } catch (error) {
      console.error("[fetchJars] - cannot get the data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJars();
  }, []);

  return { jars, isLoading, refetch: fetchJars };
}
