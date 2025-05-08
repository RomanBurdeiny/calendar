import { useRef, useEffect, useState } from "react";
import { addDays } from "date-fns";

export const useInfiniteScroll = (
  dates: Date[],
  setDates: React.Dispatch<React.SetStateAction<Date[]>>
) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          setIsLoading(true);
          const lastDate = dates[dates.length - 1];
          const newDates = Array.from({ length: 7 }, (_, i) => addDays(lastDate, i + 1));
          setDates(prev => [...prev, ...newDates]);
          setTimeout(() => setIsLoading(false), 100);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    const ref = loaderRef.current;
    if (ref) observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [dates, isLoading, setDates]);

  return { loaderRef };
};
