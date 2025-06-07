import { useFormik } from "formik";
import * as Yup from "yup";
import './buyTicket.css';


const ticketDescriptions = {
    "1day": [
        "Wstęp na 1 dzień festiwalu",
        "Dostęp do wszystkich scen",
        "Miejsca stojące"
    ],
    "3day": [
        "Wstęp na 3 dni festiwalu",
        "Dostęp do wszystkich scen",
        "Miejsca stojące",
        "Darmowe parkingi"
    ],
    "vip": [
        "Wstęp na 3 dni festiwalu",
        "Dostęp VIP do wszystkich scen",
        "Miejsca siedzące w strefie VIP",
        "Darmowe parkingi",
        "Darmowe napoje",
        "Backstage access"
    ]
};
const TicketDetails = ({ ticketType }) => {
    const features = ticketDescriptions[ticketType] || [];

    return (
        <div className="Tickes-details">
            <h2>Co zawiera bilet?</h2>
            <ul>
                {features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                ))}
            </ul>
            <h3>
                Cena: {

                    ticketType === "1day"
                        ? "10 PLN"
                        : ticketType === "3day"
                            ? "25 PLN"
                            : ticketType === "vip"
                                ? "60 PLN"
                                : "--"
                }
            </h3>
        </div>
    );
};

const paySchema = Yup.object().shape({
    name: Yup.string().required("Wymagane"),
    surname: Yup.string().required("Wymagane"),
    email: Yup.string().email("Nieprawidłowy email").required("Wymagane"),
    phone: Yup.string()
        .matches(/^[0-9]{9,15}$/, "Nieprawidłowy numer")
        .required("Wymagane"),
    ticketType: Yup.string()
        .required("Wybierz bilet")
        .notOneOf(["--"], "Wybierz bilet"),
    quantity: Yup.number()
        .min(1, "Minimum 1")
        .required("Wymagane"),
    payment: Yup.string().required("Wybierz metodę płatności"),

    // Conditional credit card fields
    cardNumber: Yup.string().when('payment', {
        is: 'credit',
        then: Yup.string()
            .matches(/^\d{16}$/, "Musi zawierać 16 cyfr")
            .required("Wymagane"),
        otherwise: Yup.string().notRequired()
    }),
    expiryDate: Yup.string().when('payment', {
        is: 'credit',
        then: Yup.string()
            .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Format MM/YY")
            .required("Wymagane"),
        otherwise: Yup.string().notRequired()
    }),
    cvv: Yup.string().when('payment', {
        is: 'credit',
        then: Yup.string()
            .matches(/^\d{3,4}$/, "3-4 cyfry")
            .required("Wymagane"),
        otherwise: Yup.string().notRequired()
    }),

    // BLIK field
    blikCode: Yup.string().when('payment', {
        is: 'blik',
        then: Yup.string()
            .matches(/^\d{6}$/, "6-cyfrowy kod")
            .required("Wymagane"),
        otherwise: Yup.string().notRequired()
    })
});

const PaymentForm = () => {
    const [submitStatus, setSubmitStatus] = useState({
        success: false,
        error: null,
        ticketId: null
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            surname: "",
            email: "",
            phone: "",
            ticketType: "",
            quantity: 1,
            payment: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            blikCode: ""
        },
        validationSchema: paySchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            setSubmitStatus({ success: false, error: null, ticketId: null });

            try {
                const response = await fetch(`https://soundon-spa.onrender.com/api/buy_ticket`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        ...values,
                        // Ensure quantity is a number
                        quantity: Number(values.quantity),
                        // Only include payment-specific fields
                        cardNumber: values.payment === 'credit' ? values.cardNumber : undefined,
                        expiryDate: values.payment === 'credit' ? values.expiryDate : undefined,
                        cvv: values.payment === 'credit' ? values.cvv : undefined,
                        blikCode: values.payment === 'blik' ? values.blikCode : undefined
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.message ||
                        errorData.error ||
                        `Server error: ${response.status} ${response.statusText}`
                    );
                }

                const data = await response.json();
                console.log("Server response:", data);

                setSubmitStatus({
                    success: true,
                    error: null,
                    ticketId: data.ticketId || data.id
                });

                resetForm();
            } catch (error) {
                console.error("Submission error:", error);
                setSubmitStatus({
                    success: false,
                    error: error.message || "Failed to process payment. Please try again.",
                    ticketId: null
                });
            } finally {
                setSubmitting(false);
            }
        },
    });
    return (
        <div className="payment-container">
            <TicketDetails ticketType={formik.values.ticketType} />
            <div className="form-wrapper">
                <form className="buy_ticket_form" onSubmit={formik.handleSubmit}>

                    <div className="two-cols">
                        <div className="form-group">
                            <label htmlFor="name">Imię</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.name && formik.errors.name ? "error" : ""}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className="error-message">{formik.errors.name}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="surname">Nazwisko</label>
                            <input
                                id="surname"
                                name="surname"
                                type="text"
                                value={formik.values.surname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.surname && formik.errors.surname ? "error" : ""}
                            />
                            {formik.touched.surname && formik.errors.surname && (
                                <div className="error-message">{formik.errors.surname}</div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={formik.touched.email && formik.errors.email ? "error" : ""}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className="error-message">{formik.errors.email}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Telefon</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={formik.touched.phone && formik.errors.phone ? "error" : ""}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                            <div className="error-message">{formik.errors.phone}</div>
                        )}
                    </div>

                    <div className="two-cols">
                        <div className="form-group">
                            <label htmlFor="ticketType">Typ biletu:</label>
                            <select
                                id="ticketType"
                                name="ticketType"
                                value={formik.values.ticketType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.ticketType && formik.errors.ticketType ? "error" : ""}
                            >
                                <option value="--">Wybierz bilet</option>
                                <option value="1day">Bilet jednodniowy</option>
                                <option value="3day">Bilet 3-dniowy</option>
                                <option value="vip">VIP Pass</option>

                            </select>
                            {formik.touched.ticketType && formik.errors.ticketType && (
                                <div className="error-message">{formik.errors.ticketType}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="quantity">Ilość biletów:</label>
                            <input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="1"
                                value={formik.values.quantity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.quantity && formik.errors.quantity ? "error" : ""}
                            />
                            {formik.touched.quantity && formik.errors.quantity && (
                                <div className="error-message">{formik.errors.quantity}</div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Forma płatności:</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="credit"
                                    checked={formik.values.payment === "credit"}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                Credit Card
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="blik"
                                    checked={formik.values.payment === "blik"}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                BLIK
                            </label>
                        </div>
                        {formik.touched.payment && formik.errors.payment && (
                            <div className="error-message">{formik.errors.payment}</div>
                        )}
                    </div>

                    {formik.values.payment === "credit" && (
                        <>
                            <div className="form-group">
                                <label htmlFor="cardNumber">Numer karty:</label>
                                <input
                                    id="cardNumber"
                                    name="cardNumber"
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    value={formik.values.cardNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                                        formik.setFieldValue('cardNumber', value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    maxLength={16}
                                    className={formik.touched.cardNumber && formik.errors.cardNumber ? "error" : ""}
                                />
                                {formik.touched.cardNumber && formik.errors.cardNumber && (
                                    <div className="error-message">{formik.errors.cardNumber}</div>
                                )}
                            </div>

                            <div className="two-cols">
                                <div className="form-group">
                                    <label htmlFor="expiryDate">Data ważności:</label>
                                    <input
                                        id="expiryDate"
                                        name="expiryDate"
                                        type="text"
                                        placeholder="MM/YY"
                                        value={formik.values.expiryDate}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/\D/g, '');
                                            if (value.length > 2) {
                                                value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                            }
                                            formik.setFieldValue('expiryDate', value);
                                        }}
                                        onBlur={formik.handleBlur}
                                        maxLength={5}
                                        className={formik.touched.expiryDate && formik.errors.expiryDate ? "error" : ""}
                                    />
                                    {formik.touched.expiryDate && formik.errors.expiryDate && (
                                        <div className="error-message">{formik.errors.expiryDate}</div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cvv">CVV:</label>
                                    <input
                                        id="cvv"
                                        name="cvv"
                                        type="text"
                                        placeholder="123"
                                        value={formik.values.cvv}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            formik.setFieldValue('cvv', value);
                                        }}
                                        onBlur={formik.handleBlur}
                                        maxLength={4}
                                        className={formik.touched.cvv && formik.errors.cvv ? "error" : ""}
                                    />
                                    {formik.touched.cvv && formik.errors.cvv && (
                                        <div className="error-message">{formik.errors.cvv}</div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    {formik.values.payment === "blik" && (
                        <div className="form-group">
                            <label htmlFor="blikCode">Kod BLIK:</label>
                            <input
                                id="blikCode"
                                name="blikCode"
                                type="text"
                                placeholder="6-cyfrowy kod"
                                value={formik.values.blikCode}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    formik.setFieldValue('blikCode', value);
                                }}
                                onBlur={formik.handleBlur}
                                maxLength={6}
                                className={formik.touched.blikCode && formik.errors.blikCode ? "error" : ""}
                            />
                            {formik.touched.blikCode && formik.errors.blikCode && (
                                <div className="error-message">{formik.errors.blikCode}</div>
                            )}
                            <p className="blik-hint">Otwórz aplikację bankową i wprowadź powyższy kod</p>
                        </div>
                    )}
                    <h2 className="submit-line">Potwierdzenie zakupu</h2>
                    <div className="form-footer">
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="band-form-button"
                        >
                            {formik.isSubmitting ? "Przetwarzanie..." : "Kup bilet"}
                        </button>
                    </div>
                    {submitStatus.error && (
                        <div className="alert alert-danger">
                            {submitStatus.error}
                        </div>
                    )}

                    {submitStatus.success && (
                        <div className="alert alert-success">
                            Payment successful! Your ticket ID: {submitStatus.ticketId}
                        </div>
                    )}

                </form>
            </div>


        </div>
    );
};

export default PaymentForm;

