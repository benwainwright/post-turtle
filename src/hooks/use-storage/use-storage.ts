import { useEffect, useState } from "react";
import fs from "node:fs/promises";
import { exists } from "../../core/exists.js";

interface StorageLoading {
  loaded: false;
}

interface StorageLoaded<T> {
  loaded: true;
  content: T;

  update: (data: T) => Promise<void>;
}

export const useStorage = <T>(
  path: string
): StorageLoading | StorageLoaded<T> => {
  const [content, setContent] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      if (!content) {
        if (!(await exists(path))) {
          await fs.writeFile(path, "[]");
          setContent("[]");
          return;
        }
        const result = await fs.readFile(path, "utf8");
        setContent(result);
      }
    })();
  }, [content]);

  const update = async (data: T): Promise<void> => {
    const stringData = JSON.stringify(data, null, 2);
    setContent(stringData);
    await fs.writeFile(path, stringData);
  };

  if (content) {
    return {
      loaded: true,
      content: JSON.parse(content) as T,
      update,
    };
  }

  return { loaded: false };
};
