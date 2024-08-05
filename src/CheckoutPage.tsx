import {loadTossPayments, TossPaymentsWidgets} from "@tosspayments/tosspayments-sdk";
import React, {useEffect, useState} from "react";

const clientKey: string | undefined = `${process.env.REACT_APP_CLIENT_KEY}`
const customerKey: string | undefined = `${process.env.REACt_APP_CUSTOMER_KEY}`

const CheckoutPage = () => {
    const [amount, setAmount] = useState({
        currency: "KRW",
        value: 10_000,
    });
    const [ready, setReady] = useState(false);
    const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);

    useEffect(() => {
        async function fetchPaymentWidgets() {
            // ------  결제위젯 초기화 ------
            if (clientKey && customerKey) {
                const tossPayments = await loadTossPayments(clientKey);
                // 회원 결제
                const widgets = tossPayments.widgets({
                    customerKey,
                });
                // 비회원 결제
                // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

                setWidgets(widgets);
            }
        }

        fetchPaymentWidgets();
    }, [clientKey, customerKey]);

    useEffect(() => {
        async function renderPaymentWidgets() {
            if (widgets == null) {
                return;
            }
            // ------ 주문의 결제 금액 설정 ------
            await widgets.setAmount(amount);

            await Promise.all([
                // ------  결제 UI 렌더링 ------
                widgets.renderPaymentMethods({
                    selector: "#payment-method",
                    variantKey: "DEFAULT",
                }),
                // ------  이용약관 UI 렌더링 ------
                widgets.renderAgreement({
                    selector: "#agreement",
                    variantKey: "AGREEMENT",
                }),
            ]);

            setReady(true);
        }

        renderPaymentWidgets();
    }, [widgets]);

    useEffect(() => {
        if (widgets == null) {
            return;
        }

        widgets.setAmount(amount);
    }, [widgets, amount]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount((prevAmount) => ({
            ...prevAmount,
            value: event.target.checked ? prevAmount.value - 5_000 : prevAmount.value + 5_000
        }))
    }

    const handleClick = async () => {
        try {
            // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
            // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
            // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
            if (widgets) {
                await widgets.requestPayment({
                    orderId: "noIDiyHqeaSFbYcLDKhGE",
                    orderName: "토스 티셔츠 외 2건",
                    successUrl: window.location.origin + "/success",
                    failUrl: window.location.origin + "/fail",
                    customerEmail: "customer123@gmail.com",
                    customerName: "김토스",
                    customerMobilePhone: "01012341234",
                });
            }
        } catch (error) {
            // 에러 처리하기
            console.error(error);
        }
    }
    return (
        <div className="wrapper">
            <div className="box_section">
                {/* 결제 UI */}
                <div id="payment-method"/>
                {/* 이용약관 UI */}
                <div id="agreement"/>
                {/* 쿠폰 체크박스 */}
                <div>
                    <div>
                        <label htmlFor="coupon-box">
                            <input
                                id="coupon-box"
                                type="checkbox"
                                aria-checked="true"
                                disabled={!ready}
                                onChange={handleChange}
                            />
                            <span>5,000원 쿠폰 적용</span>
                        </label>
                    </div>
                </div>

                {/* 결제하기 버튼 */}
                <button
                    className="button"
                    disabled={!ready}
                    onClick={handleClick}
                >
                    결제하기
                </button>
            </div>
        </div>
    );
}

export default CheckoutPage;