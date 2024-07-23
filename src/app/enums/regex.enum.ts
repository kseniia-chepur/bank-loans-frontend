export enum Regex {
  PASSWORD = '^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$',
  PHONE_NUMBER = '^\\+380[0-9]{9}$',
}
