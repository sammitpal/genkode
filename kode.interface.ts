export type CodeType = "alpha" | "numeric" | "alphanumeric";
export type CodeCase = "upper" | "lower";

export interface GenerateOptions {
  length: number;
  type?: CodeType;
  secure?: boolean;
  prefix?: string;
  suffix?: string;
  count?: number;
  shortId?: boolean;
  unique?: boolean;
  case?: CodeCase;
}

export class KodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KodeError";
  }
}