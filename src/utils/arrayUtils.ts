export type NonEmptyStringArray = NonEmptyArray<string>;

type LastElement<A extends unknown[]> =
  A extends NonEmptyArray<infer T> ? T : A extends (infer T)[] ? T | undefined : never;

export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Returns the last element of the array. Typed so that if we know we're passing a non-empty array,
 * then we know the return value is not undefined.
 */
export function getLastElement<A extends unknown[]>(arr: A): LastElement<A> {
  const lastElement = arr[arr.length - 1];
  return lastElement as LastElement<A>;
}

export function isNonEmptyArray<T>(arr: readonly T[]): arr is NonEmptyArray<T> {
  return arr.length > 0;
}

export function filterOutElements<T>(arr: readonly T[], elementsToFilterOut: Set<T>): T[] {
  return arr.filter((element) => !elementsToFilterOut.has(element));
}
