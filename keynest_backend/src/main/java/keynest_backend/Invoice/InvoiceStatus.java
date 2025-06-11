package keynest_backend.Invoice;

public enum InvoiceStatus {

    ISSUED,     // Emitiad con número y fecha
    SENT,       // Enviada al cliente
    PAID,       // Pagada
    OVERDUE,    // Vencida
    CANCELLED,  // Anulada
    REFUNDED,   // El importe ha sido devuelto
}
