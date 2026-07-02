
"use client"
import { addEventListeners, removeEventListeners} from "@/lib/utils";
import { useEffect, useState } from "react";


const useIdelTimeOut = (func: () => void) => {

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
      const createTimeout1 = () =>
        setTimeout(
          () => {
            setIsOpen(true);
          },
          1000 * 60 * 60,
        );

      const createTimeout2 = () =>
        setTimeout(
          () => {
            func();
          },
          1000 * 60 * 3,
        );

      const listener = () => {
        if (!isOpen) {
          clearTimeout(timeout);
          timeout = createTimeout1();
        }
      };

      let timeout = isOpen ? createTimeout2() : createTimeout1();
      addEventListeners(listener);

      return () => {
        removeEventListeners(listener);
        clearTimeout(timeout);
      };
  }, [isOpen]);

  return { isOpen, setIsOpen } as const;
};

export default useIdelTimeOut;

