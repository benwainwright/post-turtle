import isEqual from "lodash/isEqual.js";
import { useEffect, useRef } from "react";

function deepCompareEquals<T>(a: T, b: T) {
  return isEqual(a, b);
}

function useDeepCompareMemoize<T>(value: T) {
  const ref = useRef<T>();

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export const useDeepCompareEffect = (
  callback: () => void,
  dependencies: unknown[]
) => {
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
};
