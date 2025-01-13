import { useState } from "react";
import { toast } from "sonner";

// Define a generic callback type that accepts arguments
type Callback<T, A extends unknown[]> = (...args: A) => Promise<T>;

const useFetch = <T, A extends unknown[]>(cb: Callback<T, A>) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: A) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      setData(response);
    } catch (err) {
      setError(err as Error);
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
