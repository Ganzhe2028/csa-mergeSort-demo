export const MERGE_SORT_PSEUDO_CODE = [
  "function mergeSort(arr):",               // 0
  "  if length of arr <= 1:",               // 1
  "    return arr",                         // 2
  "  mid = floor(length / 2)",              // 3
  "  left = mergeSort(arr[0...mid])",       // 4
  "  right = mergeSort(arr[mid...end])",    // 5
  "  return merge(left, right)",            // 6
  "",                                       // 7
  "function merge(left, right):",           // 8
  "  result = []",                          // 9
  "  while left and right not empty:",      // 10
  "    if left[0] <= right[0]:",            // 11
  "      append left[0] to result",         // 12
  "    else:",                              // 13
  "      append right[0] to result",        // 14
  "  append remaining items",               // 15
  "  return result"                         // 16
];
