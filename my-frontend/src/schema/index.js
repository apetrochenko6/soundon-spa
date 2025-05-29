// paySchema.js
import * as yup from "yup";

export const paySchema = yup.object({
  name: yup
    .string()
    .required("Imię jest wymagane"),
  surname: yup
    .string()
    .required("Nazwisko jest wymagane"),
  email: yup
    .string()
    .email("Niepoprawny email")
    .required("Email jest wymagany"),
  phone: yup
    .string()
    .matches(/^\d{9}$/, "Numer telefonu musi mieć 9 cyfr")
    .required("Telefon jest wymagany"),
  ticketType: yup
    .string()
    .required("Wybierz typ biletu"),
  quantity: yup
    .number()
    .min(1, "Minimum 1 bilet")
    .max(10, "Maksymalnie 10 biletów")
    .required("Wpisz ilość biletów"),
  payment: yup
    .string()
    .required("Wybierz metodę płatności"),
  cardNumber: yup
    .string()
    .when("payment", {
      is: "card",
      then: yup
        .string()
        .required("Numer karty jest wymagany")
        .matches(/^\d{4} ?\d{4} ?\d{4} ?\d{4}$/, "Nieprawidłowy numer karty"),
    }),
  expiryDate: yup
  .string()
  .required("Data ważności jest wymagana")
  .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Użyj formatu MM/YY")
  .test("is-future-date", "Karta jest przeterminowana", (value) => {
    if (!value) return false;

    const [mm, yy] = value.split("/").map((v) => parseInt(v, 10));
    if (isNaN(mm) || isNaN(yy)) return false;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100;

    return yy > currentYear || (yy === currentYear && mm >= currentMonth);
  }),
  cvv: yup
    .string()
    .when("payment", {
      is: "card",
      then: yup
        .string()
        .required("CVV jest wymagany")
        .matches(/^\d{3,4}$/, "Nieprawidłowy kod CVV"),
    }),
});
