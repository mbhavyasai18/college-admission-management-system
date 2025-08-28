import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import './FeeDetails.css';

// --- Receipt Modal ---
const ReceiptModal = ({ receipt, onClose, studentId }) => {
    if (!receipt) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="receipt-header">
                    <h2>Payment Receipt</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="receipt-body">
                    <div className="receipt-item"><span>Receipt ID:</span> <strong>{receipt.feeID}</strong></div>
                    <div className="receipt-item"><span>Student ID:</span> {studentId}</div>
                    <div className="receipt-item"><span>Payment Date:</span> {receipt.paymentDate}</div>
                    <div className="receipt-item"><span>Installment No:</span> #{receipt.installmentNo}</div>
                    <hr className="receipt-divider" />
                    <div className="receipt-total"><span>Amount Paid:</span><strong>₹{receipt.paidAmount.toLocaleString('en-IN')}</strong></div>
                </div>
                <div className="receipt-footer"><p>Thank you for your payment!</p></div>
            </div>
        </div>
    );
};

// --- Payment Modal (Floating Label) ---
const PaymentModal = ({ installment, onClose, onSubmit, studentId }) => {
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!installment) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const paymentData = {
            studentID: studentId,
            paidAmount: parseInt(amount || '0', 10),
            installmentNo: installment.installmentNo
        };
        await onSubmit(paymentData);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content payment-modal-content" onClick={e => e.stopPropagation()}>
                <div className="receipt-header">
                    <h2>Pay Installment #{installment.installmentNo}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="payment-form">
                    <p>Enter the amount you wish to pay for this installment.</p>

                    <div className="fl-group">
                        <input
                            type="number"
                            id="amount-input"
                            className="fl-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder=" "  /* placeholder is required for floating label */
                            min="1"
                            step="1"
                            required
                            inputMode="numeric"
                        />
                        <label htmlFor="amount-input" className="fl-label">Amount (₹)</label>
                    </div>

                    <button type="submit" className="pay-now-btn" disabled={isSubmitting || !amount}>
                        {isSubmitting ? 'Processing...' : 'Submit Payment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Main FeeDetails Component ---
const FeeDetails = () => {
    const [feeSummary, setFeeSummary] = useState(null);
    const [admissionStatus, setAdmissionStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [installmentToPay, setInstallmentToPay] = useState(null);

    const studentId = localStorage.getItem('userId');

    const fetchFeeData = async () => {
        if (!studentId) {
            setError("Could not find student ID. Please log in again.");
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const [feesRes, admissionRes] = await Promise.all([
                apiClient.get(`/api/fees/${studentId}`),
                apiClient.get(`/api/admissions/${studentId}`)
            ]);
            setFeeSummary(feesRes.data);
            setAdmissionStatus(admissionRes.data);
        } catch (err) {
            setError('Failed to load fee details. Please check back later.');
            console.error("Fee details fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFeeData(); }, [studentId]);

    const handleViewReceipt = (installment) => setSelectedReceipt(installment);
    const handlePayNow = (installment) => setInstallmentToPay(installment);

    const handlePaymentSubmit = async (paymentData) => {
        try {
            await apiClient.post('/api/fees/pay', paymentData);
            fetchFeeData();
        } catch (err) {
            console.error("Payment submission error:", err);
            setError("Payment failed. Please try again.");
        }
    };

    if (loading) return <div className="fees-container"><p>Loading fee details...</p></div>;
    if (error) return <div className="fees-container"><p style={{ color: 'orange', fontWeight: 'bold' }}>{error}</p></div>;
    if (!feeSummary || !admissionStatus) return <div className="fees-container"><p>No fee or admission details found for this student.</p></div>;

    const totalCourseFees = feeSummary.totalPaid + feeSummary.totalDue;
    const concessionAmount = admissionStatus.concession || 0;
    const netPayable = totalCourseFees - concessionAmount;
    const remainingBalance = netPayable - feeSummary.totalPaid;

    const nextInstallmentNumber = feeSummary.installments.length + 1;
    const upcomingInstallment = { installmentNo: nextInstallmentNumber, paymentDate: null };

    return (
        <div className="fees-container">
            <header className="fees-header">
                <h1>Fee Details & Payment</h1>
                <p>Manage your payments and view your complete fee structure.</p>
            </header>

            <div className="fees-summary-grid">
                <div className="summary-card"><h4>Total Course Fees</h4><p>₹{totalCourseFees.toLocaleString('en-IN')}</p></div>
                <div className="summary-card"><h4>Concession Awarded</h4><p className="concession">- ₹{concessionAmount.toLocaleString('en-IN')}</p></div>
                <div className="summary-card"><h4>Net Payable</h4><p>₹{netPayable.toLocaleString('en-IN')}</p></div>
                <div className="summary-card paid"><h4>Total Paid</h4><p>₹{feeSummary.totalPaid.toLocaleString('en-IN')}</p></div>
                <div className="summary-card remaining"><h4>Remaining Balance</h4><p>₹{remainingBalance.toLocaleString('en-IN')}</p></div>
            </div>

            <div className="installments-section">
                <h2>Payment Installments</h2>
                <div className="installments-table">
                    <div className="table-header">
                        <div>Installment No.</div>
                        <div>Amount Paid</div>
                        <div>Payment Date</div>
                        <div>Status</div>
                        <div>Action</div>
                    </div>

                    {feeSummary.installments.map(inst => (
                        <div className="table-row" key={inst.feeID}>
                            <div>#{inst.installmentNo}</div>
                            <div>₹{inst.paidAmount.toLocaleString('en-IN')}</div>
                            <div>{inst.paymentDate}</div>
                            <div><span className="status-badge paid">Paid</span></div>
                            <div>
                                <button className="receipt-btn" onClick={() => handleViewReceipt(inst)}>View Receipt</button>
                            </div>
                        </div>
                    ))}

                    {remainingBalance > 0 && (
                        <div className="table-row" key="upcoming">
                            <div>#{nextInstallmentNumber}</div>
                            <div>---</div>
                            <div>---</div>
                            <div><span className="status-badge upcoming">Upcoming</span></div>
                            <div>
                                <button className="pay-now-btn" onClick={() => handlePayNow(upcomingInstallment)}>Pay Now</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ReceiptModal
                receipt={selectedReceipt}
                onClose={() => setSelectedReceipt(null)}
                studentId={studentId}
            />
            <PaymentModal
                installment={installmentToPay}
                onClose={() => setInstallmentToPay(null)}
                onSubmit={handlePaymentSubmit}
                studentId={studentId}
            />
        </div>
    );
};

export default FeeDetails;
