// Tiny class joiner to avoid pulling shadcn's cn into the pixap-web tree.
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}
