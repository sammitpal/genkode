export type CodeType = "alpha" | "numeric" | "alphanumeric";

export interface GenerateOptions {
  length: number;
  type?: CodeType;
  secure?: boolean;
}