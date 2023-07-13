export function shuffle(arr: any[]) {
  return arr.sort(function() {
    return 0.5 - Math.random();
  });
}
