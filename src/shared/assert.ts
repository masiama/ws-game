type AssertType = (cond: boolean, message: string) => asserts cond;

export const assert: AssertType = (cond: boolean, message: string) => {
  if (!cond) {
    throw new Error(message);
  }
};
