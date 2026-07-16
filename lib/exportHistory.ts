import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Request {
  request_date: string;
  sender: string;
  receiver: string;
  travel_type: string;
  status: string;
}

export function exportHistory(data: Request[]) {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("DayTick Travel History", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [
      [
        "Date",
        "Sender",
        "Receiver",
        "Travel Type",
        "Status",
      ],
    ],
    body: data.map((item) => [
      item.request_date,
      item.sender,
      item.receiver,
      item.travel_type,
      item.status,
    ]),
  });

  doc.save("Travel_History.pdf");
}