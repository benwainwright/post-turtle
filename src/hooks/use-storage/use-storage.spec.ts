import { mkdtemp, rmdir } from "fs/promises";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useStorage } from "./use-storage.js";
import { join } from "node:path";
import fs from "fs/promises";
import os from "os";
import { HttpRequest } from "../../types/http-request.js";

let path: string | undefined;

beforeEach(async () => {
  path = await mkdtemp(join(os.tmpdir(), "use-storage-test-"));
});

afterEach(async () => {
  if (path) {
    await rmdir(path, { recursive: true });
  }
});

describe("useStorage", () => {
  it("returns an empty array if the file doesn't exist", async () => {
    const { result } = renderHook(() => useStorage(`${path}/requests.json`));

    await waitFor(() => expect(result.current.loaded).toBeTruthy());
  });

  it("Creates the empty file if it doesn't exist", async () => {
    renderHook(() => useStorage(`${path}/requests.json`));
    expect(path).toBeDefined();
    await waitFor(async () => {
      if (path) {
        const result = await fs.readFile(`${path}/requests.json`, `utf8`);
        expect(JSON.parse(result)).toStrictEqual([]);
      }
    });
  });

  it("Calling the update method results in the file being updated and the updated data being returned from the hook", async () => {
    const data = `[
  {
    "id": "39f45798-94fd-4a79-b9d5-164aaeddb412",
    "title": "Check Google",
    "slug": "google",
    "method": "GET",
    "host": "http://www.google.com",
    "path": "foo/bar",
    "headers": {
      "0fd6256b-da98-4e46-bc5e-36785528ed7a": {
        "key": "content-type",
        "value": "application/json"
      }
    }
  },
  {
    "id": "cf512f76-74da-446b-8764-1f6ba09cb356",
    "title": "Random dog facts",
    "slug": "dog-facts",
    "method": "GET",
    "host": "https://dog-facts-api.herokuapp.com",
    "path": "api/v1/resources/dogs/all"
  }
]`;

    await fs.writeFile(`${path}/requests.json`, data);

    const { result } = renderHook(() =>
      useStorage<HttpRequest[]>(`${path}/requests.json`)
    );

    await waitFor(() => {
      expect(result.current.loaded).toBeTruthy();
    });

    if (result.current.loaded) {
      const dataParsed = JSON.parse(data) as HttpRequest[];
      dataParsed[1].title = "Random cat facts";
      await act(async () => {
        if (result.current.loaded) {
          await result.current.update(dataParsed);
        }
      });

      await waitFor(async () => {
        expect(result.current.loaded).toBeTruthy();
        if (result.current.loaded) {
          expect(result.current.content).toStrictEqual(dataParsed);
        }
        const fileContents = await fs.readFile(`${path}/requests.json`, `utf8`);
        expect(JSON.parse(fileContents)).toStrictEqual(dataParsed);
      });
    }
  });

  it("Loads data from disk", async () => {
    const data = `[
  {
    "id": "39f45798-94fd-4a79-b9d5-164aaeddb412",
    "title": "Check Google",
    "slug": "google",
    "method": "GET",
    "host": "http://www.google.com",
    "path": "foo/bar",
    "headers": {
      "0fd6256b-da98-4e46-bc5e-36785528ed7a": {
        "key": "content-type",
        "value": "application/json"
      }
    }
  },
  {
    "id": "cf512f76-74da-446b-8764-1f6ba09cb356",
    "title": "Random dog facts",
    "slug": "dog-facts",
    "method": "GET",
    "host": "https://dog-facts-api.herokuapp.com",
    "path": "api/v1/resources/dogs/all"
  }
]`;

    await fs.writeFile(`${path}/requests.json`, data);

    const { result } = renderHook(() => useStorage(`${path}/requests.json`));
    await waitFor(async () => {
      expect(result.current.loaded).toBeTruthy();
      if (result.current.loaded) {
        expect(result.current.content).toStrictEqual(JSON.parse(data));
      }
    });
  });
});
