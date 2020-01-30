declare class PasswordValidator {
  public constructor();

  public is(): Assertion;
  public has(): Assertion;
  public validate(password: string): boolean;
  public validate(password: string, option: { list: false }): boolean;
  public validate(password: string, option: { list: true }): string[];
}

declare module 'password-validator' {
  export = PasswordValidator;
}

interface Assertion {
  digits(): Assertion;
  letters(): Assertion;
  lowercase(): Assertion;
  uppercase(): Assertion;
  symbols(): Assertion;
  spaces(): Assertion;
  min(len: number): Assertion;
  max(len: number): Assertion;
  oneOf(list: string[]): Assertion;
  is(): Assertion;
  has(): Assertion;
  not(): Assertion;
}
