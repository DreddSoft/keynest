import React, { useEffect, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { format } from "date-fns";

function UnitBilling({ unit }) {
    const [invoices, setInvoices] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch de facturas
    useEffect(() => {
        const fetchInvoices = async () => {
            if (!unit || !unit.id) return;

            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api/invoices/list/${unit.id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (!response.ok) throw new Error("Error al cargar las facturas o no hay facturas aún para esta unidad.");

                const data = await response.json();
                setInvoices(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [unit]);

    const handleOpenPDF = (invoiceNumber) => {

        // console.log(invoiceNumber);
        if (invoiceNumber) window.open(`http://localhost:8080/invoices/${invoiceNumber}.pdf`, "_blank");
    };

    return (
        <div className="h-full w-full bg-gray-50 p-4 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Facturas de la Unidad</h2>

            {error && (
                <div className="flex justify-baseline items-center gap-2 border border-red-500 bg-red-50 text-red-700 rounded-md p-3">
                    <TriangleAlert className="mt-0.5" />
                    <p className="text-sm text-center">{error}</p>
                </div>
            )}
            {loading && (
                <div className="flex justify-center items-center">
                    <Loader2 className="animate-spin w-6 h-6 text-blue-800" />
                </div>
            )}

            <div className="flex-1 overflow-y-auto border-t border-gray-200">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            <th className="text-left py-2 px-4">Nº Factura</th>
                            <th className="text-left py-2 px-4">Fecha</th>
                            <th className="text-left py-2 px-4">Cliente</th>
                            <th className="text-left py-2 px-4">Documento</th>
                            <th className="text-left py-2 px-4">Base Imponible</th>
                            <th className="text-left py-2 px-4">Impuesto</th>
                            <th className="text-left py-2 px-4">% Impuesto</th>
                            <th className="text-left py-2 px-4">Total Impuesto</th>
                            <th className="text-left py-2 px-4">Total</th>
                            <th className="text-left py-2 px-4">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr
                                key={invoice.id}
                                onClick={() => handleOpenPDF(invoice.invoiceNumber)}
                                className="hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                            >
                                <td className="py-2 px-4">{invoice.invoiceNumber}</td>
                                <td className="py-2 px-4">{format(new Date(invoice.issueDate), "dd/MM/yyyy")}</td>
                                <td className="py-2 px-4">{invoice.receptorFullName}</td>
                                <td className="py-2 px-4">{invoice.receptorDocNumber}</td>
                                <td className="py-2 px-4">{invoice.taxBase.toFixed(2)} €</td>
                                <td className="py-2 px-4">{invoice.taxType}</td>
                                <td className="py-2 px-4">{invoice.taxRate}</td>
                                <td className="py-2 px-4">{invoice.taxAmount.toFixed(2)} €</td>
                                <td className="py-2 px-4">{invoice.total.toFixed(2)} €</td>
                                <td className="py-2 px-4">{invoice.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UnitBilling;
